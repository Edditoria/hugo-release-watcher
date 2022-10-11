import inspectedData from '../reports/inspected-assets-list.json' assert { type: 'json' };

const outputData = inspectedData.passed;
const outputFile = 'reports/file-list.json';
await Deno.mkdir('reports', { recursive: true });
await Deno.writeTextFile(outputFile, JSON.stringify(outputData, null, '\t'));
console.log(`File written to ${outputFile}`);
