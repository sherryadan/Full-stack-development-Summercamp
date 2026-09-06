const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const emptyMessage = document.getElementById("emptyMessage");

// Store Tasks

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display Tasks when page loads

renderTasks();

// Add Tasks

addTaskBtn.addEventListener("click", addTask);

// Also allow Enter Key

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Function to add Tasks

function addTask() {
    const taskText = taskInput.value.trim();
    // do not add empty tasks
    if (taskText === "") {
        alert("Please Enter a Task");
        return;
    }
    // Create Task Object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    // Add Tasks to array
    tasks.push(task);

    taskInput.value = "";

    // Save Tasks
    saveTasks();

    // Update UI
    renderTasks();
}

// Function to Display tasks

function renderTasks() {
    // clear current list
    taskList.innerHTML = "";

    // show empty message
    if (tasks.length === 0) {
        taskList.appendChild(emptyMessage);
        updateStats();
        return;
    }

    tasks.forEach(function (task) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        // Task text
        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.classList.add("task-text");

        // If complete
        if (task.completed) {
            taskText.classList.add("completed");
        }

        // Toggle complete when task text is clicked
        taskText.addEventListener("click", function () {
            toggleTask(task.id);
        });

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        // Add elements
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    });

    updateStats();
}

// Complete - Uncomplete tasks

function toggleTask(id) {
    tasks = tasks.map(function (task) {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

// Update Statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
}

// save tasks to browser

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
