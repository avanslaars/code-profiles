import { fileURLToPath } from 'url';

import { extname } from 'path';

import { readFileSync } from 'fs';

import arg from 'arg';

function getTracer() {
  return global.$_$tracer;
}

import {
  getFormat,
  transformSource,
  resolve as resolveImplmentation,
} from './hooks.mjs'

const extensionFormatMap = {
  '__proto__': null,
  '.cjs': 'commonjs',
  '.js': 'module',
  '.mjs': 'module'
};

const legacyExtensionFormatMap = {
  '__proto__': null,
  '.cjs': 'commonjs',
  '.js': 'commonjs',
  '.json': 'commonjs',
  '.mjs': 'module',
  '.node': 'commonjs'
};

function getOptionValue(opt) {
  parseOptions();
  return options[opt];
}

let options;
function parseOptions() {
  if (!options) {
    options = {
      '--preserve-symlinks': false,
      '--preserve-symlinks-main': false,
      '--input-type': undefined,
      '--experimental-specifier-resolution': 'explicit',
      '--experimental-policy': undefined,
      '--conditions': [],
      '--pending-deprecation': false,
      ...parseArgv(getNodeOptionsEnvArgv()),
      ...parseArgv(process.execArgv),
      ...getOptionValuesFromOtherEnvVars()
    }
  }
}

function parseArgv(argv) {
  return arg({
    '--preserve-symlinks': Boolean,
    '--preserve-symlinks-main': Boolean,
    '--input-type': String,
    '--experimental-specifier-resolution': String,
    // Legacy alias for node versions prior to 12.16
    '--es-module-specifier-resolution': '--experimental-specifier-resolution',
    '--experimental-policy': String,
    '--conditions': [String],
    '--pending-deprecation': Boolean,
    '--experimental-json-modules': Boolean,
    '--experimental-wasm-modules': Boolean,
  }, {
    argv,
    permissive: true
  });
}

function getNodeOptionsEnvArgv() {
  const errors = [];
  const envArgv = ParseNodeOptionsEnvVar(process.env.NODE_OPTIONS || '', errors);
  if (errors.length !== 0) {
    // TODO: handle errors somehow
  }
  return envArgv;
}

// Direct JS port of C implementation: https://github.com/nodejs/node/blob/67ba825037b4082d5d16f922fb9ce54516b4a869/src/node_options.cc#L1024-L1063
function ParseNodeOptionsEnvVar(node_options, errors) {
  const env_argv = [];

  let is_in_string = false;
  let will_start_new_arg = true;
  for (let index = 0; index < node_options.length; ++index) {
      let c = node_options[index];

      // Backslashes escape the following character
      if (c === '\\' && is_in_string) {
          if (index + 1 === node_options.length) {
              errors.push("invalid value for NODE_OPTIONS " +
                  "(invalid escape)\n");
              return env_argv;
          } else {
              c = node_options[++index];
          }
      } else if (c === ' ' && !is_in_string) {
          will_start_new_arg = true;
          continue;
      } else if (c === '"') {
          is_in_string = !is_in_string;
          continue;
      }

      if (will_start_new_arg) {
          env_argv.push(c);
          will_start_new_arg = false;
      } else {
          env_argv[env_argv.length - 1] += c;
      }
  }

  if (is_in_string) {
      errors.push("invalid value for NODE_OPTIONS " +
          "(unterminated string)\n");
  }
  return env_argv;
}

// Get option values that can be specified via env vars besides NODE_OPTIONS
function getOptionValuesFromOtherEnvVars() {
  const options = {};
  if(process.env.NODE_PENDING_DEPRECATION === '1') {
    options['--pending-deprecation'] = true;
  }
  return options;
}

const experimentalSpeciferResolution = getOptionValue('--experimental-specifier-resolution');
const experimentalJsonModules = getOptionValue('--experimental-json-modules');
const experimentalWasmModules = getOptionValue('--experimental-wasm-modules');

const packageJSONCache = new Map();

