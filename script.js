let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function toggleTheme() {

    document.body.classList.toggle("dark");

    let theme = "light";

    if (document.body.classList.contains("dark")) {
        theme = "dark";
    }

    localStorage.setItem("theme", theme);
}

let savedTheme = localStorage.getItem("theme");

if (savedTheme == "dark") {
    document.body.classList.add("dark");
}
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
    updateStats();
    showHomeData();
}
function addTask() {

    let name = document.getElementById("task-name").value;
    let description = document.getElementById("description").value;
    let priority = document.getElementById("priority").value;
    let date = document.getElementById("due-date").value;

    if (name == "") {
        alert("Please enter task name");
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

    alert("Task added successfully!");
}
function displayTasks() {

    let todo = document.getElementById("todo-list");
    let doing = document.getElementById("doing-list");
    let done = document.getElementById("done-list");

    // Check if we are on the tasks page

    if (todo == null) {
        return;
    }

    todo.innerHTML = "";
    doing.innerHTML = "";
    done.innerHTML = "";

    let filter = document.getElementById("filter").value;

    for (let i = 0; i < tasks.length; i++) {

        let task = tasks[i];

        if (filter != "All" && task.priority != filter) {
            continue;
        }

        let card = document.createElement("div");

        card.className = "task-card";
        card.draggable = true;

        card.innerHTML = `
            <h3>${task.name}</h3>

            <p>${task.description}</p>

            <p class="${task.priority}">
                ${task.priority} Priority
            </p>

            <p>Due: ${task.date || "No date"}</p>

            <button onclick="editTask(${task.id})">Edit</button>

            <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        // DRAG TASK

        card.addEventListener("dragstart", function(event) {

            event.dataTransfer.setData("taskId", task.id);

        });

        if (task.status == "todo") {
            todo.appendChild(card);
        }

        else if (task.status == "doing") {
            doing.appendChild(card);
        }

        else if (task.status == "done") {
            done.appendChild(card);
        }
    }

    // SHOW EMPTY MESSAGE

    if (todo.innerHTML == "") {
        todo.innerHTML = "<p>No tasks here</p>";
    }

    if (doing.innerHTML == "") {
        doing.innerHTML = "<p>No tasks here</p>";
    }

    if (done.innerHTML == "") {
        done.innerHTML = "<p>No tasks here</p>";
    }
}
function editTask(id) {

    for (let i = 0; i < tasks.length; i++) {

        if (tasks[i].id == id) {

            let newName = prompt("Enter new task name", tasks[i].name);

            if (newName != null && newName.trim() != "") {
                tasks[i].name = newName.trim();
            }

            let newDescription = prompt(
                "Enter new description",
                tasks[i].description
            );

            if (newDescription != null) {
                tasks[i].description = newDescription;
            }

            let newPriority = prompt(
                "Enter priority: High, Medium or Low",
                tasks[i].priority
            );

            if (newPriority != null) {

                newPriority = newPriority.trim();

                if (
                    newPriority == "High" ||
                    newPriority == "Medium" ||
                    newPriority == "Low"
                ) {
                    tasks[i].priority = newPriority;
                }
            }

            break;
        }
    }

    saveTasks();
}


// ==================================
// DELETE TASK
// ==================================

function deleteTask(id) {

    let answer = confirm("Do you want to delete this task?");

    if (answer == true) {

        for (let i = 0; i < tasks.length; i++) {

            if (tasks[i].id == id) {

                tasks.splice(i, 1);
                break;
            }
        }

        saveTasks();
    }
}


// ==================================
// DRAG AND DROP
// ==================================

let columns = document.querySelectorAll(".task-list");

for (let i = 0; i < columns.length; i++) {

    columns[i].addEventListener("dragover", function(event) {

        event.preventDefault();

    });

    columns[i].addEventListener("drop", function(event) {

        event.preventDefault();

        let id = event.dataTransfer.getData("taskId");

        let newStatus = this.getAttribute("data-status");

        for (let j = 0; j < tasks.length; j++) {

            if (tasks[j].id == id) {

                tasks[j].status = newStatus;
                break;
            }
        }

        saveTasks();

    });
}


// ==================================
// DASHBOARD STATISTICS
// ==================================

function updateStats() {

    let total = tasks.length;

    let todo = 0;
    let doing = 0;
    let done = 0;

    let high = 0;
    let medium = 0;
    let low = 0;

    for (let i = 0; i < tasks.length; i++) {

        if (tasks[i].status == "todo") {
            todo++;
        }

        else if (tasks[i].status == "doing") {
            doing++;
        }

        else if (tasks[i].status == "done") {
            done++;
        }

        if (tasks[i].priority == "High") {
            high++;
        }

        else if (tasks[i].priority == "Medium") {
            medium++;
        }

        else if (tasks[i].priority == "Low") {
            low++;
        }
    }

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((done / total) * 100);
    }

    if (document.getElementById("total") != null) {

        document.getElementById("total").innerText = total;
        document.getElementById("todo").innerText = todo;
        document.getElementById("doing").innerText = doing;
        document.getElementById("done").innerText = done;

        document.getElementById("progress-bar").style.width =
            percentage + "%";

        document.getElementById("progress-text").innerText =
            percentage + "% Completed";

        document.getElementById("priority-info").innerText =
            "High: " + high +
            " | Medium: " + medium +
            " | Low: " + low;
    }
}


// ==================================
// HOME PAGE DATA
// ==================================

function showHomeData() {

    let total = tasks.length;
    let done = 0;
    let doing = 0;

    for (let i = 0; i < tasks.length; i++) {

        if (tasks[i].status == "done") {
            done++;
        }

        if (tasks[i].status == "doing") {
            doing++;
        }
    }

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((done / total) * 100);
    }

    if (document.getElementById("total") == null) {

        if (document.getElementById("progress-bar") != null) {

            document.getElementById("total").innerText = total;
        }
    }

    if (document.getElementById("progress-bar") != null) {

        if (document.getElementById("progress-text").innerText != "") {
            document.getElementById("progress-bar").style.width =
                percentage + "%";
        }
    }

    if (document.getElementById("done") != null) {
        document.getElementById("done").innerText = done;
    }

    if (document.getElementById("doing") != null) {
        document.getElementById("doing").innerText = doing;
    }
}


// ==================================
// CALENDAR
// ==================================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

let selectedDate = "";

function showCalendar() {

    let calendar = document.getElementById("calendar");

    if (calendar == null) {
        return;
    }

    calendar.innerHTML = "";

    let monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];

    document.getElementById("month-year").innerText =
        monthNames[currentMonth] + " " + currentYear;

    let firstDay = new Date(currentYear, currentMonth, 1).getDay();

    let totalDays = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {

        let heading = document.createElement("div");

        heading.innerText = weekdays[i];

        calendar.appendChild(heading);
    }

    // EMPTY SPACES BEFORE FIRST DATE

    for (let i = 0; i < firstDay; i++) {

        let empty = document.createElement("div");

        calendar.appendChild(empty);
    }

    // DISPLAY DATES

    for (let day = 1; day <= totalDays; day++) {

        let date = document.createElement("div");

        date.className = "calendar-day";
        date.innerText = day;

        let month = String(currentMonth + 1).padStart(2, "0");
        let dayText = String(day).padStart(2, "0");

        let fullDate = currentYear + "-" + month + "-" + dayText;

        if (fullDate == selectedDate) {
            date.classList.add("selected");
        }

        for (let i = 0; i < tasks.length; i++) {

            if (tasks[i].date == fullDate) {
                date.classList.add("has-task");
            }
        }

        date.onclick = function() {

            selectedDate = fullDate;

            showCalendar();
            showDateTasks(fullDate);
        };

        calendar.appendChild(date);
    }

    if (selectedDate == "") {
        let today = new Date();

        selectedDate =
            today.getFullYear() + "-" +
            String(today.getMonth() + 1).padStart(2, "0") + "-" +
            String(today.getDate()).padStart(2, "0");
    }

    showDateTasks(selectedDate);
}


// CHANGE MONTH

function changeMonth(value) {

    currentMonth = currentMonth + value;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    showCalendar();
}


// SHOW TASKS ON SELECTED DATE

function showDateTasks(date) {

    let container = document.getElementById("date-tasks");

    if (container == null) {
        return;
    }

    container.innerHTML = "";

    let found = false;

    for (let i = 0; i < tasks.length; i++) {

        if (tasks[i].date == date) {

            found = true;

            let p = document.createElement("p");

            p.innerText = tasks[i].name + " - " + tasks[i].status;

            container.appendChild(p);
        }
    }

    if (found == false) {
        container.innerText = "No tasks on this date.";
    }
}


// ==================================
// NOTES
// ==================================

function saveNotes() {

    localStorage.setItem("notes", JSON.stringify(notes));

    displayNotes();
}


// ADD NOTE

function addNote() {

    let title = document.getElementById("note-title").value;
    let content = document.getElementById("note-content").value;

    if (title == "" || content == "") {

        alert("Please fill both fields");
        return;
    }

    let note = {
        id: Date.now(),
        title: title,
        content: content
    };

    notes.push(note);

    saveNotes();

    document.getElementById("note-title").value = "";
    document.getElementById("note-content").value = "";

    alert("Note saved!");
}


// DISPLAY NOTES

function displayNotes() {

    let container = document.getElementById("notes-list");

    if (container == null) {
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < notes.length; i++) {

        let card = document.createElement("div");

        card.className = "note-card";

        card.innerHTML = `
            <h3>${notes[i].title}</h3>
            <p>${notes[i].content}</p>

            <button onclick="editNote(${notes[i].id})">Edit</button>

            <button onclick="deleteNote(${notes[i].id})">Delete</button>
        `;

        container.appendChild(card);
    }
}


// EDIT NOTE

function editNote(id) {

    for (let i = 0; i < notes.length; i++) {

        if (notes[i].id == id) {

            let title = prompt("Enter new title", notes[i].title);

            let content = prompt(
                "Enter new content",
                notes[i].content
            );

            if (title != null && title.trim() != "") {
                notes[i].title = title.trim();
            }

            if (content != null) {
                notes[i].content = content;
            }

            break;
        }
    }

    saveNotes();
}


// DELETE NOTE

function deleteNote(id) {

    let answer = confirm("Delete this note?");

    if (answer == true) {

        for (let i = 0; i < notes.length; i++) {

            if (notes[i].id == id) {

                notes.splice(i, 1);
                break;
            }
        }

        saveNotes();
    }
}


// ==================================
// POMODORO TIMER
// ==================================

let time = 25 * 60;
let timerInterval = null;
let running = false;


// DISPLAY TIMER

function displayTimer() {

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    let timer = document.getElementById("timer");

    if (timer != null) {

        timer.innerText =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");
    }
}


// SELECT TIMER

function setTimer(minutes) {

    clearInterval(timerInterval);

    running = false;

    time = minutes * 60;

    displayTimer();

    document.getElementById("timer-message").innerText =
        "Timer ready!";
}


// START OR PAUSE TIMER

function startTimer() {

    if (running == true) {

        clearInterval(timerInterval);

        running = false;

        return;
    }

    if (time <= 0) {
        return;
    }

    running = true;

    timerInterval = setInterval(function() {

        time--;

        displayTimer();

        if (time <= 0) {

            clearInterval(timerInterval);

            running = false;

            document.getElementById("timer-message").innerText =
                "Time completed! Great job!";

            alert("Timer completed!");
        }

    }, 1000);
}


// RESET TIMER

function resetTimer() {

    clearInterval(timerInterval);

    running = false;

    time = 25 * 60;

    displayTimer();

    document.getElementById("timer-message").innerText =
        "Timer reset!";
}


// ==================================
// CLEAR ALL DATA
// ==================================

function clearData() {

    let answer = confirm(
        "Are you sure you want to delete all tasks and notes?"
    );

    if (answer == true) {

        tasks = [];
        notes = [];

        localStorage.removeItem("tasks");
        localStorage.removeItem("notes");

        alert("All data has been deleted!");

    }
}


// ==================================
// RUN FUNCTIONS WHEN PAGE OPENS
// ==================================

displayTasks();
updateStats();
showHomeData();
showCalendar();
displayNotes();
displayTimer();


