/**
 * Transform release data to a file list for each version.
 * @param {Object} releaseData Expect a list of releases fetched using GitHub API.
 * @returns A list of filename for each version. Useful to create CSV.
 */
export function createFileList(releaseData) {
	const result = [];
	for (const eachRelease of releaseData) {
		const tagName = eachRelease.tag_name;
		const releaseInfo = [tagName];
		for (const assets of eachRelease.assets) {
			const filename = assets.name;
			if (!filename) {
				throw new Error(`Missing assets.name in ${tagName}`);
			}
			releaseInfo.push(filename);
		}
		result.push(releaseInfo);
	}
	return result;
}
