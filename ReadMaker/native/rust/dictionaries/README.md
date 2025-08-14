IPADIC and Vibrato dictionary files

- ipadic.vibrato: compiled dictionary used at runtime.
- Source: MeCab IPADIC 2.7.0-20070801 (see COPYING in this folder).
- License: see COPYING (IPADIC) and Vibrato crate license for tooling.

Notes
- This repo intentionally tracks ipadic.vibrato to avoid per-developer rebuild.
- If you need to rebuild, run: `npm run dic:build-lex` then use Vibrato `compile` tool.
- The code supports reading both zstd-compressed and plain dictionaries.
