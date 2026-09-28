import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'

const FILE = new URL('../data/todos.json', import.meta.url).pathname

/** 파일에서 전부 읽는다. 없으면 빈 목록. */
export function load() {
  if (!existsSync(FILE)) return []
  try {
    return JSON.parse(readFileSync(FILE, 'utf8'))
  } catch {
    // 손상된 파일은 빈 목록으로 취급한다 — 기동이 막히는 것보다 낫다.
    return []
  }
}

// 과제 3: 쓰기마다 전체를 다시 쓴다. 동시 요청이 겹치면 나중 것이 앞 것을 덮는다.
function save(todos) {
  writeFileSync(FILE, JSON.stringify(todos, null, 2))
}

export function list() {
  // 과제 1: 정렬 규칙이 없다 — 완료된 항목이 등록 순서대로 위에 남는다.
  return load()
}

export function add(title) {
  // 과제 5: 제목 검증이 없다 — 빈 문자열도 그대로 들어간다.
  const todos = load()
  const todo = { id: randomUUID(), title, done: false, createdAt: new Date().toISOString() }
  todos.push(todo)
  save(todos)
  return todo
}

export function toggle(id) {
  const todos = load()
  const t = todos.find((x) => x.id === id)
  if (!t) return null
  t.done = !t.done
  save(todos)
  return t
}

export function remove(id) {
  const todos = load()
  const next = todos.filter((x) => x.id !== id)
  if (next.length === todos.length) return false
  save(next)
  return true
}
