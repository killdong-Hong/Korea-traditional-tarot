import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header according to guidelines
let ai: GoogleGenAI | null = null;
const geminiKey = process.env.GEMINI_API_KEY;

if (geminiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini SDK loaded successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini SDK:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. The application will use fallback local models.");
}

// Fallback Mock Saju data generator for fallback or testing
function generateFallbackSaju(name: string, gender: string, birthDate: string) {
  const elements = ["목 (Wood)", "화 (Fire)", "토 (Earth)", "금 (Metal)", "수 (Water)"];
  // Simple deterministic generation based on name length or birth date
  const hash = (name.length + birthDate.split("-").reduce((acc, c) => acc + parseInt(c || "0", 10), 0)) % 5;
  const energyMap = [
    { wood: 3, fire: 1, earth: 2, metal: 1, water: 1 },
    { wood: 1, fire: 4, earth: 1, metal: 1, water: 1 },
    { wood: 1, fire: 1, earth: 4, metal: 1, water: 1 },
    { wood: 1, fire: 1, earth: 1, metal: 4, water: 1 },
    { wood: 2, fire: 1, earth: 1, metal: 1, water: 3 },
  ];
  
  const selectedEnergy = energyMap[hash];
  
  return {
    yearPillar: { stem: "丙", branch: "午", stemKorean: "병", branchKorean: "오", element: "화 (Fire)" },
    monthPillar: { stem: "庚", branch: "寅", stemKorean: "경", branchKorean: "인", element: "금 (Metal)" },
    dayPillar: { stem: "戊", branch: "戌", stemKorean: "무", branchKorean: "술", element: "토 (Earth)" },
    hourPillar: { stem: "癸", branch: "亥", stemKorean: "계", branchKorean: "해", element: "수 (Water)" },
    wuXing: selectedEnergy,
    isFallback: true,
    yongShin: elements[(hash + 1) % 5] + " (성장을 돕는 기운)",
    gyeokGuk: "식신격 (진취적이고 창조적인 예술적 능력)",
    characterSummary: `${name}님은 대지(土)의 기운을 가진 '무술일주'로 신뢰감이 있고 묵묵히 주위 사람을 포용하는 온화함과 고집 있는 리더십을 동시에 갖추고 계십니다.`,
    analysis: {
      personality: "인내심과 우직함이 돋보이며 사람들과의 신의를 중요하게 생각합니다. 내면의 주관이 뚜렷하여 한번 맡은 일은 포기하지 않고 끝까지 성취하는 능력이 있습니다.",
      career: "안정적이고 시스템이 잘 갖추어진 전문직이나 연구, 분석 업무 혹은 기술, 행정, 교육 분야에서 큰 성과를 거둘 수 있습니다.",
      wealth: "재산이 서서히 늘어나는 '정재형' 흐름입니다. 투기적인 자금 흐름보다는 문서 자산이나 꾸준한 적립형 투자가 신체적 오행과 어우러져 길합니다.",
      love: "다정다감한 스타일로 상대방을 묵묵히 지원하며 신뢰감을 주는 연애를 지향합니다. 올해는 따뜻하고 소통이 잘 되는 상대를 만나는 연애운이 높습니다."
    },
    message: `${name}님, 스스로의 내면을 믿고 흔들림 없이 나아가신다면 반드시 올 가을 빛나는 성취를 거두시게 될 것입니다.`
  };
}

