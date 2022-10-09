import { fetchReleases } from '../scripts/fetch-releases.mjs';

const releases = await fetchReleases('gohugoio', 'hugo', 9001);
const outputFile = 'reports/release-data.json';
await Deno.mkdir('reports', { recursive: true });
await Deno.writeTextFile(outputFile, JSON.stringify(releases, null, '\t'));
console.log(`File written to ${outputFile}`);
