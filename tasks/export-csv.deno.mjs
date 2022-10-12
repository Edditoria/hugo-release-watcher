import inspectedData from '../reports/inspected-assets-list.json' assert { type: 'json' };

const head = ['os', 'arch', 'extended', 'version', 'filename'];
/** @type {string} */
let outputData = head.join(',') + '\n';
const outputFile = 'reports/hugo_releases.csv';

for (const eachRelease of inspectedData.passed) {
	const version = eachRelease.tag.replace(/^v/, '');
	for (const eachKey in eachRelease.files) {
		// Key example: "darwin_amd64_hasEx", "linux_arm64_noEx".
		const filename = eachRelease.files[eachKey];
		// Example: darwin,arm64,hasEx,0.104.0,hugo_ext...
		const newline = `${eachKey.replace(/_/g, ',')},${version},${filename}`;
		outputData += newline + '\n';
	}
}

await Deno.mkdir('reports', { recursive: true });
await Deno.writeTextFile(outputFile, outputData);
console.log(`File written to ${outputFile}`);
