const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addTask");
const list = document.getElementById("taskList");
const filter = document.getElementById("filter");
const clearCompletedBtn = document.getElementById("clearCompleted");
const clearAllBtn = document.getElementById("clearAll");

let tasks = JSON.parse(localStorage.getItem('tasks-todo')) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem('tasks-todo', JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';
  let filtered = tasks;
  if (currentFilter === "active") filtered = tasks.filter(t => !t.completed);
  if (currentFilter === "completed") filtered = tasks.filter(t => t.completed);

  filtered.forEach((task, idx) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    li.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        task.completed = !task.completed;
        saveTasks();
        render();
      }
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.title = "Удалить";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      tasks.splice(tasks.indexOf(task), 1);
      saveTasks();
      render();
    };
    li.appendChild(delBtn);

    list.appendChild(li);
  });

  Array.from(filter.children).forEach(btn => btn.classList.remove("active"));
  const activeBtn = Array.from(filter.children)
    .find(btn => btn.dataset.filter === currentFilter);
  if (activeBtn) activeBtn.classList.add("active");
}

addBtn.onclick = () => {
  const value = input.value.trim();
  if (value) {
    tasks.push({ text: value, completed: false });
    saveTasks();
    render();
    input.value = "";
    input.focus();
  }
};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBtn.click();
});

filter.addEventListener("click", function(event) {
  if (event.target.dataset.filter) {
    currentFilter = event.target.dataset.filter;
    render();
  }
});

clearCompletedBtn.onclick = () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
};

clearAllBtn.onclick = () => {
  if (confirm("Удалить все задачи?")) {
    tasks = [];
    saveTasks();
    render();
  }
};

render();
