/**
 * Fetch release JSON data using GitHub API.
 * @example await fetchReleases('gohugoio', 'hugo');
 * @param {string} owner Repo owner/username on GitHub.
 * @param {string} repo Repo name on GitHub.
 * @param {number} [max=1000] Maximum releases to fetch.
 * @returns A list of releases.
 */
export async function fetchReleases(owner, repo, max = 1000) {
	const perPage = 100;
	const maxPage = Math.ceil(max / perPage);
	const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${perPage}`;

	const releases = [];
	// NOTE: Page starts from 1.
	for (let p = 1; p <= maxPage; p++) {
		console.log(`Fetching page ${p}...`);
		const response = await fetch(`${url}&page=${p}`);
		const result = await response.json();
		if (result.length < 1) {
			break;
		}
		releases.push(...result);
	}
	return releases;
}
