const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('AUTH_GOOGLE')) {
        console.log(`Line ${i + 1}: [${line}]`);
        for (let j = 0; j < line.length; j++) {
            console.log(`Char ${j}: ${line[j]} (${line.charCodeAt(j)})`);
        }
    }
});
