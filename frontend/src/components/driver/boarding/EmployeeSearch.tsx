import React from 'react';
import { Input } from '../../common/inputs/Input';
import { Search, X } from 'lucide-react';

interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <Input
        placeholder="Search employee name, ID (e.g. EMP-1001), or department..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        leftIcon={<Search className="w-4 h-4 text-slate-400" />}
        rightIcon={
          value ? (
            <button
              onClick={() => onChange('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
      />
    </div>
  );
};
