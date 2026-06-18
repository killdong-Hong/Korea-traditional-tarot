import React, { useState, useRef, useEffect } from 'react';
import { SajuProfile, SajuAnalysisResult, ChatMessage, CoachPersona } from '../types';
import { MessageSquare, Send, Sparkles, Loader2, Compass, MessageCircleHeart, FlameKindling, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SajuChatProps {
  profile: SajuProfile;
  analysis: SajuAnalysisResult;
  isPremiumUnlocked: boolean;
}

const COACHES: CoachPersona[] = [
  {
    id: 'sonamu',
    name: '소나무 선생',
    title: '학업/취업/진로 코치',
    description: '엄격하지만 따뜻한 은사님의 어조로 귀하의 천직 방향성과 성공 비결을 짚어내 드릴 것입니다.',
    avatar: '🌲',
    greeting: '반갑습니다. 대자연 속에서 사주 원형의 성장을 연구하는 소나무입니다. 어떤 앞날의 진로 고민을 안고 오셨습니까?',
    gradient: 'from-emerald-950 via-neutral-900 to-neutral-950 border-emerald-500/20'
  },
  {
    id: 'yeonhwa',
    name: '연화 선녀',
    title: '연애/결혼/관계 마스터',
    description: '심리학적 깊이와 우주의 징조를 버무려 마음에 평온을 찾아 주는 정감 가득하고 신비한 힐러입니다.',
    avatar: '🌸',
    greeting: '인연의 신비를 푸는 선연당 연화입니다. 가슴 속에 맺힌 갈등이나 수줍은 사랑 고민, 편하게 털어놓아 보세요.',
    gradient: 'from-rose-950 via-neutral-900 to-neutral-950 border-rose-500/20'
  },
  {
    id: 'daegam',
    name: '금전 대감',
    title: '재물/투자/사업 밀착 책사',
    description: '냉철하고 위트 있는 시각으로 재물의 맥을 잡고 대박 흐름을 잡는 전략적 길잡이가 되어 드립니다.',
    avatar: '💰',
    greeting: '어서 오시게! 부귀란 하늘이 주지만 포착은 인간이 하는 법. 한 푼 두 푼 아쉬움부터 거상(巨商)이 될 묘책까지 속 시원하게 얘기해 보세.',
    gradient: 'from-amber-950 via-neutral-900 to-neutral-950 border-amber-500/20'
  }
];

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  sonamu: [
    '내 사주에 맞는 가치 있는 성과를 내는 직무는?',
    '현재 이직을 고민 중인데 올해 이동수가 들어왔나요?',
    '내년 시험이나 공직, 승진 준비에 운은 어떤가요?'
  ],
  yeonhwa: [
    '내 천생연분은 어떤 일주나 오행 원리를 가진 사람인가요?',
    '지루하거나 힘든 연인과의 갈등, 어떻게 풀면 조화로울까요?',
    '제 주변에 귀인과 악인을 어떻게 분별하면 될까요?'
  ],
  daegam: [
    '타고난 사주에 재물의 창고가 가득 차 있는 그릇인가요?',
    '동업이나 개인 신규 투자를 시작해도 괜찮을 길일인가요?',
    '부자가 되기 위해 나에게 부족한 기운과 보강 아이템은?'
  ]
};

