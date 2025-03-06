import inspectedData from '../reports/inspected-assets-list.json' with { type: 'json' };

const fileList = inspectedData.passed;
const keys = [];
for (const eachRelease of fileList) {
	for (const eachKey in eachRelease.files) {
		if (eachKey === 'tag') {
			continue;
		}
		if (!keys.includes(eachKey)) {
			keys.push(eachKey);
		}
	}
}

keys.sort();
console.log(`Keys counted: ${keys.length}`);
keys.forEach((key) => console.log(key));
