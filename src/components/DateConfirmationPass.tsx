import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Heart, Share2, Copy, Check, ExternalLink, RotateCcw, Sparkles } from 'lucide-react';
import { DatePlanData } from './DatePlanner';
import { formatFriendlyDate, formatFriendlyTime, createGoogleCalendarUrl } from '../utils/dateHelpers';
import { sounds } from '../utils/audio';

interface DateConfirmationPassProps {
  plan: DatePlanData;
  onPlanAnother: () => void;
  onOpenCustomize: () => void;
}

export const DateConfirmationPass: React.FC<DateConfirmationPassProps> = ({
  plan,
  onPlanAnother,
  onOpenCustomize,
}) => {
  const [copied, setCopied] = useState(false);

  const googleCalUrl = createGoogleCalendarUrl({
    title: `Date with ${plan.recipientName || 'You'} & ${plan.senderName || 'Me'} 💕`,
    date: plan.date,
    time: plan.time,
    activity: plan.activity,
    sender: plan.senderName,
    recipient: plan.recipientName,
    notes: plan.notes,
  });

  const handleCopySummary = async () => {
    sounds.playPop();
    const formatted = `💌 IT'S A DATE! 💖\n\n` +
      `📅 Date: ${formatFriendlyDate(plan.date)}\n` +
      `⏰ Time: ${formatFriendlyTime(plan.time)}\n` +
      `✨ Activity: ${plan.activity}\n` +
      (plan.notes ? `📝 Note: ${plan.notes}\n` : '') +
      `\nCan't wait to see you! 💕`;

    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl"
      >
        {/* Success Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Date Reservation Confirmed</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            It’s Officially a Date! 🥂
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            No takebacks, no cancellations! Here is your official pass.
          </p>
        </div>

        {/* The Romantic VIP Ticket / Pass */}
        <div className="relative bg-white border border-rose-200/80 rounded-3xl shadow-2xl shadow-rose-200/50 overflow-hidden">
          {/* Ticket Header Banner */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-rose-100 font-semibold block">
                  VIP Rendezvous Pass
                </span>
                <span className="font-serif text-lg font-bold">A Date To Remember</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono tracking-widest text-rose-100 bg-white/15 px-2 py-0.5 rounded">
                #LOVE-2026
              </span>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Attendees Row */}
            <div className="grid grid-cols-2 gap-4 pb-5 border-b border-dashed border-rose-200">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Prepared For
                </span>
                <span className="font-serif text-xl font-bold text-slate-900 block truncate">
                  {plan.recipientName || 'You (My Favorite Person)'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Invited By
                </span>
                <span className="font-serif text-xl font-bold text-rose-600 block truncate">
                  {plan.senderName || 'Me'}
                </span>
              </div>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Date</span>
                  <span className="text-base font-semibold text-slate-900 block">
                    {formatFriendlyDate(plan.date)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Time</span>
                  <span className="text-base font-semibold text-slate-900 block">
                    {formatFriendlyTime(plan.time)}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Row */}
            <div className="flex items-start gap-3 pt-2">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-slate-500 font-medium block">The Plan</span>
                <span className="text-base font-semibold text-slate-900 block">
                  {plan.activity}
                </span>
                {plan.notes && (
                  <p className="text-xs text-slate-600 mt-1 italic bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                    &quot;{plan.notes}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Perforated ticket edge circles */}
            <div className="relative pt-4">
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-50/90 border-r border-rose-200" />
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-50/90 border-l border-rose-200" />
              <div className="border-t border-dashed border-rose-200 w-full" />
            </div>

            {/* Terms of Agreement / Cute Footer */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-500 italic">
                Valid for infinite smiles, good conversations, and zero awkward pauses. Non-refundable.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-rose-50/60 p-4 sm:p-6 border-t border-rose-100 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-rose-300" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              onClick={handleCopySummary}
              className="w-full sm:flex-1 py-3 px-4 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-rose-500" />
                  <span>Copy Date Details</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secondary options */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            onClick={() => {
              sounds.playPop();
              onPlanAnother();
            }}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-rose-600 transition-colors font-medium p-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Change Date or Reset</span>
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={() => {
              sounds.playPop();
              onOpenCustomize();
            }}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-rose-600 transition-colors font-medium p-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Send to Someone Else</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