function getPackageConfig(path) {
  const existing = packageJSONCache.get(path);
  if (existing !== undefined) {
    return existing;
  }
  let source;
  try { 
    source = readFileSync(path, 'utf8');
  } catch (error) {
    // do nothing
  }
  if (source === undefined) {
    const packageConfig = {
      pjsonPath: path,
      exists: false,
      main: undefined,
      name: undefined,
      type: 'none',
      exports: undefined,
      imports: undefined,
    };
    packageJSONCache.set(path, packageConfig);
    return packageConfig;
  }

  let packageJSON;
  try {
    packageJSON = JSON.parse(source);
  } catch (error) {
    throw new Error('Unexpected result: ' + source + error.toString());
  }

  let { imports, main, name, type } = packageJSON;
  const { exports } = packageJSON;
  if (typeof imports !== 'object' || imports === null) imports = undefined;
  if (typeof main !== 'string') main = undefined;
  if (typeof name !== 'string') name = undefined;
  // Ignore unknown types for forwards compatibility
  if (type !== 'module' && type !== 'commonjs') type = 'none';

  const packageConfig = {
    pjsonPath: path,
    exists: true,
    main,
    name,
    type,
    exports,
    imports,
  };
  packageJSONCache.set(path, packageConfig);
  return packageConfig;
}

function getPackageScopeConfig(resolved) {
  let packageJSONUrl = new URL('./package.json', resolved);
  while (true) {
    const packageJSONPath = packageJSONUrl.pathname;
    if (packageJSONPath.endsWith('node_modules/package.json'))
      break;
    const packageConfig = getPackageConfig(fileURLToPath(packageJSONUrl), resolved);
    if (packageConfig.exists) return packageConfig;

    const lastPackageJSONUrl = packageJSONUrl;
    packageJSONUrl = new URL('../package.json', packageJSONUrl);

    // Terminates at root where ../package.json equals ../../package.json
    // (can't just check "/package.json" for Windows support).
    if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
  }
  const packageJSONPath = fileURLToPath(packageJSONUrl);
  const packageConfig = {
    pjsonPath: packageJSONPath,
    exists: false,
    main: undefined,
    name: undefined,
    type: 'none',
    exports: undefined,
    imports: undefined,
  };
  packageJSONCache.set(packageJSONPath, packageConfig);
  return packageConfig;
}

function defaultGetFormat(url, context, defaultGetFormatUnused) {
  if (url.startsWith('node:')) {
    return { format: 'builtin' };
  }
  const parsed = new URL(url);
  if (parsed.protocol === 'data:') {
    const [ , mime ] = /^([^/]+\/[^;,]+)(?:[^,]*?)(;base64)?,/.exec(parsed.pathname) || [ null, null, null ];
    const format = ({
      '__proto__': null,
      'text/javascript': 'module',
      'application/json': experimentalJsonModules ? 'json' : null,
      'application/wasm': experimentalWasmModules ? 'wasm' : null
    })[mime] || null;
    return { format };
  } else if (parsed.protocol === 'file:') {
    const ext = extname(parsed.pathname);
    let format;
    if (ext === '.js') {
      format = getPackageScopeConfig(parsed.href).type === 'module' ? 'module' : 'commonjs';
    } else {
      format = extensionFormatMap[ext];
    }
    if (!format) {
      if (experimentalSpeciferResolution === 'node') {
        process.emitWarning(
          'The Node.js specifier resolution in ESM is experimental.',
          'ExperimentalWarning');
        format = legacyExtensionFormatMap[ext];
      } else {
        throw new ERR_UNKNOWN_FILE_EXTENSION(ext, fileURLToPath(url));
      }
    }
    return { format: format || null };
  }
  return { format: null };
}

export async function load(url, context, defaultLoad) {
  const format = (await getFormat(url, context, defaultGetFormat)).format;
  let source = undefined;
  if (format !== 'builtin' && format !== 'commonjs') {
    const tracer = getTracer();
    if (tracer && tracer._esm) {
      const esm = tracer._esm;
      if (url === esm.scratchFileUrl) {
        return { format, source: esm.scratchFileContent };
      }
    }

    // Call the new defaultLoad() to get the source
    const { source: rawSource } = await defaultLoad(url, { format }, defaultLoad);
    if (rawSource === undefined || rawSource === null) {
      throw new Error(`Failed to load raw source: Format was '${format}' and url was '${url}''.`);
    }
    // Emulate node's built-in old defaultTransformSource() so we can re-use the old transformSource() hook
    const defaultTransformSource = (source, context, defaultTransformSource) => ({ source });
    // Call the old hook
    const { source: transformedSource } = await transformSource(rawSource, { url, format }, defaultTransformSource);
    source = transformedSource;
  }
  return { format, source };
}

export async function resolve(specifier, context, defaultResolve) {
  return resolveImplmentation(specifier, context, defaultResolve);
}
