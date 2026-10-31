import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  User,
  ArrowUpRight
} from 'lucide-react';
import { TaskItem, TaskStatus, PriorityLevel } from '../types/commandCenter.types';

interface TaskMonitoringTableProps {
  tasks: TaskItem[];
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus, progress: number) => void;
}

export const TaskMonitoringTable: React.FC<TaskMonitoringTableProps> = ({
  tasks,
  onUpdateTaskStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Decor & Mandap',
    'Catering',
    'Sound & Light',
    'Logistics',
    'Security',
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'All' || task.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'All' || task.category === categoryFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: TaskStatus, delayMinutes: number) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Ongoing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <PlayCircle className="w-3 h-3 text-amber-600 animate-pulse" />
            Ongoing
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-300">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Delayed (+{delayMinutes}m)
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <Clock className="w-3 h-3 text-gray-400" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="cc-card p-5 bg-white">
      {/* Table Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-[#E8D4B0]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF5ED] border border-[#E8D4B0] flex items-center justify-center text-[#9A7E50]">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2A1E26] flex items-center gap-2">
              Task Monitoring & Execution
              <span className="text-[11px] font-semibold text-[#684C65] bg-[#F2E8DF] px-2 py-0.5 rounded-full">
                {filteredTasks.length} tasks
              </span>
            </h2>
            <p className="text-xs text-[#6B5E68]">
              Track critical preparation tasks, progress bars and execution deadlines
            </p>
          </div>
        </div>

        {/* Search & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search task or coordinator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E8D4B0] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#B99A65]/40 text-[#2A1E26] w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E8D4B0]/60">
            {['All', 'Ongoing', 'Delayed', 'Pending', 'Completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs rounded-lg transition font-medium ${
                  statusFilter === st
                    ? 'bg-white text-[#2A1E26] shadow-xs font-bold border border-[#E8D4B0]'
                    : 'text-[#6B5E68] hover:text-[#2A1E26]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto text-xs border-b border-gray-100">
        <span className="text-[11px] font-semibold text-[#8E828B] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#9A7E50]" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition text-xs ${
              categoryFilter === cat
                ? 'bg-[#493044] text-white font-semibold'
                : 'bg-[#FAF5ED] text-[#684C65] hover:bg-[#F2E8DF] border border-[#E8D4B0]/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List / Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8D4B0]/40 text-[#8E828B] text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Task & Ceremony</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Assignee & Role</th>
              <th className="py-3 px-3">Schedule</th>
              <th className="py-3 px-3 min-w-[130px]">Progress</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No tasks found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-[#FCFAF7] transition group"
                >
                  {/* Task & Ceremony */}
                  <td className="py-3 px-3">
                    <p className="font-bold text-[#2A1E26] group-hover:text-[#9A7E50] transition">
                      {task.title}
                    </p>
                    <span className="text-[11px] text-[#6B5E68] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8D4B0]/50 inline-block mt-0.5">
                      {task.eventName}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-xs text-[#493044] font-medium">
                      {task.category}
                    </span>
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#FAF5ED] border border-[#E8D4B0] flex items-center justify-center text-[10px] font-bold text-[#9A7E50]">
                        {task.assignedTo.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2A1E26] leading-tight">
                          {task.assignedTo}
                        </p>
                        <p className="text-[10px] text-[#8E828B]">
                          {task.assignedRole}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="py-3 px-3 whitespace-nowrap text-[#6B5E68]">
                    <span className="font-medium text-[#2A1E26]">
                      {task.scheduledStart}
                    </span>{' '}
                    – {task.scheduledEnd}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            task.status === 'Completed'
                              ? 'bg-emerald-500'
                              : task.status === 'Delayed'
                              ? 'bg-red-500'
                              : 'bg-gradient-to-r from-[#D4BA8A] to-[#B99A65]'
                          }`}
                          style={{ width: `${task.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#2A1E26] min-w-[32px] text-right">
                        {task.progressPercent}%
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getPriorityBadge(task.priority)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getStatusBadge(task.status, task.delayMinutes)}
                  </td>

                  {/* Quick Action Button */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {task.status !== 'Completed' ? (
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newProgress = Math.min(100, task.progressPercent + 25);
                            const newStatus = newProgress === 100 ? 'Completed' : 'Ongoing';
                            onUpdateTaskStatus?.(task.id, newStatus, newProgress);
                          }}
                          className="px-2 py-1 rounded bg-[#FAF5ED] hover:bg-[#F2E8DF] border border-[#E8D4B0] text-[#9A7E50] hover:text-[#493044] text-[11px] font-semibold transition"
                          title="Advance Progress +25%"
                        >
                          +25%
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateTaskStatus?.(task.id, 'Completed', 100)}
                          className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-semibold transition"
                          title="Mark Complete"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
