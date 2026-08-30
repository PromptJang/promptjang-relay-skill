# Agent message envelope

PromptJang accepts text or JSON. Use this small convention when agents need a structured task and result.

## Task

```json
{
  "kind": "task",
  "task": "Review the current branch and report blocking findings.",
  "sender": "claude-code",
  "reply_to": "claude-results",
  "correlation_id": "review-2026-08-30-01",
  "context": {
    "workspace": "/workspace/project",
    "branch": "feat/example"
  },
  "constraints": ["Read-only review", "Do not push or merge"],
  "artifacts": ["src/worker.rs"]
}
```

Only `task` is required. Paths are context, not permission. Never include credentials or large file contents.

## Result

```json
{
  "kind": "result",
  "in_reply_to": "SOURCE_MESSAGE_ID",
  "correlation_id": "review-2026-08-30-01",
  "status": "succeeded",
  "summary": "No blocking correctness findings.",
  "artifacts": []
}
```

For a permanent failure, use `status: "failed"` and a sanitized `error`. Use a stable result idempotency key such as `result:SOURCE_MESSAGE_ID`. Send the result before acknowledging the task.
