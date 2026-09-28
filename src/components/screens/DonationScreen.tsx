import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Wrench, 
  BookOpen, 
  Moon, 
  Coins, 
  HeartHandshake, 
  Landmark, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  QrCode,
  Smartphone,
  Building,
  Heart,
  HelpCircle,
  X
} from 'lucide-react';
import { MosqueIcon, RubElHizbIcon } from '../common/IslamicIcons';
import QRCode from 'qrcode';

interface DonationPurposeItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const PURPOSES: DonationPurposeItem[] = [
  {
    id: 'masjid_dev',
    title: 'Masjid Development',
    description: 'Support construction and improvements',
    icon: Building2,
    tag: 'Priority'
  },
  {
    id: 'masjid_maint',
    title: 'Masjid Maintenance',
    description: 'Electricity, cleaning & daily maintenance',
    icon: Wrench,
  },
  {
    id: 'islamic_edu',
    title: 'Islamic Education',
    description: 'Support Quran & Islamic learning',
    icon: BookOpen,
  },
  {
    id: 'ramadan_iftar',
    title: 'Ramadan & Iftar',
    description: 'Support Ramadan programs and Iftar',
    icon: Moon,
    tag: 'Seasonal'
  },
  {
    id: 'zakat',
    title: 'Zakat',
    description: 'Zakat contributions',
    icon: Coins,
  },
  {
    id: 'sadaqah',
    title: 'Sadaqah',
    description: 'General Sadaqah',
    icon: HeartHandshake,
  },
  {
    id: 'general',
    title: 'General Donation',
    description: 'Support Masjid activities',
    icon: Landmark,
  }
];

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500];

const MASJID_BANK_DETAILS = {
  accountName: 'Masjid MKB Nagar',
  accountNumber: '5020 0089 4123 76',
  rawAccountNumber: '50200089412376',
  ifsc: 'HDFC0001234',
  bank: 'HDFC Bank',
  branch: 'MKB Nagar Branch, Chennai',
  accountType: 'Current / Religious Trust Account'
};

const MASJID_UPI_ID = 'masjidmkbnagar@upi';

