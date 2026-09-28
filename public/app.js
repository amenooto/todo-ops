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
  // 과제 2: 제목을 innerHTML 로 그대로 넣는다 — 저장형 XSS.
  listEl.innerHTML = todos
    .map(
      (t) => `
      <li class="${t.done ? 'done' : ''}" data-id="${t.id}">
        <input type="checkbox" ${t.done ? 'checked' : ''} data-act="toggle" />
        <span class="title">${t.title}</span>
        <button data-act="remove">삭제</button>
      </li>`
    )
    .join('')
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
