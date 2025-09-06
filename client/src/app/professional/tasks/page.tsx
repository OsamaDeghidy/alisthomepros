'use client';

import { useState } from 'react';
import { 
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Flag,
  Search,
  MoreVertical,
  MessageCircle,
  Paperclip,
  X,
  ArrowDown,
  CircleDot,
  Activity
} from 'lucide-react';

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskData {
  id: number;
  title: string;
  description: string;
  project: string;
  client: string;
  dueDate: string;
  priority: string;
  status: string;
  progress?: number;
  checklist?: ChecklistItem[];
  tags?: string[];
  assignee?: string;
  assignedTo?: string;
  createdDate?: string;
  comments?: { id: number; author: string; text: string; date: string; }[];
  attachments?: { id: number; name: string; type: string; size: string; }[];
  estimatedHours?: number;
  actualHours?: number;
  category?: string;
  dependencies?: string[];
}

interface Task {
  id?: number;
  title: string;
  description: string;
  project: string;
  client: string;
  dueDate: string;
  priority: string;
  status: string;
  progress?: number;
  checklist?: ChecklistItem[];
  tags?: string[];
  assignee?: string;
  assignedTo?: string;
  createdDate?: string;
  comments?: { id: number; author: string; text: string; date: string; }[];
  attachments?: { id: number; name: string; type: string; size: string; }[];
  estimatedHours?: number;
  actualHours?: number;
  category?: string;
  dependencies?: string[];
  subtasks?: {
    id: number;
    title: string;
    completed: boolean;
  }[];
  notes?: string;
}