// 1. Saju custom analysis endpoint
app.post("/api/saju/analyze", async (req, res) => {
  const { name, gender, birthDate, birthTime, calendarType } = req.body;
  if (!name || !gender || !birthDate) {
    return res.status(400).json({ error: "필수 입력값(이름, 성별, 생년월일)이 비어있습니다." });
  }

  if (!ai) {
    // Return graceful fallback saju
    const fallback = generateFallbackSaju(name, gender, birthDate);
    return res.json(fallback);
  }

  try {
    const prompt = `
      사주 명리학 분석기 요청:
      - 대상자 이름: ${name}
      - 성별: ${gender}
      - 생년월일: ${birthDate} (${calendarType || "Solar"}/양력)
      - 태어난 시간: ${birthTime || "모름"}

      명리학 이론에 기반하여 위 조건의 정밀 사주 분석 결과를 JSON 객체로 반환해주세요. 한국어로 작성해야 합니다.
      반드시 아래와 동일한 JSON 키와 타입을 사용해 주세요. (마크다운 포맷이나 추가 텍스트 없이 순수 JSON만 반환해 주세요):
      
      {
        "yearPillar": { "stem": "천간한글/한문", "branch": "지지한글/한문", "stemKorean": "천간한글", "branchKorean": "지지한글", "element": "오행" },
        "monthPillar": { "stem": "천간한글/한문", "branch": "지지한글/한문", "stemKorean": "천간한글", "branchKorean": "지지한글", "element": "오행" },
        "dayPillar": { "stem": "천간한글/한문", "branch": "지지한글/한문", "stemKorean": "천간한글", "branchKorean": "지지한글", "element": "오행" },
        "hourPillar": { "stem": "천간한글/한문", "branch": "지지한글/한문", "stemKorean": "천간한글", "branchKorean": "지지한글", "element": "오행" },
        "wuXing": { "wood": 목개수_숫자, "fire": 화개수_숫자, "earth": 토개수_숫자, "metal": 금개수_숫자, "water": 수개수_숫자 },
        "yongShin": "용신 설명",
        "gyeokGuk": "격국 설명",
        "characterSummary": "일간이나 일주를 중심으로 본 전반적인 강점 및 요약 한 줄",
        "analysis": {
          "personality": "성격 및 내면성향 상세 분석",
          "career": "진로 및 적합 비즈니스/직업 분야 조언",
          "wealth": "평생 재물 흐름 및 자산 관리 조언",
          "love": "애정 유형, 훌륭한 파트너 타입 및 결혼운"
        },
        "message": "코치로서 독자에게 건네는 부드러운 격려 한 마디"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    try {
      const sajuAnalysis = JSON.parse(text.trim());
      res.json({ ...sajuAnalysis, isFallback: false });
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", text, parseError);
      res.json(generateFallbackSaju(name, gender, birthDate));
    }
  } catch (error) {
    console.error("Gemini Saju API Error:", error);
    res.json(generateFallbackSaju(name, gender, birthDate));
  }
});

// 2. Chat consultation endpoint with special Coach Persona
app.post("/api/saju/chat", async (req, res) => {
  const { messages, sajuData, coachId } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "메시지 기록이 잘못되었습니다." });
  }

  const coachPersonas: Record<string, { name: string, title: string, style: string }> = {
    sonamu: {
      name: "소나무 선생",
      title: "취업/학업/성공 특화 운명 코치",
      style: "진지하고 엄격하지만, 자상한 은사님처럼 구체적인 인생 가이드라인과 혜안을 짚어주는 영적 멘토"
    },
    yeonhwa: {
      name: "연화 선녀",
      title: "연애/결혼/관계 힐링 마스터",
      style: "따뜻하고 공감 능력이 풍부하고 심리학적 관점과 신비한 지혜를 버무려 마음에 깊은 힐링을 주는 스타일"
    },
    daegam: {
      name: "금전 대감",
      title: "재물/사업/투자 컨설턴트",
      style: "현실적이고 위트가 넘치며 냉정할 정도로 부의 흐름과 기회 포착을 날카롭게 지적하는 실전형 책사"
    },
  };

  const coach = coachPersonas[coachId || "sonamu"] || coachPersonas.sonamu;
  const userContext = sajuData 
    ? `사용자 프로필: 이름: ${sajuData.name}, 성별: ${sajuData.gender}, 일간/일주 요약: ${sajuData.characterSummary || "모름"}, 오행 기운 비율 - 목: ${sajuData.wuXing?.wood}, 화: ${sajuData.wuXing?.fire}, 토: ${sajuData.wuXing?.earth}, 금: ${sajuData.wuXing?.metal}, 수: ${sajuData.wuXing?.water}`
    : "사용자 정보가 아직 입력되지 않았습니다. 대화를 시작하기 전 부드럽게 사주 프로필을 생성해 보길 권할 수 있습니다.";

  if (!ai) {
    // Mock simulation response
    const lastMessage = messages[messages.length - 1]?.content || "";
    let mockReply = `${coach.name} 코치: "${sajuData?.name || "귀한 분"}님, 깊이 있는 말씀 잘 들었습니다. 지금 ${lastMessage.substring(0, 15)}... 에 대해 고민하시는군요. 사주에 비추어 보면, 현재의 고민은 성장을 위한 봄의 시련과 같습니다. 용기를 내어 한 걸음 나아가면 하늘이 도울 것입니다. 자세한 사항은 API 설정 후 더 폭넓게 이어갈 수 있으니 이 점 참작 바랍니다."`;
    return res.json({ text: mockReply });
  }

  try {
    const formattedHistory = messages.map(msg => `${msg.role === 'user' ? '사용자' : coach.name}: ${msg.content}`).join("\n");
    const systemPrompt = `
      당신은 인생 가이드 사주 상담사 '${coach.name}'(${coach.title})입니다.
      ${coach.style} 페르소나를 100% 장착하고, 격조 있는 존칭으로 사용자의 눈높이에 맞춰 조언해 주세요.
      답변은 사주 및 명리학 용어를 적절히 차용한 대화여야 합니다. 
      텍스트는 읽기 쉽게 줄바꿈을 많이 사용하며 길이는 250자 전후로 아늑하게 작성하세요.
      
      [현재 대화 상태 및 기운]
      ${userContext}
      
      [이전 대화 기록]
      ${formattedHistory}
      
      [지침]
      - 사용자 이름(${sajuData?.name || "인연"})을 자주 불러 다정함을 더하세요.
      - 상담 분과인 '${coach.title}'에 맞춰 가장 전문적이고 특화된 운명 상담을 제공하세요.
      - 마지막 사용자 질문에 적극적으로 호응하며 고민을 깊이 어루만져 주는 따스한 조언을 해 주세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    res.json({ text: response.text || "코치의 기운을 전송하는데 어려움이 발생했습니다. 다시 질문해 주시겠습니까?" });
  } catch (error) {
    console.error("Gemini Chat Saju API Error:", error);
    res.status(500).json({ error: "상담 도중 비전 에러가 발생했습니다." });
  }
});

