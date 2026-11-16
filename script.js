
// Get saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    updateStats();
}

// Add a task
function addTask() {
    let name = document.getElementById("task-name").value;
    let description = document.getElementById("description").value;
    let priority = document.getElementById("priority").value;
    let date = document.getElementById("due-date").value;

    if (name.trim() === "") {
        alert("Please enter a task name");
        return;
    }

    let task = {
        id: Date.now(),
        name: name,
        description: description,
        priority: priority,
        date: date,
        status: "todo"
    };

    tasks.push(task);
    saveTasks();

    document.getElementById("task-name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("due-date").value = "";
}

// Display tasks
function displayTasks() {
    let todo = document.getElementById("todo-list");
    let doing = document.getElementById("doing-list");
    let done = document.getElementById("done-list");

    if (!todo || !doing || !done) return;

    todo.innerHTML = "";
    doing.innerHTML = "";
    done.innerHTML = "";

    let filter = document.getElementById("filter");
    let selectedPriority = filter ? filter.value : "All";

    tasks.forEach(function(task) {
        if (selectedPriority !== "All" && task.priority !== selectedPriority) {
            return;
        }

        let card = document.createElement("div");
        card.className = "task-card";
        card.draggable = true;

        card.innerHTML = `
            <h3>${task.name}</h3>
            <p>${task.description}</p>
            <p>${task.priority} Priority</p>
            <p>Due: ${task.date || "No date"}</p>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        // Drag task
        card.addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("taskId", task.id);
        });

        if (task.status === "todo") {
            todo.appendChild(card);
        }
        else if (task.status === "doing") {
            doing.appendChild(card);
        }
        else if (task.status === "done") {
            done.appendChild(card);
        }
    });

    if (todo.innerHTML === "") todo.innerHTML = "<p>No tasks here</p>";
    if (doing.innerHTML === "") doing.innerHTML = "<p>No tasks here</p>";
    if (done.innerHTML === "") done.innerHTML = "<p>No tasks here</p>";
}

// Edit a task
function editTask(id) {
    let task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) return;

    let newName = prompt("Enter task name", task.name);

    if (newName === null || newName.trim() === "") return;

    task.name = newName.trim();

    let newDescription = prompt("Enter description", task.description);

    if (newDescription !== null) {
        task.description = newDescription;
    }

    saveTasks();
}

// Delete a task
function deleteTask(id) {
    if (confirm("Do you want to delete this task?")) {
        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });

        saveTasks();
    }
}

// Drag and drop
let columns = document.querySelectorAll(".task-list");

columns.forEach(function(column) {

    column.addEventListener("dragover", function(event) {
        event.preventDefault();
    });

    column.addEventListener("drop", function(event) {
        event.preventDefault();

        let id = Number(event.dataTransfer.getData("taskId"));
        let newStatus = column.getAttribute("data-status");

        let task = tasks.find(function(item) {
            return item.id === id;
        });

        if (task) {
            task.status = newStatus;
            saveTasks();
        }
    });
});

// Dashboard statistics
function updateStats() {
    let total = tasks.length;

    let todo = tasks.filter(task => task.status === "todo").length;
    let doing = tasks.filter(task => task.status === "doing").length;
    let done = tasks.filter(task => task.status === "done").length;

    if (document.getElementById("total")) {
        document.getElementById("total").innerText = total;
        document.getElementById("todo").innerText = todo;
        document.getElementById("doing").innerText = doing;
        document.getElementById("done").innerText = done;

        let percentage = total === 0 ? 0 : Math.round(done / total * 100);

        document.getElementById("progress-bar").style.width = percentage + "%";
        document.getElementById("progress-text").innerText = percentage + "% Completed";
    }
}

// Run when page opens
displayTasks();
updateStats();

        



