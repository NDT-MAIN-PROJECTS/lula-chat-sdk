#!/usr/bin/env node

import { client, xml } from "@xmpp/client";
import readline from "node:readline";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const config = {
  jid: args.jid || process.env.XMPP_JID,
  domain: args.domain || process.env.XMPP_DOMAIN,
  service: args.service || process.env.XMPP_SERVICE,
  username: args.username || process.env.XMPP_USERNAME,
  password: args.password || process.env.XMPP_PASSWORD,
  resource: args.resource || process.env.XMPP_RESOURCE || "test-client",
  to: args.to || process.env.XMPP_TO,
  roomId: args.room || process.env.XMPP_ROOM || `test-${Date.now()}`,
};

const parsedJid = parseJid(config.jid);
config.domain ||= parsedJid.domain;
config.username ||= parsedJid.username;
config.resource = parsedJid.resource || config.resource;

const missing = [];
if (!config.domain) missing.push("--domain");
if (!config.username) missing.push("--jid or --username");
if (!config.password) missing.push("--password");

if (missing.length) {
  console.error(`Missing: ${missing.join(", ")}`);
  console.error("Run with --help for usage.");
  process.exit(1);
}

config.service ||= `wss://${config.domain}/chat/websocket`;

let target = config.to;
let roomId = config.roomId;
let stopping = false;
let rl;

const xmpp = client({
  service: config.service,
  domain: config.domain,
  resource: config.resource,
  credentials: {
    username: config.username,
    password: config.password,
  },
});

xmpp.on("error", (error) => {
  console.error(`[error] ${formatError(error)}`);
});

xmpp.on("offline", () => {
  console.log("[offline] Connection closed.");
  if (!stopping) process.exitCode = 1;
});

xmpp.on("online", async (address) => {
  console.log(`[online] ${address.toString()}`);
  console.log(`[service] ${config.service}`);
  console.log(`[room] ${roomId}`);
  console.log(target ? `[target] ${target}` : "[target] Not set. Use /to <jid>.");
  console.log("Type a message and press Enter. Use /help for commands.");

  await xmpp.send(xml("presence"));
  openPrompt();
});

xmpp.on("stanza", async (stanza) => {
  if (!stanza.is("message")) return;

  const from = stanza.attrs.from || "unknown";
  const body = stanza.getChildText("body");
  const thread = stanza.getChildText("thread");
  const receipt = stanza.getChild("received", "urn:xmpp:receipts");
  const error = stanza.getChild("error");

  if (body !== undefined && body !== null) {
    console.log(`\n[message] ${from}${thread ? ` room=${thread}` : ""}`);
    console.log(body);
  } else if (receipt) {
    console.log(`\n[receipt] ${from} received ${receipt.attrs.id || "unknown"}`);
  } else if (error) {
    console.log(`\n[stanza error] ${stanza.toString()}`);
  }

  const request = stanza.getChild("request", "urn:xmpp:receipts");
  if (request && stanza.attrs.id && stanza.attrs.from) {
    await xmpp.send(
      xml(
        "message",
        {
          to: bareJid(stanza.attrs.from),
          type: "chat",
          id: `receipt-${Date.now()}`,
        },
        ...(thread ? [xml("thread", {}, thread)] : []),
        xml("received", {
          xmlns: "urn:xmpp:receipts",
          id: stanza.attrs.id,
        }),
      ),
    );
  }

  rl?.prompt(true);
});

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

console.log(`[connecting] ${config.service}`);
xmpp.start().catch((error) => {
  console.error(`[failed] ${formatError(error)}`);
  process.exitCode = 1;
});

function openPrompt() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.on("line", async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    if (input.startsWith("/")) {
      await runCommand(input);
      rl.prompt();
      return;
    }

    await sendMessage(input);
    rl.prompt();
  });

  rl.on("close", stop);
  rl.prompt();
}

async function sendMessage(body) {
  if (!target) {
    console.error("Set a target with /to <jid>.");
    return;
  }

  const id = `test-${Date.now()}`;
  await xmpp.send(
    xml(
      "message",
      { to: target, type: "chat", id },
      xml("body", {}, body),
      xml("thread", {}, roomId),
      xml("request", { xmlns: "urn:xmpp:receipts" }),
      xml("markable", { xmlns: "urn:xmpp:chat-markers:0" }),
    ),
  );
  console.log(`[sent] ${id} -> ${target}`);
}

async function runCommand(input) {
  const [command, ...parts] = input.split(/\s+/);
  const value = parts.join(" ").trim();

  switch (command) {
    case "/help":
      console.log("/to <jid>    Set the recipient JID");
      console.log("/room <id>   Set the room or thread ID");
      console.log("/status      Show the active values");
      console.log("/quit        Close the connection");
      break;
    case "/to":
      if (!value) {
        console.log(`[target] ${target || "not set"}`);
      } else {
        target = value;
        console.log(`[target] ${target}`);
      }
      break;
    case "/room":
      if (!value) {
        console.log(`[room] ${roomId}`);
      } else {
        roomId = value;
        console.log(`[room] ${roomId}`);
      }
      break;
    case "/status":
      console.log(`[service] ${config.service}`);
      console.log(`[account] ${config.username}@${config.domain}`);
      console.log(`[target] ${target || "not set"}`);
      console.log(`[room] ${roomId}`);
      break;
    case "/quit":
      await stop();
      break;
    default:
      console.error(`Unknown command: ${command}`);
  }
}

async function stop() {
  if (stopping) return;
  stopping = true;
  rl?.close();
  try {
    await xmpp.stop();
  } catch (error) {
    console.error(`[stop error] ${formatError(error)}`);
  }
}

function parseArgs(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--help" || value === "-h") {
      result.help = true;
      continue;
    }
    if (!value.startsWith("--")) continue;

    const [rawKey, inlineValue] = value.slice(2).split("=", 2);
    result[rawKey] = inlineValue ?? values[index + 1];
    if (inlineValue === undefined) index += 1;
  }
  return result;
}

function parseJid(jid) {
  if (!jid) return {};
  const [bare, resource] = jid.split("/", 2);
  const separator = bare.lastIndexOf("@");
  if (separator < 1 || separator === bare.length - 1) return {};
  return {
    username: bare.slice(0, separator),
    domain: bare.slice(separator + 1),
    resource,
  };
}

function bareJid(jid) {
  return String(jid).split("/", 1)[0];
}

function formatError(error) {
  return error instanceof Error ? error.stack || error.message : String(error);
}

function printHelp() {
  console.log(`
Lula XMPP test client

Usage:
  node test-client.js --jid <user@domain> --password <password>

Options:
  --service <url>      WebSocket URL. Default: wss://<domain>/chat/websocket
  --domain <host>      XMPP domain. Read from --jid by default
  --username <name>    Account localpart. Use with --domain instead of --jid
  --resource <name>    XMPP resource. Default: test-client
  --to <jid>           Optional recipient for interactive sending
  --room <id>          XMPP thread value. Default: test-<timestamp>
  --help               Show this text

The same values can come from XMPP_JID, XMPP_DOMAIN, XMPP_SERVICE,
XMPP_USERNAME, XMPP_PASSWORD, XMPP_RESOURCE, XMPP_TO, and XMPP_ROOM.
`.trim());
}
