import React, { useEffect, useState } from 'react';
import { SajuProfile, SajuAnalysisResult } from '../types';
import { Star, Compass, Award, Heart, MessageCircle, CreditCard, ChevronRight, User, Sparkles, RefreshCw, Quote } from 'lucide-react';
import { motion } from 'motion/react';

interface SajuHomeProps {
  profile: SajuProfile;
  analysis: SajuAnalysisResult;
  onNavigate: (tab: string) => void;
  onReset: () => void;
}

export default function SajuHome({ profile, analysis, onNavigate, onReset }: SajuHomeProps) {
  const [dailyQuote, setDailyQuote] = useState('');
  const [fortuneScore, setFortuneScore] = useState(85);

  useEffect(() => {
    // Generate a beautiful, customizable Korean morning mantra depending on the user's Saju
    const quotes = [
      `귀인의 은혜가 머리 위를 비추니 오늘은 묵묵히 뿌리를 내리는 날입니다.`,
      `오행의 화(Fire) 기운이 세차게 도는 날, 당신의 창의적 직관을 믿고 선언해 보세요.`,
      `바람에 흔들리지 않는 천년 고목처럼, 오늘은 나만의 주관을 굳건히 지킬 때 번창합니다.`,
      `작은 물길이 큰 강을 이루듯, 조용히 쌓은 지식이 오후 배움의 문을 활짝 엽니다.`,
      `금(Metal) 오행의 결단력이 요구되는 시점입니다. 서운함보다 냉철한 분별이 이롭습니다.`
    ];
    const hash = (profile.name.length + new Date().getDate()) % quotes.length;
    setDailyQuote(quotes[hash]);

    const baseScore = 78 + ((profile.name.length + new Date().getDate()) % 5) * 5;
    setFortuneScore(baseScore);
  }, [profile.name]);

  const activePillar = analysis.dayPillar;

  const currentLunarDateKorean = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between border-b border-neutral-800 pb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4af37] to-amber-500 p-[1px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
              <span className="text-xs font-serif font-semibold text-[#d4af37]">運</span>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-medium text-neutral-300 font-sans">{profile.name}님의 사주 우주</h1>
            <p className="text-xs text-[#d4af37]/80 font-serif">{profile.gender === 'M' ? '乾命 (건명)' : '坤命 (곤명)'} • 무술일주 (戊戌)</p>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="text-xs text-neutral-500 hover:text-[#d4af37] transition-colors flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          다른 사주 분석
        </button>
      </motion.div>

      {/* Hero Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1c1c1f] to-neutral-950 rounded-3xl p-6 md:p-8 border border-neutral-800 shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-radial from-[#d4af37]/5 via-amber-500/2 to-transparent rounded-full -mr-12 -mt-12" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold rounded-full border border-[#d4af37]/20">
              <Sparkles className="w-3.5 h-3.5" />
              오늘의 기운 요약
            </div>
            
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-neutral-100 tracking-tight leading-snug">
              &ldquo;{analysis.gyeokGuk}&rdquo;을 타고난 <br />
              {profile.name}님의 <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-[#d4af37]">빛나는 오늘</span>
            </h2>
            
            {/* Elegant Quote Display */}
            <div className="flex gap-3 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-850">
              <Quote className="w-6 h-6 text-[#d4af37]/40 shrink-0" />
              <p className="text-sm text-neutral-300 leading-relaxed italic">{dailyQuote}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-6 bg-neutral-900/40 rounded-2xl border border-neutral-800 relative">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">Today Fortune Index</span>
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Spinning compass outline */}
              <div className="absolute inset-0 border-2 border-dashed border-[#d4af37]/20 rounded-full animate-spin-slow" />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-serif font-black text-amber-200">{fortuneScore}</span>
                <span className="text-[10px] text-[#d4af37]/90 tracking-widest uppercase mt-0.5">명조길수</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-3 text-center">우주 조화가 안정궤도에 오른 길일</p>
          </div>
        </div>
      </div>

      {/* Saju Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core pillar snapshot */}
        <div className="bg-[#18181b] border border-neutral-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-4 right-4 text-xs font-serif text-[#d4af37]/30">四大要柱</div>
          <div>
            <h3 className="text-neutral-400 text-sm font-semibold mb-4 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#d4af37]" />
              인생의 항로: 핵심 기정
            </h3>
            <p className="text-neutral-200 text-sm leading-relaxed mb-4">
              {analysis.characterSummary}
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800/60">
            <span className="text-xs text-neutral-500">본명 일주일주 : 戊戌(무술)</span>
            <button 
              onClick={() => onNavigate('analysis')} 
              className="text-[#d4af37] text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              내 사주 원국 전체보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lucky elements box */}
        <div className="bg-[#18181b] border border-neutral-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-4 right-4 text-xs font-serif text-[#d4af37]/30">用神格局</div>
          <div>
            <h3 className="text-neutral-400 text-sm font-semibold mb-3 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              나를 수호하는 귀인 오행 (용신)
            </h3>
            <p className="text-neutral-200 text-sm leading-relaxed mb-4">
              {profile.name}님의 번영과 균형을 가져다 줄 최선의 용신은 <span className="text-amber-200 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{analysis.yongShin}</span> 입니다. 부족한 에너지를 활기차게 활성화하여 앞날을 여십시오.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800/60">
            <span className="text-xs text-neutral-500">월별 기류 변화 분석 완료</span>
            <button 
              onClick={() => onNavigate('insights')} 
              className="text-[#d4af37] text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              상세 운세 분석 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Features List Carousel-like Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-400 font-mono tracking-widest uppercase">Special Life Guides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('analysis')}
            className="group bg-neutral-900/60 hover:bg-[#1a1a1e] border border-neutral-800/80 hover:border-[#d4af37]/40 rounded-2xl p-5 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div className="bg-[#d4af37]/10 w-10 h-10 rounded-xl flex items-center justify-center text-[#d4af37]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-neutral-200 font-semibold text-sm group-hover:text-amber-200 transition-colors">명리/인성 수첩</h4>
              <p className="text-neutral-500 text-xs mt-1">사주 원국과 오행 비율 분석</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('chat')}
            className="group bg-neutral-900/60 hover:bg-[#1a1a1e] border border-neutral-800/80 hover:border-[#d4af37]/40 rounded-2xl p-5 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div className="bg-amber-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-amber-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-neutral-200 font-semibold text-sm group-hover:text-amber-200 transition-colors">1:1 사주 고민 상담</h4>
              <p className="text-neutral-500 text-xs mt-1">학업•재물•연애 특화 대화방</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('chemistry')}
            className="group bg-neutral-900/60 hover:bg-[#1a1a1e] border border-neutral-800/80 hover:border-[#d4af37]/40 rounded-2xl p-5 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div className="bg-rose-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-neutral-200 font-semibold text-sm group-hover:text-amber-200 transition-colors">상생 궁합 매칭</h4>
              <p className="text-neutral-500 text-xs mt-1">상대방과의 명학 배합과 조언</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('premium')}
            className="group bg-neutral-900/60 hover:bg-[#1a1a1e] border border-[#d4af37]/20 hover:border-[#d4af37]/50 rounded-2xl p-5 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[140px] bg-gradient-to-br from-amber-950/20 to-neutral-900"
          >
            <div className="bg-amber-500/20 w-10 h-10 rounded-xl flex items-center justify-center text-amber-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-amber-200 font-semibold text-sm group-hover:text-[#d4af37] transition-colors">AI 코치 패스</h4>
              <p className="text-amber-500 text-xs mt-1">한도 없는 무제한 연회원 혜택</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
