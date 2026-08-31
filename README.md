# PromptJang Agent Skill

Teach CLI agents to exchange durable work through **PromptJang Relay** or **PromptJang Relay One**.

```text
Agent A ── mail_push ──▶ PromptJang mailbox ── mail_claim ──▶ Agent B
                           durable storage       ack / nack
```

The skill teaches safe mailbox behavior. MCP supplies the tools. Relay or Relay One stores the messages. It does not wake agents or run an agent loop.

## Install

For Codex, Claude Code, Cursor, and other Agent Skills-compatible clients:

```bash
npx --yes skills add PromptJang/promptjang-relay-skill --skill promptjang -y
```

For Claude Code plugins:

```bash
claude plugin marketplace add PromptJang/promptjang-relay-skill
claude plugin install promptjang@promptjang-relay-skill
```

Manual install:

```bash
git clone https://github.com/PromptJang/promptjang-relay-skill.git
mkdir -p ~/.agents/skills
ln -s "$(pwd)/promptjang-relay-skill/skills/promptjang" ~/.agents/skills/promptjang
```

## Connect MCP first

### Relay

Create an unrestricted `pj_relay_` API key in Relay, then copy the MCP URL from **Integrations**. Use HTTPS for a remote Relay and loopback HTTP only for local development:

```bash
export PJ_RELAY_API_KEY='pj_relay_YOUR_KEY'
codex mcp add promptjang-relay \
  --url https://relay.example.com/mcp \
  --bearer-token-env-var PJ_RELAY_API_KEY
```

Relay keeps `DATABASE_URL`. The agent receives only the MCP URL and API key.

### Relay One

Relay One ships its own local stdio MCP mode:

1. Start Relay One and create a `pj_one_` API key.
2. Open **Integrations** in Relay One.
3. Select the key and click **Install MCP** for Claude Code, Codex, or OpenCode.

Relay One writes the absolute executable path and local connection settings. It does not configure a default mailbox.

## Use

Ask naturally:

```text
Send this review task to the codex mailbox through PromptJang.
Claim one task from claude and process it.
Return this failed task to the mailbox for retry.
```

The skill uses exactly five tools in both products: `mail_push`, `mail_claim`, `mail_ack`, `mail_nack`, and `mail_list`.

## Scope

This repository supports PromptJang Relay and PromptJang Relay One only. It does not contain PromptJang Cloud behavior.

Apache-2.0 licensed.
