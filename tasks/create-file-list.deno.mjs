import { createFileList } from '../scripts/create-file-list.mjs';
import releaseData from '../reports/release-data.json' assert { type: 'json' };

const fileList = createFileList(releaseData);
const outputFile = 'reports/file-list.json';
await Deno.mkdir('reports', { recursive: true });
await Deno.writeTextFile(outputFile, JSON.stringify(fileList, null, '\t'));
