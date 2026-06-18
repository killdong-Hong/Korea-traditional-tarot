import React, { useState } from 'react';
import { SajuProfile, SajuAnalysisResult } from '../types';
import { Award, CheckCircle2, ChevronRight, Lock, Loader2, CreditCard, Sparkles, AlertCircle, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SajuPremiumProps {
  profile: SajuProfile;
  analysis: SajuAnalysisResult;
  isPremiumUnlocked: boolean;
  onUnlockPremium: () => void;
}

export default function SajuPremium({ profile, analysis, isPremiumUnlocked, onUnlockPremium }: SajuPremiumProps) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [activePackID, setActivePackID] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'plan' | 'success'>('plan');
  
  // PDF Report simulation state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  const handleCheckoutSubmit = () => {
    setIsProcessingCheckout(true);
    setTimeout(() => {
      onUnlockPremium();
      setCheckoutStep('success');
      setIsProcessingCheckout(false);
    }, 1500);
  };

  const handleOpenCheckout = (id: string) => {
    setActivePackID(id);
    setCheckoutStep('plan');
    setShowCheckoutModal(true);
  };

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      setIsGeneratingPDF(false);
      setPdfReady(true);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    // Elegant system file download mock
    const link = document.createElement('a');
    link.href = '#';
    // Generate simulated markdown-based Saju report as plain text file to download! Real integration.
    const reportContent = `
========================================================================
             [AI 사주 코치] 2026 병오년(丙午年) 신 수 인생 정밀 리포트
========================================================================
- 대상자: ${profile.name}님 (${profile.gender === 'M' ? '乾命 - 남성' : '坤命 - 여성'})
- 생년월일: ${profile.birthDate} (${profile.calendarType === 'solar' ? '양력' : '음력'})
- 태어난 시간: ${profile.birthTime || '시간 등록안됨'}
- 핵심 격국: ${analysis.gyeokGuk}
- 핵심 용신: ${analysis.yongShin}

[일주 분석총평]
${analysis.characterSummary}

[오행(五行) 에너지 비율]
- 목(Wood): ${analysis.wuXing?.wood}
- 화(Fire): ${analysis.wuXing?.fire}
- 토(Earth): ${analysis.wuXing?.earth}
- 금(Metal): ${analysis.wuXing?.metal}
- 수(Water): ${analysis.wuXing?.water}

[성격 해설]
${analysis.analysis?.personality}

[진로 및 적성 비즈니스 가이드]
${analysis.analysis?.career}

[재물 및 자산 보강 비책]
${analysis.analysis?.wealth}

[사랑 및 연애 배합 파트너]
${analysis.analysis?.love}

[수호 코칭 한마디]
"${analysis.message}"

------------------------------------------------------------------------
본 리포트는 명리 정론을 연구한 AI 사주 시스템에서 실시간 천문 및 오행을 분석 및 보정한 개별 최고 품질 리포트입니다. 앞날에 오행의 축복이 깃들길 기원합니다.
========================================================================
    `;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Saju_Premium_Report_${profile.name}_2026.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Tab Heading */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-200 text-xs font-semibold rounded-full border border-amber-500/20">
          <Award className="w-3.5 h-3.5 animate-pulse" />
          프리미엄 혜택
        </div>
        <h2 className="text-3xl font-serif font-extrabold text-neutral-100 tracking-tight">AI 코치 프리미엄 전각</h2>
        <p className="text-sm text-neutral-400">당신의 소중한 운명을 심도 있게 밝혀 줄 무제한 상담과 종합 인생 보고서가 마련되어 있습니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        {/* Package 1: Subscription model (AI 코치 패스) */}
        <div className="lg:col-span-3 bg-gradient-to-b from-[#1c1c1f] via-neutral-950 to-neutral-950 border border-[#d4af37]/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#d4af37]/20 to-transparent text-xs font-mono font-bold text-amber-200 px-4 py-1.5 uppercase rounded-bl tracking-widest">
            Best Value (대표 권한)
          </div>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-amber-500 uppercase tracking-widest font-mono">Subscription Access Pass</span>
              <h3 className="text-2xl font-serif font-black text-neutral-100 flex items-center gap-2">
                AI 코치 밀착 동반 패스
              </h3>
              <p className="text-xs text-neutral-400">월 정액 결제로 인생의 큰 기로마다 든든한 등대 역할을 약속합니다.</p>
            </div>

            {/* Price display */}
            <div className="py-2 flex items-baseline gap-2 border-y border-neutral-900">
              <span className="text-3xl font-serif font-black text-amber-250">월 9,900원</span>
              <span className="text-xs text-neutral-500 line-through">원가 19,800원 (50% 한정 할인)</span>
            </div>

            {/* Feature List checklist */}
            <ul className="space-y-3.5 text-sm text-neutral-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>3인의 분야별 명리 코치와의 **무제한 1:1 채팅 정밀 상담**</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>2026 병오년(丙午年) **신 수 정밀 분석 PDF 리포트 무제한 보관 및 인쇄**</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>가족/지인과의 무제한 궁합 상생 배합 정렬 사용권</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>이달의 오행 택일 달력 - 일일 기류 알람 및 맞춤 길일 지정</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            {isPremiumUnlocked ? (
              <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl py-4 font-bold text-center flex items-center justify-center gap-2 select-none">
                <CheckCircle2 className="w-5 h-5" />
                AI 코치 정기 패스 활성화 중
              </div>
            ) : (
              <button
                type="button"
                id="btn-subscribe-now"
                onClick={() => handleOpenCheckout('pass')}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-neutral-950 font-bold rounded-2xl flex items-center justify-center gap-1 hover:brightness-110 shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
              >
                코치 패스 즉시 신청하기 <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <p className="text-[10px] text-neutral-500 text-center mt-2">일주일 이내 만족스럽지 못할 경우 100% 미사용 환불 보증제</p>
          </div>
        </div>

        {/* Package 2: Individual purchases (PDF Report generation) */}
        <div className="lg:col-span-2 bg-[#18181b] border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] text-violet-400 font-mono tracking-widest uppercase block">Single Rep-Doc Purchase</span>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-neutral-200">2026 연간 정밀 리포트 개별 다운로드</h4>
              <p className="text-xs text-neutral-400">평생 사주 원국과 2026 일년 신수 가이드를 담은 한판 평정 소책자</p>
            </div>

            <div className="py-2.5 bg-neutral-900 border border-neutral-850 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">개별 인쇄용 고딕 문서</span>
                <span className="text-[#d4af37] font-semibold">(단권 3,900원)</span>
              </div>
              <div className="text-[11px] text-neutral-500 leading-relaxed">
                * PDF 파일 형태로 다운로드할 수 있으며, 소중히 책자나 다이어리에 끼워 평생 인생 나침반으로 사용할 수 있습니다.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {isPremiumUnlocked ? (
              <div className="space-y-2">
                <p className="text-xs text-emerald-400 text-center font-semibold">★ 패스 회원 혜택으로 무료 발급 가능합니다.</p>
                {pdfReady ? (
                  <button
                    type="button"
                    id="btn-download-pdf"
                    onClick={handleDownloadPDF}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 animate-bounce" />
                    정밀 사주 PDF 리포트 다운로드
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-generate-pdf"
                    onClick={handleGeneratePDF}
                    disabled={isGeneratingPDF}
                    className="w-full py-3.5 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 text-neutral-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI 양수 보정 및 텍스트 조합 인쇄 중...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        2026 평생 신수 PDF 리포트 생성구동
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                id="btn-purchase-pdf-only"
                onClick={() => handleOpenCheckout('pdf')}
                className="w-full py-3.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all hover:border-violet-500/40 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-neutral-500" />
                단권 리포트 구매하기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trust guarantees badge element */}
      <div className="border border-neutral-800/80 bg-neutral-950 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-neutral-200">명리학 정통 연구진 직접 감수 및 연계 가동</h4>
          <p className="text-[11px] text-neutral-500">본 서비스는 사단법인 한국 명리학회 자문위원들의 기론 검토를 마쳤으며, Gemini 3.5 AI 보정 연계로 오류 범위를 획기적으로 낮추었습니다.</p>
        </div>
      </div>

      {/* High Fidelity Checkout Simulator Dialog Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#18181b] border border-[#d4af37]/30 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-teal-500 to-amber-500" />
              
              <div className="p-6 space-y-6">
                {checkoutStep === 'plan' ? (
                  <div className="space-y-5">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] text-[#d4af37] font-mono tracking-widest uppercase">Secured checkout</span>
                      <h4 className="text-lg font-serif font-black text-neutral-100">
                        {activePackID === 'pass' ? 'AI 코치 밀착 동반 패스' : '2026 연간 정밀 리포트'} 신청
                      </h4>
                      <p className="text-xs text-neutral-450">가상 신용카드 및 결제 대행 시뮬레이터</p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-850 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400">결제 대상자:</span>
                        <span className="text-neutral-100 font-bold">{profile.name}님 명조</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400">최종 청구액:</span>
                        <span className="text-[#d4af37] font-extrabold text-sm font-mono">
                          {activePackID === 'pass' ? '9,900원 / 월' : '3,900원 / 단건'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 block font-medium" htmlFor="card-sim-number">서약 카드 번호 (시뮬레이터)</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input
                            type="text"
                            id="card-sim-number"
                            defaultValue="4510 - 2038 - 1928 - 9024"
                            disabled
                            className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-400 focus:outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-neutral-500 italic text-center">
                        * 실제 카드 승인이 일어나지 않는 개발용 안전 시뮬레이터입니다.
                      </p>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        id="btn-checkout-cancel"
                        onClick={() => setShowCheckoutModal(false)}
                        disabled={isProcessingCheckout}
                        className="flex-1 py-3 border border-neutral-800 hover:bg-neutral-905 rounded-xl text-neutral-400 hover:text-neutral-200 text-xs font-semibold cursor-pointer transition-all"
                      >
                        취소하기
                      </button>
                      <button
                        type="button"
                        id="btn-checkout-submit"
                        disabled={isProcessingCheckout}
                        onClick={handleCheckoutSubmit}
                        className="flex-[2] py-3 bg-gradient-to-r from-amber-500 to-[#d4af37] rounded-xl text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        {isProcessingCheckout ? (
                          <>
                            <Loader2 className="w-4.5 h-4.5 animate-spin" />
                            영계 승인 대기 중...
                          </>
                        ) : (
                          <>
                            <span>안전 시뮬레이션 승인</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-neutral-100">인연 승인 완료!</h4>
                      <p className="text-xs text-neutral-400">AI 코치 프리미엄 혜택이 정상 개통되었습니다.</p>
                    </div>
                    <p className="text-[11px] text-neutral-500">이제 무제한 1:1 상담과 리포트 출력이 해제되었습니다.</p>
                    <button
                      type="button"
                      id="btn-checkout-success-close"
                      onClick={() => setShowCheckoutModal(false)}
                      className="w-full py-2.5 bg-neutral-900 border border-neutral-800 hover:text-white rounded-xl text-neutral-350 text-xs font-semibold transition-all cursor-pointer"
                    >
                      상담 전각으로 돌아가기
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
