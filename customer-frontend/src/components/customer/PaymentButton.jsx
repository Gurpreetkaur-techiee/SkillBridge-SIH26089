import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Smartphone,
  X,
  Zap,
  AlertCircle,
  IndianRupee
} from 'lucide-react';

import { Button } from '../ui/Button';

export function PaymentButton({
  amount = 35,
  serviceName = 'SkillBridge Service',
  onSuccess,
  className = '',
  disabled = false,
  buttonText = null,
  size = 'lg'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('321');
  const [cardName, setCardName] = useState('Alex Morgan');
  const [upiId, setUpiId] = useState('alex@okaxis');

  const [paymentError, setPaymentError] = useState('');

  // --------------------------------------------------
  // STANDARD CURRENCY
  // --------------------------------------------------
  const currency = 'INR';
  const currencySymbol = '₹';

  // --------------------------------------------------
  // NORMALIZE SERVICE AMOUNT
  // --------------------------------------------------
  const numericAmount =
    typeof amount === 'string'
      ? parseFloat(amount.replace(/[^0-9.]/g, '')) || 35
      : Number(amount) || 35;

  // --------------------------------------------------
  // PLATFORM FEE
  // --------------------------------------------------
  const platformFee = 2.5;

  const totalAmount = numericAmount + platformFee;

  const formattedServiceAmount = numericAmount.toFixed(2);
  const formattedPlatformFee = platformFee.toFixed(2);
  const formattedTotalAmount = totalAmount.toFixed(2);

  // --------------------------------------------------
  // OPEN PAYMENT MODAL
  // --------------------------------------------------
  const handleOpenPayment = (e) => {
    if (e) {
      e.stopPropagation();
    }

    setPaymentError('');
    setIsModalOpen(true);
  };

  // --------------------------------------------------
  // PROCESS PAYMENT
  // --------------------------------------------------
  const handleProcessPayment = () => {
    setPaymentError('');

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        setPaymentError(
          'Please fill in complete card billing details.'
        );
        return;
      }
    }

    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setPaymentError(
          'Please enter a valid UPI / VPA ID.'
        );
        return;
      }
    }

    setIsProcessing(true);

    // Demo payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsModalOpen(false);

      // --------------------------------------------------
      // PAYMENT RECEIPT
      // --------------------------------------------------
      const paymentReceipt = {
        transactionId: `TXN-${Math.floor(
          100000 + Math.random() * 900000
        )}`,

        serviceName,

        currency,

        currencySymbol,

        baseAmount: numericAmount,

        platformFee,

        totalAmount,

        totalPaid: totalAmount,

        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit/Debit Card'
            : paymentMethod === 'upi'
            ? 'UPI'
            : paymentMethod === 'wallet'
            ? 'Google/Apple Pay'
            : 'Cash on Completion',

        status: 'PAID',

        paidAt: new Date().toISOString()
      };

      console.log(
        'Payment completed:',
        paymentReceipt
      );

      if (onSuccess) {
        onSuccess(paymentReceipt);
      }
    }, 1200);
  };

  return (
    <>
      {/* --------------------------------------------------
          PAYMENT BUTTON
      -------------------------------------------------- */}
      <Button
        variant="primary"
        size={size}
        disabled={disabled}
        onClick={handleOpenPayment}
        className={`font-bold shadow-lg shadow-blue-500/25 ${className}`}
        icon={CreditCard}
      >
        {buttonText ||
          `Pay Now • ${currencySymbol}${formattedServiceAmount}`}
      </Button>

      {/* --------------------------------------------------
          PAYMENT MODAL
      -------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">

          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() =>
              !isProcessing && setIsModalOpen(false)
            }
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-scale-up">

            {/* --------------------------------------------------
                HEADER
            -------------------------------------------------- */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Lock className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Secure Checkout
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    256-bit Encrypted Escrow Payment
                  </p>
                </div>

              </div>

              <button
                disabled={isProcessing}
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* --------------------------------------------------
                MODAL BODY
            -------------------------------------------------- */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

              {/* Order Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">

                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {serviceName}
                  </span>

                  <span>
                    {currencySymbol}
                    {formattedServiceAmount}
                  </span>

                </div>

                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">

                  <span>
                    Platform Fee & Trust Guarantee
                  </span>

                  <span>
                    {currencySymbol}
                    {formattedPlatformFee}
                  </span>

                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white">

                  <span>
                    Total Amount Due
                  </span>

                  <span className="text-base text-blue-600 dark:text-blue-400">
                    {currencySymbol}
                    {formattedTotalAmount}
                  </span>

                </div>

              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 animate-shake">

                  <AlertCircle className="w-4 h-4 shrink-0" />

                  <span>
                    {paymentError}
                  </span>

                </div>
              )}

              {/* --------------------------------------------------
                  PAYMENT METHODS
              -------------------------------------------------- */}
              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Select Payment Method
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                  {/* Card */}
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('card')
                    }
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Card</span>
                  </button>

                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('upi')
                    }
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>UPI / QR</span>
                  </button>

                  {/* Digital Wallet */}
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('wallet')
                    }
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'wallet'
                        ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-500" />
                    <span>Digital Pay</span>
                  </button>

                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('cash')
                    }
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <IndianRupee className="w-5 h-5 text-purple-500" />
                    <span>Post Pay</span>
                  </button>

                </div>

              </div>

              {/* --------------------------------------------------
                  CARD FORM
              -------------------------------------------------- */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">

                  <div>

                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Card Number
                    </label>

                    <div className="relative">

                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(e.target.value)
                        }
                        placeholder="4532 0000 0000 0000"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div>

                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Expiry Date
                      </label>

                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) =>
                          setCardExpiry(e.target.value)
                        }
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />

                    </div>

                    <div>

                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        CVV / CVC
                      </label>

                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) =>
                          setCardCvc(e.target.value)
                        }
                        placeholder="•••"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Cardholder Name
                    </label>

                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) =>
                        setCardName(e.target.value)
                      }
                      placeholder="Alex Morgan"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />

                  </div>

                </div>
              )}

              {/* --------------------------------------------------
                  UPI FORM
              -------------------------------------------------- */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">

                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Enter UPI ID / VPA
                  </label>

                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) =>
                      setUpiId(e.target.value)
                    }
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />

                  <p className="text-[11px] text-slate-400">
                    A payment prompt will be sent to your UPI App (GPay, PhonePe, Paytm).
                  </p>

                </div>
              )}

              {/* --------------------------------------------------
                  WALLET
              -------------------------------------------------- */}
              {paymentMethod === 'wallet' && (
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 text-center space-y-2">

                  <Smartphone className="w-8 h-8 text-emerald-500 mx-auto" />

                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    One-Touch Apple Pay & Google Pay
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Instant biometric authentication will be triggered upon clicking confirm.
                  </p>

                </div>
              )}

              {/* --------------------------------------------------
                  CASH
              -------------------------------------------------- */}
              {paymentMethod === 'cash' && (
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5 text-xs text-amber-900 dark:text-amber-300">

                  <p className="font-bold flex items-center gap-1.5">

                    <IndianRupee className="w-4 h-4 text-amber-600" />

                    Pay After Service Completion

                  </p>

                  <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                    You can pay the technician directly via Cash or Instant QR once the service is verified and finished to your satisfaction.
                  </p>

                </div>
              )}

              {/* --------------------------------------------------
                  ESCROW GUARANTEE
              -------------------------------------------------- */}
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5">

                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">

                  <strong className="text-blue-700 dark:text-blue-300">
                    SkillBridge Escrow Protection:
                  </strong>{' '}
                  Funds are safely held in escrow and will only be released to the worker when you confirm job completion.

                </p>

              </div>

            </div>

            {/* --------------------------------------------------
                FOOTER
            -------------------------------------------------- */}
            <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">

              <Button
                type="button"
                variant="ghost"
                size="md"
                disabled={isProcessing}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="primary"
                size="lg"
                loading={isProcessing}
                onClick={handleProcessPayment}
                className="px-6 font-bold flex-1 sm:flex-initial"
              >
                {paymentMethod === 'cash'
                  ? 'Confirm Booking'
                  : `Authorize & Pay ${currencySymbol}${formattedTotalAmount}`}
              </Button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}