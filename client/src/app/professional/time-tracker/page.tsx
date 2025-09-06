'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Timer,
  Play,
  Pause,
  Square,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  Download,
  TrendingUp,
  FileText,
  Search,
  X
} from 'lucide-react';

export default function TimeTrackerPage() {
  const [activeTimer, setActiveTimer] = useState<{
    id: number;
    name: string;
    client: string;
    task: string;
    hourlyRate: number;
    startTime: Date;
    notes: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<typeof timeEntries[0] | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample time entries
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      project: 'Kitchen Renovation - Johnson House',
      client: 'Sarah Johnson',
      task: 'Site Preparation',
      startTime: '2024-01-15T09:00:00',
      endTime: '2024-01-15T12:30:00',
      duration: 210, // minutes
      hourlyRate: 85,
      billable: true,
      invoiced: false,
      notes: 'Prepared kitchen area for cabinet installation. Removed old fixtures and cleaned surfaces.',
      tags: ['preparation', 'kitchen', 'renovation'],
      status: 'completed'
    },
    {
      id: 2,
      project: 'Bathroom Remodel - Smith Residence',
      client: 'John Smith',
      task: 'Plumbing Installation',
      startTime: '2024-01-15T14:00:00',
      endTime: '2024-01-15T17:45:00',
      duration: 225, // minutes
      hourlyRate: 95,
      billable: true,
      invoiced: false,
      notes: 'Installed new plumbing fixtures including shower, toilet, and sink. Tested all connections.',
      tags: ['plumbing', 'installation', 'bathroom'],
      status: 'completed'
    },
    {
      id: 3,
      project: 'Deck Construction - Wilson Property',
      client: 'Emily Wilson',
      task: 'Material Preparation',
      startTime: '2024-01-16T08:30:00',
      endTime: '2024-01-16T11:15:00',
      duration: 165, // minutes
      hourlyRate: 85,
      billable: true,
      invoiced: true,
      notes: 'Prepared lumber and materials for deck construction. Organized tools and workspace.',
      tags: ['preparation', 'deck', 'construction'],
      status: 'completed'
    },
    {
      id: 4,
      project: 'Electrical Work - Davis Office',
      client: 'Mike Davis',
      task: 'Circuit Installation',
      startTime: '2024-01-16T13:00:00',
      endTime: '2024-01-16T16:30:00',
      duration: 210, // minutes
      hourlyRate: 95,
      billable: true,
      invoiced: false,
      notes: 'Installed new electrical circuits for office renovation. Updated panel and tested all connections.',
      tags: ['electrical', 'installation', 'office'],
      status: 'completed'
    },
    {
      id: 5,
      project: 'Flooring Project - Brown Home',
      client: 'Robert Brown',
      task: 'Floor Installation',
      startTime: '2024-01-17T09:00:00',
      endTime: null,
      duration: 120, // minutes so far
      hourlyRate: 80,
      billable: true,
      invoiced: false,
      notes: 'Installing hardwood flooring in living room area.',
      tags: ['flooring', 'installation', 'hardwood'],
      status: 'in_progress'
    }
  ]);

  const [activeProject, setActiveProject] = useState({
    id: 5,
    name: 'Flooring Project - Brown Home',
    client: 'Robert Brown',
    task: 'Floor Installation',
    hourlyRate: 80,
    startTime: new Date('2024-01-17T09:00:00'),
    notes: ''
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && activeTimer) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTimer]);

  // Calculate stats
  const getStats = () => {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const weekEntries = timeEntries.filter(entry => new Date(entry.startTime) >= weekStart);
    const monthEntries = timeEntries.filter(entry => new Date(entry.startTime) >= monthStart);
    
    const totalWeekHours = weekEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
    const totalMonthHours = monthEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
    
    const billableWeekHours = weekEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.duration, 0) / 60;
    const billableMonthHours = monthEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.duration, 0) / 60;
    
    const weekEarnings = weekEntries.filter(e => e.billable).reduce((sum, entry) => sum + (entry.duration / 60) * entry.hourlyRate, 0);
    const monthEarnings = monthEntries.filter(e => e.billable).reduce((sum, entry) => sum + (entry.duration / 60) * entry.hourlyRate, 0);
    
    const uninvoicedAmount = timeEntries.filter(e => e.billable && !e.invoiced).reduce((sum, entry) => sum + (entry.duration / 60) * entry.hourlyRate, 0);
    
    return {
      totalWeekHours: Math.round(totalWeekHours * 10) / 10,
      totalMonthHours: Math.round(totalMonthHours * 10) / 10,
      billableWeekHours: Math.round(billableWeekHours * 10) / 10,
      billableMonthHours: Math.round(billableMonthHours * 10) / 10,
      weekEarnings: Math.round(weekEarnings),
      monthEarnings: Math.round(monthEarnings),
      uninvoicedAmount: Math.round(uninvoicedAmount),
      averageHourlyRate: Math.round(timeEntries.reduce((sum, entry) => sum + entry.hourlyRate, 0) / timeEntries.length)
    };
  };

  const stats = getStats();

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setActiveTimer(activeProject);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    if (activeTimer && currentTime > 0) {
      // Save the time entry
      const newEntry = {
        id: timeEntries.length + 1,
        project: activeTimer.name,
        client: activeTimer.client,
        task: activeTimer.task,
        startTime: activeTimer.startTime.toISOString(),
        endTime: new Date().toISOString(),
        duration: Math.floor(currentTime / 60),
        hourlyRate: activeTimer.hourlyRate,
        billable: true,
        invoiced: false,
        notes: activeTimer.notes,
        tags: [],
        status: 'completed'
      };
      
      setTimeEntries(prev => [newEntry, ...prev]);
    }
    
    setIsRunning(false);
    setActiveTimer(null);
    setCurrentTime(0);
  };

  const filteredEntries = timeEntries.filter(entry => {
    if (filter === 'billable' && !entry.billable) return false;
    if (filter === 'non_billable' && entry.billable) return false;
    if (filter === 'invoiced' && !entry.invoiced) return false;
    if (filter === 'uninvoiced' && entry.invoiced) return false;
    if (searchQuery && !entry.project.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !entry.client.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.task.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                Time Tracker
              </h1>
              <p className="text-gray-600 mt-1">
                Track your time and manage productivity
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={() => setShowAddEntry(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Manual Entry</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-dark-900">{stats.totalWeekHours}</p>
                <p className="text-sm text-gray-600">Hours</p>
              </div>
            </div>
            <p className="text-gray-700 font-medium">Total This Week</p>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-dark-900">${stats.weekEarnings}</p>
                <p className="text-sm text-gray-600">Earned</p>
              </div>
            </div>
            <p className="text-gray-700 font-medium">This Week</p>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-dark-900">${stats.uninvoicedAmount}</p>
                <p className="text-sm text-gray-600">Uninvoiced</p>
              </div>
            </div>
            <p className="text-gray-700 font-medium">Pending Invoice</p>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-dark-900">${stats.averageHourlyRate}</p>
                <p className="text-sm text-gray-600">Avg Rate</p>
              </div>
            </div>
            <p className="text-gray-700 font-medium">Per Hour</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 mb-6">
              <h2 className="font-heading font-semibold text-xl text-dark-900 mb-6">
                Current Timer
              </h2>
              
              {/* Timer Display */}
              <div className="text-center mb-6">
                <div className="text-6xl font-mono font-bold text-dark-900 mb-2">
                  {formatTime(currentTime)}
                </div>
                {activeTimer && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{activeTimer.name}</p>
                    <p>{activeTimer.client}</p>
                    <p>{activeTimer.task}</p>
                  </div>
                )}
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center space-x-3 mb-6">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Play className="h-6 w-6" />
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="bg-yellow-500 text-white p-4 rounded-full hover:bg-yellow-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Pause className="h-6 w-6" />
                  </button>
                )}
                <button
                  onClick={stopTimer}
                  className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Square className="h-6 w-6" />
                </button>
              </div>

              {/* Project Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <select
                    value={activeProject.name}
                    onChange={(e) => {
                      const project = timeEntries.find(entry => entry.project === e.target.value);
                      if (project) {
                        setActiveProject({
                          id: project.id,
                          name: project.project,
                          client: project.client,
                          task: project.task,
                          hourlyRate: project.hourlyRate,
                          startTime: new Date(),
                          notes: ''
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {Array.from(new Set(timeEntries.map(entry => entry.project))).map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task
                  </label>
                  <input
                    type="text"
                    value={activeProject.task}
                    onChange={(e) => setActiveProject(prev => ({ ...prev, task: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="What are you working on?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    value={activeProject.hourlyRate}
                    onChange={(e) => setActiveProject(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="$85"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-lg text-dark-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <span className="text-primary-700 font-medium">Generate Invoice</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Download className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Export Timesheet</span>
                </button>
                <Link
                  href="/professional/calendar"
                  className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">View Calendar</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Time Entries */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-dark-900">
                  Time Entries
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Entries</option>
                    <option value="billable">Billable</option>
                    <option value="non_billable">Non-Billable</option>
                    <option value="invoiced">Invoiced</option>
                    <option value="uninvoiced">Uninvoiced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredEntries.map(entry => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-dark-900">{entry.project}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                          {entry.billable && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              Billable
                            </span>
                          )}
                          {entry.invoiced && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              Invoiced
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">
                          Client: {entry.client}
                        </p>
                        <p className="text-gray-600 mb-2">
                          Task: {entry.task}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(entry.startTime).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {entry.endTime && (
                              <span>- {new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Timer className="h-4 w-4" />
                            <span>{formatDuration(entry.duration)}</span>
                          </div>
                        </div>
                        {entry.notes && (
                          <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded-lg">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-dark-900">
                            ${Math.round((entry.duration / 60) * entry.hourlyRate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${entry.hourlyRate}/hr
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredEntries.length === 0 && (
                <div className="text-center py-12">
                  <Timer className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No time entries found</p>
                  <p className="text-gray-500">Start tracking your time or add manual entries</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Manual Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-900">Add Manual Entry</h3>
              <button
                onClick={() => setShowAddEntry(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
                         <form onSubmit={(e) => {
               e.preventDefault();
               const formData = new FormData(e.target as HTMLFormElement);
               const newEntry = {
                 id: timeEntries.length + 1,
                 project: formData.get('project') as string,
                 client: formData.get('client') as string,
                 task: formData.get('task') as string,
                 startTime: `${formData.get('date')}T${formData.get('startTime')}:00`,
                 endTime: `${formData.get('date')}T${formData.get('endTime')}:00`,
                 duration: Math.floor((new Date(`${formData.get('date')}T${formData.get('endTime')}:00`).getTime() - new Date(`${formData.get('date')}T${formData.get('startTime')}:00`).getTime()) / 60000),
                 hourlyRate: Number(formData.get('hourlyRate')),
                 billable: formData.get('billable') === 'on',
                 invoiced: false,
                 notes: (formData.get('notes') as string) || '',
                 tags: [],
                 status: 'completed'
               };
               setTimeEntries(prev => [newEntry, ...prev]);
               setShowAddEntry(false);
             }} className="space-y-4">
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task *
                </label>
                <input
                  type="text"
                  name="task"
                  required
                  placeholder="What did you work on?"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  required
                  min="0"
                  step="0.01"
                  placeholder="85.00"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Add any notes about this work session..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="billable"
                  id="billable"
                  defaultChecked
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="billable" className="ml-2 text-sm text-gray-700">
                  This is billable work
                </label>
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  Add Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEntry(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-900">Edit Entry</h3>
              <button
                onClick={() => setEditingEntry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const updatedEntry = {
                ...editingEntry,
                project: formData.get('project') as string,
                client: formData.get('client') as string,
                task: formData.get('task') as string,
                startTime: `${formData.get('date')}T${formData.get('startTime')}:00`,
                endTime: `${formData.get('date')}T${formData.get('endTime')}:00`,
                duration: Math.floor((new Date(`${formData.get('date')}T${formData.get('endTime')}:00`).getTime() - new Date(`${formData.get('date')}T${formData.get('startTime')}:00`).getTime()) / 60000),
                hourlyRate: Number(formData.get('hourlyRate')),
                billable: formData.get('billable') === 'on',
                notes: (formData.get('notes') as string) || ''
              };
              setTimeEntries(prev => prev.map(entry => 
                entry.id === editingEntry.id ? updatedEntry : entry
              ));
              setEditingEntry(null);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <input
                  type="text"
                  name="project"
                  required
                  defaultValue={editingEntry.project}
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
                  defaultValue={editingEntry.client}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task *
                </label>
                <input
                  type="text"
                  name="task"
                  required
                  defaultValue={editingEntry.task}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={editingEntry.startTime.split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    defaultValue={editingEntry.startTime.split('T')[1]?.split(':').slice(0, 2).join(':')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    defaultValue={editingEntry.endTime?.split('T')[1]?.split(':').slice(0, 2).join(':')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={editingEntry.hourlyRate}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingEntry.notes}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="billable"
                  id="editBillable"
                  defaultChecked={editingEntry.billable}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="editBillable" className="ml-2 text-sm text-gray-700">
                  This is billable work
                </label>
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  Update Entry
                </button>
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
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