// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');
const progressFill = document.getElementById('progressFill');
const taskCount = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskModal = document.getElementById('taskModal');
const closeModal = document.querySelector('.close-modal');
const editTaskText = document.getElementById('editTaskText');
const editTaskPriority = document.getElementById('editTaskPriority');
const editTaskDueDate = document.getElementById('editTaskDueDate');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Global variables
let currentFilter = 'all';
let editingTaskId = null;
let nextTaskId = 1;

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadTheme();
    updateUI();
});

addTaskBtn.addEventListener('click', addNewTask);

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addNewTask();
    }
});

themeToggle.addEventListener('click', toggleTheme);
clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        currentFilter = this.getAttribute('data-filter');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        filterTasks();
    });
});

closeModal.addEventListener('click', closeTaskModal);
saveTaskBtn.addEventListener('click', saveEditedTask);
cancelEditBtn.addEventListener('click', closeTaskModal);

// Main Functions

function checkDueDates() {
    const tasks = getTasks();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            if (dueDate.toDateString() === now.toDateString() && !task.completed) {
                alert(`Task "${task.text}" is due today!`);
            } else if (dueDate < now && !task.completed) {
                alert(`Task "${task.text}" is overdue!`);
            }
        }
    });
}

// Run the check when the page loads
window.addEventListener('DOMContentLoaded', checkDueDates);       

let draggedTask = null;

taskList.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'LI') {
        draggedTask = e.target;
        e.target.classList.add('dragging');
    }
});

taskList.addEventListener('dragend', function (e) {
    if (e.target.tagName === 'LI') {
        e.target.classList.remove('dragging');
        draggedTask = null;
    }
});

taskList.addEventListener('dragover', function (e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.appendChild(draggedTask);
    } else {
        taskList.insertBefore(draggedTask, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        const taskText = task.querySelector('.task-text').textContent.toLowerCase();
        task.style.display = taskText.includes(query) ? 'flex' : 'none';
    });
});
function addNewTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: nextTaskId++,
        text: taskText,
        completed: false,
        priority: 'medium',
        dueDate: '',
        createdAt: new Date().toISOString()
    };

    addTaskToDOM(task);
    saveTasks();
    
    taskInput.value = '';
    taskInput.focus();
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.draggable = true; // Add this line
    if (task.completed) li.classList.add('completed');
    
    // Due date check
    let dueDateClass = '';
    let dueDateDisplay = '';
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (dueDate < now && !task.completed) {
            dueDateClass = 'overdue';
            dueDateDisplay = formatDate(task.dueDate);
        } else {
            dueDateDisplay = formatDate(task.dueDate);
        }
    }

    li.innerHTML = `
        <div class="task-content">
            <div class="checkbox ${task.completed ? 'checked' : ''}"></div>
            <div class="priority ${task.priority}"></div>
            <span class="task-text">${escapeHTML(task.text)}</span>
            ${task.dueDate ? `<span class="due-date ${dueDateClass}">${dueDateDisplay}</span>` : ''}
        </div>
        <div class="actions">
            <button class="action-btn edit-btn">✏️</button>
            <button class="action-btn delete-btn">🗑️</button>
        </div>
    `;

    // Event Listeners for Task Items
    const checkbox = li.querySelector('.checkbox');
    checkbox.addEventListener('click', function() {
        toggleTaskCompletion(li, task.id);
    });

    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
        openEditTaskModal(task.id);
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        deleteTask(task.id);
    });

    taskList.appendChild(li);
    applyTaskFilter(li);
}

function toggleTaskCompletion(li, taskId) {
    li.classList.toggle('completed');
    li.querySelector('.checkbox').classList.toggle('checked');
    
    // Update task in storage
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    updateUI();
}

function openEditTaskModal(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        editingTaskId = taskId;
        editTaskText.value = task.text;
        editTaskPriority.value = task.priority;
        editTaskDueDate.value = task.dueDate ? task.dueDate : '';
        
        taskModal.style.display = 'flex';
    }
}

function closeTaskModal() {
    taskModal.style.display = 'none';
    editingTaskId = null;
}

function saveEditedTask() {
    if (!editingTaskId) return;
    
    const text = editTaskText.value.trim();
    if (text === '') return;
    
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].text = text;
        tasks[taskIndex].priority = editTaskPriority.value;
        tasks[taskIndex].dueDate = editTaskDueDate.value;
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        refreshTaskList();
        closeTaskModal();
    }
}

