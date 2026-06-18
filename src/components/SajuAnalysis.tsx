import React from 'react';
import { SajuAnalysisResult } from '../types';
import { Compass, ShieldCheck, Briefcase, DollarSign, Heart, Award, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SajuAnalysisProps {
  analysis: SajuAnalysisResult;
  userName: string;
}

export default function SajuAnalysis({ analysis, userName }: SajuAnalysisProps) {
  // Map elements to custom styling & color palettes
  const getElementParams = (elem: string) => {
    const norm = elem.toLowerCase();
    if (norm.includes('목') || norm.includes('wood')) {
      return {
        bg: 'bg-emerald-950/30',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-300',
        label: '목 (木)',
        color: '#10b981',
      };
    }
    if (norm.includes('화') || norm.includes('fire')) {
      return {
        bg: 'bg-rose-950/30',
        text: 'text-rose-300',
        border: 'border-rose-500/30',
        badge: 'bg-rose-500/20 text-rose-300',
        label: '화 (火)',
        color: '#f43f5e',
      };
    }
    if (norm.includes('토') || norm.includes('earth')) {
      return {
        bg: 'bg-amber-950/20',
        text: 'text-amber-200',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/20 text-amber-200',
        label: '토 (土)',
        color: '#d4af37',
      };
    }
    if (norm.includes('금') || norm.includes('metal')) {
      return {
        bg: 'bg-neutral-800/40',
        text: 'text-neutral-200',
        border: 'border-neutral-500/30',
        badge: 'bg-neutral-600/30 text-neutral-200',
        label: '금 (金)',
        color: '#e5e5e5',
      };
    }
    if (norm.includes('수') || norm.includes('water')) {
      return {
        bg: 'bg-blue-950/30',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        badge: 'bg-blue-500/20 text-blue-300',
        label: '수 (水)',
        color: '#3b82f6',
      };
    }
    return {
      bg: 'bg-neutral-900',
      text: 'text-neutral-300',
      border: 'border-neutral-800',
      badge: 'bg-neutral-800 text-neutral-350',
      label: '불명',
      color: '#a3a3a3',
    };
  };

  const pYear = getElementParams(analysis.yearPillar.element);
  const pMonth = getElementParams(analysis.monthPillar.element);
  const pDay = getElementParams(analysis.dayPillar.element);
  const pHour = getElementParams(analysis.hourPillar.element);

  // Maximum value for scaling WuXing bars
  const wuXing = analysis.wuXing || { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 };
  const totalWuXing = Object.values(wuXing).reduce((acc, c) => acc + c, 0) || 5;

  const wuxingWeights = [
    { key: 'wood', label: '목 (木 / Wood)', count: wuXing.wood, color: 'bg-emerald-500', desc: '성장, 전진, 추진력, 인자함' },
    { key: 'fire', label: '화 (火 / Fire)', count: wuXing.fire, color: 'bg-rose-500', desc: '열정, 화려함, 소통력, 명예' },
    { key: 'earth', label: '토 (土 / Earth)', count: wuXing.earth, color: 'bg-amber-500', desc: '신용, 중재, 믿음직함, 보수성' },
    { key: 'metal', label: '금 (金 / Metal)', count: wuXing.metal, color: 'bg-neutral-400', desc: '결단, 신의, 원칙성, 수렴력' },
    { key: 'water', label: '수 (水 / Water)', count: wuXing.water, color: 'bg-blue-500', desc: '지혜, 침투력, 유연함, 기획성' },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Tab Heading */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-200 text-xs font-semibold rounded-full border border-amber-500/20">
          <Compass className="w-3.5 h-3.5" />
          정밀 명조 해설
        </div>
        <h2 className="text-3xl font-serif font-extrabold text-neutral-100 tracking-tight">四柱四柱 (네 기둥과 오행 원국)</h2>
        <p className="text-sm text-neutral-400">우주적인 천기(天氣)와 지기(地氣)가 빚어낸 평생의 에너지 분포를 입체 분석합니다.</p>
      </div>

      {/* 4 Pillars Grid (Hour, Day, Month, Year) */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-emerald-500 via-rose-500 via-amber-500 via-neutral-300 to-blue-500" />
        <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-400 uppercase">명리학 사주원국 대지 (四柱)</h3>
        
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 text-center">
          {/* Hour Pillar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`border rounded-2xl p-3 sm:p-5 flex flex-col justify-between ${pHour.bg} ${pHour.border} transition-transform hover:scale-[1.02] duration-300`}
          >
            <span className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-widest block mb-2">시주 (時柱)</span>
            <div className="space-y-2 py-4">
              <div className="text-2xl sm:text-4xl font-serif font-black flex justify-center gap-0.5">
                <span className={pHour.text}>{analysis.hourPillar.stem}</span>
              </div>
              <div className="text-2xl sm:text-4xl font-serif font-black flex justify-center gap-0.5">
                <span className={pHour.text}>{analysis.hourPillar.branch}</span>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs sm:text-sm font-semibold text-neutral-300">
                {analysis.hourPillar.stemKorean}{analysis.hourPillar.branchKorean}
              </div>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${pHour.badge}`}>
                {pHour.label}
              </span>
            </div>
          </motion.div>

          {/* Day Pillar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`border-2 rounded-2xl p-3 sm:p-5 flex flex-col justify-between relative overflow-hidden ${pDay.bg} ${pDay.border} shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-transform hover:scale-[1.02] duration-300`}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/30 to-transparent text-[8px] font-bold text-amber-200 px-1 py-0.5 uppercase rounded-bl tracking-widest font-mono">My 일주</div>
            <span className="text-[10px] md:text-xs font-semibold text-amber-300/80 uppercase tracking-widest block mb-2">일주 (日柱)</span>
            <div className="space-y-2 py-4">
              <div className="text-2xl sm:text-4xl font-serif font-black flex justify-center gap-0.5">
                <span className={pDay.text}>{analysis.dayPillar.stem}</span>
              </div>
              <div className="text-2xl sm:text-4xl font-serif font-black flex justify-center gap-0.5">
                <span className={pDay.text}>{analysis.dayPillar.branch}</span>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs sm:text-sm font-bold text-amber-100">
                {analysis.dayPillar.stemKorean}{analysis.dayPillar.branchKorean}
              </div>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${pDay.badge}`}>
                {pDay.label}
              </span>
            </div>
          </motion.div>

          {/* Month Pillar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`border rounded-2xl p-3 sm:p-5 flex flex-col justify-between ${pMonth.bg} ${pMonth.border} transition-transform hover:scale-[1.02] duration-300`}
          >
            <span className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-widest block mb-2">월주 (月柱)</span>
            <div className="space-y-2 py-4">
              <div className="text-2xl sm:text-4xl font-serif font-black flex justify-center gap-0.5">
                <span className={pMonth.text}>{analysis.monthPillar.stem}</span>
              </div>
              <div className="text-2xl sm:text-4xl font-serif font-black flex justify-center gap-0.5">
                <span className={pMonth.text}>{analysis.monthPillar.branch}</span>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs sm:text-sm font-semibold text-neutral-300">
                {analysis.monthPillar.stemKorean}{analysis.monthPillar.branchKorean}
              </div>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${pMonth.badge}`}>
                {pMonth.label}
              </span>
            </div>
          </motion.div>

          {/* Year Pillar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`border rounded-2xl p-3 sm:p-5 flex flex-col justify-between ${pYear.bg} ${pYear.border} transition-transform hover:scale-[1.02] duration-300`}
          >
            <span className="text-[10px] md:text-xs font-medium text-neutral-500 uppercase tracking-widest block mb-2">년주 (年柱)</span>
            <div className="space-y-2 py-4">
              <div className="text-2xl sm:text-4xl font-serif font-black flex justify-center gap-0.5">
                <span className={pYear.text}>{analysis.yearPillar.stem}</span>
              </div>
              <div className="text-2xl sm:text-4xl font-serif font-black flex justify-center gap-0.5">
                <span className={pYear.text}>{analysis.yearPillar.branch}</span>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs sm:text-sm font-semibold text-neutral-300">
                {analysis.yearPillar.stemKorean}{analysis.yearPillar.branchKorean}
              </div>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${pYear.badge}`}>
                {pYear.label}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Five Elements WuXing Chart bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#18181b] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-400 uppercase">오행 성분 비율 분석 (五行)</h3>
            <span className="text-xs text-[#d4af37]">전체 인자 기운 가중값: {totalWuXing}</span>
          </div>

          <div className="space-y-5">
            {wuxingWeights.map((w) => {
              const rRatio = Math.round((w.count / totalWuXing) * 100) || 0;
              return (
                <div key={w.key} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full ${w.color}`} />
                      <span className="font-semibold text-neutral-200">{w.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 font-mono">수치: {w.count}</span>
                      <span className="text-neutral-200 font-bold font-mono">{rRatio}%</span>
                    </div>
                  </div>
                  {/* Progress bar with glowing element depending on weight */}
                  <div className="h-3.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 p-[1px]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${rRatio}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${w.color} shadow-[0_0_8px_rgba(255,255,255,0.1)]`}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 italic pl-5">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialized metadata blocks */}
        <div className="bg-[#18181b] border border-neutral-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-400 uppercase">에너지 처방구</h3>
            
            <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl space-y-3">
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase block">Yong-Shin (용신)</span>
              <p className="text-lg font-serif font-bold text-amber-200">{analysis.yongShin}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                용신은 운세가 막혔을 때 마법의 치유제 역할을 하는 핵심 오행으로, 이 기운을 품는 색상이나 장식, 습관을 기르면 운이 풀립니다.
              </p>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl space-y-3">
              <span className="text-[10px] text-violet-400 font-mono tracking-widest uppercase block">Gyeok-Guk (격국)</span>
              <p className="text-lg font-serif font-bold text-violet-200">{analysis.gyeokGuk}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                본인의 가장 웅대한 핵심 사회적 적성과 천성을 상징합니다. 이 무기를 연마할 때 진로 방향이 흔들림 없이 우뚝 섭니다.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/60 text-[11px] text-neutral-500 text-center">
            * 명리학 원전에 준거한 실시간 AI 보정 완료
          </div>
        </div>
      </div>

      {/* Saju Category Analysis details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-500 uppercase">심층 인맥/활동 영역별 분석</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personality */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/20 rounded-2xl p-6 space-y-3 transition-all"
          >
            <div className="flex items-center gap-2.5 text-amber-200">
              <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">성격 및 기품 (性格)</h4>
            </div>
            <p className="text-sm text-neutral-350 leading-relaxed">
              {analysis.analysis?.personality}
            </p>
          </motion.div>

          {/* Career */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/20 rounded-2xl p-6 space-y-3 transition-all"
          >
            <div className="flex items-center gap-2.5 text-emerald-200">
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">진로 및 적성 (適性)</h4>
            </div>
            <p className="text-sm text-neutral-350 leading-relaxed">
              {analysis.analysis?.career}
            </p>
          </motion.div>

          {/* Wealth */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/20 rounded-2xl p-6 space-y-3 transition-all"
          >
            <div className="flex items-center gap-2.5 text-amber-200">
              <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">재물 흐름 가치 (財物)</h4>
            </div>
            <p className="text-sm text-neutral-350 leading-relaxed">
              {analysis.analysis?.wealth}
            </p>
          </motion.div>

          {/* Love */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-neutral-900 border border-neutral-800 hover:border-rose-500/20 rounded-2xl p-6 space-y-3 transition-all"
          >
            <div className="flex items-center gap-2.5 text-rose-200">
              <div className="bg-rose-500/10 p-2 rounded-xl text-rose-400">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">사랑 및 배필 타입 (配匹)</h4>
            </div>
            <p className="text-sm text-neutral-350 leading-relaxed">
              {analysis.analysis?.love}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Dynamic warm message of coach */}
      <div className="bg-gradient-to-r from-amber-950/20 to-neutral-900 border border-[#d4af37]/30 rounded-3xl p-6 md:p-8 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-[#d4af37]/5 to-transparent pointer-events-none" />
        <div className="bg-[#d4af37]/10 w-12 h-12 rounded-2xl flex items-center justify-center text-[#d4af37] shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-neutral-200 font-bold text-sm mb-1 font-mono tracking-wider">MENGXIAN (명가 수첩 격려사)</h4>
          <p className="text-sm text-neutral-300 italic leading-relaxed">
            &ldquo;{analysis.message}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