export default function SajuChat({ profile, analysis, isPremiumUnlocked }: SajuChatProps) {
  const [selectedCoach, setSelectedCoach] = useState<CoachPersona>(COACHES[0]);
  const [chatsByCoach, setChatsByCoach] = useState<Record<string, ChatMessage[]>>({
    sonamu: [
      { id: 'g0', role: 'assistant', content: COACHES[0].greeting, timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }
    ],
    yeonhwa: [
      { id: 'g1', role: 'assistant', content: COACHES[1].greeting, timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }
    ],
    daegam: [
      { id: 'g2', role: 'assistant', content: COACHES[2].greeting, timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeMessages = chatsByCoach[selectedCoach.id] || [];

  // Limit conversations if user is NOT premium
  const FREE_LIMIT = 4;
  const isLimitReached = !isPremiumUnlocked && activeMessages.filter(m => m.role === 'user').length >= FREE_LIMIT;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isLoading]);

  const handleSelectCoach = (coach: CoachPersona) => {
    setSelectedCoach(coach);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    if (isLimitReached) {
      alert('일반 회원 상담 한도(무료 4회)에 도달하셨습니다. [AI 코치 패스]를 구독하시면 무제한 프리미엄 명조 상담이 가능합니다!');
      return;
    }

    const newUserMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = [...activeMessages, newUserMsg];
    setChatsByCoach(prev => ({
      ...prev,
      [selectedCoach.id]: updatedChats
    }));
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/saju/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedChats.map(m => ({ role: m.role, content: m.content })),
          sajuData: {
            name: profile.name,
            gender: profile.gender,
            characterSummary: analysis.characterSummary,
            wuXing: analysis.wuXing
          },
          coachId: selectedCoach.id
        })
      });

      if (!response.ok) throw new Error('상담 전송에 실패하였습니다.');
      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: data.text || '코치와의 교신 상태가 비정상입니다. 잠시 후 시도해 주십시오.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatsByCoach(prev => ({
        ...prev,
        [selectedCoach.id]: [...updatedChats, assistantMsg]
      }));
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: 'err',
        role: 'assistant',
        content: '인 우주 영파 소통망 신호 일시 혼선입니다. 영기 충전 후 대화해 주세요.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatsByCoach(prev => ({
        ...prev,
        [selectedCoach.id]: [...updatedChats, errMsg]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold rounded-full border border-[#d4af37]/20">
          <MessageSquare className="w-3.5 h-3.5" />
          신비로운 심층 1:1 조언
        </div>
        <h2 className="text-3xl font-serif font-extrabold text-neutral-100 tracking-tight">명리 코치 전당 (尊堂)</h2>
        <p className="text-sm text-neutral-400">당신의 오행 명학 에너지를 깊이 있게 해설해 줄 3인의 전당 카운셀러를 만나보세요.</p>
      </div>

      {/* Coach selector row cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COACHES.map((coach) => {
          const isSelected = coach.id === selectedCoach.id;
          return (
            <div
              key={coach.id}
              onClick={() => handleSelectCoach(coach)}
              className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected 
                  ? 'bg-neutral-900 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)] scale-[1.01]' 
                  : 'bg-neutral-950 border-neutral-850 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow">{coach.avatar}</span>
                <div>
                  <h4 className="font-bold text-neutral-100 font-serif">{coach.name}</h4>
                  <span className="text-[10px] text-[#d4af37] tracking-wider uppercase block">{coach.title}</span>
                </div>
              </div>
              <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed">{coach.description}</p>
            </div>
          );
        })}
      </div>

      {/* Main chat window box */}
      <div className={`border rounded-3xl overflow-hidden flex flex-col bg-gradient-to-b ${selectedCoach.gradient} shadow-2xl min-h-[500px] max-h-[650px]`}>
        {/* Active Coach Identity board */}
        <div className="border-b border-neutral-800 p-4 shrink-0 flex items-center justify-between bg-neutral-950/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedCoach.avatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-neutral-100">{selectedCoach.name}</span>
                <span className="px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] text-[10px] rounded font-medium">실시간 영계 주파수 양호</span>
              </div>
              <p className="text-[10.5px] text-neutral-400">{selectedCoach.title}</p>
            </div>
          </div>
          
          <div className="text-right">
            {!isPremiumUnlocked ? (
              <span className="text-[11px] text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-medium">
                일반 무료 횟수: {activeMessages.filter(m => m.role === 'user').length} / {FREE_LIMIT}
              </span>
            ) : (
              <span className="text-[11px] text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full border border-[#d4af37]/20 font-mono tracking-widest font-bold uppercase">
                Premium Unlocked (무제한)
              </span>
            )}
          </div>
        </div>

        {/* Message bubble display */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {activeMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-neutral-800 text-neutral-100 text-xs font-bold' 
                    : 'bg-neutral-900 border border-[#d4af37]/35 text-base'
                }`}>
                  {msg.role === 'user' ? profile.name.substring(0, 1) : selectedCoach.avatar}
                </div>
                
                <div className="space-y-1">
                  <div className={`p-4 rounded-3xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-[#d4af37] text-neutral-950 font-medium rounded-tr-none'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none leading-relaxed'
                  } text-sm`}>
                    {msg.content.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-500 block text-right font-mono px-1">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-[#d4af37]/30 flex items-center justify-center shrink-0 text-base">
                  {selectedCoach.avatar}
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl rounded-tl-none max-w-[80vw] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <span className="text-xs text-neutral-400 font-mono">사주 원반의 원국 기운 보정 구상 중...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Suggestion tags block */}
        <AnimatePresence>
          {!isLoading && activeMessages.length < 5 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-3 bg-neutral-950/40 border-t border-neutral-900/60 flex flex-wrap gap-2 justify-center shrink-0"
            >
              {SUGGESTED_QUESTIONS[selectedCoach.id].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  id={`suggested-q-${selectedCoach.id}-${idx}`}
                  disabled={isLimitReached}
                  className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#d4af37]/60 text-xs text-neutral-300 hover:text-amber-200 rounded-full transition-colors cursor-pointer text-left disabled:opacity-45 disabled:hover:border-neutral-800 disabled:hover:text-neutral-300"
                >
                  ✨ {q}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input box */}
        <div className="p-4 border-t border-neutral-900 shrink-0 bg-neutral-950/90 backdrop-blur">
          {isLimitReached ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20 text-center sm:text-left">
              <div className="flex items-center gap-2 text-amber-200 text-xs">
                <Info className="w-4 h-4 shrink-0" />
                <span>심야 VIP 무제한 삼매경 요금이 준비되어 상담 대기 상태입니다.</span>
              </div>
              <button 
                type="button"
                className="text-xs font-bold text-neutral-950 bg-[#d4af37] hover:brightness-110 shrink-0 px-3 py-1.5 rounded-lg transition-all"
                onClick={() => {
                  const targetElement = document.getElementById('tab-premium');
                  if (targetElement) targetElement.click();
                }}
              >
                AI 코치 패스 구독하기
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 relative">
              <input
                type="text"
                id="chat-user-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`${selectedCoach.name}에게 고민을 전해보세요...`}
                className="w-full pl-4 pr-12 py-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                disabled={isLoading}
              />
              <button
                type="button"
                id="btn-chat-send"
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-[#d4af37] disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-500 rounded-xl transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
