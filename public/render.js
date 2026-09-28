// 구조는 코드로 만들고, 사용자가 넣은 값(제목·id)은 textContent·dataset 으로만 넣는다.
// HTML 문자열로 조립하면 `<b>회의준비</b>` 같은 제목이 글자가 아니라 마크업으로 해석된다.

export function createTodoItem(todo, doc = globalThis.document) {
  const li = doc.createElement('li')
  if (todo.done) li.className = 'done'
  li.dataset.id = todo.id

  const checkbox = doc.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = Boolean(todo.done)
  checkbox.dataset.act = 'toggle'

  const title = doc.createElement('span')
  title.className = 'title'
  title.textContent = todo.title ?? ''

  const removeButton = doc.createElement('button')
  removeButton.dataset.act = 'remove'
  removeButton.textContent = '삭제'

  li.append(checkbox, title, removeButton)
  return li
}

export function renderTodos(listEl, todos, doc = globalThis.document) {
  listEl.replaceChildren(...todos.map((t) => createTodoItem(t, doc)))
}