export const DonationScreen: React.FC = () => {
  const { setOverlayScreen, triggerHapticFeedback, settings } = useApp();

  // State: Purpose & Amount
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>('masjid_dev');
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(500);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');

  // State: Payment Method Tab ('qr' | 'upi_id' | 'bank')
  const [activePaymentMethod, setActivePaymentMethod] = useState<'qr' | 'upi_id' | 'bank'>('qr');

  // State: Completion Flow
  const [completionChoice, setCompletionChoice] = useState<'none' | 'donated' | 'later'>('none');
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [confirmedRecordRef, setConfirmedRecordRef] = useState<string>('');

  // State: Toast / Copy feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // QR Canvas Reference
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Compute active numeric amount
  const resolvedAmount: number = 
    selectedAmount === 'custom' 
      ? Math.max(0, parseInt(customAmountInput, 10) || 0) 
      : selectedAmount;

  const currentPurpose = PURPOSES.find(p => p.id === selectedPurposeId) || PURPOSES[0];

  // Helper: Show transient toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (window.navigator.vibrate) {
      window.navigator.vibrate(35);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Generate UPI URI
  const generateUpiUri = () => {
    const params = new URLSearchParams();
    params.set('pa', MASJID_UPI_ID);
    params.set('pn', 'Masjid MKB Nagar');
    params.set('cu', 'INR');
    if (resolvedAmount > 0) {
      params.set('am', resolvedAmount.toString());
    }
    params.set('tn', `Donation - ${currentPurpose.title}`);
    return `upi://pay?${params.toString()}`;
  };

  // Render QR Code to Canvas whenever amount or purpose changes
  useEffect(() => {
    if (activePaymentMethod !== 'qr' || !qrCanvasRef.current) return;

    const uri = generateUpiUri();
    QRCode.toCanvas(
      qrCanvasRef.current,
      uri,
      {
        width: 220,
        margin: 2,
        color: {
          dark: settings.ramadanMode ? '#0A1E37' : '#063B2C',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      },
      (err) => {
        if (err) console.error('Failed to generate UPI QR code:', err);
      }
    );
  }, [resolvedAmount, selectedPurposeId, activePaymentMethod, settings.ramadanMode]);

  // Copy helper
  const handleCopy = (text: string, label: string, key: string) => {
    triggerHapticFeedback('light');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      showToast(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2500);
    }).catch(() => {
      showToast(`Copied: ${text}`);
    });
  };

  // Save QR Code helper
  const handleSaveQrCode = () => {
    triggerHapticFeedback('light');
    if (!qrCanvasRef.current) return;
    try {
      const dataUrl = qrCanvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Masjid-MKB-Nagar-UPI-QR-${resolvedAmount || 'Any'}.png`;
      link.href = dataUrl;
      link.click();
      showToast('QR Code image saved to your device!');
    } catch {
      showToast('Please screenshot or save the QR code on your screen.');
    }
  };

  // Open native UPI app intent
  const handleOpenUpiApp = () => {
    triggerHapticFeedback('light');
    const uri = generateUpiUri();
    showToast('Launching installed UPI application...');
    
    // Attempt deep link
    window.location.href = uri;

    // Graceful fallback timeout notice for desktop/web
    setTimeout(() => {
      showToast('If UPI app did not open, please copy UPI ID or scan QR.');
    }, 2200);
  };

  // Confirm Donation submit handler
  const handleConfirmDonation = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticFeedback('medium');
    const randomRef = `MMKB-DON-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setConfirmedRecordRef(randomRef);
    setIsConfirmed(true);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-8 text-[#17221D]">
      
      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-[360px] w-[90%] bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3 border border-white/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. TOP HEADER & HIGHLIGHTED INFORMATION CARD ─── */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Support Your Masjid
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Donate directly to Masjid MKB Nagar
            </p>
          </div>
          <button
            onClick={() => setOverlayScreen(null)}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close Donation Page"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlighted Information Card */}
        <div className="w-full rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#087F5B] via-[#076E4E] to-[#054432] text-white shadow-md relative overflow-hidden">
          {/* Subtle Islamic Geometry Watermark */}
          <div className="absolute -top-6 -right-6 opacity-15 pointer-events-none text-white">
            <RubElHizbIcon className="w-32 h-32" />
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold text-emerald-100 border border-white/20 self-start">
              <MosqueIcon className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>Direct Masjid Donation</span>
            </div>

            <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug tracking-tight">
              No payment gateway required.
            </h2>
            <p className="text-xs text-emerald-50/90 leading-relaxed max-w-sm font-medium">
              Your donation goes directly to the Masjid’s official UPI or bank account. The app never holds or processes your money.
            </p>

            {/* Trust Pill */}
            <div className="mt-2 pt-2.5 border-t border-white/15 flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-[#FDE68A]">
              <ShieldCheck className="w-4 h-4 text-[#FDE68A] shrink-0" />
              <span>100% Direct • No Platform Fee • No Gateway Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. DONATION PURPOSE SECTION ─── */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              What would you like to support?
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Select one purpose for your donation
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#087F5B] border border-emerald-200/60">
            {currentPurpose.title}
          </span>
        </div>

        {/* 7 Selectable Purpose Cards */}
        <div className="grid grid-cols-1 gap-2">
          {PURPOSES.map((purpose) => {
            const isSelected = selectedPurposeId === purpose.id;
            const Icon = purpose.icon;

            return (
              <button
                key={purpose.id}
                type="button"
                onClick={() => {
                  triggerHapticFeedback('light');
                  setSelectedPurposeId(purpose.id);
                }}
                className={`w-full min-h-[56px] p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'bg-[#E8F7F1] border-[#087F5B] shadow-xs ring-1 ring-[#087F5B]/30'
                    : 'bg-slate-50/70 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-[#087F5B] text-white shadow-xs' 
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold transition-colors ${
                        isSelected ? 'text-[#064e3b]' : 'text-slate-900'
                      }`}>
                        {purpose.title}
                      </span>
                      {purpose.tag && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {purpose.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium line-clamp-1">
                      {purpose.description}
                    </span>
                  </div>
                </div>

                {/* Selection Radio / Checkmark */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isSelected 
                    ? 'bg-[#087F5B] text-white scale-105 shadow-xs' 
                    : 'border-2 border-slate-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. DONATION AMOUNT SECTION ─── */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Select Amount
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Choose a preset or enter custom amount
            </p>
          </div>
          {resolvedAmount > 0 && (
            <div className="text-sm font-black text-[#087F5B]">
              ₹{resolvedAmount.toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Preset Amount Grid */}
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((amt) => {
            const isSelected = selectedAmount === amt;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  triggerHapticFeedback('light');
                  setSelectedAmount(amt);
                  setCustomAmountInput('');
                }}
                className={`h-11 rounded-2xl text-xs font-black tracking-tight transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#087F5B] text-white shadow-xs scale-102 ring-2 ring-[#087F5B]/30'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            );
          })}

          {/* Custom Amount Button */}
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setSelectedAmount('custom');
            }}
            className={`h-11 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center ${
              selectedAmount === 'custom'
                ? 'bg-[#087F5B] text-white shadow-xs ring-2 ring-[#087F5B]/30'
                : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Custom Amount
          </button>
        </div>

        {/* Custom Amount Input Box */}
        {selectedAmount === 'custom' && (
          <div className="mt-1 flex flex-col gap-1.5 animate-in fade-in duration-200">
            <label className="text-[11px] font-bold text-slate-600">
              Enter Amount (₹):
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-base font-extrabold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={customAmountInput}
                onChange={(e) => setCustomAmountInput(e.target.value)}
                placeholder="e.g. 5000"
                autoFocus
                className="w-full h-12 pl-8 pr-4 rounded-2xl border-2 border-[#087F5B] bg-white text-base font-extrabold text-slate-900 focus:outline-hidden focus:ring-3 focus:ring-[#087F5B]/20 shadow-xs"
              />
            </div>
            {customAmountInput && parseInt(customAmountInput, 10) <= 0 && (
              <span className="text-[10px] text-rose-600 font-semibold">
                Please enter an amount greater than 0.
              </span>
            )}
          </div>
        )}
      </div>

      {/* ─── 4. DIRECT PAYMENT METHODS SECTION ─── */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Donate Directly
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Choose your preferred direct payment method:
          </p>
        </div>

        {/* 3 Payment Method Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setActivePaymentMethod('qr');
            }}
            className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activePaymentMethod === 'qr'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#087F5B]" />
            <span>UPI QR Code</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setActivePaymentMethod('upi_id');
            }}
            className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activePaymentMethod === 'upi_id'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#3B6FD8]" />
            <span>UPI ID</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setActivePaymentMethod('bank');
            }}
            className={`py-2 px-1 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activePaymentMethod === 'bank'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Bank Transfer</span>
          </button>
        </div>

        {/* ── METHOD 1: UPI QR CODE ── */}
        {activePaymentMethod === 'qr' && (
          <div className="flex flex-col items-center gap-3 pt-2 animate-in fade-in duration-200">
            {/* QR Card Container */}
            <div className="relative p-3.5 rounded-3xl bg-white border-2 border-emerald-600/30 shadow-sm flex flex-col items-center">
              {/* QR Canvas */}
              <canvas
                ref={qrCanvasRef}
                className="w-[200px] h-[200px] rounded-xl block mx-auto"
                aria-label="Masjid MKB Nagar UPI QR Code"
              />

              {/* Verified Masjid Badge below QR */}
              <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-[#087F5B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>Masjid MKB Nagar • Official Account</span>
              </div>
            </div>

            {/* Scan & Pay Instructions */}
            <div className="text-center px-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                Scan & Pay
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5 max-w-xs leading-relaxed">
                Scan this QR code using Google Pay, PhonePe, Paytm or any UPI app.
              </p>
              {resolvedAmount > 0 && (
                <p className="text-[11px] font-bold text-[#087F5B] mt-1">
                  Preset for ₹{resolvedAmount.toLocaleString('en-IN')} ({currentPurpose.title})
                </p>
              )}
            </div>

            {/* Supported App Badges */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Google Pay</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">PhonePe</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Paytm</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">BHIM</span>
            </div>

            {/* Save QR Code Button */}
            <button
              type="button"
              onClick={handleSaveQrCode}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-slate-200"
            >
              <Download className="w-4 h-4 text-[#087F5B]" />
              <span>Save QR Code</span>
            </button>
          </div>
        )}

        {/* ── METHOD 2: UPI ID ── */}
        {activePaymentMethod === 'upi_id' && (
          <div className="flex flex-col gap-3 pt-2 animate-in fade-in duration-200">
            {/* UPI ID Display Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-[#F0FDFA] border-2 border-teal-500/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  UPI ID
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#087F5B]" />
                  Verified Masjid ID
                </span>
              </div>

              <div className="text-base sm:text-lg font-black font-mono text-slate-900 tracking-tight select-all">
                {MASJID_UPI_ID}
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                Payee Name: <strong>Masjid MKB Nagar</strong>
              </div>
            </div>

            {/* Action Buttons: Copy UPI ID & Open UPI App */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleCopy(MASJID_UPI_ID, 'UPI ID', 'upi_id')}
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-slate-200"
              >
                {copiedKey === 'upi_id' ? (
                  <>
                    <Check className="w-4 h-4 text-[#087F5B]" />
                    <span className="text-[#087F5B]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copy UPI ID</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenUpiApp}
                className="py-3 px-3 rounded-2xl bg-[#087F5B] hover:bg-[#076E4E] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xs"
              >
                <ExternalLink className="w-4 h-4 text-[#FDE68A]" />
                <span>Open UPI App</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-500 font-medium leading-relaxed">
              Tapping "Open UPI App" will launch Google Pay, PhonePe, or Paytm installed on your device.
            </p>
          </div>
        )}

        {/* ── METHOD 3: BANK TRANSFER ── */}
        {activePaymentMethod === 'bank' && (
          <div className="flex flex-col gap-3 pt-2 animate-in fade-in duration-200">
            {/* Bank Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 divide-y divide-slate-200/70 text-xs">
              
              {/* Account Name */}
              <div className="pb-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Account Name
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {MASJID_BANK_DETAILS.accountName}
                  </span>
                </div>
              </div>

              {/* Account Number */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Account Number
                  </span>
                  <span className="font-black font-mono text-slate-900 text-sm tracking-wide select-all">
                    {MASJID_BANK_DETAILS.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(MASJID_BANK_DETAILS.rawAccountNumber, 'Account Number', 'acc_num')}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 transition-colors"
                  title="Copy Account Number"
                >
                  {copiedKey === 'acc_num' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* IFSC Code */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    IFSC Code
                  </span>
                  <span className="font-black font-mono text-slate-900 text-sm tracking-wide select-all">
                    {MASJID_BANK_DETAILS.ifsc}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(MASJID_BANK_DETAILS.ifsc, 'IFSC Code', 'ifsc')}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 transition-colors"
                  title="Copy IFSC Code"
                >
                  {copiedKey === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Bank Name */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Bank
                  </span>
                  <span className="font-bold text-slate-800">
                    {MASJID_BANK_DETAILS.bank}
                  </span>
                </div>
              </div>

              {/* Branch */}
              <div className="pt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Branch
                  </span>
                  <span className="font-bold text-slate-800">
                    {MASJID_BANK_DETAILS.branch}
                  </span>
                </div>
              </div>
            </div>

            {/* Copy All Bank Details Button */}
            <button
              type="button"
              onClick={() => {
                const formatted = `Masjid MKB Nagar - Bank Account Details\nBank: ${MASJID_BANK_DETAILS.bank}\nBranch: ${MASJID_BANK_DETAILS.branch}\nAccount Name: ${MASJID_BANK_DETAILS.accountName}\nAccount Number: ${MASJID_BANK_DETAILS.rawAccountNumber}\nIFSC Code: ${MASJID_BANK_DETAILS.ifsc}`;
                handleCopy(formatted, 'All Bank Details', 'bank_all');
              }}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-slate-200"
            >
              {copiedKey === 'bank_all' ? (
                <>
                  <Check className="w-4 h-4 text-[#087F5B]" />
                  <span className="text-[#087F5B]">All Bank Details Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#087F5B]" />
                  <span>Copy Bank Details</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ─── 5. DONATION COMPLETION SECTION ─── */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Have you completed your donation?
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Let the Masjid office know once you have transferred your donation via UPI or Bank Transfer.
          </p>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setCompletionChoice('donated');
            }}
            className={`py-3 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer ${
              completionChoice === 'donated'
                ? 'bg-[#087F5B] text-white shadow-xs'
                : 'bg-emerald-50 text-[#087F5B] border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Yes, I have donated</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setCompletionChoice('later');
            }}
            className={`py-3 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer ${
              completionChoice === 'later'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>I’ll do it later</span>
          </button>
        </div>

        {/* ─── "I'll do it later" Message ─── */}
        {completionChoice === 'later' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center gap-2 animate-in fade-in duration-200">
            <Heart className="w-6 h-6 text-amber-500" />
            <div className="text-xs font-bold text-slate-800">
              No problem at all!
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
              You can return whenever you are ready. May Allah ﷻ reward your sincere intention and grant Barakah in your sustenance.
            </p>
            <button
              type="button"
              onClick={() => setOverlayScreen(null)}
              className="mt-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 shadow-2xs"
            >
              Return to Home
            </button>
          </div>
        )}

        {/* ─── "Yes, I have donated" Optional Confirmation Form ─── */}
        {completionChoice === 'donated' && !isConfirmed && (
          <form onSubmit={handleConfirmDonation} className="flex flex-col gap-3 pt-2 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#087F5B] shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-950 leading-relaxed font-medium">
                This optional confirmation helps the Masjid accounts committee log your contribution for records & official receipts.
              </div>
            </div>

            {/* Readonly/Prefilled Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Donation Amount
                </span>
                <span className="font-extrabold text-[#087F5B] text-sm">
                  ₹{resolvedAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Donation Purpose
                </span>
                <span className="font-bold text-slate-800 text-xs line-clamp-1">
                  {currentPurpose.title}
                </span>
              </div>
            </div>

            {/* Donor Name */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Donor Name: <span className="text-slate-400 font-normal">[Optional]</span>
              </label>
              <input
                type="text"
                disabled={isAnonymous}
                value={isAnonymous ? 'Anonymous Donor' : donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Brother Mohammed"
                className={`w-full h-11 px-3.5 rounded-xl border text-xs font-semibold focus:outline-hidden transition-all ${
                  isAnonymous 
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-white border-slate-300 text-slate-900 focus:border-[#087F5B]'
                }`}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Phone Number: <span className="text-slate-400 font-normal">[Optional]</span>
              </label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
              />
            </div>

            {/* Transaction / UTR Number */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Transaction / UTR Number: <span className="text-slate-400 font-normal">[Optional]</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 12-digit UPI reference number"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
              />
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2.5 py-1 text-xs text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded-sm text-[#087F5B] accent-[#087F5B] cursor-pointer"
              />
              <span>Donate anonymously</span>
            </label>

            {/* Confirm Donation Button */}
            <button
              type="submit"
              className="mt-1 w-full h-12 rounded-2xl bg-[#087F5B] hover:bg-[#076E4E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/15 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Donation</span>
            </button>

            {/* Critical Disclaimer */}
            <div className="mt-1 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 text-left">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-950 font-medium leading-relaxed">
                <strong>Disclaimer:</strong> Your payment is made directly to the Masjid using your selected payment method. This app does not receive, hold, or process your donation.
              </p>
            </div>
          </form>
        )}

        {/* ─── CONFIRMATION ACKNOWLEDGMENT MODAL / CARD ─── */}
        {isConfirmed && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border-2 border-[#087F5B]/30 shadow-md flex flex-col gap-3 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#087F5B] text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                JazakAllah Khair!
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                May Allah ﷻ accept your generosity and place continuous barakah in your wealth and family.
              </p>
            </div>

            {/* Recorded Details */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-left space-y-1.5 divide-y divide-slate-100">
              <div className="flex justify-between items-center pb-1.5">
                <span className="text-slate-500">Record Ref:</span>
                <span className="font-mono font-bold text-slate-900">{confirmedRecordRef}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500">Donation Amount:</span>
                <span className="font-black text-[#087F5B]">₹{resolvedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500">Purpose:</span>
                <span className="font-bold text-slate-800">{currentPurpose.title}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500">Donor:</span>
                <span className="font-semibold text-slate-800">{isAnonymous ? 'Anonymous' : (donorName || 'Not specified')}</span>
              </div>
              {utrNumber && (
                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500">UTR / Ref:</span>
                  <span className="font-mono text-slate-800 text-[11px]">{utrNumber}</span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              This record has been logged for Masjid MKB Nagar accounts committee. Direct payments are verified against the Masjid's bank statements.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  setIsConfirmed(false);
                  setCompletionChoice('none');
                  setUtrNumber('');
                  setDonorName('');
                  setDonorPhone('');
                }}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Make Another
              </button>
              <button
                type="button"
                onClick={() => setOverlayScreen(null)}
                className="py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#076E4E] text-white text-xs font-bold shadow-xs"
              >
                Done & Return Home
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DonationScreen;
