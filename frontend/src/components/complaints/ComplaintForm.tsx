import React, { useState } from 'react';
import { ComplaintCategory, ComplaintPriority, CreateComplaintInput } from '../../types';
import { Button } from '../common/buttons/Button';
import { Input } from '../common/inputs/Input';
import { AlertCircle, Paperclip, Send, X, FileText } from 'lucide-react';

interface ComplaintFormProps {
  onSubmit: (input: CreateComplaintInput) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const CATEGORIES: ComplaintCategory[] = [
  'Vehicle Issue',
  'Driver Behaviour',
  'Employee Behaviour',
  'Route Issue',
  'Delay',
  'Maintenance',
  'Safety',
  'Suggestion',
  'Other',
];

const PRIORITIES: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Vehicle Issue');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    onSubmit({
      subject,
      category,
      priority,
      description,
      attachmentName,
    });
  };

  const handleSimulateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Subject */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Subject / Brief Title *
        </label>
        <Input
          placeholder="e.g., Shuttle KA-01-EQ-9812 late pickup or AC fault"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      {/* Category & Priority Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Priority *
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Detailed Description *
        </label>
        <textarea
          rows={4}
          placeholder="Describe what happened, including shuttle number, route, time, and specific observations..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Attachment Placeholder */}
      <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-slate-400" />
          {attachmentName ? (
            <span className="text-xs font-bold text-indigo-500 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> {attachmentName}
            </span>
          ) : (
            <span className="text-xs text-slate-500">Attach photo or document (Optional)</span>
          )}
        </div>

        <label className="cursor-pointer px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors">
          Browse File
          <input type="file" className="hidden" onChange={handleSimulateFileSelect} />
        </label>
      </div>

      {/* Submit Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          leftIcon={<Send className="w-4 h-4" />}
        >
          Submit Complaint
        </Button>
      </div>
    </form>
  );
};
