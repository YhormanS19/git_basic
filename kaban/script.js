let draggedTask = null;


const MAX_TASKS_IN_DONE = 5;




function saveTasks() {
    const columns = document.querySelectorAll(".column");
    const allTasks = {};

    columns.forEach(column => {
        const columnId = column.querySelector(".task-list").id;
        const tasksInColumn = [];
        column.querySelectorAll(".task").forEach(taskElement => {
            tasksInColumn.push({
                id: taskElement.dataset.taskId,
                text: taskElement.querySelector('.task-text').textContent
            });
        });
        allTasks[columnId] = tasksInColumn;
    });

    localStorage.setItem("kanbanTasks", JSON.stringify(allTasks));
    console.log("Tareas guardadas:", allTasks);
}



function loadTasks() {
    const storedTasks = localStorage.getItem("kanbanTasks");
    if (storedTasks) {
        const allTasks = JSON.parse(storedTasks);

        for (const columnId in allTasks) {
            const taskList = document.getElementById(columnId);
            if (taskList) {
                allTasks[columnId].forEach(taskData => {
                    createTaskElement(taskData.text, taskData.id, taskList);
                });
            }
        }
        console.log("Tareas cargadas:", allTasks);
    }
}



// --- Funciones de Creación y Manejo de Tareas ---

/**
 * Crea un elemento de tarea (div.task) con su texto, ID, botón de eliminar
 * y eventos de drag-and-drop y edición.
 * @param {string} taskText - El texto de la tarea.
 * @param {string} [taskId] - El ID único de la tarea. Si no se proporciona, se genera uno.
 * @param {HTMLElement} [parentList] - La lista de tareas (div.task-list) a la que se añadirá.
 * @returns {HTMLElement} El elemento de tarea creado.
 */
function createTaskElement(taskText, taskId = Date.now().toString(), parentList) {
    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;
    task.dataset.taskId = taskId;

    const taskTextSpan = document.createElement("span");
    taskTextSpan.className = "task-text";
    taskTextSpan.textContent = taskText;
    task.appendChild(taskTextSpan);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task-btn";
    deleteButton.textContent = "X";
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            task.remove();
            saveTasks();
        }
    };
    task.appendChild(deleteButton);

    addDragAndDropEvents(task);
    addEditEvents(taskTextSpan);

    if (parentList) {
        parentList.appendChild(task);
    }
    return task;
}

/**
 * Añade la funcionalidad de edición (doble clic) a un elemento de texto de tarea.
 * @param {HTMLElement} taskTextSpan
 */
function addEditEvents(taskTextSpan) {
    taskTextSpan.addEventListener("dblclick", () => {
        const currentText = taskTextSpan.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.className = "task-edit-input";
        input.value = currentText;

        taskTextSpan.replaceWith(input);
        input.focus();

        const saveEditedTask = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                taskTextSpan.textContent = newText;
            } else {
                taskTextSpan.textContent = currentText;
            }
            input.replaceWith(taskTextSpan);
            saveTasks();
        };

        input.addEventListener("blur", saveEditedTask);
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });
    });
}

/**
 * Añade una nueva tarea a la columna especificada.
 * @param {string} columnId - El ID de la lista de tareas a la que se añadirá la tarea.
 */
function addTask(columnId) {
    const taskText = prompt("Escribe la tarea:");
    if (taskText) {
        const taskList = document.getElementById(columnId);
        createTaskElement(taskText, undefined, taskList);
        saveTasks();

        if (columnId === 'done') {
            checkAndArchiveDoneTasks(); // Verifica y archiva automáticamente si la columna "Hecho" se llena
        }
    }
}



// --- Funciones de Drag and Drop ---

/**
 * Añade los eventos de dragstart y dragend a un elemento de tarea.
 * @param {HTMLElement} task - El elemento de tarea (div.task).
 */
