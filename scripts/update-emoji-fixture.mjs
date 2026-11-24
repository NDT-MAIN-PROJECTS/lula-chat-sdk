import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

const version = process.argv[2];
if (!version || !/^\d+\.\d+$/.test(version)) {
  throw new Error(
    "Usage: node scripts/update-emoji-fixture.mjs <emoji-version>, e.g. 18.0",
  );
}
// Unicode's current versioned layout (including Emoji 18) uses the Unicode
// release directory, not /Public/emoji/18.0/. Never use the mutable latest URL.
const source = `https://www.unicode.org/Public/${version}.0/emoji/emoji-test.txt`;
const response = await fetch(source);
if (!response.ok)
  throw new Error(`Unicode download failed: ${response.status} ${source}`);
const bytes = Buffer.from(await response.arrayBuffer());
const text = bytes.toString("utf8");
if (!text.includes(`# Version: ${version}\n`)) {
  throw new Error("Unicode file version does not match the requested fixture");
}
const fullyQualified = text.split(/\r?\n/).flatMap((line) => {
  const match = /^([\dA-F ]+)\s*;\s*fully-qualified\s*#/.exec(line);
  return match
    ? [
        String.fromCodePoint(
          ...match[1]
            .trim()
            .split(/\s+/)
            .map((hex) => parseInt(hex, 16)),
        ),
      ]
    : [];
});
if (
  !fullyQualified.length ||
  new Set(fullyQualified).size !== fullyQualified.length
) {
  throw new Error("Unicode fixture is empty or contains duplicate sequences");
}
const fixture = {
  source,
  version,
  sha256: createHash("sha256").update(bytes).digest("hex"),
  fullyQualified,
};
const filename = new URL(
  `../tests/fixtures/emoji-${version.replace(/\.0$/, "")}.json`,
  import.meta.url,
);
await writeFile(filename, `${JSON.stringify(fixture)}\n`);
console.log(
  `Wrote ${fullyQualified.length} fully qualified Emoji ${version} sequences from ${source}`,
);
