/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FloatingHearts } from './components/FloatingHearts';
import { QuestionCard } from './components/QuestionCard';
import { DatePlanner, DatePlanData } from './components/DatePlanner';
import { DateConfirmationPass } from './components/DateConfirmationPass';
import { CustomizeModal } from './components/CustomizeModal';
import { sounds } from './utils/audio';

export default function App() {
  const [step, setStep] = useState<'question' | 'planner' | 'pass'>('question');
  const [recipientName, setRecipientName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [customQuestion, setCustomQuestion] = useState<string>('Do you want to date with me?');
  const [datePlan, setDatePlan] = useState<DatePlanData | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Parse URL query parameters on load to support personalized shareable links
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to');
      const fromParam = params.get('from');
      const qParam = params.get('q');

      if (toParam) setRecipientName(toParam);
      if (fromParam) setSenderName(fromParam);
      if (qParam) setCustomQuestion(qParam);
    }
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
    if (!nextMuted) {
      sounds.playPop();
    }
  };

  const handleSelectYes = () => {
    setStep('planner');
  };

  const handleConfirmPlan = (plan: DatePlanData) => {
    setDatePlan(plan);
    setStep('pass');
  };

  const handleReset = () => {
    setStep('question');
  };

  const handleApplyCustomization = (params: {
    recipientName: string;
    senderName: string;
    customQuestion: string;
  }) => {
    setRecipientName(params.recipientName);
    setSenderName(params.senderName);
    setCustomQuestion(params.customQuestion);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-rose-100/40 font-sans selection:bg-rose-200 selection:text-rose-900">
      {/* Subtle floating background hearts and sparkle particles */}
      <FloatingHearts />

      {/* Top Bar Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onReset={handleReset}
        currentStep={step}
      />

      {/* Main Interactive Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        {step === 'question' && (
          <QuestionCard
            recipientName={recipientName}
            senderName={senderName}
            customQuestion={customQuestion}
            onSelectYes={handleSelectYes}
          />
        )}

        {step === 'planner' && (
          <DatePlanner
            recipientName={recipientName}
            senderName={senderName}
            onBack={() => setStep('question')}
            onConfirm={handleConfirmPlan}
          />
        )}

        {step === 'pass' && datePlan && (
          <DateConfirmationPass
            plan={datePlan}
            onPlanAnother={() => setStep('planner')}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
          />
        )}
      </main>

      {/* Customization & Share Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        recipientName={recipientName}
        senderName={senderName}
        customQuestion={customQuestion}
        onSave={handleApplyCustomization}
      />
    </div>
  );
}
