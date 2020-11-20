let todos = JSON.parse(localStorage.getItem("todos")) || [];
let isEditing = false;
let todoToEdit = {};
let itemsLeftText = 0;

loadClickHandlers();
renderTodos(todos);
listItemsLeft();

function loadClickHandlers() {
  document.querySelector("form").addEventListener("submit", handleSubmit);
  document.getElementById("completedCount").innerHTML = itemsLeftText;
  document.getElementById("all").addEventListener("click", showAll);
  document.getElementById("active").addEventListener("click", showActive);
  document.getElementById("completed").addEventListener("click", showCompleted);
  document.getElementById("cancelBtn").addEventListener("click", cancelForm);
  document.getElementById("saveBtn").addEventListener("click", saveTodos);
  document
    .getElementById("clearCompletedBtn")
    .addEventListener("click", clearCompleted);
}

function handleSubmit(e) {
  e.preventDefault();
  let input = document.querySelector("input");

  if (!isEditing) {
    if (input.value !== "") {
      addTodo(input.value);
      input.value = "";
      isEditing = false;
    }
  } else {
    let updatedTodo = {
      id: Number(todoToEdit.id),
      name: input.value,
      completed: todoToEdit.completed,
    };
    todos = todos.map((t) => {
      if (t.id === updatedTodo.id) {
        return updatedTodo;
      } else {
        return t;
      }
    });
    renderTodos(todos);
    input.value = "";
    isEditing = false;
    todoToEdit = {};
  }
  localStorage.setItem("todos", JSON.stringify(todos));
}

function cancelForm() {
  let input = document.querySelector("input");
  input.value = "";
  isEditing = false;
  todoToEdit = {};
}

function addTodo(todo) {
  todos.push({
    id: Date.now(),
    name: todo,
    completed: false,
  });
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(todos);
  listItemsLeft();
}

function renderTodos(todoList) {
  let ul = document.querySelector("ul");
  ul.innerHTML = "";

  todoList.forEach((t) => {
    let div1 = document.createElement("div");
    div1.classList.add("liLeft");

    let div2 = document.createElement("div");
    div2.classList.add("liRight");

    let li = document.createElement("li");
    li.classList.add("li");

    let p = document.createElement("p");
    p.classList.add("p");
    p.textContent = t.name;

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("data-key", t.id);
    checkbox.checked = t.completed;
    checkbox.checked
      ? (p.style.textDecoration = "line-through")
      : (p.style.textDecoration = "none");
    checkbox.addEventListener("click", toggleStatus);

    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("data-key", t.id);
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", deleteTodo);

    let editBtn = document.createElement("button");
    editBtn.setAttribute("data-key", t.id);
    editBtn.classList.add("editBtn");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", editTodo);

    div1.append(checkbox, p);
    div2.append(deleteBtn, editBtn);
    li.append(div1, div2);
    ul.append(li);
  });
}

function deleteTodo({ target }) {
  todos = todos.filter((t) => Number(target.dataset.key) !== t.id);
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(todos);
  listItemsLeft();
}

function editTodo({ target }) {
  let input = document.querySelector("input");
  let todo = todos.find((t) => t.id === Number(target.dataset.key));
  isEditing = true;
  todoToEdit = todo;
  input.value = todo.name;
  input.focus();
}

function toggleStatus({ target }) {
  todos = todos.map((t) => {
    if (Number(target.dataset.key) === t.id) {
      t.completed = !t.completed;
    }
    return t;
  });
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(todos);
  listItemsLeft();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(todos);
}

function listItemsLeft() {
  itemsLeftText = todos.filter((t) => !t.completed).length;
  document.getElementById("completedCount").innerHTML = itemsLeftText;
}

function showAll() {
  renderTodos(todos);
}

function showCompleted() {
  let completedTodos = todos.filter((t) => t.completed);
  renderTodos(completedTodos);
}

function showActive() {
  let activeTodos = todos.filter((t) => !t.completed);
  renderTodos(activeTodos);
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
