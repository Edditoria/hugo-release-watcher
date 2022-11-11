import { inspectReleases } from '../scripts/inspect-releases.mjs';
import releaseData from '../reports/release-data.json' assert { type: 'json' };

const report = inspectReleases(releaseData);
const outputFile = 'reports/inspected-assets-list.json';
console.warn(`Total unexpected files: ${report.unexpected.length}`);
console.warn('The first record of unexpected:', report.unexpected[0]);
await Deno.mkdir('reports', { recursive: true });
await Deno.writeTextFile(outputFile, JSON.stringify(report, null, '\t'));
console.log(`File written to ${outputFile}`);
