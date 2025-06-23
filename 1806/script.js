
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');


let tasks = [];


function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
    
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks() {
    taskList.innerHTML = ''; 
    if (tasks.length === 0) {
        const noTasksMessage = document.createElement('li');
        noTasksMessage.className = 'text-center text-gray-500 text-lg py-4';
        noTasksMessage.textContent = '¡Añade una nueva tarea!';
        taskList.appendChild(noTasksMessage);
    } else {
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'task-item'; 
            listItem.innerHTML = `
                <span class="task-text">${task}</span>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            `;
            taskList.appendChild(listItem);
        });
    }
}


function addTask() {
    const newTask = taskInput.value.trim(); 
    if (newTask !== '') {
        tasks.push(newTask);
        taskInput.value = ''; 
        saveTasks();
        renderTasks(); 
    } else {
        
        
        alert('Por favor, introduzca una tarea.');
    }
}


function deleteTask(event) {
    
    if (event.target.classList.contains('delete-btn')) {
        const indexToDelete = event.target.dataset.index;
        tasks.splice(indexToDelete, 1); 
        saveTasks(); 
        renderTasks(); 
    }
}


addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});
taskList.addEventListener('click', deleteTask);
document.addEventListener('DOMContentLoaded', loadTasks);


