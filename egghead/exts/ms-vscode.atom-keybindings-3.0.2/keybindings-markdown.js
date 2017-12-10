const fs = require('fs');

// Get keybindings from package.json
const keybindings = require('./package.json').contributes.keybindings;

// Markdown content structure
const headerContent = `| Command | Mac | Windows | Linux |
| :---------: | :---------: | :---------: | :----------: |
`;
const rowContent = (accumulatedContent, row) => `${accumulatedContent}| ${row.command} | ${row.mac} | ${row.win} | ${row.linux} |
`;

// Generate markdown
const generateContent = (accumulatedContent, row) => rowContent(accumulatedContent, row);
const markdownOutput = keybindings.reduce(generateContent, headerContent);

// Save markdown to external file
fs.writeFileSync('keybindings.md', markdownOutput);
