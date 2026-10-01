import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Sparkles, Heart, Send } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
  customQuestion: string;
  onSave: (params: { recipientName: string; senderName: string; customQuestion: string }) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  senderName,
  customQuestion,
  onSave,
}) => {
  const [recipient, setRecipient] = useState(recipientName);
  const [sender, setSender] = useState(senderName);
  const [question, setQuestion] = useState(customQuestion || 'Do you want to date with me?');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the shareable URL with parameters
  const generateShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    if (recipient.trim()) url.searchParams.set('to', recipient.trim());
    else url.searchParams.delete('to');

    if (sender.trim()) url.searchParams.set('from', sender.trim());
    else url.searchParams.delete('from');

    if (question.trim() && question.trim() !== 'Do you want to date with me?') {
      url.searchParams.set('q', question.trim());
    } else {
      url.searchParams.delete('q');
    }

    return url.toString();
  };

  const shareUrl = generateShareUrl();

  const handleCopyLink = async () => {
    sounds.playPop();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleSaveAndApply = () => {
    sounds.playPop();
    onSave({
      recipientName: recipient.trim(),
      senderName: sender.trim(),
      customQuestion: question.trim() || 'Do you want to date with me?',
    });
    // Also push to history URL without reloading so the URL updates
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', shareUrl);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-rose-500">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Personalize Your Invitation
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Customize the names and question, then copy the link and text it to your special someone!
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Who are you asking? (Recipient Name)
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah, Alex, or My Crush"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-rose-50/30 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name (Sender)
              </label>
              <input
                type="text"
                placeholder="e.g. Stephen"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-rose-50/30 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Question
              </label>
              <input
                type="text"
                placeholder="Do you want to date with me?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-rose-50/30 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Generated Share Link Box */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Shareable Invitation Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Apply & Preview</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
