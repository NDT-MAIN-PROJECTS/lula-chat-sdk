# Unicode emoji fixture

`emoji-18.json` preserves every fully qualified sequence in the official Unicode 18 emoji test data, independently of Emojibase's generated matcher.

Source: https://www.unicode.org/Public/18.0.0/emoji/emoji-test.txt
Copyright © 2026 Unicode, Inc.
Terms: https://www.unicode.org/terms_of_use.html

Regenerate from fully-qualified rows when intentionally upgrading the pinned Unicode version:

```sh
node scripts/update-emoji-fixture.mjs 18.0
npm run build
```

The script verifies the downloaded file's version and records its SHA-256 alongside the versioned source URL. CI tests use the checked-in fixture offline; they do not depend on Unicode's website being available. The fixture preserves all code points, including variation selectors, modifiers, joiners and tag characters. It excludes the nine standalone components, which are not offered as reactions.
