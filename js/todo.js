// Modern Todo List JavaScript with ES6+ features
class TodoManager {
  constructor() {
    this.taskInput = document.getElementById('task-input');
    this.addTaskButton = document.getElementById('add-task-button');
    this.taskList = document.getElementById('task-list');
    this.init();
  }

  init() {
    if (!this.taskInput || !this.addTaskButton || !this.taskList) {
      console.warn('Todo elements not found on page');
      return;
    }

    this.addTaskButton.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.addTask();
      }
    });
    this.taskList.addEventListener('click', event => this.handleTaskClick(event));
  }

  addTask() {
    const taskText = this.taskInput.value.trim();
    if (!taskText) {
      this.showToast('Please enter a task', 'warning');
      return;
    }

    const li = this.createTaskElement(taskText);
    this.taskList.appendChild(li);
    this.taskInput.value = '';
    this.taskInput.focus();

    this.showToast('Task added successfully', 'success');
  }

  createTaskElement(taskText) {
    const li = document.createElement('li');
    li.className =
      'task-item flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200';

    li.innerHTML = `
      <div class="flex items-center space-x-3">
        <input type="checkbox" class="task-checkbox w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
        <span class="task-text text-gray-900">${this.escapeHtml(taskText)}</span>
      </div>
      <button class="delete-btn text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `;

    return li;
  }

  handleTaskClick(event) {
    const { target } = event;

    if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
      this.deleteTask(target.closest('.task-item'));
    } else if (target.classList.contains('task-checkbox')) {
      this.toggleTask(target);
    }
  }

  toggleTask(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    const taskText = taskItem.querySelector('.task-text');

    if (checkbox.checked) {
      taskText.classList.add('line-through', 'text-gray-500');
      taskItem.classList.add('bg-gray-50');
    } else {
      taskText.classList.remove('line-through', 'text-gray-500');
      taskItem.classList.remove('bg-gray-50');
    }
  }

  deleteTask(taskItem) {
    if (confirm('Are you sure you want to delete this task?')) {
      taskItem.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => {
        taskItem.remove();
        this.showToast('Task deleted', 'info');
      }, 300);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showToast(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300 ${this.getToastClass(type)}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  getToastClass(type) {
    const classes = {
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    };
    return classes[type] || classes.info;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TodoManager();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }

  .task-item {
    transition: all 0.2s ease-in-out;
  }

  .task-item:hover {
    transform: translateY(-1px);
  }
`;
document.head.appendChild(style);
