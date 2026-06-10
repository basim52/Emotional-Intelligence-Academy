import { Brain, ArrowRight, RefreshCw, CheckCircle, Award } from "lucide-react";
import { useState } from "react";
import { Question } from "../types";

export default function Assessment() {
  const [currentIdx, setCurrentIdx] = useState<number>(-1); // -1 is start screen
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      category: "regulation",
      text: "عندما يعود شريك حياتك من العمل متوتراً للغاية ويبدأ بتوجيه كلام ضاغط أو لوم على تفصيل بسيط بالمنزل:",
      options: [
        { id: "1a", text: "أغضب فوراً وأرد بنفس النبرة الهجومية للدفاع عن حقي وأذكّره بأخطائه السابقة.", score: 1 },
        { id: "1b", text: "أصمت بجفاء شديد وأنسحب لغرفة أخرى مع ممارسة الجفاء والصمت العقابي لإثبات ضيقي.", score: 3 },
        { id: "1c", text: "أتنفس بعمق، مستذكراً أن توتره خارجي، وأهدئ الموقف بنبرة لطيفة: «يبدو يومك شاقاً، نتحدث بهدوء عند استرخائك».", score: 5 }
      ]
    },
    {
      id: 2,
      category: "empathy",
      text: "حينما يدخل أحد أبنائك في ثورة بكاء وعناد شديد رافضاً أداء طقس يومي كالنوم أو الواجبات المدرسية:",
      options: [
        { id: "2a", text: "أصرخ في وجهه مهدداً بالعقاب الفوري أو الحرمان لإجباره التام على الانصياع دون نقاش.", score: 1 },
        { id: "2b", text: "أشعر بالعجز والضغط الشديد فأتركه يفعل ما يريد تماماً لتجنب الصداع والضجيج.", score: 3 },
        { id: "2c", text: "أنزل لمستوى عينيه، أحتضنه لتهدئة جهازه العصبي، ثم أنطق بمشاعره: «أعلم أنك متعب وتريد الاستمرار باللعب، لكن جسدك يحتاج للراحة».", score: 5 }
      ]
    },
    {
      id: 3,
      category: "communication",
      text: "أثناء نقاش عائلي حاد حول ترتيب الميزانية الشهرية أو وجهة السفر العائلية:",
      options: [
        { id: "3a", text: "أستخدم لغة حاسمة وعبارات تعميمية وهجومية مثل: «أنت دائماً أناني ومسرف» أو «أنتِ لا تفهمين أبداً التحديات».", score: 1 },
        { id: "3b", text: "أتظاهر بالموافقة التامة لإنهاء النقاش المزعج، ثم أقوم بتنفيذ ما يدور برأسي بالخفاء دون علم الطرف الآخر.", score: 3 },
        { id: "3c", text: "أطبق لغة الأنا والتواصل غير العنيف: «أشعر بالقلق تجاه الاستقرار المالي وأتمنى أن نضع خطة سوياً ترضينا».", score: 5 }
      ]
    },
    {
      id: 4,
      category: "awareness",
      text: "إذا شعرت فجأة بضيق خانق أو غضب يتصاعد داخلك أثناء جلوسك مع عائلتك دون سبب مباشر واضح:",
      options: [
        { id: "4a", text: "أصب هذا الضيق على أولادي وأصرخ عليهم لأي هفوة بسيطة لتفريغ الشحنة بداخلي.", score: 1 },
        { id: "4b", text: "أحاول كبت المشاعر وتجاهلها تماماً والاستمرار بالحديث متظاهراً بالسعادة مما يولد ضغطاً أكبر.", score: 3 },
        { id: "4c", text: "أنسحب لدقائق، أراقب مشاعري وأسأل نفسي: «ما هو الاحتياج غير الملبي خلف هذا الضيق؟» وأشرح لعائلتي بوعي حاجتي لبعض السكينة.", score: 5 }
      ]
    },
    {
      id: 5,
      category: "communication",
      text: "حينما يمر شريك حياتك بفترة من الحزن والانطواء والتقصير في مسؤولياته المعتادة تجاهك وتجاه المنزل:",
      options: [
        { id: "5a", text: "أعامله بالمثل تماماً وأهمله لكي يشعر بمدى سوء تصرفه وعقوبة إهماله.", score: 1 },
        { id: "5b", text: "أشعر بالقلق والتهديد وأبدأ بمطالبته الدائمة بالقيام بمسؤولياته دون الالتفات لأسباب حالته المزاجية.", score: 3 },
        { id: "5c", text: "أقدم الدعم والأمان أولاً، مستكشفاً حاجاته: «ألاحظ أنك لست على طبيعتك مؤخراً، هل أمر معك بصورة ترهقك؟ أنا بجانبك».", score: 5 }
      ]
    },
    {
      id: 6,
      category: "empathy",
      text: "تتلقى شكوى من معلمة طفلك في المدرسة بأنه يتصرف بعناد أو يشتت الأطفال الآخرين بالفصل الدراسي:",
      options: [
        { id: "6a", text: "أقوم بمعاقبة الطفل بشدة فور عودته، وأنعته بالفاشل والمهمل أمام اخوته ليرتدع.", score: 1 },
        { id: "6b", text: "أتجاهل مراسلات المدرسة معتبراً أن المعلمة تبالغ في تقييم الطفل ولا تفهم روحه المرحة.", score: 3 },
        { id: "6c", text: "أجلس مع طفلي جلسة هادئة آمنة، أستمع لوجهة نظره مستفسراً عن مشاعره وصعوباته في المدرسة للوصول للسبب السلوكي الأساسي.", score: 5 }
      ]
    },
    {
      id: 7,
      category: "awareness",
      text: "عندما تقع في خطأ ما أو تفقد أعصابك وتصرخ على عائلتك في لحظة إرهاق شديدة وتدرك ذلك لاحقاً:",
      options: [
        { id: "7a", text: "أتجاهل الأمر تماماً معتبراً أن والديتي أو قوامتي تمنعني من الاعتذار لكيلا تهتز هيبتي أمامهم.", score: 1 },
        { id: "7b", text: "ألومهم هم على خطئي قائلاً: «أنتم من استفززتموني ودفعتموني لتلك الثورة!».", score: 3 },
        { id: "7c", text: "أتحمل المسؤولية بشجاعة وأقدم اعتذاراً واضحاً: «لقد أخطأت بالصراخ، كنت مجهداً وهذا ليس مبرراً، أنا آسف».", score: 5 }
      ]
    },
    {
      id: 8,
      category: "regulation",
      text: "عند سماع رأي أو قرار عائلي مفاجئ يخالف قناعتك وتفضيلاتك تماماً من أحد أفراد الأسرة:",
      options: [
        { id: "8a", text: "أقاطعه فوراً مستهزءاً برأيه لفرض وجهة نظري كخيار وحيد وقاطع بالمنزل.", score: 1 },
        { id: "8b", text: "أستمع دون تعبير حقيقي بينما يعتمل الغضب بداخلي وأخطط لعرقلة this الخيار خلف الكواليس.", score: 3 },
        { id: "8c", text: "أستمع له لكامل كلامه دون مقاطعة، ثم أسأله بلطف عن أسبابه لنبحث معاً عن مساحة مشتركة توائم الطرفين.", score: 5 }
      ]
    }
  ];

  const handleStart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleSelectOption = (score: number) => {
    const qId = questions[currentIdx].id;
    setAnswers(prev => ({ ...prev, [qId]: score }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // Calculations
  const calculateResults = () => {
    let totalScore = 0;
    const categoryTotals: Record<string, { earned: number; max: number }> = {
      awareness: { earned: 0, max: 0 },
      regulation: { earned: 0, max: 0 },
      empathy: { earned: 0, max: 0 },
      communication: { earned: 0, max: 0 }
    };

    questions.forEach(q => {
      const score = answers[q.id] || 3;
      totalScore += score;
      categoryTotals[q.category].earned += score;
      categoryTotals[q.category].max += 5;
    });

    const maxTotal = questions.length * 5;
    const percentage = Math.round((totalScore / maxTotal) * 100);

    // Profile determination
    let profileTitle = "";
    let profileIcon = "🧘";
    let profileDesc = "";
    let weaknesses: string[] = [];

    if (percentage >= 80) {
      profileTitle = "المرساة العاطفية الحكيمة (The Emotional Anchor)";
      profileIcon = "⚓";
      profileDesc = "أنت تمتلك مستوى نضج وعاطفي وجداني استثنائي! منزلك يستمد منك السكينة والأمان. تجيد السيطرة على جهازك العصبي وقت الأزمات، وتحول الغضب لفرص شفاء وفهم وتواصل نقي. عائلتك محظوظة بوجودك كصمام أمان مرن.";
    } else if (percentage >= 55) {
      profileTitle = "الحارس الوجداني الصبور (The Empathetic Guardian)";
      profileIcon = "🛡️";
      profileDesc = "أنت حارس عطوف وجيد التوجيه لأسرتك، تسعى باهتمام لبناء بيئة هادئة وتتحلى بالصبر. بالرغم من ذلك، تضغطك أحياناً ضغوط الحياة المتلاحقة فتفقد السيطرة المؤقتة لتعود للاستجابة الانفعالية. تحتاج فقط لترسيخ تقنية الوقوف والشهيق قبل الرد.";
    } else {
      profileTitle = "المستجيب السريع والمدافع العفوي (The Reactive Survivor)";
      profileIcon = "⚡";
      profileDesc = "تغلب عليك أحياناً العفوية والدفاعية السريعة في العلاقات والمواقف المتوترة. تشعر أن ضخامة انفعالاتك أكبر من قدرتك الفورية على ضبطها، مما يوقعك في دائرة الندم واللوم اللاحق لشركائك. بمتابعتك للدورة والمحاكي ستتعلم إعادة هندسة استجابتك الدماغية بكل تميز.";
    }

    // Category percentage ratings
    const breakdown = Object.entries(categoryTotals).map(([cat, val]) => {
      const pct = Math.round((val.earned / val.max) * 100);
      let name = "";
      let desc = "";
      if (cat === "awareness") {
        name = "الوعي الذاتي بالمشاعر";
        desc = "تحديد ورصد مشاعرك الداخلية ومعرفة سبب انفعالك الحقيقي قبل إطلاقه.";
      }
      if (cat === "regulation") {
        name = "ضبط وتقنين الانفعالات";
        desc = "فصل المشعر الداخلي عن السلوك الخارجي، وتفادي الصراخ وتأمين السكينة.";
      }
      if (cat === "empathy") {
        name = "التعاطف وفهم الآخر";
        desc = "فهم الاحتياج الوجداني الخفي لشريكك أو أطفالك وتحليل دوافع سلوكياتهم.";
      }
      if (cat === "communication") {
        name = "التواصل البناء وحل النزاع";
        desc = "التحدث بنعومة بوعي الأنا الفعالة وحل الخلاف قبل تأصيله للصمت النزاعي.";
      }

      if (pct < 70) {
        weaknesses.push(name);
      }

      return { key: cat, name, pct, desc };
    });

    return { percentage, profileTitle, profileIcon, profileDesc, breakdown, weaknesses };
  };

  const results = showResults ? calculateResults() : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Quiz Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex p-3 bg-[#d4a373]/10 text-[#d4a373] rounded-2xl">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e3b40] font-tajawal">مقياس الذكاء العاطفي الأسري</h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          أجب بصدق وشفافية مطلقة عن المواقف الواقعية التالية لنقيس مستوى نضج استجابتك العاطفية في بيتك، ونرسم لك دليلاً شخصياً للارتقاء المعرفي.
        </p>
      </div>

      {/* Start Screen */}
      {currentIdx === -1 && (
        <div className="bg-white border border-[#e0dcd2] rounded-3xl p-8 text-center space-y-6 shadow-md">
          <div className="flex justify-center">
            <span className="text-6xl">📊</span>
          </div>
          <div className="space-y-3 max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-[#1e3b40]">عن الاختبار التدريبي</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              يشتمل المقياس على 8 تساؤلات ومحكّات سلوكية حية جرى صياغتها بالتعاون مع مستشارين نفسيين للوقوف على أربعة أبعاد جوهرية في ذكاء الفرد اليومي داخل الأسرة. لن يستغرق المقياس أكثر من 5 دقائق.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4 text-xs font-bold text-gray-750">
            <div className="p-4 bg-[#fffef9] rounded-2xl border border-[#e0dcd2] shadow-sm">
              <span className="text-xl block mb-1">🧠</span>
              <span>رصد وعي الذات</span>
            </div>
            <div className="p-4 bg-[#fffef9] rounded-2xl border border-[#e0dcd2] shadow-sm">
              <span className="text-xl block mb-1">🧘</span>
              <span>الضبط تحت التوتر</span>
            </div>
            <div className="p-4 bg-[#fffef9] rounded-2xl border border-[#e0dcd2] shadow-sm">
              <span className="text-xl block mb-1">🤝</span>
              <span>مهارة فك الخلاف</span>
            </div>
            <div className="p-4 bg-[#fffef9] rounded-2xl border border-[#e0dcd2] shadow-sm">
              <span className="text-xl block mb-1">💞</span>
              <span>التعاطف الأسري اللين</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStart}
              className="bg-[#1e3b40] hover:bg-[#2a5459] text-white font-bold px-8 py-4 rounded-full text-base shadow-lg transition-transform hover:scale-105"
            >
              🚀 ابدأ تشغيل المقياس التفاعلي الآن
            </button>
          </div>
        </div>
      )}

      {/* Progressing Quiz Question Screen */}
      {currentIdx >= 0 && !showResults && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#e0dcd2] shadow-sm flex items-center justify-between gap-4 text-xs">
            <div className="flex-1 bg-[#f4ede4] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#d4a373] h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <span className="font-bold text-[#1e3b40] whitespace-nowrap">السؤال {currentIdx + 1} من {questions.length}</span>
          </div>

          {/* Question Box */}
          <div className="bg-[#fffef9] border border-[#e0dcd2] rounded-3xl p-8 shadow-sm space-y-6 text-right">
            <span className="inline-block bg-[#1e3b40]/10 text-[#1e3b40] text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full">
              {questions[currentIdx].category === "awareness" && "مقياس وعي الذات 🧠"}
              {questions[currentIdx].category === "regulation" && "مقياس السيطرة وضبط النفس 🧘"}
              {questions[currentIdx].category === "empathy" && "التعاطف الوجداني مع شريكك 🌱"}
              {questions[currentIdx].category === "communication" && "مهارات الحوار والاتصال اللبق 🗣️"}
            </span>
            
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e3b40] leading-relaxed">
              {questions[currentIdx].text}
            </h3>

            <div className="space-y-3 pt-4">
              {questions[currentIdx].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.score)}
                  className="w-full text-right p-5 rounded-2xl border border-[#e0dcd2] bg-[#fffef9] hover:bg-[#d4a373]/5 hover:border-[#d4a373] transition-all duration-200 focus:outline-none flex gap-4 items-center group relative overflow-hidden"
                >
                  <span className="w-8 h-8 rounded-full bg-[#f4ede4] group-hover:bg-[#d4a373] text-[#1e3b40] group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors flex-shrink-0">
                    ★
                  </span>
                  <span className="text-gray-800 text-sm sm:text-base font-semibold group-hover:text-[#1e3b40] leading-relaxed">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Back Button */}
            {currentIdx > 0 && (
              <div className="flex justify-start pt-4 border-t border-gray-150">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1e3b40] transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-[#d4a373] ml-1" />
                  <span>السؤال السابق</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show Results Screen */}
      {showResults && results && (
        <div className="space-y-8 animate-fade-in text-right">
          
          {/* Main Score Box */}
          <div className="bg-gradient-to-br from-[#1e3b40] to-[#2a5459] text-white rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#d4a373] opacity-5 rounded-full blur-3xl"></div>
            
            <div className="inline-flex p-4 bg-white/10 rounded-full text-[#d4a373] text-5xl">
              {results.profileIcon}
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#d4a373] font-black">مؤشر نضج وعيك الأسري الإجمالي</span>
              <h2 className="text-4xl font-extrabold text-[#d4a373] font-tajawal">{results.profileTitle}</h2>
            </div>

            {/* SVG Interactive Circular Gauge */}
            <div className="flex justify-center py-4">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#132629]/40"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#d4a373] transition-all duration-1000"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * results.percentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black">{results.percentage}%</span>
                  <span className="text-[10px] font-semibold text-gray-300">درجة الاستجابة</span>
                </div>
              </div>
            </div>

            <p className="text-gray-200 text-sm max-w-xl mx-auto leading-relaxed">
              {results.profileDesc}
            </p>

            <div className="pt-2 text-xs text-gray-400">
              تم التقييم ومطابقة الردود لنموذج القيادة التربوية.
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="bg-white border border-[#e0dcd2] rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#1e3b40] flex items-center gap-2 border-b border-gray-150 pb-4">
              <Award className="w-6 h-6 text-[#d4a373]" />
              تحليل كفاءة القدرات الأربعة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {results.breakdown.map((b) => (
                <div key={b.key} className="space-y-2 border border-[#e0dcd2] p-5 rounded-2xl bg-[#fffef9]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-extrabold text-[#1e3b40]">{b.name}</span>
                    <span className="font-mono font-black text-[#d4a373]">{b.pct}%</span>
                  </div>
                  
                  {/* Custom progress level bar */}
                  <div className="w-full bg-[#f4ede4] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        b.pct >= 85 ? "bg-[#1e3b40]" : b.pct >= 60 ? "bg-[#d4a373]" : "bg-[#c95b4b]"
                      }`}
                      style={{ width: `${b.pct}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customized Recommendation Box */}
          <div className="bg-[#fffef9] border border-[#e0dcd2] rounded-3xl p-8 shadow-md space-y-4">
            <div className="flex items-center gap-3 text-[#1e3b40] font-extrabold text-lg">
              <CheckCircle className="w-6 h-6 text-[#d4a373]" />
              <h4>توصيات الخبراء لتطوير مهاراتك اليوم:</h4>
            </div>
            
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed text-right pt-2">
              <p>بناء على تفضيلاتك وردودك، إليك النصائح الأساسية التي يحدثك عنها مستشارنا لتطبيقها فوراً بالمنزل لتعزيز مناعتك وعلاقته الوجدانية:</p>
              
              <ul className="space-y-4 pr-3 border-r-2 border-[#d4a373]">
                <li className="flex items-start gap-2">
                  <span className="text-[#1e3b40] font-black">1.</span>
                  <span><strong>أسبوع 'لغة الأنا':</strong> حاول لمدة 7 أيام منع استخدام أي لوم مباشر يبدأ بـ 'أنت'. بدلاً من ذلك، صف شعورك الشخصي 'أنا يقلقني...، يسعدني...'.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1e3b40] font-black">2.</span>
                  <span><strong>دقيقتي التنفس الصامت:</strong> عند مواجهة سلوك عناد الأبناء، توقف لمدة دقيقتين كاملتين لتهدئة عاصفة جهازك العصبي قبل نطق الكلمة الأولى.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1e3b40] font-black">3.</span>
                  <span><strong>علق لافتة المشاعر:</strong> اسأل طفلك يومياً: «أي شعور يزورك الآن؟ هل هو غضب، ضجر، حماس؟» لتعليمه رصد انفعالاته بذكاء منذ نعومة أظفاره.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStart}
                className="bg-transparent hover:bg-[#1e3b40]/5 text-gray-750 font-bold px-6 py-3.5 rounded-full border border-[#e0dcd2] text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4 text-[#d4a373]" />
                <span>إعادة إجراء الفحص والتقييم</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
