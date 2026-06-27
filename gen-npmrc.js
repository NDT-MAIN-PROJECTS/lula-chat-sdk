#!/usr/bin/env node
/* eslint-disable no-undef */

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import readline from "node:readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const npmrcPath = resolve(__dirname, ".npmrc");

const writeNpmrc = (token) => {
  const npmrc = [
    "registry=https://registry.npmjs.org/",
    "@hubnet-systems:registry=https://npm.pkg.github.com/",
    `//npm.pkg.github.com/:_authToken=${token}`,
  ].join("\n");

  fs.writeFileSync(npmrcPath, `${npmrc}\n`, { encoding: "utf8" });
  console.log(`Saved token to ${npmrcPath}.\n`);
  console.log("\u001b[33mYou may now run `pnpm install`.\u001b[0m\n");
};

const tryToken = (token) => {
  if (typeof token !== "string") {
    return false;
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return false;
  }

  writeNpmrc(trimmedToken);
  return true;
};

if (tryToken(process.argv[2])) {
  process.exit(0);
}

if (tryToken(process.env.NPMRC_TOKEN)) {
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the GitHub Packages auth token: ", (token) => {
  if (!tryToken(token)) {
    console.error("No token provided. Aborting.");
    rl.close();
    process.exit(1);
  }

  rl.close();
  process.exit(0);
});
