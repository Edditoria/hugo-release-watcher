# Hugo Release Watcher

This is a quick and dirty mini-project to examine the filename in releases of [Hugo][official_site], an awesome static website generator.

I created this for another project [asdf-hugo][asdf-hugo_repo], my own asdf-plugin to manage multiple Hugo cli for macOS and Linux.

This project requires Deno to run.

## Usage

```shell
# List all tasks
deno task

# Steps
deno task fetch
deno task inspect
deno task create-json
deno task export-csv
```

The output files are in `reports/` directory:

1. `release-data.json`: The plain Hugo release data fetched from GitHub.
1. `inspected-assets-list.json`: Organized release files in:
	1. "passed" objects: Will be used in `asdf-hugo`.
	1. "ignored": Expected to be ignored in current development of `asdf-hugo`.
	1. "unexpected": Unexpected errors or design of the scripts. Fix it later.
1. `hugo-releases.json`: List of "expected" release files organized by query keys.
1. `hugo_releases.csv`: Used directly in [asdf-hugo][asdf_hugo_repo] project.

## Copyright and License

Copyright (c) Edditoria. All rights reserved. Code released under the [MIT License](LICENSE.txt). Docs released under [Creative Commons](https://creativecommons.org/licenses/by/4.0/).

As human-readable summary (but not a substitute for the license):

You can use it, share it, modify the code and distribute your work for private and commercial uses. If you like, please share your work with me. :pizza:

[official_site]: https://gohugo.io
[asdf-hugo_repo]: https://github.com/Edditoria/asdf-hugo
