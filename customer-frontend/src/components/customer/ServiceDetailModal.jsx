import React, { useState } from 'react';
import { 
  Star, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  DollarSign,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PaymentButton } from './PaymentButton';

export function ServiceDetailModal() {
  const { 
    selectedService, 
    setSelectedService, 
    selectedWorker, 
    setSelectedWorker, 
    createBooking, 
    userProfile,
    userLocation
  } = useApp();
  const { t } = useLanguage();

  const [selectedTask, setSelectedTask] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Immediate (15-30 mins)');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBookingData, setCreatedBookingData] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  if (!selectedService) return null;

  const handleClose = () => {
    setSelectedService(null);
    setSelectedWorker(null);
    setIsSuccess(false);
    setSelectedTask('');
    setNotes('');
    setPaymentReceipt(null);
  };

  const handlePaymentSuccess = (receipt) => {
    setPaymentReceipt(receipt);
    const booking = createBooking(
      {
        ...selectedService,
        title: selectedTask || selectedService.title,
        price: receipt?.baseAmount || selectedService.price
      },
      selectedWorker,
      notes
    );
    
    // Attach payment info to booking preview
    setCreatedBookingData({
      ...booking,
      transactionId: receipt?.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: receipt?.paymentMethod || 'Credit/Debit Card',
      totalPaid: receipt?.totalPaid || `₹${selectedService.price + 2.50}`
    });

    setIsSuccess(true);
  };

  const timeSlots = [
    'Immediate (15-30 mins)',
    'Today (2:00 PM - 4:00 PM)',
    'Tomorrow Morning (9:00 AM)',
    'Tomorrow Evening (5:00 PM)'
  ];

  return (
    <Modal
      isOpen={!!selectedService}
      onClose={handleClose}
      title={isSuccess ? "Booking & Payment Confirmed! 🎉" : `${selectedService.title} Service`}
      subtitle={isSuccess ? "A verified pro is being dispatched to your location" : "Customize your service requirements and complete checkout"}
      maxWidth="max-w-lg"
    >
      {isSuccess ? (
        <div className="text-center py-4 space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30 animate-bounce-short">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Booking #{createdBookingData?.id}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your pro will arrive at <span className="font-semibold text-slate-700 dark:text-slate-200">{userLocation}</span>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-left space-y-2 text-xs border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-900 dark:text-white">{createdBookingData?.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTimeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Paid via {createdBookingData?.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction Ref:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{createdBookingData?.transactionId}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
              <span className="text-slate-500 font-semibold">Total Paid:</span>
              <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">{createdBookingData?.totalPaid || createdBookingData?.amount}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              variant="primary"
              className="w-full font-bold"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Service Pricing & Rating Header */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Standard Price</span>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                ₹{selectedService.price}
                <span className="text-xs font-normal text-slate-500"> {selectedService.unit || '/hr'}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedService.rating || 4.9}</span>
              <span className="text-slate-400">({selectedService.reviewCount || 200}+ reviews)</span>
            </div>
          </div>

          {/* Specific Task Select */}
          {selectedService.tasks && selectedService.tasks.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Select Common Task
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedService.tasks.map((task, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                      selectedTask === task
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {task}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Slot Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Preferred Timing
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`p-2.5 text-xs text-left rounded-xl border transition-all flex items-center justify-between ${
                    selectedTimeSlot === slot
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{slot}</span>
                  {selectedTimeSlot === slot && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Service Address
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{userProfile.address}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Additional Notes / Problem Description
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please bring a 10ft ladder or call before arriving..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Bottom Actions with Integrated Payment Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handleClose}
            >
              Cancel
            </Button>

            {/* Dedicated Reusable PaymentButton Component */}
            <PaymentButton
              amount={selectedService.price}
              serviceName={selectedTask || selectedService.title}
              onSuccess={handlePaymentSuccess}
              buttonText={`Proceed to Pay • ₹${selectedService.price}`}
              className="px-6"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
