const fs = require('fs');
let content = fs.readFileSync('lint.json');
if (content[0] === 0xFF && content[1] === 0xFE) {
    content = content.toString('utf16le');
} else {
    content = content.toString('utf8');
}
const startIndex = content.indexOf('[');
const results = JSON.parse(content.substring(startIndex));
results.filter(r => r.errorCount > 0 || r.warningCount > 0).forEach(r => {
    console.log(`\n${r.filePath}`);
    r.messages.forEach(m => {
        console.log(`  ${m.line}:${m.column}  ${m.severity === 2 ? 'error' : 'warning'}  ${m.message}  ${m.ruleId}`);
    });
});
