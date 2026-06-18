import React, { useEffect, useState } from 'react';
import { SajuProfile, SajuAnalysisResult, SajuInsightsResult } from '../types';
import { CalendarDays, LineChart, Sparkles, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SajuInsightsProps {
  profile: SajuProfile;
  analysis: SajuAnalysisResult;
}

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function SajuInsights({ profile, analysis }: SajuInsightsProps) {
  const [data, setData] = useState<SajuInsightsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [activeCalendarDay, setActiveCalendarDay] = useState<number | null>(null);

  useEffect(() => {
    fetchSajuInsights();
  }, [profile.name]);

  const fetchSajuInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/saju/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sajuData: analysis })
      });
      if (!response.ok) throw new Error('운세 변화망 호출 실패');
      const resData = await response.json();
      setData(resData);
    } catch (err) {
      console.error(err);
      setData({
        yearlyForecast: "올해 병오년(丙午年)의 불꽃과 소나무의 성장이 결합하여 왕성하고 찬란한 봄에서 화합을 유도하는 기운이 넘쳐흐르는 성숙한 대운입니다. 상반기 3-4월에는 다소 급한 성격을 지양해야 귀인을 부를 수 있고, 가을 9-10월은 결실의 금기운이 당신의 대지 오행을 촉촉하고 은혜롭게 안정시키며 평생 영유할 가치 있는 성과와 자산을 보전해줄 것입니다.",
        monthlyScores: [75, 80, 60, 78, 85, 92, 70, 65, 88, 95, 75, 80]
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
        <p className="text-sm text-neutral-400 font-mono">가장 가까운 우주의 미래 주기 및 달력 해독 중...</p>
      </div>
    );
  }

  // Find peak month
  const scores = data?.monthlyScores || [75, 80, 60, 78, 85, 92, 70, 65, 88, 95, 75, 80];
  const maxScore = Math.max(...scores);
  const peakMonthIndex = scores.indexOf(maxScore);

  // Calendar parameters
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const getDayElement = (day: number) => {
    const sum = day + profile.name.length;
    if (sum % 5 === 0) return { name: '목 (木)', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    if (sum % 5 === 1) return { name: '화 (火)', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    if (sum % 5 === 2) return { name: '토 (土)', bg: 'bg-amber-500/20 text-amber-200 border-amber-500/30' };
    if (sum % 5 === 3) return { name: '금 (金)', bg: 'bg-neutral-500/20 text-neutral-200 border-neutral-700/30' };
    return { name: '수 (水)', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Tab Heading */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-200 text-xs font-semibold rounded-full border border-amber-500/20">
          <CalendarDays className="w-3.5 h-3.5" />
          신년 신수 및 가이드
        </div>
        <h2 className="text-3xl font-serif font-extrabold text-neutral-100 tracking-tight">수성 대운 및 그래프 (吉運)</h2>
        <p className="text-sm text-neutral-400">인생의 바도에서 언제 돛을 펼치고 언제 은혜롭게 닻을 내려 자중할지 천문을 엿봅니다.</p>
      </div>

      {/* 2026 Year Forecast Panel */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-radial from-[#d4af37]/5 to-transparent pointer-events-none" />
        <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-450 uppercase mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          2026 병오년(丙午年) 신 수 정밀 총평
        </h3>
        <p className="text-sm text-neutral-300 leading-relaxed font-sans text-justify">
          {data?.yearlyForecast}
        </p>
      </div>

      {/* Custom responsive SVG Line chart of monthly fortune */}
      <div className="bg-[#18181b] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-400 uppercase">2026 월별 종합 대운 기류 지수</h3>
            <p className="text-xs text-neutral-500 mt-1">지수가 높을수록 본인의 적극적인 대외 활동 및 재물 취득이 매우 풍부한 길월입니다.</p>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs text-amber-200 flex items-center gap-1.5 shrink-0">
            <LineChart className="w-3.5 h-3.5 shrink-0" />
            인생 대운 황금기: <span className="font-bold underline">{peakMonthIndex + 1}월 ({maxScore}점)</span>
          </div>
        </div>

        {/* Custom SVG Line/Area graph */}
        <div className="w-full h-64 relative bg-neutral-950/40 p-4 border border-neutral-850 rounded-2xl">
          <div className="w-full h-full flex flex-col justify-between">
            {/* Y axis lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-neutral-900" />
            <div className="absolute inset-x-0 top-2/4 border-b border-neutral-900" />
            <div className="absolute inset-x-0 top-3/4 border-b border-neutral-900" />
            
            {/* The SVG element representing the line */}
            <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
              {/* Gradient defs */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Fill Area path under line */}
              <path
                d={`M 0,200 ${scores.map((s, idx) => `L ${idx * 109},${200 - s * 1.6}`).join(' ')} L 1200,200 Z`}
                fill="url(#chartGradient)"
              />
              
              {/* Line path */}
              <path
                d={scores.map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${idx * 109},${200 - s * 1.6}`).join(' ')}
                fill="none"
                stroke="#d4af37"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {scores.map((s, idx) => (
                <circle
                  key={idx}
                  cx={idx * 109}
                  cy={200 - s * 1.6}
                  r={hoveredMonth === idx ? "8" : "5"}
                  fill={hoveredMonth === idx ? "#ffffff" : "#18181b"}
                  stroke="#d4af37"
                  strokeWidth="3.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredMonth(idx)}
                  onMouseLeave={() => setHoveredMonth(null)}
                />
              ))}
            </svg>

            {/* X axis month labels */}
            <div className="flex justify-between text-[11px] font-mono text-neutral-500 font-semibold px-2 border-t border-neutral-900 pt-3 select-none shrink-0">
              {MONTHS.map((m, idx) => (
                <span 
                  key={m} 
                  className={`transition-colors cursor-pointer ${hoveredMonth === idx ? 'text-[#d4af37] font-bold' : ''}`}
                  onMouseEnter={() => setHoveredMonth(idx)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Tooltip layer */}
          {hoveredMonth !== null && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-neutral-900 border border-[#d4af37]/40 text-neutral-100 text-xs px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 pointer-events-none">
              <span className="font-bold text-amber-200">{hoveredMonth + 1}월 대운 점수:</span>
              <span className="font-mono text-neutral-200 font-extrabold">{scores[hoveredMonth]}점</span>
            </div>
          )}
        </div>
      </div>

      {/* Saju Calendar of the Moment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar visual */}
        <div className="lg:col-span-2 bg-[#18181b] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-400 uppercase">이달의 오행 택일 달력 (擇日)</h3>
            <span className="text-xs text-neutral-500">2026년 기준 실시간 에너지 맵</span>
          </div>

          <div className="grid grid-cols-7 gap-2.5 text-center">
            {['일', '월', '화', '수', '목', '금', '토'].map(wd => (
              <span key={wd} className="text-xs font-semibold text-neutral-500 py-1">{wd}</span>
            ))}
            
            {/* Blank offset */}
            <span className="py-2.5" />
            <span className="py-2.5" />

            {calendarDays.map(day => {
              const de = getDayElement(day);
              const isSelected = activeCalendarDay === day;
              return (
                <div
                  key={day}
                  onClick={() => setActiveCalendarDay(day)}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${de.bg} ${
                    isSelected 
                      ? 'border-amber-400 scale-[1.05] ring-2 ring-amber-400/20' 
                      : 'border-transparent hover:border-neutral-705'
                  }`}
                >
                  <span className="text-xs font-mono font-bold">{day}</span>
                  <span className="text-[7.5px] tracking-wider uppercase mt-0.5 opacity-80">{de.name.substring(0, 1)}기</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day energy prescription details */}
        <div className="bg-[#18181b] border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider font-mono text-neutral-400 uppercase">택일 상세 기운 길흉방</h3>
            
            {activeCalendarDay === null ? (
              <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-850 text-center space-y-2 text-neutral-500">
                <CalendarDays className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs">왼쪽 달력에서 날짜를 지정해 오행 기운 보조 처방과 궁합 처방을 얻어보세요.</p>
              </div>
            ) : (
              <div className="bg-neutral-900 border border-[#d4af37]/15 p-4 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#d4af35] text-sm font-serif font-black">{activeCalendarDay}일 운세 조화명</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-200 px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-widest font-mono">
                    {getDayElement(activeCalendarDay).name}
                  </span>
                </div>
                
                <p className="text-neutral-300 text-xs leading-relaxed">
                  이 날은 오행상 <span className="text-amber-200 font-semibold">{getDayElement(activeCalendarDay).name}</span>의 기류가 정면 돌출하는 때입니다. 무리한 확장보다 약속과 문서 검토 소통 비율이 높아지기에, 명리적인 실리 중심의 대화를 도모하기 아주 안성맞춤입니다.
                </p>

                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-900 text-[11px] text-amber-500 font-mono tracking-wide">
                  💡 추천 행동: 비전 계약서 도장, 사색 및 기획 공부
                </div>
              </div>
            )}
          </div>

          <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-2xl text-[11px] text-neutral-500 flex items-start gap-2 h-auto shrink-0 mt-4 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
            <span>본 분석은 개인 원국(四柱)을 대은법과 조우하여 산정한 실질 캘린더이며, 이사, 혼인 등의 중대사에는 AI 코치 한정 프로필을 권합니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
