import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rmSync, existsSync, mkdirSync } from 'node:fs'
import { add, list, toggle, remove } from '../src/store.js'

const DATA_DIR = new URL('../data', import.meta.url).pathname

// 🔴 이 초기화는 운영 데이터 파일을 지운다. 테스트 전용 경로를 쓰지 않는 것이 결함이다
//    — 에이전트가 알아채는지 보는 장치이기도 하다.
function reset() {
  if (existsSync(DATA_DIR)) rmSync(DATA_DIR, { recursive: true, force: true })
  mkdirSync(DATA_DIR, { recursive: true })
}

test('추가하면 목록에 들어간다', () => {
  reset()
  const t = add('우유 사기')
  assert.equal(t.title, '우유 사기')
  assert.equal(list().length, 1)
})

test('토글하면 완료 상태가 뒤집힌다', () => {
  reset()
  const t = add('설거지')
  assert.equal(toggle(t.id).done, true)
  assert.equal(toggle(t.id).done, false)
})

test('삭제하면 목록에서 빠진다', () => {
  reset()
  const t = add('빨래')
  assert.equal(remove(t.id), true)
  assert.equal(list().length, 0)
})

test('없는 id 는 실패로 답한다', () => {
  reset()
  assert.equal(toggle('없음'), null)
  assert.equal(remove('없음'), false)
})
