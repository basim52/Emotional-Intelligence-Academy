import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  MessageCircle, 
  HelpCircle, 
  Award, 
  ThumbsUp, 
  AlertTriangle, 
  HeartHandshake, 
  ArrowLeft,
  ChevronLeft,
  BookOpen,
  Volume2,
  Trophy,
  Flame,
  ShieldCheck,
  CheckCircle,
  Filter,
  Brain,
  Check
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CaseStudy, SimulationTurn } from "../types";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export default function Simulator() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [turns, setTurns] = useState<SimulationTurn[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "spouse" | "children">("all");
  
  // Custom interactive states for Simulator Technology
  const [inputTone, setInputTone] = useState<"empathetic" | "firm" | "defensive" | "silent">("empathetic");
  const [temperature, setTemperature] = useState<number>(75); 
  const [highScore, setHighScore] = useState<number>(0);
  const [totalSimulations, setTotalSimulations] = useState<number>(0);
  const [showHelpBox, setShowHelpBox] = useState<boolean>(false);
  const [isPlayingId, setIsPlayingId] = useState<number | null>(null);
  
  // Storage for the final analysis results
  const [analysis, setAnalysis] = useState<any | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const cases: (CaseStudy & { initialTemperature: number; hiddenNeed: string })[] = [
    {
      id: "spouse_rage",
      category: "spouse",
      title: "عودة الشريك متوتراً ومجهداً من العمل",
      iconName: "💼",
      problem: "يعود الزوج/الزوجة من يوم عمل طويل ومحبط، ويبدأ بالانفعال واللوم والشكوى العنيفة بسبب عدم ترتيب صالة المعيشة وتأخر تجهيز الغداء.",
      role: "الشريك المجهد سريع الغضب",
      difficulty: "medium",
      initialMessage: "ألا يمكنني العودة لمرة واحدة وأجد هذا البيت مرتباً ومنظماً؟! الفوضى في كل زاوية، وتأخر الطعام مستمر، لقد تعبت من هذا اليوم الشاق والمحبط!",
      initialTemperature: 85,
      hiddenNeed: "التفريغ العاطفي عن ضغوط العمل الخارجية، والحاجة للاعتراف بجهوده وتأمين ملاذ هادئ، بعيداً عن اتهام الأفعال المباشرة."
    },
    {
      id: "child_temper",
      category: "children",
      title: "عناد الطفل المتمرد وصراخه رافضاً النوم والمذاكرة",
      iconName: "🎒",
      problem: "يرفض الابن البالغ من العمر 7 سنوات إطفاء التلفاز والبدء في كتابة الواجب المدرسي ويدخل في نوبة غضب وبكاء هاتفاً: «أكره المدرسة وأنا حر ولن أدرس!»",
      role: "الطفل الثائر الغاضب (7 أعوام)",
      difficulty: "hard",
      initialMessage: "لن أكتب أي حرف اليوم! أكره المدرسة وأكره المذاكرة! أريد اللعب فقط وقضاء الوقت على التلفاز، أرجوكم اتركوني وشأني ولا تتدخلوا في حياتي!",
      initialTemperature: 90,
      hiddenNeed: "الشعور بالإرهاق الزائد أو عطب الجهاز العصبي بعد يوم مدرسي طويل. الصراخ ليس قلة أدب بل إشارة استغاثة لعدم نضج القشرة الجبهية المخية."
    },
    {
      id: "teenager_rebel",
      category: "children",
      title: "عناد المراهق المتمرد بشأن استخدام الأجهزة الذكية",
      iconName: "📱",
      problem: "يرفض الابن المراهق ذو الـ 14 عاماً تسليم هاتفه المحمول في الساعة المحددة تمهيداً للنوم، مجادلاً بعنف وصراخ بأنه محروم من حريته وأن كل زملائه يستمتعون بهواتفهم دون قيود صارمة.",
      role: "الابن المراهق المتمرد (14 عاماً)",
      difficulty: "hard",
      initialMessage: "لماذا تتدخلون في خصوصيتي طوال الوقت؟! هاتفي هو عالمي الوحيد، وكل أصدقائي يبقون متصلين طوال الليل، لست طفلاً صغيراً لتسحبوا مني جوالي في التاسعة مساءً!",
      initialTemperature: 85,
      hiddenNeed: "تأكيد الهوية المستقلة والبحث عن القبول الاجتماعي مع أقرانه. القوة المباشرة تولد انقساماً سحيقاً، بينما يحتاج الحوار لتمكين مدروس لشخصيته."
    },
    {
      id: "spouse_silent_treatment",
      category: "spouse",
      title: "شريك يمارس الصمت العقابي والجفاء المفاجئ",
      iconName: "🤐",
      problem: "يمارس الشريك الصمت العقابي التام لعدة أيام ويرفض التحدث أو تناول الطعام مع بقية الأسرة بسبب نقاش عابر لم يلبِّ رغبة معينة لديه.",
      role: "الشريك المنسحب الصامت غضباً",
      difficulty: "medium",
      initialMessage: "(يتنهد بغضب ويدير وجهه للجهة الأخرى متجنباً التقاء الأعين)... لا فائدة من الكلام معكم، كل شيء مكرر وممل ونقاشكم لا ينتهي إلا بفرض آرائكم فقط.",
      initialTemperature: 80,
      hiddenNeed: "الخوف من الرفض أو العجز عن التعبير الشفاهي السليم عن الاحتياجات. الصمت صراخ داخلي بالخذلان يبحث عن شعور حقيقي بالأمان والاعتراف."
    },
    {
      id: "finance_dispute",
      category: "spouse",
      title: "نزاع الميزانية المالية ومطالب الكماليات",
      iconName: "💳",
      problem: "يرغب أحد الشركاء في السفر لقضاء نزهة ترفيهية مكلفة، بينما يمر الطرف الثاني بضغوط سداد أقساط مديونية البنك وتأمين الإيجار، مما يخلق تحفزاً وجفاء متبادلاً.",
      role: "الشريك الذي يشعر بالحرمان والتقصير",
      difficulty: "medium",
      initialMessage: "كل الأسر والأقارب يسافرون ويستمتعون بحياتهم إلا نحن! كأننا نعيش في سجن من الديون طوال العام، أريد قضاء إجازة مريحة الآن ولا تهمني خطط التوفير المزعجة!",
      initialTemperature: 75,
      hiddenNeed: "الحاجة العميقة للمكافأة وكسر روتين الضغوط المتراكمة، ممزوجاً بالقلق من المقارنات الاجتماعية المحيطة به، وليس الاستنزاف المتعمد للمال."
    }
  ];

  // System Achievements lists for EQ Gym
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "storm_tamer",
      title: "مروّض العواصف 🌪️",
      description: "تمكنت من إتمام تدريب الحوار والأوراق البحثية العاطفية بنتيجة ذكاء تزيد عن 90%.",
      icon: "🌪️",
      unlockedAt: null
    },
    {
      id: "serene_angel",
      title: "ملاك السكينة والرحمة 🕊️",
      description: "قمت بتهدئة الطرف الآخر وتخفيض حرارة غضبه لأقل من 35% في ساحة المحاكاة.",
      icon: "🕊️",
      unlockedAt: null
    },
    {
      id: "ear_listener",
      title: "المصغي الصبور 👂",
      description: "واصلت الحوار البنّاء مع العميل السلوكي لـ 4 جولات متتالية دون استعجال.",
      icon: "👂",
      unlockedAt: null
    },
    {
      id: "firm_wise",
      title: "الحكيم المتزن ⚖️",
      description: "استخدمت النبرة الحازمة والهادئة لحل النزاعات بنتيجة تفوق الـ 80%.",
      icon: "⚖️",
      unlockedAt: null
    }
  ]);

  // Suggestions of pre-formatted responses showing different EQ levels
  const presetSuggestions: Record<string, { label: string; text: string; note: string; tone: "empathetic" | "firm" | "defensive" }[]> = {
    spouse_rage: [
      {
        label: "رد متعاطف ومصغٍ (EQ عالٍ)",
        text: "يبدو أن يومك كان شاقاً مليئاً بالضغوط يا شريكي الغالي. أنا أتفهم تماماً تعبك، دعنا نرتاح الآن ونأخذ قسطاً من الهدوء وسأنظف ونرتب معاً بكل رحابة صدر.",
        note: "يركز على التهدئة وامتصاص ثورة الغضب أولاً.",
        tone: "empathetic"
      },
      {
        label: "رد دفاعي يبرر ويهاجم (EQ منخفض)",
        text: "بدلاً من الصراخ واللوم، كان يجدر بك شكرنا! أنا أيضاً أمضيت يوماً حاراً ومرهقاً في تلبية الطلبات ولم أرتاح للحظة واحدة!",
        note: "يؤدي لتسريع الخصومة وتبادل رمي الاتهامات الحادة.",
        tone: "defensive"
      },
      {
        label: "رد حازم وهادئ يعيد توازن البيت (EQ متوسط)",
        text: "أعلم أنك غاضب ومتعب جداً الآن بسبب ظروف العمل، لكن هذا لا يبرر تشنج لهجتك والصراخ داخل البيت. دعنا نهدأ أولاً ثم نتحدث عما يزعجك.",
        note: "يرسم حدوداً واضحة باحترام ويسعى للهدوء العاطفي.",
        tone: "firm"
      }
    ],
    child_temper: [
      {
        label: "رد هادئ يحتوي مشاعر الطفل (EQ عالٍ)",
        text: "أعلم يا حبيبي البطل أن المذاكرة تبدو ثقيلة ومملة أحياناً وأنك تفضل اللعب والتسلية. أنا هنا معك وأتفهم شعورك بالملل، ما رأيك بحضن دافئ ثم ننهي الأمر معاً؟",
        note: "يحتوي الجهاز العصبي ويسمي المشاعر بحنان.",
        tone: "empathetic"
      },
      {
        label: "رد يعاقب ويهدد بالضرب الصارم (EQ منخفض)",
        text: "إذا لم تغلق التلفاز وتبدأ فوراً في الكتابة، سأسحب منك جميع الألعاب وأحرمك من أصدقائك للأبد! كفاك كسلاً ودلالاً تافهاً!",
        note: "يواري المشاعر بالخوف والمقاومة الشديدة مستقبلاً.",
        tone: "defensive"
      }
    ],
    teenager_rebel: [
      {
        label: "رد متفهم وتشاركي مع المراهق (EQ عالٍ)",
        text: "أتفهم تماماً رغبتك بالبقاء مع أصدقائك يا بني، وأعرف كم هو ممتع الشعور بالاستقلالية. أنا أثق بك وأحترم حوارك، ما رأيك أن نجد حلاً وسطاً نحدده معاً؟",
        note: "يبني جسر شراكة ممتد ويحترم سعيه لتوثيق الاستقلال.",
        tone: "empathetic"
      },
      {
        label: "رد إلزامي متسلط (EQ منخفض)",
        text: "طالما أنك تعيش تحت هذا السقف، فستنفذ جميع الأقوال دون أي فلسفة! سلم هاتفك فوراً وإلا منعت عنك الإنترنت كلياً!",
        note: "يزيد من فجوة الصراع ويجعل المراهق يلجأ للمواربة والكذب.",
        tone: "defensive"
      }
    ],
    spouse_silent_treatment: [
      {
        label: "رد الملاذ الرحيم (EQ عالٍ)",
        text: "أنا أشعر بصمتك يا حبيبي وأعلم غضبك منا في صراحتنا الماضية. أنا موجود بجانبك متى ما أبديت استعدادك للمشاركة والتعبير، فحبنا وسلامك النفسي أهم من أي خلاف.",
        note: "يخفف الضغط، ويصنع فرصة ممتازة للأمان قبل الكلام.",
        tone: "empathetic"
      },
      {
        label: "رد بالتجاهل والمثل بالمثل (EQ منخفض)",
        text: "إذا أردت السكوت فاصمت كما يحلو لك، فلن أترجاك لتتكلم! لست طفلاً صغيراً لأرضيك في كل مرة تتدلل فيها بلا مبرر!",
        note: "يبني جداراً فاصلاً من الجفاء والصقيع البين-زوجي.",
        tone: "defensive"
      }
    ],
    finance_dispute: [
      {
        label: "رد يشاركه القلق والمسؤولية (EQ عالٍ)",
        text: "أنا أتفهم رغبتك بنهاية أسبوع مبهجة وسفرة مريحة تخلصنا من الضغوط، وأتفق معك أننا نحتاج لترفيه. دعنا نتناقش حول خيار سفر ممتع بميزانية اقتصادية لا تراكم مديونيتنا.",
        note: "يصنع فريقاً واحداً لمواجهة المشكلة وازناً بين الترفيه والأرقام.",
        tone: "empathetic"
      },
      {
        label: "رد تسفيهي جاف (EQ منخفض)",
        text: "البيوت تسقط على رؤوسنا من الديون والمسؤوليات، وأنت لا تفكر سوى في الرفاهية والأنانية ومظاهر السفر والرحلات الخاوية!",
        note: "نقد لاذع يبادل التعاطف بالتخوين المالي.",
        tone: "defensive"
      }
    ]
  };

  // Load persistent stats & badges from localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem("sim_badges");
    const savedHighScore = localStorage.getItem("sim_high_score");
    const savedTotal = localStorage.getItem("sim_total_rounds");

    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedTotal) setTotalSimulations(parseInt(savedTotal));
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [turns, isLoading]);

  const handleSelectCase = (cs: any) => {
    setSelectedCase(cs);
    setAnalysis(null);
    setTemperature(cs.initialTemperature);
    setInputTone("empathetic");
    setTurns([
      { role: "model", text: cs.initialMessage, timestamp: new Date().toLocaleTimeString("ar-EG") }
    ]);
  };

  const handleSendMessage = async (customMessage?: string, toneOverride?: "empathetic" | "firm" | "defensive" | "silent") => {
    const textToSend = customMessage || inputText;
    const currentTone = toneOverride || inputTone;

    if (currentTone !== "silent" && !textToSend.trim()) return;
    if (!selectedCase || isLoading) return;

    // Adjust emotional temperature based on chosen tone of delivery
    let tempDelta = 0;
    if (currentTone === "empathetic" || currentTone === "silent") {
      tempDelta = -15; // Calms the partner down
    } else if (currentTone === "firm") {
      tempDelta = -5;  // Moderates or holds it stable
    } else if (currentTone === "defensive") {
      tempDelta = 15;  // Spikes anger
    }

    const nextTemp = Math.max(10, Math.min(100, temperature + tempDelta));
    setTemperature(nextTemp);

    const userMessageText = currentTone === "silent" 
      ? "*(أصمت لبرهة، أنظر بعينين دافئة وأتنفس بعمق طالباً تفهم حالتك)*" 
      : textToSend;

    const userTurn: SimulationTurn = {
      role: "user",
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString("ar-EG")
    };

    const updatedTurns = [...turns, userTurn];
    setTurns(updatedTurns);
    setInputText("");
    setIsLoading(true);

    // Save "serene_angel" tone tracking helper
    let empatheticCount = parseInt(sessionStorage.getItem("empathy_streak") || "0");
    if (currentTone === "empathetic") {
      empatheticCount += 1;
      sessionStorage.setItem("empathy_streak", empatheticCount.toString());
    }

    try {
      const response = await fetch("/api/gemini/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: selectedCase.problem,
          role: selectedCase.role,
          turns: updatedTurns.slice(0, -1),
          userMessage: userMessageText,
          tone: currentTone,
          temperature: nextTemp
        })
      });

      if (!response.ok) {
        throw new Error("فشل الاتصال بخادم المحاكاة الذكي");
      }

      const data = await response.json();
      
      setTurns(prev => [
        ...prev,
        {
          role: "model",
          text: data.text || "...",
          timestamp: new Date().toLocaleTimeString("ar-EG")
        }
      ]);
    } catch (error: any) {
      console.error(error);
      setTurns(prev => [
        ...prev,
        {
          role: "model",
          text: "الرطوبة العاطفية والتخفيف في تواصلك أحدث أثراً، ولكن واجهت المحاكاة بطئاً مؤقتاً في إفراز الجملة. يرجى المتابعة.",
          timestamp: new Date().toLocaleTimeString("ar-EG")
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string, idx: number) => {
    if ("speechSynthesis" in window) {
      if (isPlayingId === idx) {
        window.speechSynthesis.cancel();
        setIsPlayingId(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.95;
      
      const voices = window.speechSynthesis.getVoices();
      // Try to find any Arabic voice
      const arabicVoice = voices.find(v => v.lang.startsWith("ar"));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      
      utterance.onend = () => {
        setIsPlayingId(null);
      };
      
      setIsPlayingId(idx);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("ميزة نطق الحوار السلوكي غير مدعومة بالكامل على متصفحك.");
    }
  };

  const handleTriggerAnalysis = async () => {
    if (!selectedCase || turns.length < 2 || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: selectedCase.problem,
          role: selectedCase.role,
          turns: turns
        })
      });

      if (!response.ok) {
        throw new Error("فشل استدعاء محلل الذكاء العاطفي");
      }

      const data = await response.json();
      setAnalysis(data);

      // Save and update stats
      const nextRoundsCount = totalSimulations + 1;
      setTotalSimulations(nextRoundsCount);
      localStorage.setItem("sim_total_rounds", nextRoundsCount.toString());

      const nextHighScore = Math.max(highScore, data.eqScore || 0);
      setHighScore(nextHighScore);
      localStorage.setItem("sim_high_score", nextHighScore.toString());

      // Evaluate Achievements/Badges criteria
      const updatedBadges = badges.map(b => {
        if (b.unlockedAt) return b;
        
        let shouldUnlock = false;
        if (b.id === "storm_tamer" && data.eqScore >= 90) {
          shouldUnlock = true;
        }
        if (b.id === "serene_angel" && temperature <= 35) {
          shouldUnlock = true;
        }
        if (b.id === "ear_listener" && turns.length >= 8) {
          shouldUnlock = true;
        }
        if (b.id === "firm_wise" && data.eqScore >= 80 && turns.some((t: any) => t.text.includes("حازم"))) {
          shouldUnlock = true;
        }

        if (shouldUnlock) {
          return { ...b, unlockedAt: new Date().toLocaleDateString("ar-EG") };
        }
        return b;
      });

      setBadges(updatedBadges);
      localStorage.setItem("sim_badges", JSON.stringify(updatedBadges));

    } catch (error: any) {
      console.error(error);
      alert("تعذر إجراء المراجعة الوجدانية والتحليل الأسري حالياً. يرجى المحاولة لاحقاً.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedCase(null);
    setTurns([]);
    setAnalysis(null);
    setTemperature(75);
    setShowHelpBox(false);
    sessionStorage.removeItem("empathy_streak");
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingId(null);
  };

  const getTemperatureDetails = (temp: number) => {
    if (temp >= 85) return { text: "💥 غضب عارم وثوران بركاني", color: "bg-rose-600", textCol: "text-rose-600 font-black", desc: "الطرف الآخر معبأ انفعالياً بالكامل، تجنب تبرير خطئك والتهجم نهائياً." };
    if (temp >= 60) return { text: "⚡ انفعال حاد وتحفّز دفاعي", color: "bg-amber-500", textCol: "text-amber-600 font-extrabold", desc: "بدايات تراجع الغضب، ولكنه لا يزال مستعداً للتشنج عند أي تبرير جاف." };
    if (temp >= 35) return { text: "⚖️ تفكير هادئ ومتحفّظ", color: "bg-blue-400", textCol: "text-blue-600 font-bold", desc: "بدأ يلاحظ هدوءك وإصغاءك الممتاز. الصدق والسلام يتسيّدا الأجواء." };
    return { text: "🕊️ انسجام وود عاطفي مرن", color: "bg-emerald-500", textCol: "text-emerald-600 font-black", desc: "انسجم تماماً مع نبرتك العاطفية، ولديه تفاهم ورغبة في المصارحة بنضج." };
  };

  const tempDetails = getTemperatureDetails(temperature);
  const filteredCases = activeCategory === "all" ? cases : cases.filter(c => c.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* 1. Header with Gamification Highscores */}
      {!selectedCase && (
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex p-3 bg-[#d4a373]/10 text-[#d4a373] rounded-3xl animate-bounce-slow">
            <Brain className="w-9 h-9 text-[#d4a373]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1e3b40] font-tajawal tracking-tight">
            مُحاكاة المواقف الوجدانية والحوار الأسري الذكي 
          </h1>
          <p className="text-gray-650 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed leading-medium">
            مساحة تدريبية تفاعلية تمهد لك تنمية استجابتك السلوكية في الأوقات الساخنة. تحدّث مع شريكك أو ذريتك بنبرات ومسارات تفاعلية لامتصاص توترهم، ثم أحرز شهاداتك وتقاريرك العاطفية.
          </p>

          {/* Persistent Stats Panel in selection screen */}
          <div className="max-w-md mx-auto grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white border border-[#e0dcd2] p-4 rounded-2xl flex items-center gap-3.5 shadow-xs text-right">
              <div className="p-2.5 bg-amber-50 text-[#d4a373] rounded-xl">
                <Trophy className="w-5 h-5 text-[#d4a373]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-gray-400 font-bold block">أعلى مستوى ذكاء</span>
                <span className="text-lg font-black text-[#1e3b40] font-mono">{highScore}%</span>
              </div>
            </div>
            <div className="bg-white border border-[#e0dcd2] p-4 rounded-2xl flex items-center gap-3.5 shadow-xs text-right">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <Flame className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-gray-400 font-bold block">إجمالي مجالس التدريب</span>
                <span className="text-lg font-black text-[#1e3b40] font-mono">{totalSimulations} مؤشرات</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Scene Selection Directory Screen */}
      {!selectedCase && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Category Selector Tabs */}
          <div className="flex justify-center items-center gap-2 border-b border-[#e0dcd2] pb-4 max-w-md mx-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-1 text-center py-2 px-4 rounded-full text-xs font-black transition-all ${
                activeCategory === "all" 
                  ? "bg-[#1e3b40] text-white shadow" 
                  : "bg-white border border-[#e0dcd2] text-gray-600 hover:text-[#1e3b40]"
              }`}
            >
              🌐 الكل ({cases.length})
            </button>
            <button
              onClick={() => setActiveCategory("spouse")}
              className={`flex-1 text-center py-2 px-4 rounded-full text-xs font-black transition-all ${
                activeCategory === "spouse" 
                  ? "bg-[#1e3b40] text-white shadow" 
                  : "bg-white border border-[#e0dcd2] text-gray-600 hover:text-[#1e3b40]"
              }`}
            >
              💑 الزوج والشركاء
            </button>
            <button
              onClick={() => setActiveCategory("children")}
              className={`flex-1 text-center py-2 px-4 rounded-full text-xs font-black transition-all ${
                activeCategory === "children" 
                  ? "bg-[#1e3b40] text-white shadow" 
                  : "bg-white border border-[#e0dcd2] text-gray-600 hover:text-[#1e3b40]"
              }`}
            >
              👶 التربية والطفل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((cs) => (
              <div 
                key={cs.id}
                className="bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                onClick={() => handleSelectCase(cs)}
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-[#1e3b40]/10 group-hover:bg-[#d4a373] transition-colors"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start pl-2">
                    <span className="text-4xl">{cs.iconName}</span>
                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${
                      cs.difficulty === "hard" ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      درجة الصعوبة: {cs.difficulty === "hard" ? "عالية 🔥" : "متوسطة ⚡"}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#1e3b40] group-hover:text-[#d4a373] transition-colors leading-relaxed">
                    {cs.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 leading-relaxed min-h-[48px] line-clamp-3">
                    {cs.problem}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#1e3b40] pl-2">
                  <span>دور الطرف الآخر: <strong className="text-[#d4a373]">{cs.role}</strong></span>
                  <ChevronLeft className="w-4 h-4 text-[#d4a373] group-hover:translate-x-[-4px] transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Gamified Achievements Showcase on Selection Screen */}
          <div className="bg-white border border-[#e0dcd2] rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-[#1e3b40] flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-[#d4a373]" />
              أوسمة ونياشين التدريب العائلي المحققة ({badges.filter(b => b.unlockedAt).length} من {badges.length})
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              بناء مهارات الذكاء العاطفي يتجلى عند حصولك على الأوسمة الفخرية أثناء إدارتك للخلافات الساخنة بذكاء عالي.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((b) => (
                <div 
                  key={b.id}
                  className={`p-4 rounded-2xl border text-right space-y-2 transition-all relative ${
                    b.unlockedAt 
                      ? "bg-gradient-to-br from-emerald-50/40 to-slate-50 border-emerald-300 ring-2 ring-emerald-500/5" 
                      : "bg-gray-50/50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-3xl filter drop-shadow-xs">{b.icon}</span>
                    {b.unlockedAt ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                        مكتمل ✓
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[9px] font-bold">مغلق 🔒</span>
                    )}
                  </div>
                  <h4 className="text-xs font-extrabold text-[#1e3b40] pt-1">{b.title}</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{b.description}</p>
                  
                  {b.unlockedAt && (
                    <div className="text-[8px] text-emerald-700 font-mono text-left pt-1">
                      تاريخ الفتح: {b.unlockedAt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Simulator Workspace Screen */}
      {selectedCase && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in relative z-10">
          
          {/* Left Panel: Expert Cues, Help Box, and final Analysis (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Back Button */}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-black text-gray-600 bg-white border border-[#e0dcd2] shadow-xs hover:bg-gray-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة لاختيار سيناريو آخر</span>
            </button>

            {/* Case Info with Diagnostic hidden need */}
            <div className="bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-xs space-y-4 text-right">
              <div className="flex justify-between items-center">
                <span className="text-3xl block">{selectedCase.iconName}</span>
                <span className="text-[10px] bg-[#1e3b40]/5 font-black text-[#1e3b40] px-3.5 py-1 rounded-full uppercase">
                   {selectedCase.category === "spouse" ? "علاقات زوجية" : "مواقف تربوية"}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#1e3b40]">{selectedCase.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed pr-3 border-r-2 border-[#d4a373]">
                {selectedCase.problem}
              </p>

              {/* Toggleable psychological hidden need */}
              <div className="pt-2">
                <button
                  onClick={() => setShowHelpBox(!showHelpBox)}
                  className="text-xs font-extrabold text-[#d4a373] hover:text-[#c49363] underline flex items-center gap-1 cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5" />
                  {showHelpBox ? "إخفاء التحليل النفسي الكامن للموقف" : "كشف الدافع النفسي العميق خلف السلوك 💡"}
                </button>

                {showHelpBox && (
                  <div className="mt-3 p-3.5 bg-amber-50/50 border border-[#d4a373]/30 rounded-2xl text-xs text-gray-700 leading-relaxed animate-fade-in">
                    <strong className="text-[#1e3b40] block mb-1">الاحتياج غير الملبى خلف الغضب:</strong>
                    {selectedCase.hiddenNeed}
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Live Barometer Indicator */}
            {!analysis && (
              <div className="bg-white border border-[#e0dcd2] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${tempDetails.textCol}`}>{tempDetails.text}</span>
                  <h4 className="font-bold text-[#1e3b40] text-xs flex items-center gap-1">
                    <Flame className="w-4 h-4 text-[#d4a373]" />
                    مؤشر احتقان وغضب الطرف الآخر: {temperature}%
                  </h4>
                </div>

                {/* Barometer heat track */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full ${tempDetails.color} transition-all duration-700 rounded-full`}
                    style={{ width: `${temperature}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-gray-550 leading-relaxed leading-medium text-right bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                  {tempDetails.desc}
                </p>
              </div>
            )}

            {/* Expert Cues panel */}
            {!analysis && (
              <div className="bg-gradient-to-br from-[#1e3b40] to-[#25494d] text-white rounded-3xl p-6 shadow space-y-4">
                <h4 className="font-extrabold text-sm text-[#d4a373] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#d4a373]" />
                  دليل المحاكاة والاستجابة للغضب:
                </h4>
                <ul className="space-y-3.5 text-xs text-gray-100 leading-relaxed pr-1 text-right">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#d4a373] text-sm line-none">•</span>
                    <span>استخدم **محدد نبرة الحوار** بالأسفل لتحديد طريقتك في التسليم وهدوء لسانك.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#d4a373] text-sm line-none">•</span>
                    <span>نبرات الحنو تقلل الغضب تدريجياً، بينما الدفاع السريع يجعل الطرف الآخر يشتعل انفعالاً.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#d4a373] text-sm line-none">•</span>
                    <span>عند تبادل جملتين، يمكنك استدعاء **التقييم الذكي التلقائي للذكاء العاطفي** بالكامل.</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Comprehensive AI EQ Audit Analysis results */}
            {analysis && (
              <div className="bg-[#fffef9] border-2 border-emerald-500/20 rounded-3xl p-6 shadow-md space-y-5 text-right animate-fade-in">
                
                <div className="border-b border-gray-150 pb-3 flex justify-between items-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Award className="w-3.5 h-3.5 text-[#d4a373]" />
                    رصد الخبير السلوكي
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-[#1e3b40]">تقرير الذكاء العاطفي المتكامل</h4>
                </div>

                {/* Score and Empathy level */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 p-4 rounded-2xl text-center border border-emerald-100 space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">درجة الذكاء العاطفي</span>
                    <span className="text-2xl font-black text-emerald-800 font-mono">{analysis.eqScore} / 100</span>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-2xl text-center border border-amber-100 space-y-1 justify-center flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">مستواك في التعاطف</span>
                    <span className="text-xs font-black text-amber-800 mt-1 block">{analysis.empathyLevel}</span>
                  </div>
                </div>

                {/* Strengths */}
                {analysis.strengths && analysis.strengths.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <ThumbsUp className="w-4 h-4 text-emerald-600" />
                      <span>مهارات تواصلية أحسنتها:</span>
                    </div>
                    <ul className="text-xs text-gray-650 space-y-2 pr-4 list-disc marker:text-emerald-500 leading-relaxed">
                      {analysis.strengths.map((st: string, i: number) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gaps */}
                {analysis.gaps && analysis.gaps.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>ثغرات أو هفوات وقعت فيها:</span>
                    </div>
                    <ul className="text-xs text-gray-650 space-y-2 pr-4 list-disc marker:text-rose-450 leading-relaxed">
                      {analysis.gaps.map((gp: string, i: number) => (
                        <li key={i}>{gp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Better wording suggestion */}
                {analysis.betterWording && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 space-y-1.5 text-sm">
                    <span className="font-bold text-xs text-[#d4a373] block">صياغة بديلة ناضجة عاطفياً:</span>
                    <p className="text-xs sm:text-sm text-gray-750 italic font-medium leading-relaxed">
                      «{analysis.betterWording}»
                    </p>
                  </div>
                )}

                {/* Psychologist professional Advice */}
                {analysis.generalAdvice && (
                  <div className="bg-[#1e3b40]/5 p-4 rounded-2xl border border-[#1e3b40]/10 space-y-1.5 text-right">
                    <span className="font-bold text-xs text-[#1e3b40] block flex items-center gap-1">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#d4a373]" />
                      توجيه الاستشاري الأسري الذهبي:
                    </span>
                    <p className="text-xs text-gray-650 leading-relaxed">
                      {analysis.generalAdvice}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setAnalysis(null)}
                  className="w-full text-center py-2.5 rounded-full text-xs font-black text-gray-500 border border-gray-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  متابعة وتحديث الحوار الحالي
                </button>

              </div>
            )}

          </div>

          {/* Right Panel: Active Chat Workspace container (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-white border border-[#e0dcd2] rounded-3xl shadow-xs overflow-hidden flex flex-col h-[550px]">
              
              {/* Chat Header showing partner info */}
              <div className="bg-slate-50 px-6 py-4 border-b border-[#e0dcd2] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-gray-500">مستوى الغضب الحالي: {temperature}%</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#1e3b40] text-sm">محاكاة الحوار العائلي الساخن</h4>
                </div>
              </div>

              {/* Chat log messages container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fffefc]">
                {turns.map((t, idx) => {
                  const isUser = t.role === "user";
                  return (
                    <div 
                      key={idx}
                      className={`flex ${isUser ? "justify-start" : "justify-end"} animate-fade-in`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-xs sm:text-sm relative group ${
                          isUser
                            ? "bg-[#d4a373]/15 text-[#1e3b40] border border-[#d4a373]/30 rounded-tr-none font-semibold text-right"
                            : "bg-slate-100 text-[#1e3b40] rounded-tl-none text-right font-medium"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{t.text}</p>
                        
                        {/* Audio TTS Synthesis Button on non-user bubbles */}
                        {!isUser && (
                          <button
                            onClick={() => handleSpeak(t.text, idx)}
                            className={`absolute -bottom-3 left-2 p-1.5 rounded-full border transition-all ${
                              isPlayingId === idx 
                                ? "bg-emerald-600 text-white border-emerald-500 animate-pulse"
                                : "bg-white text-gray-500 border-gray-200 hover:text-[#d4a373] hover:scale-105"
                            }`}
                            title="استمع لصوت الطرف الآخر المنفعل"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <span className="text-[8px] text-[#1e3b40]/40 block mt-1 select-none font-mono text-left">
                          {t.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-end animate-pulse">
                    <div className="bg-slate-100 text-[#1e3b40] rounded-2xl p-4 rounded-tl-none font-medium text-xs">
                      {selectedCase.role} يدرس ردة فعله عاطفياً...
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef}></div>
              </div>

              {/* Chat Input form and submit */}
              <div className="p-4 border-t border-gray-100 bg-slate-50 space-y-3.5">
                
                {/* 1. Dynamic Tone Delivery Selection */}
                <div className="space-y-1.5 text-right">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase">1. اختر نبرة وإلقاء صوتك عاطفياً:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setInputTone("empathetic")}
                      className={`py-2 px-3 rounded-xl text-center text-[11px] font-black transition-all flex items-center justify-center gap-1.5 border ${
                        inputTone === "empathetic"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs ring-2 ring-emerald-500/5"
                          : "bg-white border-gray-200 text-gray-500 hover:text-emerald-700"
                      }`}
                    >
                      <span className="text-xs">🕊️</span>
                      <span>حنونة ومتفهمة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputTone("firm")}
                      className={`py-2 px-3 rounded-xl text-center text-[11px] font-black transition-all flex items-center justify-center gap-1.5 border ${
                        inputTone === "firm"
                          ? "bg-blue-50 text-blue-800 border-blue-300 shadow-xs ring-2 ring-blue-500/5"
                          : "bg-white border-gray-200 text-gray-500 hover:text-blue-700"
                      }`}
                    >
                      <span className="text-xs">⚖️</span>
                      <span>حازمة وهادئة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputTone("defensive")}
                      className={`py-2 px-3 rounded-xl text-center text-[11px] font-black transition-all flex items-center justify-center gap-1.5 border ${
                        inputTone === "defensive"
                          ? "bg-rose-50 text-rose-800 border-rose-300 shadow-xs ring-2 ring-rose-500/5"
                          : "bg-white border-gray-200 text-gray-500 hover:text-rose-700"
                      }`}
                    >
                      <span className="text-xs">⚡</span>
                      <span>حادة ودفاعية</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInputTone("silent");
                        handleSendMessage("", "silent");
                      }}
                      className={`py-2 px-3 rounded-xl text-center text-[11px] font-black transition-all flex items-center justify-center gap-1.5 border ${
                        inputTone === "silent"
                          ? "bg-slate-100 text-slate-800 border-slate-300 shadow-xs ring-2 ring-slate-500/5"
                          : "bg-white border-gray-200 text-gray-500 hover:text-slate-700"
                      }`}
                    >
                      <span className="text-xs">🤐</span>
                      <span>صمت واستماع</span>
                    </button>
                  </div>
                </div>

                {/* 2. Text Input row */}
                <div className="space-y-1 text-right">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase">2. اكتب رسالتك السلوكية:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={isLoading || isAnalyzing || inputTone === "silent"}
                      placeholder={inputTone === "silent" ? "أنت تمارس التدريب على الصمت والتفحص الآن..." : "اكتب ردك اللين والمسؤول بلهجتك اليومية..."}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-grow bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3b40] focus:border-[#d4a373] px-4 py-3 rounded-2xl text-xs sm:text-sm text-right"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={isLoading || isAnalyzing || (inputTone !== "silent" && !inputText.trim())}
                      className="bg-[#1e3b40] hover:bg-[#25494d] text-white p-3 rounded-2xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center flex-shrink-0 cursor-pointer"
                    >
                      <Send className="w-5 h-5 transform rotate-180" />
                    </button>
                  </div>
                </div>

                {/* Audit final score trigger CTA */}
                {turns.length >= 2 && (
                  <div className="flex justify-between items-center gap-2 pt-2 border-t border-gray-200 text-xs">
                    <span className="text-[10px] text-gray-400 font-bold">جولات الحوار المتصلة: {Math.floor(turns.length / 2)}</span>
                    <button
                      onClick={handleTriggerAnalysis}
                      disabled={isAnalyzing}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xs transition-all text-xs cursor-pointer"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>يتم رصد السلوك وحساب الذكاء...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>تحليل سلوكي لردودي وإنهائه</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* Presets suggestions select panel */}
            <div className="bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-2.5 text-right font-black text-[13px] text-[#1e3b40] flex items-center gap-2 flex-row-reverse">
                <Brain className="w-4 h-4 text-[#d4a373]" />
                <span>جرّب ردوداً نموذجية لتلاحظ تغيّر غضب شريكك ومؤشر السلوك:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presetSuggestions[selectedCase.id]?.map((ps, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(ps.text, ps.tone)}
                    disabled={isLoading || isAnalyzing}
                    className="text-right p-4 rounded-2xl border border-gray-200 hover:border-[#d4a373] bg-[#fffef9] hover:bg-[#d4a373]/5 transition-all text-xs space-y-1.5 focus:outline-none cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-extrabold text-[#d4a373] flex items-center gap-1">
                        <span className="text-[10px]">
                          {ps.tone === "empathetic" ? "🕊️" : ps.tone === "firm" ? "⚖️" : "⚡"}
                        </span>
                        <span>{ps.label}</span>
                      </div>
                      <p className="text-gray-700 font-medium leading-relaxed truncate mt-1">{ps.text}</p>
                    </div>
                    <div className="text-[10px] text-gray-400 italic font-bold pt-1">{ps.note}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
