import React from 'react';
import { SajuProfile, SajuAnalysisResult } from '../types';
import { User, ShieldCheck, Mail, Calendar, Clock, RotateCcw, HelpCircle, AppWindow, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SajuProfileTabProps {
  profile: SajuProfile;
  analysis: SajuAnalysisResult;
  onReset: () => void;
}

export default function SajuProfileTab({ profile, analysis, onReset }: SajuProfileTabProps) {
  const metaDetail = [
    { label: '성명', value: `${profile.name}님`, icon: <User className="w-4 h-4 text-[#d4af37]" /> },
    { label: '성별 기운', value: profile.gender === 'M' ? '건명 (남성)' : '곤명 (여성)', icon: <Sparkles className="w-4 h-4 text-rose-400" /> },
    { label: '탄생일 기준', value: `${profile.birthDate} (${profile.calendarType === 'solar' ? '양력' : '음력'})`, icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
    { label: '탄생시각', value: profile.birthTime || '모름/시간 미지정', icon: <Clock className="w-4 h-4 text-blue-400" /> },
    { label: '격국명', value: analysis.gyeokGuk, icon: <ShieldCheck className="w-4 h-4 text-violet-400" /> },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Tab Heading */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-200 text-xs font-semibold rounded-full border border-amber-500/20">
          <User className="w-3.5 h-3.5" />
          내 명리학 정보
        </div>
        <h2 className="text-3xl font-serif font-extrabold text-neutral-100 tracking-tight">명리 수첩 및 전각 (設定)</h2>
        <p className="text-sm text-neutral-400">등록하신 우주 탄생 각인 정보와 가이드 기록을 소중하고 안전하게 관리하는 영역입니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core details column */}
        <div className="lg:col-span-2 bg-[#18181b] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-400 uppercase">기본 원국 각인 데이터</h3>
          
          <div className="divide-y divide-neutral-900">
            {metaDetail.map((meta, idx) => (
              <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-900 border border-neutral-850 p-2 rounded-xl">
                    {meta.icon}
                  </div>
                  <span className="text-sm text-neutral-400">{meta.label}</span>
                </div>
                <span className="text-sm text-neutral-150 font-semibold font-serif">{meta.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-900">
            <button
              onClick={onReset}
              className="w-full py-3.5 bg-neutral-900 border border-neutral-800 hover:border-[#d4af37]/45 text-neutral-300 hover:text-amber-200 text-xs font-medium rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              모든 명조 및 세션 데이터 초기화하기
            </button>
          </div>
        </div>

        {/* Info or support details */}
        <div className="bg-[#18181b] border border-neutral-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-400 uppercase">서비스 품질 및 영적 보안</h3>
            
            <div className="bg-neutral-950 p-4 rounded-xl space-y-2 border border-neutral-900">
              <span className="text-[10px] text-teal-400 font-mono tracking-widest block uppercase font-bold">Privacy Secure</span>
              <p className="text-xs text-neutral-350 leading-relaxed">
                사용자가 입력하신 성함 및 탄생 시각은 로컬 브라우저 세션 및 전송 데이터 보안 필터에만 적용되며, 제3자에 유출되지 않는 절대 청정 우주를 지향합니다.
              </p>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl space-y-2 border border-neutral-900">
              <span className="text-[10px] text-amber-500 font-mono tracking-widest block uppercase font-bold">FCM Fortune Notify</span>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-300 font-medium">일일 운세 푸시림 메일</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-200 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">수신동의</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-neutral-900 pt-6">
            <div className="flex justify-between text-[11px] text-neutral-500">
              <span>서비스 버전</span>
              <span className="font-mono text-neutral-400">v2.4.0-Premium</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500">
              <span>인증 제휴서</span>
              <span className="text-neutral-450">사단법인 동양문화 보전동맹</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
