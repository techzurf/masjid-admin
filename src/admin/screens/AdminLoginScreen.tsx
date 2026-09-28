import React, { useState } from 'react';
import { MosqueIcon, RubElHizbIcon } from '../../components/common/IslamicIcons';
import { Lock, Mail, ArrowRight, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  onPreviewUserApp: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLoginSuccess,
  onPreviewUserApp
}) => {
  const [identifier, setIdentifier] = useState('admin@madinamasjid.org');
  const [password, setPassword] = useState('••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleForgotPassword = () => {
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="admin-portal-root min-h-screen w-full bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFB] to-[#EEF5F2] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Decorative Islamic Watermark */}
      <div className="absolute -top-12 -right-12 w-64 h-64 text-emerald-900/5 pointer-events-none">
        <RubElHizbIcon className="w-full h-full" />
      </div>

      {/* Top Bar Switcher to User App */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-[#087F5B]" />
          <span>Admin Portal</span>
        </div>
        <button
          type="button"
          onClick={onPreviewUserApp}
          className="text-xs font-bold text-slate-600 hover:text-emerald-800 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all"
        >
          <span>User App</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6 z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50 flex flex-col gap-5">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#087F5B] to-[#043d2d] text-white flex items-center justify-center shadow-md relative">
              <MosqueIcon className="w-9 h-9 text-[#FDE68A]" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                <Lock className="w-2.5 h-2.5 text-slate-900" />
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Masjid Admin
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Manage your Masjid App
              </p>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 flex items-center gap-2 text-xs text-emerald-950 font-medium">
            <Sparkles className="w-4 h-4 text-[#087F5B] shrink-0" />
            <span>Demonstration Mode: Tap <strong>Sign In</strong> below to enter the dashboard.</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Email / Mobile Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email / Mobile Number
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@madinamasjid.org"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/15 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/15 transition-all"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-[#087F5B] accent-[#087F5B]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-bold text-[#087F5B] hover:text-[#065e43] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {forgotSent && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                Password reset instructions sent to registered administrator contact.
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="mt-2 w-full h-12 rounded-2xl bg-gradient-to-r from-[#087F5B] to-[#06543F] hover:from-[#06543F] hover:to-[#043d2d] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Footer info */}
      <div className="w-full max-w-md mx-auto text-center z-10 pb-2">
        <p className="text-[11px] text-slate-400 font-medium">
          Masjid Admin Management Platform • Madina Masjid MKB Nagar
        </p>
      </div>

    </div>
  );
};