// 3. Chemistry (Compatibility) analysis endpoint
app.post("/api/saju/chemistry", async (req, res) => {
  const { me, partner } = req.body;
  if (!me || !partner) {
    return res.status(400).json({ error: "본인과 상대방 정보가 모두 필요합니다." });
  }

  if (!ai) {
    // Generate deterministic mock chemistry
    const score = 75 + ((me.name.length + partner.name.length) % 5) * 5;
    return res.json({
      score: score,
      wuXingHarmony: "65% (상생과 상극이 균형을 이루어, 자극을 주면서도 안정감을 가질 수 있는 오행 연계)",
      affinityType: "금상첨화형 (서로에게 없는 오행 성분을 은혜롭게 보완해 주는 상생의 거울)",
      analysis: `${me.name}님과 ${partner.name}님은 오행상 서로 보완적 관계를 형성하고 있습니다. 한쪽이 감정적으로 폭발할 때 다른 한편이 대지처럼 차분하게 품어 주어 부딪침이 줄어들며, 영적인 협동심이 상당히 뛰어난 궁합입니다.`,
      conflictAdvice: `소통이 마를 때 사소한 고집으로 차가운 빙하기가 급격히 찾아올 수 있습니다. 한 번쯤 서운할 때는 즉각적인 반박을 접어두고 '그럴 수 있겠군요'라는 쿠션 언어를 먼저 사용해 보세요.`
    });
  }

  try {
    const prompt = `
      사주 명학 궁합 분석기 요청:
      - 본인 정보: 이름: ${me.name}, 성별: ${me.gender}, 생년월일: ${me.birthDate}, 시간: ${me.birthTime || "모름"}
      - 상대방 정보: 이름: ${partner.name}, 성별: ${partner.gender}, 생년월일: ${partner.birthDate}, 시간: ${partner.birthTime || "모름"}

      두 명의 생년월일과 사주 원국에 내포된 조후, 오행의 균형, 상생상극을 분석하여 궁합 결과를 산정해 주세요. 한국어로 작성하며, 아래 JSON 형식을 100% 지켜주세요:
      
      {
        "score": 0~100 사이의 궁합 점수(숫자만),
        "wuXingHarmony": "두 사주의 오행 조화도 설명 (예: 서로 보완해 주는 목화 상생의 아름다운 균형)",
        "affinityType": "궁합 관계 유형 슬로건 (8글자 이내)",
        "analysis": "궁합 분석 내용 상세 서술 (성격 조화, 성향의 차이점, 일상 행동 패턴 등)",
        "conflictAdvice": "만약 다툼이 발생했을 때 사주를 활용한 특별한 소통 조언 및 솔루션"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse((response.text || "").trim());
    res.json(data);
  } catch (error) {
    console.error("Gemini Chemistry API Error:", error);
    res.json({
      score: 80,
      wuXingHarmony: "72% (오행 보완)",
      affinityType: "호형호제형",
      analysis: "상호 존중 속에서 소중한 성취를 유도해 내는 멋진 인연이자 동반자적 궁합입니다.",
      conflictAdvice: "양보와 솔직한 대화로 언제나 실마리를 찾으시길 조언합니다."
    });
  }
});

// 4. Insights - custom monthly fortune generator
app.post("/api/saju/insights", async (req, res) => {
  const { sajuData } = req.body;
  if (!sajuData) {
    return res.status(400).json({ error: "사주 프로필 분석 정보가 우선적으로 필요합니다." });
  }

  if (!ai) {
    return res.json({
      yearlyForecast: "2026년 병오년(丙午年)은 따뜻한 태양과 불꽃이 대지를 덮치는 정열적인 해입니다. 성급한 투자와 벼락치기의 확장보다는 내면의 자양분을 축적하고 꼼꼼히 문서를 검토하는 정인격/비견격 운세가 도드라집니다. 상반기는 갈등 정리가 이루어지고 하반기부터 눈이 번쩍 뜨일 귀인 운세가 깃들어 한층 고양된 자존감을 확보하게 될 것입니다.",
      monthlyScores: [65, 70, 55, 80, 85, 90, 75, 60, 85, 95, 70, 75]
    });
  }

  try {
    const prompt = `
      사주 기반의 2026년 일년 신수 및 월별 조수 분석기:
      - 사용자 사주 특성 요약: ${sajuData.characterSummary || "일반 사주"}
      - 오행 점수 - 목: ${sajuData.wuXing?.wood}, 화: ${sajuData.wuXing?.fire}, 토: ${sajuData.wuXing?.earth}, 금: ${sajuData.wuXing?.metal}, 수: ${sajuData.wuXing?.water}

      이 조건의 사람을 대상으로 2026년 병오년 전체 정밀 대운 분석 텍스트와, 1월부터 12월까지 각 월별 인생 종합 지수 (0에서 100 사이의 만족 점수 12개)를 산출해 주세요. 한국어로 작성하며 JSON 형식을 지키십시오:
      
      {
        "yearlyForecast": "2026년 신년 총평과 월별 중심 흐름에 대한 따뜻하고 조화로운 멘토식 분석 단락 (300자 이상)",
        "monthlyScores": [1월점수_숫자, 2월점수_숫자, 3월점수_숫자, 4월점수_숫자, 5월점수_숫자, 6월점수_숫자, 7월점수_숫자, 8월점수_숫자, 9월점수_숫자, 10월점수_숫자, 11월점수_숫자, 12월점수_숫자]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse((response.text || "").trim());
    res.json(data);
  } catch (error) {
    console.error("Gemini Insights API Error:", error);
    res.json({
      yearlyForecast: "에러로 인해 표준화된 2026 운세를 제공합니다. 올해는 기백이 웅대하며, 내공을 착실히 키워나간다면 직장과 인생 모두에서 가시적인 번영을 거두는 성숙한 한 해가 될 터이니 희망찬 마음을 간직하십시오.",
      monthlyScores: [70, 75, 60, 80, 85, 90, 70, 65, 80, 90, 75, 80]
    });
  }
});


// Serve static frontend files in production or proxy in dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Saju Coach server online on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start AI Saju Coach server:", err);
});
