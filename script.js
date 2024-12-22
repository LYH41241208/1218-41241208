const apiBaseURL = "https://nfutest.pythonanywhere.com/todos";
const studentIdInput = document.getElementById("studentIdInput");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const todoList = document.getElementById("todoList");

// Fetch tasks for the current student
async function fetchTasks() {
    const studentId = studentIdInput.value.trim();
    if (!studentId) {
        alert("Please enter your Student ID.");
        return;
    }
    const response = await fetch(`${apiBaseURL}?student_id=${studentId}`);
    const data = await response.json();
    renderTasks(data.todos);
}

// Render tasks to the DOM
function renderTasks(todos) {
    todoList.innerHTML = ""; // Clear the list
    todos.forEach((todo) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item todo-item";
        listItem.innerHTML = `
            <span>${todo.task}</span>
            <div>
                <button class="btn btn-success btn-sm complete-btn" data-id="${todo.id}" data-completed="${todo.completed}">
                    ${todo.completed ? "Undo" : "Complete"}
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${todo.id}">Delete</button>
            </div>
        `;
        todoList.appendChild(listItem);
    });
}

// Add a new task
addTaskBtn.addEventListener("click", async () => {
    const studentId = studentIdInput.value.trim();
    const taskText = taskInput.value.trim();
    if (!studentId || !taskText) {
        alert("Please enter both Student ID and Task.");
        return;
    }

    const response = await fetch(apiBaseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, task: taskText }),
    });

    if (response.ok) {
        taskInput.value = "";
        fetchTasks();
    } else {
        alert("Failed to add task.");
    }
});

// Handle task actions
todoList.addEventListener("click", async (e) => {
    const target = e.target;
    const taskId = target.getAttribute("data-id");
    const studentId = studentIdInput.value.trim();

    if (!studentId) {
        alert("Please enter your Student ID.");
        return;
    }

    if (target.classList.contains("complete-btn")) {
        const isCompleted = target.getAttribute("data-completed") === "true";
        const response = await fetch(`${apiBaseURL}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ student_id: studentId, task: target.closest("li").querySelector("span").textContent, completed: !isCompleted }),
        });

        if (response.ok) {
            fetchTasks();
        } else {
            alert("Failed to update task.");
        }
    } else if (target.classList.contains("delete-btn")) {
        const response = await fetch(`${apiBaseURL}/${taskId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ student_id: studentId }),
        });

        if (response.ok) {
            fetchTasks();
        } else {
            alert("Failed to delete task.");
        }
    }
});

// Fetch tasks when the student ID is entered
studentIdInput.addEventListener("blur", fetchTasks);
