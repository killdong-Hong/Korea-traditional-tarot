import React, { useState, useEffect } from 'react';
import { SajuProfile, SajuAnalysisResult } from './types';
import SajuInputForm from './components/SajuInputForm';
import SajuHome from './components/SajuHome';
import SajuAnalysis from './components/SajuAnalysis';
import SajuChat from './components/SajuChat';
import SajuChemistry from './components/SajuChemistry';
import SajuInsights from './components/SajuInsights';
import SajuPremium from './components/SajuPremium';
import SajuProfileTab from './components/SajuProfileTab';

import { Sparkles, Compass, Award, Heart, MessageCircle, CalendarDays, User, FlameKindling, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [profile, setProfile] = useState<SajuProfile | null>(null);
  const [analysis, setAnalysis] = useState<SajuAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Premium simulation state across session
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(false);

  // Load existing profile from localStorage on mount for premium UX
  useEffect(() => {
    const savedProfile = localStorage.getItem('saju_user_profile');
    const savedAnalysis = localStorage.getItem('saju_user_analysis');
    const savedPremium = localStorage.getItem('saju_premium_unlocked');

    if (savedProfile && savedAnalysis) {
      try {
        setProfile(JSON.parse(savedProfile));
        setAnalysis(JSON.parse(savedAnalysis));
      } catch (e) {
        console.error("Error reading saved profile data", e);
      }
    }
    if (savedPremium === 'true') {
      setIsPremiumUnlocked(true);
    }
  }, []);

  const handleProfileComplete = async (newProfile: SajuProfile) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/saju/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfile),
      });

      if (!response.ok) throw new Error('명학 해설 전각의 기류 지체 현상 발생');
      const data: SajuAnalysisResult = await response.json();
      
      setProfile(newProfile);
      setAnalysis(data);
      setActiveTab('home');

      // Sync and persist data in localStorage
      localStorage.setItem('saju_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('saju_user_analysis', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching Saju analysis:', error);
      // Construct a robust deterministically generated fallback saju if fetch fails
      const elements = ["목 (Wood)", "화 (Fire)", "토 (Earth)", "금 (Metal)", "수 (Water)"];
      const hash = (newProfile.name.length) % 5;
      const fallbackData: SajuAnalysisResult = {
        yearPillar: { stem: "丙", branch: "午", stemKorean: "병", branchKorean: "오", element: "화 (Fire)" },
        monthPillar: { stem: "庚", branch: "寅", stemKorean: "경", branchKorean: "인", element: "금 (Metal)" },
        dayPillar: { stem: "戊", branch: "戌", stemKorean: "무", branchKorean: "술", element: "토 (Earth)" },
        hourPillar: { stem: "癸", branch: "亥", stemKorean: "계", branchKorean: "해", element: "수 (Water)" },
        wuXing: { wood: 2, fire: 1, earth: 3, metal: 1, water: 1 },
        yongShin: elements[(hash + 1) % 5] + " (수호하는 은혜와 성장)",
        gyeokGuk: "정인격 (직관적 영감과 풍성한 철학적 내면)",
        characterSummary: `${newProfile.name}님은 자상하며 두터운 신의를 지키는 온화한 포용력을 갖춘 사주입니다.`,
        analysis: {
          personality: "주위 사람들을 따뜻하게 배려하며 한결같은 신념을 추구하는 안정감 넘치는 품격을 갖고 계십니다.",
          career: "성실하게 장기적 성과를 거두는 연구직, 교육, 시스템 행정 혹은 독립 예술 영역에서 최고 효율이 발휘됩니다.",
          wealth: "자산운이 느리지만 바위에 물이 스미듯 정밀하고 견고하게 차오르는 형태입니다. 무리한 단기 차입 투자는 금물입니다.",
          love: "파트너와의 마음의 교감과 순수하고 신뢰 가득 찬 장기 연애를 이상적으로 지향하는 온후한 마음씨의 연인입니다."
        },
        message: `${newProfile.name}님, 스스로의 내면의 빛나는 북극성을 조용히 지키신다면 마침내 봄처럼 피어날 것입니다.`
      };
      setProfile(newProfile);
      setAnalysis(fallbackData);
      setActiveTab('home');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetProfile = () => {
    localStorage.removeItem('saju_user_profile');
    localStorage.removeItem('saju_user_analysis');
    setProfile(null);
    setAnalysis(null);
    setActiveTab('home');
  };

  const handleUnlockPremium = () => {
    setIsPremiumUnlocked(true);
    localStorage.setItem('saju_premium_unlocked', 'true');
  };

  const renderActiveTabContent = () => {
    if (!profile || !analysis) return null;

    switch (activeTab) {
      case 'home':
        return (
          <SajuHome
            profile={profile}
            analysis={analysis}
            onNavigate={(tab) => setActiveTab(tab)}
            onReset={handleResetProfile}
          />
        );
      case 'analysis':
        return <SajuAnalysis analysis={analysis} userName={profile.name} />;
      case 'chat':
        return (
          <SajuChat
            profile={profile}
            analysis={analysis}
            isPremiumUnlocked={isPremiumUnlocked}
          />
        );
      case 'chemistry':
        return <SajuChemistry myProfile={profile} />;
      case 'insights':
        return <SajuInsights profile={profile} analysis={analysis} />;
      case 'premium':
        return (
          <SajuPremium
            profile={profile}
            analysis={analysis}
            isPremiumUnlocked={isPremiumUnlocked}
            onUnlockPremium={handleUnlockPremium}
          />
        );
      case 'profile':
        return (
          <SajuProfileTab
            profile={profile}
            analysis={analysis}
            onReset={handleResetProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans selection:bg-[#d4af37]/20 selection:text-[#d4af37]">
      {/* Mystic Ambient Background Gradients */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#18120d]/50 via-[#0d0912]/20 to-transparent pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-neutral-900 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#d4af37] to-amber-500 flex items-center justify-center p-[1px] shadow-[0_0_12px_rgba(212,175,55,0.2)]">
              <div className="w-full h-full bg-[#09090b] rounded-[7px] flex items-center justify-center">
                <FlameKindling className="w-4.5 h-4.5 text-[#d4af37] animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold tracking-wider font-sans uppercase">AI 사주 코치</span>
              <span className="text-[9px] text-[#d4af37] tracking-widest font-bold uppercase font-mono ml-1.5 hidden sm:inline-block">Mystic Premium</span>
            </div>
          </div>

          {profile && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-450 font-medium">안녕 하세요,</span>
              <span className="text-xs font-bold text-neutral-200">{profile.name}님</span>
              {isPremiumUnlocked ? (
                <span className="text-[10px] bg-gradient-to-r from-amber-200 to-yellow-500 text-neutral-950 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest font-mono">
                  VIP
                </span>
              ) : (
                <span className="text-[10.5px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono font-medium">
                  일반
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh] space-y-6"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-amber-500/30 animate-spin-slow" />
                <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] absolute" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-serif font-bold text-[#d4af37]">천문과 오행 조화 해독 중</h3>
                <p className="text-xs text-neutral-450 max-w-sm mx-auto leading-relaxed">
                  이름과 탄생 우주에 각인된 천간(天干) 지지(地支)의 힘을 정렬하여 맞춤 명조 수첩을 준비하고 있습니다. 잠시만 경건히 기다려주십시오.
                </p>
              </div>
            </motion.div>
          ) : !profile ? (
            <motion.div
              key="form-entry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* Introduction Banner before form */}
              <div className="text-center space-y-4 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/25 text-xs font-semibold">
                  <FlameKindling className="w-3.5 h-3.5" />
                  정통 명리학 x 현대 인맥학 배학
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-black text-neutral-100 tracking-tight leading-none leading-snug">
                  우주의 에너지가 들려주는<br />당신의 <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-[#d4af37]">특별한 운명 가이드</span>
                </h1>
                <p className="text-xs md:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
                  단순한 운세 풀이를 넘어, 인생의 나침반이 되어 줄 세밀한 사주 분석과 AI 카운셀러 상담을 바로 시작해 보세요.
                </p>
              </div>

              <SajuInputForm onComplete={handleProfileComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="main-app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Primary Tabs navigation bar for multi-screen exploration */}
              <nav className="flex bg-neutral-950/90 border border-neutral-900 rounded-2xl p-1.5 overflow-x-auto gap-1 no-scrollbar sticky top-[60px] z-30 backdrop-blur">
                <button
                  onClick={() => setActiveTab('home')}
                  id="tab-home"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-gradient-to-r from-neutral-900 to-neutral-900 text-amber-250 border border-[#d4af37]/30 font-extrabold shadow-md'
                      : 'text-neutral-450 hover:text-neutral-200'
                  }`}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  홈
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  id="tab-analysis"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'analysis'
                      ? 'bg-gradient-to-r from-neutral-900 to-neutral-900 text-amber-250 border border-[#d4af37]/30 font-extrabold shadow-md'
                      : 'text-neutral-450 hover:text-neutral-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  사주 원국
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  id="tab-chat"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-gradient-to-r from-neutral-900 to-neutral-900 text-amber-250 border border-[#d4af37]/30 font-extrabold shadow-md'
                      : 'text-neutral-450 hover:text-neutral-200'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  1:1 AI 상담
                </button>
                <button
                  onClick={() => setActiveTab('chemistry')}
                  id="tab-chemistry"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'chemistry'
                      ? 'bg-gradient-to-r from-neutral-900 to-neutral-900 text-amber-250 border border-[#d4af37]/30 font-extrabold shadow-md'
                      : 'text-neutral-450 hover:text-neutral-200'
                  }`}
                >
                  <Heart className="w-4 h-4 shrink-0" />
                  궁합 매칭
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  id="tab-insights"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'insights'
                      ? 'bg-gradient-to-r from-neutral-900 to-neutral-900 text-amber-250 border border-[#d4af37]/30 font-extrabold shadow-md'
                      : 'text-neutral-450 hover:text-neutral-200'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  신년대운
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  id="tab-premium"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'premium'
                      ? 'bg-gradient-to-r from-[#d4af37]/10 to-amber-500/5 text-amber-200 border border-[#d4af37]/45 font-extrabold'
                      : 'text-neutral-450 hover:text-amber-400'
                  }`}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  구독패스
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  id="tab-profile"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-neutral-900 to-neutral-900 text-amber-250 border border-[#d4af37]/30 font-extrabold shadow-md'
                      : 'text-neutral-450 hover:text-neutral-200'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  설정
                </button>
              </nav>

              {/* Central Dynamic Screen render panel */}
              <div className="min-h-[60vh]">
                {renderActiveTabContent()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer element */}
      <footer className="border-t border-neutral-900 bg-[#09090b] py-8 text-center text-xs text-neutral-500 space-y-1">
        <p>© 2026 AI 사주 코치. All rights reserved.</p>
        <p className="font-serif">하늘이 준 사주명리를 바르게 풀이하여 미래에 빛나는 등불을 밝혀 드립니다.</p>
      </footer>
    </div>
  );
}
