import { renderTodos } from './render.js'

const listEl = document.getElementById('list')
const emptyEl = document.getElementById('empty')
const formEl = document.getElementById('add-form')
const titleEl = document.getElementById('title')

async function api(path, options) {
  const res = await fetch(path, { headers: { 'content-type': 'application/json' }, ...options })
  if (res.status === 204) return null
  return res.json()
}

function render(todos) {
  emptyEl.hidden = todos.length > 0
  renderTodos(listEl, todos)
}

async function refresh() {
  render(await api('/api/todos'))
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault()
  await api('/api/todos', { method: 'POST', body: JSON.stringify({ title: titleEl.value }) })
  titleEl.value = ''
  refresh()
})

listEl.addEventListener('click', async (e) => {
  const act = e.target.dataset.act
  if (!act) return
  const id = e.target.closest('li').dataset.id
  if (act === 'toggle') await api(`/api/todos/${id}`, { method: 'PATCH' })
  // 과제 4: 확인 없이 바로 지운다.
  if (act === 'remove') await api(`/api/todos/${id}`, { method: 'DELETE' })
  refresh()
})

refresh()
