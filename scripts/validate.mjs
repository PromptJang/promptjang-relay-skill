import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const skillRoot = join(root, "skills", "promptjang");
const required = [
  "SKILL.md",
  ".claude-plugin/plugin.json",
  "references/tool-contracts.md",
  "references/message-envelope.md",
  "references/safety-boundary.md",
];

for (const file of required) await access(join(skillRoot, file));

const skill = await readFile(join(skillRoot, "SKILL.md"), "utf8");
if (!skill.startsWith("---\nname: promptjang\n")) throw new Error("invalid skill frontmatter");
for (const tool of ["mail_push", "mail_claim", "mail_ack", "mail_nack", "mail_list"]) {
  if (!skill.includes(`\`${tool}\``)) throw new Error(`missing tool ${tool}`);
}

const combined = await Promise.all(required.map((file) => readFile(join(skillRoot, file), "utf8")));
const forbidden = ["PromptJang Cloud", "send_event", "list_unread", "claim_message", "ack_message"];
for (const term of forbidden) {
  if (combined.some((content) => content.includes(term))) throw new Error(`out-of-scope term: ${term}`);
}

const plugin = JSON.parse(await readFile(join(skillRoot, ".claude-plugin/plugin.json"), "utf8"));
const marketplace = JSON.parse(await readFile(join(root, ".claude-plugin/marketplace.json"), "utf8"));
if (plugin.name !== "promptjang") throw new Error("plugin name mismatch");
if (marketplace.plugins?.[0]?.source?.path !== "skills/promptjang") {
  throw new Error("marketplace source path mismatch");
}

console.log("PromptJang skill validation passed");
