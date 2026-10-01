import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Heart, Sparkles, Check, ArrowLeft, MessageSquareHeart } from 'lucide-react';
import { getTodayDate, getUpcomingDay, getTomorrowDate, formatFriendlyDate } from '../utils/dateHelpers';
import { sounds } from '../utils/audio';

export interface DatePlanData {
  date: string;
  time: string;
  activity: string;
  notes: string;
  recipientName: string;
  senderName: string;
}

interface DatePlannerProps {
  recipientName: string;
  senderName: string;
  onBack: () => void;
  onConfirm: (plan: DatePlanData) => void;
}

const ACTIVITIES = [
  { id: 'dinner', label: 'Romantic Dinner & Drinks', icon: '🍷', desc: 'Candlelight, great food, cozy table' },
  { id: 'coffee', label: 'Coffee & Bookstore Walk', icon: '☕', desc: 'Warm lattes, sweet pastries, quiet talks' },
  { id: 'sunset', label: 'Sunset Picnic & Gelato', icon: '🌅', desc: 'Scenic golden hour view, blankets & treats' },
  { id: 'movie', label: 'Cinema & Late Night Bites', icon: '🎬', desc: 'Latest film, warm popcorn, midnight diner' },
  { id: 'creative', label: 'Pottery or Painting Class', icon: '🎨', desc: 'Hands-on art session, laughs & creativity' },
  { id: 'arcade', label: 'Bowling & Arcade Games', icon: '🎳', desc: 'Friendly competition, arcade tickets & prizes' },
  { id: 'stargazing', label: 'Evening Stargazing', icon: '🌌', desc: 'Quiet spot under the night stars' },
  { id: 'surprise', label: 'Surprise Mystery Date', icon: '✨', desc: 'Full mystery itinerary planned with love' },
];

export const DatePlanner: React.FC<DatePlannerProps> = ({
  recipientName,
  senderName,
  onBack,
  onConfirm,
}) => {
  const today = getTodayDate();
  const defaultDate = getUpcomingDay(5); // Default to this upcoming Friday

  const [date, setDate] = useState<string>(defaultDate);
  const [time, setTime] = useState<string>('19:00');
  const [activity, setActivity] = useState<string>('Romantic Dinner & Drinks');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePresetDate = (newDate: string) => {
    sounds.playPop();
    setDate(newDate);
    setError('');
  };

  const handleActivitySelect = (selectedLabel: string) => {
    sounds.playPop();
    setActivity(selectedLabel);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Please choose a date for our special time together! 💕');
      return;
    }
    sounds.playCelebration();
    onConfirm({
      date,
      time,
      activity,
      notes,
      recipientName,
      senderName,
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-rose-100 shadow-2xl shadow-rose-100/70 rounded-3xl p-6 sm:p-10"
      >
        {/* Top navigation within card */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-50">
          <button
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Question</span>
          </button>

          <span className="text-xs font-semibold text-rose-600 tracking-wide uppercase">
            Step 2 of 2 · Date Details
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-500 mb-3 border border-rose-100">
            <Sparkles className="w-6 h-6 text-rose-500 animate-pulse-subtle" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Yay! You Said Yes! 🎉
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            {recipientName ? `Alright ${recipientName}, ` : ''}let’s pick the perfect date and time for our rendezvous.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Date Picker Textbox & Presets */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Select Date To Date</span>
              <span className="text-rose-500 text-xs">*</span>
            </label>

            {/* The Date Picker Textbox */}
            <div className="relative">
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3.5 bg-rose-50/40 border border-rose-200 rounded-xl text-slate-900 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all shadow-xs"
                required
              />
            </div>

            {/* Date Display Confirmation */}
            {date && (
              <p className="text-xs font-medium text-rose-600">
                Selected: {formatFriendlyDate(date)}
              </p>
            )}

            {/* Quick Date Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Quick pick:</span>
              <button
                type="button"
                onClick={() => handlePresetDate(getUpcomingDay(5))}
                className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg transition-colors border border-slate-200/70"
              >
                This Friday
              </button>
              <button
                type="button"
                onClick={() => handlePresetDate(getUpcomingDay(6))}
                className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg transition-colors border border-slate-200/70"
              >
                This Saturday
              </button>
              <button
                type="button"
                onClick={() => handlePresetDate(getUpcomingDay(0))}
                className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg transition-colors border border-slate-200/70"
              >
                This Sunday
              </button>
              <button
                type="button"
                onClick={() => handlePresetDate(getTomorrowDate())}
                className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg transition-colors border border-slate-200/70"
              >
                Tomorrow
              </button>
            </div>

            {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
          </div>

          {/* Section 2: Time Picker */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>What Time Works Best?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-rose-50/40 border border-rose-200 rounded-xl text-slate-900 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all shadow-xs"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTime('19:00')}
                  className={`flex-1 py-2.5 px-3 text-xs font-medium rounded-xl border transition-colors ${
                    time === '19:00'
                      ? 'bg-rose-100/80 border-rose-300 text-rose-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50'
                  }`}
                >
                  Dinner (7:00 PM)
                </button>
                <button
                  type="button"
                  onClick={() => setTime('14:30')}
                  className={`flex-1 py-2.5 px-3 text-xs font-medium rounded-xl border transition-colors ${
                    time === '14:30'
                      ? 'bg-rose-100/80 border-rose-300 text-rose-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50'
                  }`}
                >
                  Coffee (2:30 PM)
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Activity Picker */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Choose Our Activity</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACTIVITIES.map((act) => {
                const isSelected = activity === act.label;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleActivitySelect(act.label)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-200 shadow-xs'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <span className="text-2xl select-none" aria-hidden="true">
                      {act.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {act.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{act.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Sweet Note / Food Preferences */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <MessageSquareHeart className="w-4 h-4 text-rose-500" />
              <span>Favorite Cravings or Notes (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Italian pasta, boba tea lover, sushi enthusiast, favorite song..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all placeholder:text-slate-400 shadow-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-300/60 hover:shadow-xl hover:shadow-rose-400/60 transition-all flex items-center justify-center gap-2 text-base sm:text-lg cursor-pointer"
            >
              <span>Lock In Our Date!</span>
              <Heart className="w-5 h-5 fill-white" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
