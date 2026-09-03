import React from 'react';
import { Employee } from '../../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '../common/buttons/Button';

interface DeleteEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (employee: Employee) => Promise<void>;
  isLoading?: boolean;
}

export const DeleteEmployeeDialog: React.FC<DeleteEmployeeDialogProps> = ({
  employee,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen || !employee) return null;

  const handleConfirm = async () => {
    await onConfirm(employee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Delete Employee Record?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to remove{' '}
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {employee.name} ({employee.employeeId})
              </span>{' '}
              from the active directory? This will cancel active shuttle bookings.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs font-medium"
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            isLoading={isLoading}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="text-xs font-semibold"
          >
            Delete Employee
          </Button>
        </div>
      </div>
    </div>
  );
};