function deleteTask(taskId) {
    const tasks = getTasks().filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    const taskElement = document.querySelector(`li[data-id="${taskId}"]`);
    if (taskElement) {
        taskElement.style.opacity = '0';
        setTimeout(() => {
            taskElement.remove();
            updateUI();
        }, 300);
    }
}

function clearCompleted() {
    const tasks = getTasks().filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
}

function filterTasks() {
    const taskItems = document.querySelectorAll('#taskList li');
    taskItems.forEach(li => {
        applyTaskFilter(li);
    });
    
    // Show empty state if no visible tasks
    updateEmptyState();
}

function applyTaskFilter(li) {
    const isCompleted = li.classList.contains('completed');
    
    switch(currentFilter) {
        case 'active':
            li.style.display = isCompleted ? 'none' : 'flex';
            break;
        case 'completed':
            li.style.display = isCompleted ? 'flex' : 'none';
            break;
        default: // 'all'
            li.style.display = 'flex';
    }
}

function updateEmptyState() {
    const visibleTasks = document.querySelectorAll('#taskList li[style="display: flex;"]');
    
    if (taskList.children.length === 0 || visibleTasks.length === 0) {
        // No tasks or no visible tasks
        if (!document.querySelector('.empty-state')) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            
            const message = currentFilter === 'all' 
                ? "You don't have any tasks yet."
                : currentFilter === 'active' 
                    ? "No active tasks."
                    : "No completed tasks.";
            
            emptyState.innerHTML = `
                <div class="empty-icon">📋</div>
                <p>${message}</p>
            `;
            
            taskList.appendChild(emptyState);
        }
    } else {
        // Tasks exist
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }
}

function refreshTaskList() {
    taskList.innerHTML = '';
    loadTasks();
    updateUI();
}

function updateUI() {
    const tasks = getTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Update counts
    taskCount.textContent = `${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'}`;
    completedCount.textContent = `${completedTasks} completed`;
    
    // Update progress bar
    if (totalTasks > 0) {
        const progressPercentage = (completedTasks / totalTasks) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    } else {
        progressFill.style.width = '0%';
    }
    
    updateEmptyState();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Helper Functions
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const taskId = parseInt(li.dataset.id);
        if (!taskId) return;
        
        const textEl = li.querySelector('.task-text');
        const completed = li.classList.contains('completed');
        const priorityEl = li.querySelector('.priority');
        const dueDateEl = li.querySelector('.due-date');
        
        // Get the existing task to preserve creation date
        const existingTasks = getTasks();
        const existingTask = existingTasks.find(t => t.id === taskId);
        
        tasks.push({
            id: taskId,
            text: textEl ? textEl.textContent : '',
            completed: completed,
            priority: priorityEl ? priorityEl.classList[1] : 'medium',
            dueDate: dueDateEl ? extractDateFromDisplay(dueDateEl.textContent) : '',
            createdAt: existingTask ? existingTask.createdAt : new Date().toISOString()
        });
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateUI();
}

function getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Find the highest task ID to set nextTaskId
    if (tasks.length > 0) {
        const maxId = Math.max(...tasks.map(task => task.id || 0));
        nextTaskId = maxId + 1;
    }
    return tasks;
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => addTaskToDOM(task));
}

function loadTheme() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

    const diffTime = now - date; // Difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days (use Math.ceil for past dates)

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `Due ${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Due ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `Due ${months} month${months > 1 ? 's' : ''} ago`;
    } else if (diffDays < 730) { // Less than 2 years
        return 'Due last year';
    } else {
        // Beyond a year, show the exact date
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
}

function extractDateFromDisplay(displayText) {
    // Convert display format back to YYYY-MM-DD
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (displayText === 'Today') {
        return today.toISOString().split('T')[0];
    } else if (displayText === 'Tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    } else if (displayText === 'Yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    } else {
        // Try to parse the short date format (e.g., "Apr 15")
        const current = new Date();
        const parts = displayText.split(' ');
        if (parts.length === 2) {
            const months = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };
            const month = months[parts[0]];
            const day = parseInt(parts[1]);
            
            if (month !== undefined && !isNaN(day)) {
                current.setMonth(month);
                current.setDate(day);
                return current.toISOString().split('T')[0];
            }
        }
        
        return '';
    }
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}