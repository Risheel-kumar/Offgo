import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StopCard, ShuttleStop } from './StopCard';
import { EmployeeCard, EmployeeBoardingRecord } from './EmployeeCard';
import { UserX } from 'lucide-react';

interface StopAccordionProps {
  stop: ShuttleStop;
  employees: EmployeeBoardingRecord[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const StopAccordion: React.FC<StopAccordionProps> = ({
  stop,
  employees,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <div id={`stop-accordion-${stop.id}`} className="space-y-3 scroll-mt-24">
      {/* Stop Card Header */}
      <StopCard
        stop={stop}
        employeeCount={employees.length}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden pl-2 sm:pl-4 border-l-2 border-indigo-500/30 ml-3 sm:ml-5 space-y-3"
          >
            {employees.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-1">
                <UserX className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  No matching employees assigned to this stop.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 py-1">
                {employees.map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
