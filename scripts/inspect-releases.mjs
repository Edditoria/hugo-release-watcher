const reForGoodHead = (version) => new RegExp('^hugo_(extended_)?v?' + version + '_');

const reForGoodTail = /\.tar\.gz$/;

// const goos = ['darwin', 'dragonfly', 'freebsd', 'linux', 'netbsd', 'openbsd', 'windows'];
// const goarch = ['amd64', '386', 'arm', 'arm32'];
const replacements = [
	// For naming OS:
	{ from: /^macos/, to: 'darwin' },
	{ from: /^dragonflybsd/, to: 'dragonfly' },
	// For naming arch:
	{ from: /amd$/, to: '386' },
	{ from: /64bit$/, to: 'amd64' },
	{ from: /32bit$/, to: '386' },
];

const reForDarwin = /^darwin_(universal|all)_/;
const replacersForDarwin = ['darwin_amd64_', 'darwin_arm64_'];

/**
 * Create a good key name for query.
 * NOTE: It will not handle "darwin_all" and "darwin_universal".
 * @param {filename} Original filename in release assets. Requires good format.
 * @return {string} Key format: "{os}_{arch}_{isEx|noEx}".
 */
function createQueryKey(filename, version) {
	let shortName = filename
		.replace(reForGoodHead(version), '')
		.replace(reForGoodTail, '')
		.toLowerCase()
		.replace('-', '_');
	replacements.forEach((item) => {
		shortName = shortName.replace(item.from, item.to);
	});
	let ex;
	if (/^hugo_extend/.test(filename)) {
		ex = 'hasEx';
	} else if (reForGoodHead(version).test(filename)) {
		ex = 'noEx';
	} else {
		throw new Error(`Program error: Bad filename format "${filename}".`);
	}
	return `${shortName}_${ex}`;
}

export function inspectReleases(releases) {
	// Each passed: { tag, 'queryKey': 'filename'... }
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
		const thisRelease = { tag };
		const version = tag.replace(/^v/, '');

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
			if (!reForGoodHead(version).test(file)) {
				unexpected.push({ tag, file, reason: 'unexpected_filename' });
				// throw new Error(`Unexpected filename ${file} in v${version}.`);
				continue; // early.
			}
			if (!reForGoodTail.test(file)) {
				unexpected.push({ tag, file, reason: 'unexpected_extension' });
				// throw new Error(`Unexpected extension ${file} in v${version}.`);
				continue; // early.
			}

			const key = createQueryKey(file, version);
			// Handle "darwin_all" and "darwin_universal":
			if (reForDarwin.test(key)) {
				replacersForDarwin.forEach((replacer) => {
					const newKey = key.replace(reForDarwin, replacer);
					thisRelease[newKey] = file;
				});
				continue; // early.
			}
			thisRelease[key] = file;
		} // looping eachAsset.

		passed.push(thisRelease);
	} // looping eachRelease.
	return { passed, ignored, unexpected };
}
