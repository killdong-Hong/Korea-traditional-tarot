import React, { useState } from 'react';
import { SajuProfile } from '../types';
import { ChevronRight, Calendar, Clock, User, Compass, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SajuInputFormProps {
  onComplete: (profile: SajuProfile) => void;
}

export default function SajuInputForm({ onComplete }: SajuInputFormProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [noTime, setNoTime] = useState(false);
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const nextStep = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !birthDate) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    const timeToSubmit = noTime ? '' : birthTime;
    setIsSubmitting(true);
    
    // Tiny dramatic wait to represent cosmic synchronization
    setTimeout(() => {
      onComplete({
        name: name.trim(),
        gender,
        birthDate,
        birthTime: timeToSubmit,
        calendarType,
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-md bg-[#18181b] border border-[#d4af37]/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#d4af37]/10 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-radial from-amber-500/5 to-transparent rounded-full -ml-16 -mb-16 pointer-events-none" />

        {/* Stepper Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step 
                    ? 'w-8 bg-gradient-to-r from-[#d4af37] to-amber-500' 
                    : s < step 
                    ? 'w-4 bg-[#d4af37]/60' 
                    : 'w-2 bg-neutral-800'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-[#d4af37]/80 tracking-wider">0{step} / 03</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-sans tracking-tight text-neutral-100">
                  당신의 귀한 <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-[#d4af37]">성함과 성별</span>을<br />알려주세요.
                </h2>
                <p className="text-sm text-neutral-400">명리학 분석을 위한 첫 걸음입니다.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    id="input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] transition-all text-base"
                    onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setGender('M')}
                    className={`py-4 rounded-2xl font-medium tracking-wide transition-all border ${
                      gender === 'M'
                        ? 'bg-neutral-800 border-[#d4af37] text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    남성 (乾命)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('F')}
                    className={`py-4 rounded-2xl font-medium tracking-wide transition-all border ${
                      gender === 'F'
                        ? 'bg-neutral-800 border-[#d4af37] text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    여성 (坤命)
                  </button>
                </div>
              </div>

              <button
                type="button"
                id="btn-next-1"
                disabled={!name.trim()}
                onClick={nextStep}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-2xl font-medium text-neutral-950 flex items-center justify-center gap-1 hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100 transition-all cursor-pointer shadow-lg shadow-amber-500/15"
              >
                다음 단계로 <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-sans tracking-tight text-neutral-100">
                  태어나신 <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-[#d4af37]">날짜와 캘린더</span>를<br />선택해 주세요.
                </h2>
                <p className="text-sm text-neutral-400">그날 우주의 별들이 내린 에너지를 추적합니다.</p>
              </div>

              <div className="space-y-4">
                <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setCalendarType('solar')}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      calendarType === 'solar'
                        ? 'bg-neutral-800 text-[#d4af37]'
                        : 'text-neutral-500'
                    }`}
                  >
                    양력 (Solar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarType('lunar')}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      calendarType === 'lunar'
                        ? 'bg-neutral-800 text-[#d4af37]'
                        : 'text-neutral-500'
                    }`}
                  >
                    음력 (Lunar)
                  </button>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="date"
                    id="input-date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-100 focus:outline-none focus:border-[#d4af37] transition-all text-base [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  id="btn-back-2"
                  onClick={prevStep}
                  className="flex-1 py-4 bg-neutral-950 border border-neutral-800 text-neutral-400 rounded-2xl hover:text-neutral-200 transition-all cursor-pointer"
                >
                  이전
                </button>
                <button
                  type="button"
                  id="btn-next-2"
                  disabled={!birthDate}
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-2xl font-medium text-neutral-950 flex items-center justify-center gap-1 hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100 transition-all cursor-pointer"
                >
                  다음 단계로 <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-sans tracking-tight text-neutral-100">
                  태어나신 <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-[#d4af37]">정확한 시간</span>을<br />알고 계신가요?
                </h2>
                <p className="text-sm text-neutral-400">시주(時柱) 분석은 운세의 대단히 디테일한 세부를 밝힙니다.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
                  <input
                    type="checkbox"
                    id="checkbox-no-time"
                    checked={noTime}
                    onChange={(e) => setNoTime(e.target.checked)}
                    className="w-5 h-5 rounded accent-[#d4af37] bg-neutral-800 border-neutral-700 cursor-pointer"
                  />
                  <label htmlFor="checkbox-no-time" className="text-sm text-neutral-300 font-medium cursor-pointer flex-1">
                    태어난 시간을 모릅니다. (시간 미등록 분석)
                  </label>
                </div>

                {!noTime && (
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="time"
                      id="input-time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-100 focus:outline-none focus:border-[#d4af37] transition-all text-base [color-scheme:dark]"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  id="btn-back-3"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-neutral-950 border border-neutral-800 text-neutral-400 rounded-2xl hover:text-neutral-200 transition-all cursor-pointer disabled:opacity-50"
                >
                  이전
                </button>
                <button
                  type="button"
                  id="btn-submit"
                  disabled={(!birthTime && !noTime) || isSubmitting}
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-2xl font-medium text-neutral-950 flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      신비로운 실마리 추적 중...
                    </>
                  ) : (
                    <>
                      <Compass className="w-5 h-5 animate-pulse" />
                      사주풀이 시작하기
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
