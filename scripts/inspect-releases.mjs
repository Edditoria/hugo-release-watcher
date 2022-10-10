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
		const version = tag.replace(/^v/, '');
		const goodFiles = [];

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

			// Filter some files to unexpected:
			const reForGoodHead = new RegExp('^hugo_(extended_)?v?' + version + '_');
			const reForGoodTail = /\.tar\.gz$/;
			if (!reForGoodHead.test(file)) {
				unexpected.push({ tag, file, reason: 'unexpected_filename' });
				// throw new Error(`Unexpected filename ${file} in v${version}.`);
				continue; // early.
			}
			if (!reForGoodTail.test(file)) {
				unexpected.push({ tag, file, reason: 'unexpected_extension' });
				// throw new Error(`Unexpected extension ${file} in v${version}.`);
				continue; // early.
			}

			goodFiles.push(file);
		} // looping eachAsset.

		passed.push({ tag, files: goodFiles });
	} // looping eachRelease.
	return { passed, ignored, unexpected };
}
