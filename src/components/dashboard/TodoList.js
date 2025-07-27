import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Check, Clock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { todoAPI } from '../../services/api';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { showToast } from '../ui/Toast';

const TodoList = () => {
  const [newTask, setNewTask] = useState('');
  const queryClient = useQueryClient();

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await todoAPI.getTasks();
      return response.data.tasks || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: todoAPI.addTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      setNewTask('');
      showToast('success', 'Task added successfully');
    },
    onError: () => {
      showToast('error', 'Failed to add task');
    },
  });

  // Toggle task mutation
  const toggleTaskMutation = useMutation({
    mutationFn: todoAPI.toggleTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      showToast('success', 'Task updated');
    },
    onError: () => {
      showToast('error', 'Failed to update task');
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: todoAPI.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      showToast('success', 'Task deleted');
    },
    onError: () => {
      showToast('error', 'Failed to delete task');
    },
  });

  const handleAddTask = e => {
    e.preventDefault();
    if (!newTask.trim()) {
      showToast('error', 'Please enter a task');
      return;
    }
    addTaskMutation.mutate({ task: newTask.trim() });
  };

  const handleToggleTask = taskId => {
    toggleTaskMutation.mutate(taskId);
  };

  const handleDeleteTask = taskId => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tasks</h3>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Todo List</h2>
          <p className="text-gray-600 mt-1">Manage your tasks and stay organized</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-600">{pendingTasks.length} Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-600">{completedTasks.length} Completed</span>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      <Card>
        <Card.Body>
          <form onSubmit={handleAddTask} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="form-input w-full"
                disabled={addTaskMutation.isLoading}
              />
            </div>
            <Button type="submit" loading={addTaskMutation.isLoading} className="whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </form>
        </Card.Body>
      </Card>

      {/* Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Tasks ({pendingTasks.length})
              </h3>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {isLoading ? (
              <div className="p-8">
                <LoadingSpinner className="mx-auto" />
              </div>
            ) : pendingTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending tasks</p>
                <p className="text-sm">Add a task to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="flex-shrink-0 w-5 h-5 border-2 border-gray-300 rounded hover:border-green-500 transition-colors"
                        disabled={toggleTaskMutation.isLoading}
                      />
                      <span className="text-gray-900">{task.task}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={deleteTaskMutation.isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Completed Tasks ({completedTasks.length})
              </h3>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {isLoading ? (
              <div className="p-8">
                <LoadingSpinner className="mx-auto" />
              </div>
            ) : completedTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Check className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No completed tasks</p>
                <p className="text-sm">Complete a task to see it here!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {completedTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="flex-shrink-0 w-5 h-5 bg-green-500 border-2 border-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors"
                        disabled={toggleTaskMutation.isLoading}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </button>
                      <span className="text-gray-500 line-through">{task.task}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={deleteTaskMutation.isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TodoList;
