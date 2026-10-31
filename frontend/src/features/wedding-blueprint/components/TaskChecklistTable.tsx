'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  GitBranch,
  Calendar,
  Sparkles,
  ChevronDown,
  Edit3,
  Save,
} from 'lucide-react';
import { BlueprintTask } from '../types/blueprint.types';
import { blueprintApi } from '../services/blueprintService';

interface TaskManagementTableProps {
  tasks: BlueprintTask[];
  onTaskUpdated?: (updatedTask: BlueprintTask) => void;
}

export default function TaskManagementTable({ tasks: initialTasks, onTaskUpdated }: TaskManagementTableProps) {
  const [tasks, setTasks] = useState<BlueprintTask[]>(initialTasks);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');

  const phases = Array.from(new Set(tasks.map((t) => t.phase)));

  const handleStatusToggle = async (task: BlueprintTask) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await blueprintApi.updateTask(task.id, {
        status: nextStatus,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      if (onTaskUpdated) onTaskUpdated(updated);
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const startEdit = (task: BlueprintTask) => {
    setEditingTaskId(task.id);
    setEditNotes(task.notes || '');
  };

  const saveEdit = async (task: BlueprintTask) => {
    try {
      const updated = await blueprintApi.updateTask(task.id, {
        notes: editNotes,
        is_manually_edited: true,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      setEditingTaskId(null);
      if (onTaskUpdated) onTaskUpdated(updated);
    } catch (err) {
      console.error('Failed to save task notes', err);
    }
  };

  const filtered = tasks.filter((t) => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterPhase !== 'all' && t.phase !== filterPhase) return false;
    return true;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical':
        return 'bg-red-950/40 text-red-200 border-red-500/30';
      case 'high':
        return 'bg-amber-950/40 text-[#D4BA8A] border-[#B99A65]/40';
      case 'medium':
        return 'bg-slate-800/40 text-slate-300 border-slate-700';
      default:
        return 'bg-gray-800/30 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="card p-6 border border-[rgba(185,154,101,0.25)] shadow-xl bg-white overflow-hidden">
      {/* Table Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[rgba(185,154,101,0.18)]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-bold text-[#2A1E26]">
              Intelligent Task Checklist & Schedule
            </h3>
            <span className="badge-gold">{filtered.length} Tasks</span>
          </div>
          <p className="text-xs text-[#8A7380] mt-0.5">
            Organized via Kahn's DAG Topological Sorting & Scheduled via Greedy Priority-based Backpropagation.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[rgba(185,154,101,0.3)] bg-[#FAF5F0] text-xs font-semibold text-[#493044] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical (P0)</option>
            <option value="high">High (P1)</option>
            <option value="medium">Medium (P2)</option>
          </select>

          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[rgba(185,154,101,0.3)] bg-[#FAF5F0] text-xs font-semibold text-[#493044] focus:outline-none"
          >
            <option value="all">All Phases</option>
            {phases.map((ph) => (
              <option key={ph} value={ph}>
                {ph}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[rgba(185,154,101,0.15)] text-[#8A7380] uppercase tracking-wider font-semibold">
              <th className="py-3 px-3 w-10">Status</th>
              <th className="py-3 px-4">Task & DAG Pre-requisites</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Deadline</th>
              <th className="py-3 px-3">Coordinator</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(185,154,101,0.08)]">
            {filtered.map((task) => {
              const isCompleted = task.status === 'completed';
              const isEditing = editingTaskId === task.id;

              return (
                <tr
                  key={task.id}
                  className={`hover:bg-[#FAF5F0]/60 transition-colors ${
                    isCompleted ? 'bg-emerald-50/20 opacity-75' : ''
                  }`}
                >
                  {/* Status checkbox */}
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => handleStatusToggle(task)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                        isCompleted
                          ? 'bg-[#B99A65] border-[#B99A65] text-white'
                          : 'border-[rgba(185,154,101,0.4)] hover:border-[#B99A65]'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Task details */}
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-sm ${
                          isCompleted ? 'line-through text-[#8A7380]' : 'text-[#2A1E26]'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.is_critical_path && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-red-100 text-red-700">
                          Critical Path
                        </span>
                      )}
                      {task.is_manually_edited && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-100 text-amber-800">
                          Preserved Edit
                        </span>
                      )}
                    </div>

                    {/* Dependencies indicator */}
                    {task.depends_on && task.depends_on.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[#8A7380] mt-1">
                        <GitBranch className="w-3 h-3 text-[#B99A65]" />
                        <span>Prerequisite: {task.depends_on.join(', ')}</span>
                      </div>
                    )}

                    {/* Inline edit or display notes */}
                    {isEditing ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add planner notes..."
                          className="px-2 py-1 text-xs border border-[rgba(185,154,101,0.3)] rounded bg-white w-full"
                        />
                        <button
                          onClick={() => saveEdit(task)}
                          className="px-2 py-1 bg-[#493044] text-white rounded text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                      </div>
                    ) : task.notes ? (
                      <div className="text-[11px] text-[#493044] bg-[#FAF5F0] px-2 py-1 rounded mt-1 italic">
                        "{task.notes}"
                      </div>
                    ) : null}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Deadline */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[#493044] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#B99A65]" />
                      <span>{task.deadline || 'Pending'}</span>
                    </div>
                  </td>

                  {/* Coordinator */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[#8A7380]">
                      <User className="w-3.5 h-3.5 text-[#B99A65]" />
                      <span className="truncate max-w-[140px]">{task.coordinator_role}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => (isEditing ? setEditingTaskId(null) : startEdit(task))}
                      className="p-1.5 rounded-lg hover:bg-[#FAF5F0] text-[#8A7380] hover:text-[#493044] cursor-pointer"
                      title="Edit task & add notes"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
