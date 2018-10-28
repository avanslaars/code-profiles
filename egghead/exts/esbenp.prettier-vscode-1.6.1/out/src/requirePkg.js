"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("./errorHandler");
const path = require("path");
const resolve = require("resolve");
const readPkgUp = require('read-pkg-up');
function findPkg(fspath, pkgName) {
    const res = readPkgUp.sync({ cwd: fspath, normalize: false });
    const { root } = path.parse(fspath);
    if (res.pkg &&
        ((res.pkg.dependencies && res.pkg.dependencies[pkgName]) ||
            (res.pkg.devDependencies && res.pkg.devDependencies[pkgName]))) {
        return resolve.sync(pkgName, { basedir: res.path });
    }
    else if (res.path) {
        const parent = path.resolve(path.dirname(res.path), '..');
        if (parent !== root) {
            return findPkg(parent, pkgName);
        }
    }
    return;
}
function requireLocalPkg(fspath, pkgName) {
    const modulePath = findPkg(fspath, pkgName);
    if (modulePath !== void 0) {
        try {
            return require(modulePath);
        }
        catch (e) {
            errorHandler_1.addToOutput(`Failed to load ${pkgName} from ${modulePath}. Using bundled`);
        }
    }
    return require(pkgName);
}
exports.requireLocalPkg = requireLocalPkg;
//# sourceMappingURL=requirePkg.js.map