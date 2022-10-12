import inspectedData from '../reports/inspected-assets-list.json' assert { type: 'json' };

const fileList = [];
for (const eachRelease of inspectedData.passed) {
	const files = { tag: eachRelease.tag };
	for (const key in eachRelease.files) {
		files[key] = eachRelease.files[key];
	}
	fileList.push(files);
}

const outputFile = 'reports/hugo-releases.json';
await Deno.mkdir('reports', { recursive: true });
await Deno.writeTextFile(outputFile, JSON.stringify(fileList, null, '\t'));
console.log(`File written to ${outputFile}`);
