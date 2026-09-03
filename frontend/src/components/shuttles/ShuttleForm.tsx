import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ShuttleDetailItem, CreateShuttlePayload, UpdateShuttlePayload } from '../../types';
import { Button } from '../common/buttons/Button';

interface ShuttleFormProps {
  isOpen: boolean;
  shuttleToEdit?: ShuttleDetailItem | null;
  onClose: () => void;
  onSubmit: (data: CreateShuttlePayload | UpdateShuttlePayload) => Promise<void>;
  isLoading?: boolean;
}

export const ShuttleForm: React.FC<ShuttleFormProps> = ({
  isOpen,
  shuttleToEdit,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const isEditing = !!shuttleToEdit;

  const [formData, setFormData] = useState<CreateShuttlePayload>({
    vehicleNumber: '',
    vehicleType: 'Sprinter Van',
    manufacturer: 'Mercedes-Benz',
    model: 'Sprinter 2500',
    capacity: 18,
    registrationNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],
    color: 'Midnight Blue',
    status: 'AVAILABLE',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    if (shuttleToEdit) {
      setFormData({
        vehicleNumber: shuttleToEdit.vehicleNumber,
        vehicleType: shuttleToEdit.vehicleType,
        manufacturer: shuttleToEdit.manufacturer,
        model: shuttleToEdit.model,
        capacity: shuttleToEdit.capacity,
        registrationNumber: shuttleToEdit.registrationNumber,
        registrationDate: shuttleToEdit.registrationDate,
        color: shuttleToEdit.color || '',
        status: shuttleToEdit.status as any,
        notes: shuttleToEdit.notes || '',
        assignedRouteId: shuttleToEdit.assignedRoute?.id,
      });
    } else {
      setFormData({
        vehicleNumber: `OFF-GO-${Math.floor(100 + Math.random() * 900)}`,
        vehicleType: 'Sprinter Van',
        manufacturer: 'Mercedes-Benz',
        model: 'Sprinter 2500',
        capacity: 18,
        registrationNumber: `CAL-SF-${Math.floor(10000 + Math.random() * 90000)}`,
        registrationDate: new Date().toISOString().split('T')[0],
        color: 'Midnight Blue',
        status: 'AVAILABLE',
        notes: '',
      });
    }
    setErrors({});
    setShowSuccessAnimation(false);
  }, [shuttleToEdit, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.vehicleNumber.trim()) errs.vehicleNumber = 'Vehicle Number is required';
    if (!formData.model.trim()) errs.model = 'Vehicle model is required';
    if (!formData.manufacturer.trim()) errs.manufacturer = 'Manufacturer is required';
    if (!formData.registrationNumber.trim()) errs.registrationNumber = 'Registration Number is required';
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be at least 1 seat';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing && shuttleToEdit) {
        await onSubmit({
          id: shuttleToEdit.id,
          ...formData,
        });
      } else {
        await onSubmit(formData);
      }

      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        onClose();
      }, 1000);
    } catch {
      // Error handled by parent toast/mutation
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {isEditing ? `Edit Shuttle ${shuttleToEdit?.vehicleNumber}` : 'Register New Shuttle Asset'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEditing
                      ? 'Update fleet specifications, seating capacity, or status.'
                      : 'Enter shuttle specifications for fleet tracking & assignment.'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {showSuccessAnimation ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-12 h-12 animate-bounce" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {isEditing ? 'Shuttle Record Updated!' : 'Shuttle Registered Successfully!'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vehicle data synced across fleet operation centers.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Vehicle Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Vehicle Number *
                      </label>
                      <input
                        type="text"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        placeholder="e.g. OFF-GO-108"
                        className={`w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.vehicleNumber
                            ? 'border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                        }`}
                      />
                      {errors.vehicleNumber && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.vehicleNumber}
                        </p>
                      )}
                    </div>

                    {/* Vehicle Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Vehicle Type
                      </label>
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Sprinter Van">Sprinter Van</option>
                        <option value="Electric Bus">Electric Bus</option>
                        <option value="Coach Bus">Coach Bus</option>
                        <option value="Minivan">Minivan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Route ID (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.assignedRouteId || ''}
                        onChange={(e) => setFormData({ ...formData, assignedRouteId: e.target.value || undefined })}
                        placeholder="UUID of an existing route"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    {/* Manufacturer */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Manufacturer *
                      </label>
                      <input
                        type="text"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="e.g. Mercedes-Benz, BYD, Ford"
                        className={`w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.manufacturer
                            ? 'border-rose-500'
                            : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                        }`}
                      />
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Model *
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="e.g. Sprinter EV 2500"
                        className={`w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.model
                            ? 'border-rose-500'
                            : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500'
                        }`}
                      />
                    </div>

                    {/* Passenger Capacity */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Seating Capacity (Seats) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    {/* Registration Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Registration License Plate *
                      </label>
                      <input
                        type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        placeholder="e.g. CAL-SF-99120"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    {/* Registration Date */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Registration Date
                      </label>
                      <input
                        type="date"
                        value={formData.registrationDate}
                        onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Operational Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="IN_SERVICE">In Service</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Vehicle Color
                      </label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="e.g. Midnight Blue, Pure White"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fleet Operational Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Special features, equipment list, or maintenance alerts..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isLoading}
                      leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                      className="text-xs font-semibold"
                    >
                      {isEditing ? 'Save Changes' : 'Register Vehicle'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
