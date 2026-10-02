import { readFile } from 'node:fs/promises'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import assert from 'node:assert/strict'

const schema = JSON.parse(await readFile(new URL('../skills/promptjang/references/agent-message-v1.schema.json', import.meta.url)))
const ajv = new Ajv({ strict: false })
addFormats(ajv)
const validate = ajv.compile(schema)
const task = { schema: 'promptjang.agent-message.v1', kind: 'task', correlation_id: 'one', task: 'Review' }
const result = { schema: task.schema, kind: 'result', correlation_id: 'one',
  in_reply_to: '550e8400-e29b-41d4-a716-446655440000', status: 'succeeded', summary: 'Done' }
assert(validate(task), JSON.stringify(validate.errors))
assert(validate(result), JSON.stringify(validate.errors))
assert(!validate({ ...result, status: 'failed' }))
assert(validate({ ...result, status: 'failed', error: 'Cannot complete' }))
assert(!validate({ ...result, in_reply_to: 'not-a-uuid' }))
assert(!validate({ ...task, task: '' }))
assert(!validate({ ...task, schema: 'promptjang.agent-message.v2' }))
for (const product of ['promptjang-relay-one', 'promptjang-webhooks']) {
  const copy = new URL('../../' + product + '/skills/promptjang/references/agent-message-v1.schema.json', import.meta.url)
  try { assert.deepEqual(JSON.parse(await readFile(copy)), schema) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
}
console.log('Agent Message Envelope v1: independent schema and local product parity passed')