function addDragAndDropEvents(task) {
    task.addEventListener("dragstart", (e) => {
        draggedTask = task;
        task.classList.add("dragging");
    });

    task.addEventListener("dragend", (e) => {
        e.preventDefault();
        task.classList.remove("dragging");
        draggedTask = null;
    });
}

/**
 * Configura los eventos de drag-and-drop para todas las listas de tareas (columnas).
 */
function setupColumnsEvents() {
    document.querySelectorAll(".task-list").forEach(list => {
        list.addEventListener("dragover", (e) => {
            e.preventDefault();
            list.classList.add("drag-over"); // Indicador visual de arrastre
        });

        list.addEventListener("dragleave", (e) => {
            e.preventDefault();
            list.classList.remove("drag-over");
        });

        list.addEventListener("drop", (e) => {
            e.preventDefault();
            list.classList.remove("drag-over");

            if (draggedTask) {
                const targetList = list;
                targetList.appendChild(draggedTask);

                if (targetList.id === 'done') {
                    checkAndArchiveDoneTasks(); // Verifica y archiva automáticamente
                }
                saveTasks(); // Guarda el estado después de soltar la tarea
            }
        });
    });
}



// --- Funciones de Archivando ---

/**
 * Mueve un elemento de tarea a la columna 'Archivadas'.
 * No llama a saveTasks() directamente para permitir optimizaciones
 * cuando se mueven múltiples tareas a la vez.
 * @param {HTMLElement} taskElement - El elemento de tarea a mover.
 */
function moveTaskToArchived(taskElement) {
    const archivedList = document.getElementById('archived');
    if (archivedList && taskElement) {
        archivedList.appendChild(taskElement);
        console.log(`Tarea "${taskElement.querySelector('.task-text').textContent}" movida a Archivadas.`);
    }
}

/**
 * Verifica si la columna 'Hecho' excede el límite y archiva las tareas más antiguas automáticamente.
 * Llama a saveTasks() al final de su ejecución para persistir todos los cambios.
 */
function checkAndArchiveDoneTasks() {
    const doneList = document.getElementById('done');
    let tasksInDone = doneList.querySelectorAll('.task');

    while (tasksInDone.length > MAX_TASKS_IN_DONE) {
        const taskToArchive = tasksInDone[0]; // La tarea más antigua
        moveTaskToArchived(taskToArchive);
        tasksInDone = doneList.querySelectorAll('.task'); // Recargar la lista para la próxima iteración
    }
    saveTasks(); // Guarda el estado después de cualquier archivo automático
}

/**
 * Archiva la última tarea de la columna 'Hecho' a la columna 'Archivadas'
 * (función asociada al botón "Archivar Última Tarea").
 */
function archiveLastDoneTask() {
    const doneList = document.getElementById('done');
    const tasksInDone = doneList.querySelectorAll('.task');

    if (tasksInDone.length > 0) {
        const lastTask = tasksInDone[tasksInDone.length - 1]; // Obtener la última tarea
        moveTaskToArchived(lastTask);
        saveTasks(); // Guarda el estado después de archivar la tarea
        alert(`Tarea "${lastTask.querySelector('.task-text').textContent}" archivada.`);
    } else {
        alert("No hay tareas en la columna 'Hecho' para archivar.");
    }
}


function archiveAllDoneTasks() {
    const doneList = document.getElementById('done');
    const tasksToArchive = Array.from(doneList.querySelectorAll('.task'));

    if (tasksToArchive.length > 0) {
        if (confirm("¿Estás seguro de que quieres archivar TODAS las tareas de 'Hecho'?")) {
            tasksToArchive.forEach(task => {
                moveTaskToArchived(task);
            });
            saveTasks(); // Guarda el estado UNA VEZ después de mover todas las tareas
            alert("Todas las tareas de 'Hecho' han sido archivadas.");
        }
    } else {
        alert("No hay tareas en la columna 'Hecho' para archivar.");
    }
}



// --- Ejecución al Iniciar la Página ---
// Configura los eventos de arrastre para las columnas al cargar el DOM.
setupColumnsEvents();
// Carga las tareas existentes desde