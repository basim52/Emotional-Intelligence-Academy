import { 
  BookHeart, 
  Plus, 
  Calendar, 
  Trash2, 
  Sparkles, 
  Smile, 
  Save, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  CheckCircle,
  HelpCircle,
  Award,
  Users
} from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { JournalEntry } from "../types";

interface WeeklyReview {
  id: string;
  date: string;
  reflection: string;
  habitFocus: string;
  signature: string;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);

  // New entry fields
  const [mood, setMood] = useState("🧘");
  const [triggerTag, setTriggerTag] = useState("spouse");
  const [situation, setSituation] = useState("");
  const [reaction, setReaction] = useState("");
  const [reflection, setReflection] = useState("");
  const [goalText, setGoalText] = useState("");
  const [goals, setGoals] = useState<string[]>([]);

  // New weekly review fields
  const [weeklyReflection, setWeeklyReflection] = useState("");
  const [weeklyHabitFocus, setWeeklyHabitFocus] = useState("ممارسة تنفس الـ 5 ثوانٍ الصامت قبل الرد");
  const [userNameSignature, setUserNameSignature] = useState("");

  const triggerTags = [
    { key: "children", label: "عناد الأطفال والضغط التربوي 🎒", color: "bg-rose-500", border: "border-rose-200", text: "text-rose-700 bg-rose-50" },
    { key: "spouse", label: "النقد وتشنج الشريك 👥", color: "bg-amber-500", border: "border-amber-200", text: "text-amber-700 bg-amber-50" },
    { key: "work", label: "ضغوط العمل والإرهاق المهني 💼", color: "bg-cyan-500", border: "border-cyan-200", text: "text-cyan-700 bg-cyan-50" },
    { key: "money", label: "الأزمات والنزاعات المالية 💳", color: "bg-emerald-500", border: "border-emerald-200", text: "text-emerald-700 bg-emerald-50" },
    { key: "silent", label: "الصمت والانسحاب العاطفي 🤐", color: "bg-purple-500", border: "border-purple-200", text: "text-purple-700 bg-purple-50" },
    { key: "other", label: "مثيرات أخرى عامة 🔘", color: "bg-slate-400", border: "border-slate-200", text: "text-slate-700 bg-slate-50" }
  ];

  const moods = [
    { emoji: "🧘", label: "متزن وهادئ", weight: 100 },
    { emoji: "😊", label: "سعيد ومرتاح", weight: 85 },
    { emoji: "😔", label: "حزين أو محبط", weight: 50 },
    { emoji: "🤯", label: "مضغوط بشدة", weight: 30 },
    { emoji: "😠", label: "غاضب وثائر", weight: 10 }
  ];

  const habitOptions = [
    "ممارسة تنفس الـ 5 ثوانٍ الصامت قبل الرد",
    "تجنب استخدام 'لغة الأنت' الهجومية والتركيز على 'لغة الأنا'",
    "النزول لمستوى الطفل واحتضانه قبل صياغة القوانين",
    "فصل مشاكل العمل عند عتبة المنزل وتخصيص ربع ساعة تفريغ",
    "الامتناع عن الصمت العقابي والتعبير بوضوح: 'أنا متعب وسأتحدث لاحقاً'"
  ];

  // Load entries and weekly reviews from localStorage on mount
  useEffect(() => {
    const cachedEntries = localStorage.getItem("ei_family_journal");
    if (cachedEntries) {
      try {
        setEntries(JSON.parse(cachedEntries));
      } catch (e) {
        console.error("Error parsing journal cache", e);
      }
    } else {
      // Seed initial sample entry
      const sampleEntry: JournalEntry = {
        id: "sample_1",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString("ar-EG"),
        mood: "😊",
        triggerTag: "spouse",
        situation: "عاد زوجي من العمل مجهداً للغاية وبدأ ينتقد ترتيب صالة المعيشة.",
        reaction: "بدلاً من الرد الغاضب المعتاد، تنفست بعمق لمدة 5 ثوانٍ، وقلت: «يبدو يومك متعباً يا حبيبي، ارتح الآن وسنرتب الأمور لاحقاً سوياً».",
        reflection: "هدأت نبرة زوجي فوراً واعتذر عن توتره المباغت وحضن الأطفال. النتيجة كانت استقرار هادئ بالبيت بدلاً من نزاع دام يوماً كاملاً.",
        goals: ["عدم المقاطعة أثناء الشكوى", "ممارسة تنفس الـ 5 ثوانٍ الصامت"]
      };
      setEntries([sampleEntry]);
      localStorage.setItem("ei_family_journal", JSON.stringify([sampleEntry]));
    }

    const cachedReviews = localStorage.getItem("ei_weekly_reviews");
    if (cachedReviews) {
      try {
        setWeeklyReviews(JSON.parse(cachedReviews));
      } catch (e) {
        console.error("Error parsing weekly reviews cache", e);
      }
    } else {
      // Seed initial sample weekly review
      const sampleReview: WeeklyReview = {
        id: "review_1",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString("ar-EG"),
        reflection: "اكتشفت أن ذروة انفعالاتي تحدث أيام الأحد بسبب تراكم الأعباء المهنية. تفادي النقاش المالي مساءً خفف التوتر بنسبة 60%.",
        habitFocus: "ممارسة تنفس الـ 5 ثوانٍ الصامت قبل الرد",
        signature: "باسم"
      };
      setWeeklyReviews([sampleReview]);
      localStorage.setItem("ei_weekly_reviews", JSON.stringify([sampleReview]));
    }
  }, []);

  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem("ei_family_journal", JSON.stringify(updated));
  };

  const saveWeeklyReviews = (updated: WeeklyReview[]) => {
    setWeeklyReviews(updated);
    localStorage.setItem("ei_weekly_reviews", JSON.stringify(updated));
  };

  const handleAddGoal = () => {
    if (goalText.trim()) {
      setGoals([...goals, goalText.trim()]);
      setGoalText("");
    }
  };

  const handleRemoveGoal = (idxToRem: number) => {
    setGoals(goals.filter((_, i) => i !== idxToRem));
  };

  const handleSaveEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !reaction.trim()) {
      alert("الرجاء ملء حقول الموقف والرد السلوكي الأساسية.");
      return;
    }

    const newEntry: JournalEntry = {
      id: "entry_" + Date.now(),
      date: new Date().toLocaleDateString("ar-EG"),
      mood,
      triggerTag,
      situation: situation.trim(),
      reaction: reaction.trim(),
      reflection: reflection.trim(),
      goals: goals.length > 0 ? goals : ["ضبط الهدوء الانفعالي"]
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);

    // Reset fields
    setMood("🧘");
    setTriggerTag("spouse");
    setSituation("");
    setReaction("");
    setReflection("");
    setGoals([]);
    setGoalText("");
    setShowAddForm(false);
  };

  const handleSaveWeeklyReview = (e: FormEvent) => {
    e.preventDefault();
    if (!weeklyReflection.trim() || !userNameSignature.trim()) {
      alert("الرجاء كتابة الفحص التحليلي والتوقيع لتأكيد المسؤولية والالتزام.");
      return;
    }

    const newReview: WeeklyReview = {
      id: "weekly_rev_" + Date.now(),
      date: new Date().toLocaleDateString("ar-EG"),
      reflection: weeklyReflection.trim(),
      habitFocus: weeklyHabitFocus,
      signature: userNameSignature.trim()
    };

    const updated = [newReview, ...weeklyReviews];
    saveWeeklyReviews(updated);

    // Reset fields
    setWeeklyReflection("");
    setUserNameSignature("");
    setShowWeeklyForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا التسجيل اليومي؟")) {
      const updated = entries.filter((e) => e.id !== id);
      saveEntries(updated);
    }
  };

  const handleDeleteWeeklyReview = (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف مراجعة هذا الأسبوع؟")) {
      const updated = weeklyReviews.filter((r) => r.id !== id);
      saveWeeklyReviews(updated);
    }
  };

  // --- Dynamic Psychometrics Calculations ---

  // Calculated EQ Stability score (0 to 100) based on weighted average of moods
  const calculateStabilityIndex = () => {
    if (entries.length === 0) return 85; // Default healthy baseline
    let totalWeight = 0;
    entries.forEach((e) => {
      const foundMood = moods.find((m) => m.emoji === e.mood);
      totalWeight += foundMood ? foundMood.weight : 80;
    });
    return Math.round(totalWeight / entries.length);
  };

  // Stress Trigger Tag frequencies calculation
  const getTriggerStats = () => {
    const counts: Record<string, number> = {};
    triggerTags.forEach((t) => { counts[t.key] = 0; });

    let maxCount = 0;
    entries.forEach((e) => {
      const tag = e.triggerTag || "other";
      counts[tag] = (counts[tag] || 0) + 1;
      if (counts[tag] > maxCount) maxCount = counts[tag];
    });

    return triggerTags.map((t) => {
      const qty = counts[t.key] || 0;
      const pct = entries.length > 0 ? Math.round((qty / entries.length) * 100) : 0;
      return {
        ...t,
        count: qty,
        percentage: pct
      };
    }).sort((a, b) => b.count - a.count);
  };

  // Mood occurrences counts
  const getMoodCounts = () => {
    const counts: Record<string, number> = {};
    moods.forEach((m) => { counts[m.emoji] = 0; });
    entries.forEach((e) => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    return moods.map((m) => ({
      ...m,
      count: counts[m.emoji] || 0
    }));
  };

  const stabilityScore = calculateStabilityIndex();
  const triggerStats = getTriggerStats();
  const moodStats = getMoodCounts();

  // Find most frequent trigger to offer advice
  const topTrigger = triggerStats[0]?.count > 0 ? triggerStats[0] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-right dir-rtl">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-3 bg-teal-50 text-[#1e3b40] rounded-2xl border border-teal-100">
          <BookHeart className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1e3b40] font-tajawal">
          مفكرة الوعي الوجداني والمحاسبة المعرفية المستمرة
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          تطبيق الممارسة الميدانية للحقيبة التدريبية: تتبّع حالتك المزاجية اليومية، وحلّل المحفزات المتكررة لتوتر غضبك، وشارك في الفحص والمحاسبة الأسبوعية لترسيخ الرفق الأسري والتواصل اللين.
        </p>
      </div>

      {/* Grid: Stats and Analysis (Continuous Psychometrics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Dynamic Card 1: EQ Stability Index Gauge */}
        <div className="bg-gradient-to-br from-[#1e3b40] to-[#2c585e] text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 w-44 h-44 bg-teal-600 opacity-10 rounded-full blur-2xl"></div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-white/10 rounded-xl">
                <Activity className="w-5 h-5 text-[#d4a373]" />
              </span>
              <span className="text-xs font-bold text-gray-300">القياس النفسي المستمر (Continuous Psychometrics)</span>
            </div>
            <h3 className="text-lg font-bold">مؤشر استقرار التوازن العاطفي</h3>
            <p className="text-xs text-gray-300 mt-1">يُقاس تلقائياً بناءً على تقاطعات أمزجتك المسجلة مؤخراً.</p>
          </div>

          <div className="my-6 flex justify-center items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#132629]/40"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#d4a373] transition-all duration-1000"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * stabilityScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-[#d4a373] leading-none">{stabilityScore}%</span>
                <span className="text-[10px] text-gray-200 mt-1">توازن وهدوء</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-black/20 rounded-2xl p-3 text-xs leading-relaxed text-yellow-100 border border-white/5">
              💡 {stabilityScore >= 75 
                ? "مستوى رائع من الثبات العاطفي وبسط الأمان بالبيئة المنزلية. استمر!" 
                : "تنبيه: مؤشرات الانفعال متذبذبة مؤخراً. ننصحك باستخدام لغة الأنا والتنفس لرفع الاتزان."
              }
            </div>
          </div>
        </div>

        {/* Dynamic Card 2: Stress Triggers Heatmap */}
        <div className="bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-gray-400">تقصي المسببات الذكية للتوتر</span>
            </div>
            <h3 className="text-base font-extrabold text-[#1e3b40]">خريطة المحفزات المتكررة (Triggers Heatmap)</h3>
            <p className="text-xs text-gray-500 mt-0.5">يكشف نقاط استجاباتك المثارة الأكثر تسجيلاً.</p>
          </div>

          <div className="my-4 space-y-3">
            {triggerStats.map((tag) => (
              <div key={tag.key} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-700">{tag.label}</span>
                  <span className="text-[#1e3b40] font-mono">{tag.count} تسجيل ({tag.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${tag.color}`}
                    style={{ width: `${tag.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] leading-relaxed text-gray-600 bg-[#fffef9] border border-dashed border-[#e0dcd2] p-2.5 rounded-xl">
            {topTrigger ? (
              <span>
                المحفز الأكبر لتوترك هو <strong>{topTrigger.label}</strong>. لتفادي تمدد التشنج، مارس مهارة التسمية الفعالة والتعاطف المشعري.
              </span>
            ) : (
              <span>ابدأ بتدوين مواقفك اليوم لتكتشف مسببات توترك الأوتوماتيكية بالتحليل الذاتي.</span>
            )}
          </div>
        </div>

        {/* Dynamic Card 3: Continuous Action Tracker & Insights */}
        <div className="bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-gray-400">الممارسة الميدانية والمحاسبية</span>
            </div>
            <h3 className="text-base font-extrabold text-[#1e3b40]">إحصائيات تفريغ الانفعال النشط</h3>
            <p className="text-xs text-gray-500 mt-0.5">مدى التزامك وتجاوبك مع التدريب اليومي والمحاسبة الذاتية.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-3 text-center">
            <div className="bg-[#faf8f5] p-3 rounded-2xl border border-gray-150">
              <span className="text-2xl block text-[#1e3b40] font-mono font-black">{entries.length}</span>
              <span className="text-[10px] text-gray-500 font-bold">تأمل وجداني مسجل</span>
            </div>
            <div className="bg-[#faf8f5] p-3 rounded-2xl border border-gray-150">
              <span className="text-2xl block text-[#1e3b40] font-mono font-black">{weeklyReviews.length}</span>
              <span className="text-[10px] text-gray-500 font-bold">مراجعة أسبوعية عائلية</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-3">
            <h4 className="text-xs font-bold text-gray-700">توزيع أمزجة التدوين المأخوذة:</h4>
            <div className="flex gap-2 justify-between flex-wrap">
              {moodStats.map((ms) => (
                <div key={ms.emoji} className="flex flex-col items-center bg-slate-50 border border-slate-150 px-2 py-1 rounded-xl min-w-[50px] shadow-inner">
                  <span className="text-lg">{ms.emoji}</span>
                  <span className="text-[10px] font-extrabold text-[#1e3b40]">{ms.count} مرات</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-gray-500 text-center mt-3">
            🎯 الالتزام بالكتابة والتفريغ يرفع وعيك العصبي المباشر بنسبة تفوق الـ 40%.
          </p>
        </div>

      </div>

      {/* Main Container */}
      <div className="space-y-8">
        
        {/* Actions bar (Add entry / Add weekly checking) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#faf8f5] border border-[#e0dcd2] p-4 rounded-3xl">
          <div className="text-right">
            <h3 className="font-bold text-[#1e3b40]">جرّب تسجيل أفعالك وملاحظاتك الآن</h3>
            <p className="text-xs text-gray-500 mt-1">سجل الموقف الحاضر، أو اعقد المحاسبة الأسبوعية لأسرتك لتنشد التقدم المستمر.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!showAddForm && (
              <button
                onClick={() => { setShowAddForm(true); setShowWeeklyForm(false); }}
                className="bg-[#1e3b40] hover:bg-[#204045] text-white font-extrabold px-5 py-2.5 rounded-full flex items-center gap-1.5 text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" />
                <span>رصد وتأمل انفعال يومي 🧘</span>
              </button>
            )}
            {!showWeeklyForm && (
              <button
                onClick={() => { setShowWeeklyForm(true); setShowAddForm(false); }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-5 py-2.5 rounded-full flex items-center gap-1.5 text-xs shadow-sm transition-all"
              >
                <CheckCircle className="w-4 h-4 text-white" />
                <span>المراجعة والمحاسبة الأسبوعية 📅</span>
              </button>
            )}
          </div>
        </div>

        {/* Form 1: Add Daily Entry */}
        {showAddForm && (
          <div className="bg-white border-2 border-[#d4a373]/30 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fade-in text-right">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1e3b40] flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-[#d4a373]" />
                تسجيل تأمل وجداني لموقف عائلي
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                إلغاء التدوين ×
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-5">
              
              {/* Mood & Trigger Selector (Inline Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mood Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">ما هو مزاجك الغالب العاطفي في هذا الموقف؟</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((m) => (
                      <button
                        type="button"
                        key={m.emoji}
                        onClick={() => setMood(m.emoji)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs transition-all focus:outline-none ${
                          mood === m.emoji
                            ? "bg-[#1e3b40] text-white border-[#1e3b40] shadow"
                            : "bg-slate-50 text-gray-700 border-gray-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-base">{m.emoji}</span>
                        <span className="text-[10px] font-bold">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Stress Trigger Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">ما هو المحفز الأساسي المثير لتوترك؟</label>
                  <select
                    value={triggerTag}
                    onChange={(e) => setTriggerTag(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3b40] p-3 rounded-2xl text-xs font-bold"
                  >
                    {triggerTags.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Situation Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">1. ما الموقف العائلي أو المثير الذي حدث بدقة؟</label>
                <textarea
                  required
                  rows={2}
                  placeholder="مثال: واجهت الشريكة بنقاط القصور المالي للبيت، فاستخدمت نبرة لائمة ومقاطعة صريحة..."
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3b40] p-4 rounded-2xl text-sm leading-relaxed"
                />
              </div>

              {/* My Action Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">2. كيف كانت استجابتك ورد فعلك العاطفي والجسدي لمنع تصاعد الشجار؟</label>
                <textarea
                  required
                  rows={2.5}
                  placeholder="مثال: لجمت رغبتي الفورية بالرد اللائم، تنفست بهدوء 10 ثوانٍ، وقلت بهدوء: 'أتفهم قلقك على مصاريف الأولاد، فلنتعاضد لنقاط الميزانية سوياً'..."
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3b40] p-4 rounded-2xl text-sm leading-relaxed"
                />
              </div>

              {/* Reflections Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">3. الانعكاس والنتيجة المحببة (الانطباع، أثر التغيير، والتعلم):</label>
                <textarea
                  rows={2}
                  placeholder="مثال: تلاشى الصراخ فجأة، وانحنت نبرتها للاعتذار عن الانفعال. أدركت مدى ثقل الصمت الإيجابي بدلاً من كرامات الرد المعاند."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3b40] p-4 rounded-2xl text-sm leading-relaxed"
                />
              </div>

              {/* Interactive Communication Goals Tags input */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <label className="block text-sm font-bold text-gray-700">4. أهداف تواصلية تلتزم بالتدرب عليها لمواجهة هذا المثير لاحقاً:</label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: خفض سرعة الحديث، تطبيق لغة الأنا، احترام الرأي المخالف"
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGoal())}
                    className="flex-1 bg-[#faf8f5] border border-[#e0dcd2] focus:bg-white focus:outline-none px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3b40]"
                  />
                  <button
                    type="button"
                    onClick={handleAddGoal}
                    className="bg-[#1e3b40]/10 hover:bg-[#1e3b40]/20 text-[#1e3b40] font-bold px-4 rounded-xl text-xs flex-shrink-0 transition-colors"
                  >
                    إضافة هدف
                  </button>
                </div>

                {goals.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {goals.map((g, i) => (
                      <span 
                        key={i}
                        className="bg-teal-50 text-teal-700 border border-teal-100 text-xs font-semibold py-1.5 px-3 rounded-full flex items-center gap-1.5"
                      >
                        <span>{g}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveGoal(i)}
                          className="text-teal-700 hover:text-teal-900 font-bold text-sm leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-full text-xs transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#1e3b40] hover:bg-[#204045] text-white font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-4 h-4 text-[#d4a373]" />
                  <span>حفظ تأملات الموقف الوجداني</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Form 2: Add Weekly Accountability Check-In */}
        {showWeeklyForm && (
          <div className="bg-teal-55/10 border-2 border-teal-500/20 bg-teal-50/20 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-fade-in text-right">
            <div className="border-b border-teal-200 pb-3 flex justify-between items-center">
              <h3 className="text-xl font-bold text-teal-800 flex items-center gap-1.5">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                المراجعة الأسبوعية والمحاسبة المعرفية الذاتية (Weekly Audit Setup)
              </h3>
              <button 
                onClick={() => setShowWeeklyForm(false)}
                className="text-teal-500 hover:text-teal-700 text-xs font-bold"
              >
                إلغاء الفحص الأسبوعي ×
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-teal-100 text-xs text-gray-700 leading-relaxed mb-4">
              📌 <strong>عن المحاسبية الأسبوعية (Actionable Accountability):</strong> التدريب الحقيقي هو ما نلتزم برصده وفحصه ذاتياً كل نهاية أسبوع. راجع تدوينات الأيام الفائتة، واكتب ملخص المثيرات وعثرات الضبط التي واجهتك، ثم وقّع التزام السلوكي بالأسبوع الجديد.
            </div>

            <form onSubmit={handleSaveWeeklyReview} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-teal-900">1. ما هو التحليل والتأمل الكلي لمثيرات توترك وعلاجاتك السلوكية هذا الأسبوع؟</label>
                <textarea
                  required
                  rows={3}
                  placeholder="مثال: لاحظت تكرار توتري أيام ضغط العمل مما يجعلني أقل تحملاً لعناد ابني. التزمت بممارسة ربع ساعة من العزلة الصامتة والمشي غسلاً للأعباء قبل الاندماج بالمنزل هدوئاً..."
                  value={weeklyReflection}
                  onChange={(e) => setWeeklyReflection(e.target.value)}
                  className="w-full bg-white border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 p-4 rounded-2xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-teal-900">2. حدد موضع التركيز والنمط السلوكي الوعر للأسبوع القادم:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-semibold text-xs">
                  {habitOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setWeeklyHabitFocus(opt)}
                      className={`text-right p-3 rounded-xl border text-xs transition-colors ${
                        weeklyHabitFocus === opt 
                          ? "bg-teal-600 text-white border-teal-700" 
                          : "bg-white text-gray-700 border-gray-200 hover:bg-teal-50"
                      }`}
                    >
                      ✓ {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-teal-100 pt-4">
                <label className="block text-sm font-bold text-teal-900">3. توقيع المتدرب للالتزام الذاتي والمثابرة بالمنزل:</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    placeholder="اكتب اسمك الثلاثي كعهد شخصي"
                    value={userNameSignature}
                    onChange={(e) => setUserNameSignature(e.target.value)}
                    className="flex-1 bg-white border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 p-3 rounded-2xl text-sm"
                  />
                  <span className="text-xs text-teal-700 font-mono italic whitespace-nowrap">✍️ التوقيع يوثق الالتزام السلوكي</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-teal-100">
                <button
                  type="button"
                  onClick={() => setShowWeeklyForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-full text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 rounded-full text-xs shadow-md transition-colors"
                >
                  إيداع بطاقة المحاسبية والمراجعة السنوية ✍️
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Dynamic Display Grid: List of Daily Entries & Weekly Reviews side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Right Column (Span 7/12): Daily Emotion & Situation Logs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-[#e0dcd2] pb-3 flex justify-between items-center flex-row-reverse">
              <span className="text-xs bg-[#1e3b40]/10 text-[#1e3b40] font-bold px-3 py-1.5 rounded-full font-mono">
                {entries.length} تدوينات مسجلة
              </span>
              <h3 className="font-extrabold text-xl text-[#1e3b40] flex items-center gap-2">
                <Smile className="w-5 h-5 text-[#d4a373]" />
                مذكرات رصد المثير واستجابات الضبط اليومية
              </h3>
            </div>

            {entries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 text-gray-500 font-semibold shadow-inner">
                لا توجد تدوينات بعد. انقر على «رصد وتأمل انفعال يومي» بالأعلى لكتابة وتأمل أول موقف عائلي واعي لك اليوم!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {entries.map((entry) => {
                  const tagInfo = triggerTags.find((t) => t.key === entry.triggerTag) || triggerTags[5];
                  return (
                    <div 
                      key={entry.id}
                      className="bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Entry Top bar */}
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-gray-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="حذف التدوينه"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold">
                            <span>{entry.date}</span>
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span 
                              className="text-lg bg-slate-50 p-1 rounded-xl shadow-inner inline-block leading-none"
                              title={moods.find((m) => m.emoji === entry.mood)?.label || ""}
                            >
                              {entry.mood}
                            </span>
                          </div>
                        </div>

                        {/* Trigger Type Indicator tag */}
                        <div className="flex justify-start">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${tagInfo.text} ${tagInfo.border}`}>
                            {tagInfo.label}
                          </span>
                        </div>

                        {/* Situation */}
                        <div className="space-y-1 text-right">
                          <span className="text-[10px] font-black text-[#d4a373] tracking-widest block uppercase font-tajawal">الموقف الحاصل والمثير للغضب:</span>
                          <p className="text-[#1e3b40] text-xs sm:text-sm font-extrabold leading-relaxed">
                            {entry.situation}
                          </p>
                        </div>

                        {/* Reaction taken */}
                        <div className="space-y-1 text-right bg-[#faf8f5] p-3.5 rounded-2xl border border-dashed border-[#e0dcd2]">
                          <span className="text-[10px] font-black text-teal-800 tracking-widest block uppercase font-tajawal">استجابة الضبط السلوكي لمنع الاحتدام:</span>
                          <p className="text-gray-700 italic text-xs leading-relaxed font-semibold">
                            {entry.reaction}
                          </p>
                        </div>

                        {/* Reflective learned lesson */}
                        {entry.reflection && (
                          <div className="space-y-1 text-right">
                            <span className="text-[10px] font-black text-rose-700 tracking-widest block uppercase font-tajawal">الانعكاس والدرس المستخلص في نضجي:</span>
                            <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                              {entry.reflection}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Active goals tags in footer */}
                      {entry.goals && entry.goals.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-4 mt-4 border-t border-gray-105 justify-start">
                          {entry.goals.map((g, idx) => (
                            <span 
                              key={idx}
                              className="bg-teal-50 text-teal-700 border border-teal-100 text-[9px] font-bold py-0.5 px-2 rounded-full font-mono"
                            >
                              # {g}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Left Column (Span 4/12): Weekly Audits and Accountability Archive */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border-b border-[#e0dcd2] pb-3 flex justify-between items-center flex-row-reverse">
              <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-1 rounded-full font-mono">
                {weeklyReviews.length} أسبوع موثق
              </span>
              <h3 className="font-extrabold text-lg text-teal-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                سجل المراجعة والالتزام الأسبوعي
              </h3>
            </div>

            {weeklyReviews.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-[#e0dcd2] text-gray-400 text-xs">
                لا توجد تقارير محاسبة وحفظ أسبوعية مسجلة بعد. أدرج مراجعتك الأولى من الأعلى لتثبيت تركيز عادتك!
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {weeklyReviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="bg-teal-50/10 border border-teal-200/50 rounded-2xl p-5 shadow-inner space-y-3 relative text-right"
                  >
                    <div className="flex justify-between items-center border-b border-teal-150 pb-2">
                      <button
                        onClick={() => handleDeleteWeeklyReview(rev.id)}
                        className="text-gray-300 hover:text-rose-600 p-1"
                        title="حذف مراجعة الأسبوع"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-teal-600 font-extrabold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        أسبوع: {rev.date}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-teal-800 block">فحص الأسبوع وحصيلة الضبط:</span>
                      <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                        {rev.reflection}
                      </p>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-teal-100">
                      <span className="text-[8px] font-black text-rose-600 block">العادة التواصلية المستهدفة:</span>
                      <p className="text-[11px] text-teal-800 font-extrabold mt-0.5">
                        🎯 {rev.habitFocus}
                      </p>
                    </div>

                    <div className="flex justify-end pt-1 border-t border-teal-100">
                      <span className="text-[9px] text-[#1e3b40]/80 font-serif italic text-left">
                        ✍️ الملتزم الموقّع: <strong>{rev.signature}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
