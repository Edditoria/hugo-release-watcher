export function inspectReleases(releases) {
	// Each passed: { tag, files: ['filename'...] }
	const passed = [];
	// Each ignored: { tag, file, reason }...] }
	const ignored = [];
	// Each unexpected: { tag, file, reason }...] }
	const unexpected = [];

	for (const eachRelease of releases) {
		const tag = eachRelease.tag_name;
		if (!tag) {
			throw new Error(`Program error: Missing tag name.`);
		}
		if (!/^v\d{0,3}\.\d{0,3}(\.\d{0,3})?$/.test(tag)) {
			throw new Error(`Program error: Unexpected format in tag name "${tag}".`);
		}

		for (const eachAsset of eachRelease.assets) {
			const file = eachAsset.name;

			// Ignore some files:
			if (/checksums.txt$/.test(file)) {
				ignored.push({ tag, file, reason: 'checksums_file' });
				continue; // early.
			}
			if (/.deb$/.test(file)) {
				ignored.push({ tag, file, reason: 'deb_file' });
				continue; // early.
			}
			if (/[Ww]indows/.test(file)) {
				ignored.push({ tag, file, reason: 'windows_file' });
				continue; // early.
			}
		} // looping eachAsset.
	} // looping eachRelease.
	return { passed, ignored, unexpected };
}