export default function TaskManagementPage() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState('priority');

  // Sample tasks data
  const [tasks, setTasks] = useState<TaskData[]>([
    {
      id: 1,
      title: 'Install Kitchen Cabinets',
      description: 'Install upper and lower kitchen cabinets with proper alignment and spacing',
      project: 'Kitchen Renovation - Johnson House',
      client: 'Sarah Johnson',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2024-01-20',
      createdDate: '2024-01-15',
      estimatedHours: 8,
      actualHours: 6,
      assignedTo: 'Self',
      tags: ['installation', 'kitchen', 'cabinets'],
      checklist: [
        { id: 1, text: 'Measure cabinet spaces', completed: true },
        { id: 2, text: 'Prepare wall surfaces', completed: true },
        { id: 3, text: 'Install upper cabinets', completed: false },
        { id: 4, text: 'Install lower cabinets', completed: false },
        { id: 5, text: 'Adjust doors and drawers', completed: false }
      ],
      attachments: [
        { id: 1, name: 'cabinet_layout.pdf', type: 'pdf', size: '2.3 MB' },
        { id: 2, name: 'installation_photo.jpg', type: 'image', size: '1.8 MB' }
      ],
      comments: [
        { id: 1, author: 'Sarah Johnson', text: 'Please ensure the cabinets are level', date: '2024-01-16' }
      ]
    },
    {
      id: 2,
      title: 'Plumbing System Check',
      description: 'Inspect and test all plumbing connections after installation',
      project: 'Bathroom Remodel - Smith Residence',
      client: 'John Smith',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-18',
      createdDate: '2024-01-14',
      estimatedHours: 3,
      actualHours: 0,
      assignedTo: 'Self',
      tags: ['plumbing', 'inspection', 'testing'],
      checklist: [
        { id: 1, text: 'Check water pressure', completed: false },
        { id: 2, text: 'Test all fixtures', completed: false },
        { id: 3, text: 'Inspect for leaks', completed: false }
      ],
      attachments: [],
      comments: []
    },
    {
      id: 3,
      title: 'Electrical Panel Upgrade',
      description: 'Upgrade electrical panel to handle increased capacity',
      project: 'Electrical Work - Davis Office',
      client: 'Mike Davis',
      priority: 'high',
      status: 'completed',
      dueDate: '2024-01-16',
      createdDate: '2024-01-12',
      estimatedHours: 6,
      actualHours: 7,
      assignedTo: 'Self',
      tags: ['electrical', 'upgrade', 'panel'],
      checklist: [
        { id: 1, text: 'Turn off main power', completed: true },
        { id: 2, text: 'Remove old panel', completed: true },
        { id: 3, text: 'Install new panel', completed: true },
        { id: 4, text: 'Connect circuits', completed: true },
        { id: 5, text: 'Test all circuits', completed: true }
      ],
      attachments: [
        { id: 1, name: 'electrical_diagram.pdf', type: 'pdf', size: '1.2 MB' }
      ],
      comments: []
    },
    {
      id: 4,
      title: 'Deck Material Delivery',
      description: 'Coordinate delivery of deck materials and organize workspace',
      project: 'Deck Construction - Wilson Property',
      client: 'Emily Wilson',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-22',
      createdDate: '2024-01-17',
      estimatedHours: 2,
      actualHours: 0,
      assignedTo: 'Self',
      tags: ['delivery', 'materials', 'coordination'],
      checklist: [
        { id: 1, text: 'Confirm delivery date', completed: false },
        { id: 2, text: 'Prepare storage area', completed: false },
        { id: 3, text: 'Inspect materials', completed: false }
      ],
      attachments: [],
      comments: []
    },
    {
      id: 5,
      title: 'Flooring Installation Progress',
      description: 'Continue hardwood flooring installation in living room',
      project: 'Flooring Project - Brown Home',
      client: 'Robert Brown',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2024-01-19',
      createdDate: '2024-01-16',
      estimatedHours: 12,
      actualHours: 8,
      assignedTo: 'Self',
      tags: ['flooring', 'installation', 'hardwood'],
      checklist: [
        { id: 1, text: 'Acclimate wood flooring', completed: true },
        { id: 2, text: 'Install first row', completed: true },
        { id: 3, text: 'Continue installation', completed: false },
        { id: 4, text: 'Install trim and molding', completed: false }
      ],
      attachments: [
        { id: 1, name: 'floor_plan.jpg', type: 'image', size: '2.1 MB' }
      ],
      comments: []
    },
    {
      id: 6,
      title: 'Final Project Documentation',
      description: 'Complete project documentation and client handover',
      project: 'Electrical Work - Davis Office',
      client: 'Mike Davis',
      priority: 'low',
      status: 'pending',
      dueDate: '2024-01-25',
      createdDate: '2024-01-17',
      estimatedHours: 2,
      actualHours: 0,
      assignedTo: 'Self',
      tags: ['documentation', 'handover', 'completion'],
      checklist: [
        { id: 1, text: 'Create project report', completed: false },
        { id: 2, text: 'Take final photos', completed: false },
        { id: 3, text: 'Client approval', completed: false }
      ],
      attachments: [],
      comments: []
    }
  ]);

  const projects = Array.from(new Set(tasks.map(task => task.project)));

  const statusColumns = [
    { id: 'pending', label: 'Pending', color: 'bg-yellow-100 border-yellow-200' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-blue-100 border-blue-200' },
    { id: 'completed', label: 'Completed', color: 'bg-green-100 border-green-200' }
  ];

  const priorityColors: { [key: string]: string } = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedProject !== 'all' && task.project !== selectedProject) return false;
    if (filter !== 'all' && task.status !== filter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'created':
        const aCreated = a.createdDate ? new Date(a.createdDate).getTime() : 0;
        const bCreated = b.createdDate ? new Date(b.createdDate).getTime() : 0;
        return bCreated - aCreated;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Get task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
    
    return { total, completed, inProgress, pending, overdue };
  };

  const stats = getTaskStats();

  const toggleTaskComplete = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const getTasksByStatus = (status: string) => {
    return sortedTasks.filter(task => task.status === status);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <CircleDot className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getCompletionPercentage = (task: TaskData) => {
    if (!task.checklist || task.checklist.length === 0) return 0;
    const completed = task.checklist.filter((item: ChecklistItem) => item.completed).length;
    return Math.round((completed / task.checklist.length) * 100);
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                Task Management
              </h1>
              <p className="text-gray-600 mt-1">
                Organize and track your project tasks
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${
                    viewMode === 'kanban' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${
                    viewMode === 'calendar' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Calendar
                </button>
              </div>
              <button
                onClick={() => setShowAddTask(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-dark-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
              <CheckSquare className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="created">Sort by Created</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statusColumns.map(column => (
              <div key={column.id} className={`rounded-lg border-2 border-dashed p-4 ${column.color}`}>
                <h3 className="font-semibold text-lg mb-4 flex items-center justify-between">
                  {column.label}
                  <span className="text-sm font-normal bg-white px-2 py-1 rounded-full">
                    {getTasksByStatus(column.id).length}
                  </span>
                </h3>
                <div className="space-y-4">
                  {getTasksByStatus(column.id).map(task => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => setEditingTask(task)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-dark-900 flex-1">{task.title}</h4>
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(task.priority)}
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{task.project}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          isOverdue(task.dueDate, task.status) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {task.checklist && task.checklist.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{getCompletionPercentage(task)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getCompletionPercentage(task)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Paperclip className="h-3 w-3" />
                              <span>{task.attachments.length}</span>
                            </div>
                          )}
                          {task.comments && task.comments.length > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <MessageCircle className="h-3 w-3" />
                              <span>{task.comments.length}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {task.tags && task.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="space-y-4">
              {sortedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                      task.status === 'completed' 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {task.status === 'completed' && (
                      <CheckCircle className="h-3 w-3 text-white" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${
                        task.status === 'completed' ? 'text-gray-500 line-through' : 'text-dark-900'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Project: {task.project}</span>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>Client: {task.client}</span>
                      {task.checklist && task.checklist.length > 0 && (
                        <span>Progress: {getCompletionPercentage(task)}%</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Calendar View</p>
              <p className="text-gray-500">Coming soon - View tasks by due date</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-900">Add New Task</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const newTask = {
                id: tasks.length + 1,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                project: formData.get('project') as string,
                client: formData.get('client') as string,
                priority: formData.get('priority') as string,
                status: 'pending',
                dueDate: formData.get('dueDate') as string,
                createdDate: new Date().toISOString().split('T')[0],
                estimatedHours: Number(formData.get('estimatedHours')),
                actualHours: 0,
                assignedTo: 'Self',
                tags: ((formData.get('tags') as string) || '').split(',').map(tag => tag.trim()).filter(tag => tag),
                checklist: [],
                attachments: [],
                comments: []
              };
              setTasks(prev => [newTask, ...prev]);
              setShowAddTask(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Describe the task..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project *
                  </label>
                  <input
                    type="text"
                    name="project"
                    required
                    placeholder="Enter project name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <input
                    type="text"
                    name="client"
                    required
                    placeholder="Enter client name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    name="priority"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  min="0"
                  step="0.5"
                  placeholder="8"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="installation, kitchen, renovation (comma separated)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-900">Edit Task</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const updatedTask: TaskData = {
                ...editingTask,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                project: formData.get('project') as string,
                client: formData.get('client') as string,
                priority: formData.get('priority') as string,
                status: formData.get('status') as string,
                dueDate: formData.get('dueDate') as string,
                estimatedHours: Number(formData.get('estimatedHours')),
                actualHours: Number(formData.get('actualHours')),
                tags: ((formData.get('tags') as string) || '').split(',').map(tag => tag.trim()).filter(tag => tag),
                notes: formData.get('notes') as string
              } as TaskData;
              setTasks(prev => prev.map(task => 
                task.id === editingTask.id ? updatedTask : task
              ));
              setEditingTask(null);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingTask.title}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingTask.description}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project *
                  </label>
                  <input
                    type="text"
                    name="project"
                    required
                    defaultValue={editingTask.project}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <input
                    type="text"
                    name="client"
                    required
                    defaultValue={editingTask.client}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    name="priority"
                    required
                    defaultValue={editingTask.priority}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={editingTask.status}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={editingTask.dueDate}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    name="estimatedHours"
                    min="0"
                    step="0.5"
                    defaultValue={editingTask.estimatedHours}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Hours
                  </label>
                  <input
                    type="number"
                    name="actualHours"
                    min="0"
                    step="0.5"
                    defaultValue={editingTask.actualHours}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={editingTask.tags?.join(', ')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checklist
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {editingTask.checklist && editingTask.checklist.map((item: ChecklistItem, index: number) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={item.completed}
                        onChange={(e) => {
                          const updatedChecklist = [...(editingTask.checklist || [])];
                          updatedChecklist[index].completed = e.target.checked;
                          setEditingTask({...editingTask, checklist: updatedChecklist});
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 