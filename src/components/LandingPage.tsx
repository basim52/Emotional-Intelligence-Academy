import { 
  Award, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FileText, 
  Gift, 
  Heart, 
  MessageSquare, 
  Play, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Users, 
  X,
  Lock
} from "lucide-react";
import { useState, FormEvent } from "react";

interface LandingPageProps {
  onJoinCourse: () => void;
  onGoToSimulator: () => void;
  onGoToAssessment: () => void;
  onEnrollSuccess: () => void;
}

export default function LandingPage({ onJoinCourse, onGoToSimulator, onGoToAssessment, onEnrollSuccess }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showTeaser, setShowTeaser] = useState(false);
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(() => {
    return localStorage.getItem("is_enrolled_ei") === "true";
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleEnroll = (e: FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    localStorage.setItem("is_enrolled_ei", "true");
    localStorage.setItem("enrolled_email", emailInput);
    setIsEnrolled(true);
    setShowRegisterSuccess(true);
    if (onEnrollSuccess) {
      onEnrollSuccess();
    }
  };

  const modules = [
    {
      num: "01",
      icon: "🧠",
      title: "وعي الذات والخرائط الجسدية",
      desc: "تحليل تشريح الانفعال الدماغي، ورصد الإشارات التحذيرية المادية للغضب، وتتبع الأزرار السلوكية للأفراد لتجنب انفجار الصمت والتوتر."
    },
    {
      num: "02",
      icon: "🧘",
      title: "فرامل الضبط والتهوية العصبية",
      desc: "سيادة قاعدة الثواني الخمس الحجابية، وتذويب التشوهات الفكرية كالشخصنة وتسميم النوايا والتعميم، فضلاً عن بناء مخارج آمنة تربوية."
    },
    {
      num: "03",
      icon: "🤝",
      title: "التعاطف الأسري اللين وفهم القلوب",
      desc: "مبادئ ارتداء نظارات الشريك لاستجلاء مخاوفه، وتطبيق الإنصات ثلاثي الأبعاد الموجه للاحتياج، وبناء التوجيه والذكاء الوجداني الطفولي."
    },
    {
      num: "04",
      icon: "🗣️",
      title: "الاتصال الناضج ولغة الأنا الخماسية",
      desc: "استئصال هجوم 'أنت' المتبادل وصياغة لغة الأنا اللطيفة للتعبير عن الضيق بسلام، وتطبيق طقوس الإيداع بالحساب العاطفي المشترك."
    },
    {
      num: "05",
      icon: "⚓",
      title: "التفاوض الوجداني وحسم النزاعات",
      desc: "تفكيك آفة الصمت العقابي والجفاء المدمر بالمنزل، وابتكار مذكرات الوفاق لحل مسائل المال والمهام، وكتابة دستور المرساة العائلية الساقط."
    }
  ];

  const faqs = [
    {
      q: "هل الدورة تناسب من لديهم خلافات مستعصية جداً؟",
      a: "نعم، تماماً. صُممت الدورة لمخاطبة جذور وسلوك التوتر اليومي والصمت والنزاعات المتكررة. ستكتشف أن أدوات تفكيك الخلاف بسلام تكمن في تعديل بسيط لنوعية الاستجابة والذكاء الوجداني."
    },
    {
      q: "كيف استفيد من مميزات هذا التطبيق المرافق؟",
      a: "هذا التطبيق هو مرافقك المعرفي الذكي! بجانب تفاصيل الدورة، يمكنك الانتقال لأعلى وإجراء 'اختبار الذكاء العاطفي' المتخصص، والتدرب بطريقة فريدة مع 'محاكي المواقف الذكي' المدعوم بالذكاء الاصطناعي لحالات غضب وحوار حقيقية، وتدوين مشاعرك وأهدافك يومياً."
    },
    {
      q: "هل يتطلب التسجيل بالدورة أي تكاليف أو اشتراكات حالياً؟",
      a: "لا، الدورة والمنهج الـ 15 درساً مكثفاً متاحة مجاناً بالكامل للجميع بدون أي رسوم أو اشتراكات حالياً لتسهيل طلب المعرفة ونشر السلم التربوي والسكينة الأسرية."
    }
  ];

  return (
    <div className="pb-16 bg-[#faf8f5]">
      {/* Dynamic Student Banner */}
      {isEnrolled && (
        <div className="bg-emerald-800 text-white py-3 px-4 text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
          <CheckCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
          <span>مبارك! لقد تم بنجاح تسجيلك في الدورة التدريبية. حسابك الآن مفعل في وضع التدريب الفائق العاطفي.</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf8f0] via-[#f5ede3] to-[#e8dfd3] py-20 border-b border-[#e2dacb]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a373] opacity-5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1e3b40]/10 text-[#1e3b40] border border-[#1e3b40]/15">
                <Sparkles className="w-3.5 h-3.5 text-[#d4a373]" />
                التدريب القيادي السلوكي والتربوي الأكثر مبيعاً
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1e3b40] leading-tight font-tajawal">
                اكتشف فن إدارة حياتك العاطفية والأسرية بذكاء
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl">
                دورة متكاملة لتعلم أدوات الذكاء العاطفي وتطبيقاته العملية في محيطك المعيشي ومع شريك حياتك وأبنائك، لتعيش بسكينة، وتفاهم حقيقي، وسلام نفسي مستمر.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={onEnrollSuccess}
                  className="inline-flex items-center justify-center bg-[#d4a373] hover:bg-[#c49363] text-[#1e3b40] font-black px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center gap-2"
                >
                  📖 ابدأ قراءة الدروس الـ 15 المكثفة مجاناً
                </button>
                <button 
                  onClick={onGoToSimulator}
                  className="inline-flex items-center justify-center bg-[#1e3b40] hover:bg-[#2a5459] text-white font-bold px-8 py-4 rounded-full text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-[#d4a373]" />
                  جرّب محاكي المواقف (AI) مجاناً
                </button>
              </div>


            </div>

            {/* Laptop Mockup Box */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Backdrop glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d4a373] to-[#1e3b40] rounded-2xl blur opacity-25"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-2xl border border-gray-150">
                  <div className="relative aspect-video rounded-xl bg-gradient-to-br from-[#2a5459] to-[#1e3b40] overflow-hidden group shadow-inner">
                    
                    {/* Decorative Top-Bar */}
                    <div className="absolute top-2 left-3 flex gap-1.5 z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
                    </div>

                    {/* Centered Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
                      <div className="bg-[#d4a373]/20 border border-[#d4a373] p-4 rounded-full animate-pulse">
                        <Play className="w-8 h-8 text-[#d4a373] fill-[#d4a373] translate-x-[-1px]" />
                      </div>
                      <h3 className="font-bold text-lg">فيديو تمهيدي: ركائز الوعي العائلي</h3>
                      <button 
                        onClick={() => setShowTeaser(true)}
                        className="bg-[#d4a373] hover:bg-[#c49363] text-[#1e3b40] font-bold text-xs py-2 px-5 rounded-full transition-transform hover:scale-105"
                      >
                        تشغيل العرض التعريفي
                      </button>
                    </div>

                    {/* Floating Label */}
                    <div className="absolute bottom-3 right-3 bg-[#132629]/80 backdrop-blur px-3 py-1 rounded-full text-[10px] text-gray-200 font-bold border border-white/10">
                      المدة: 3:45 دقائق
                    </div>
                  </div>
                  
                  {/* Laptop keyboard visual base */}
                  <div className="mt-3 py-1 px-4 bg-gray-100 rounded-lg flex justify-between items-center text-xs text-gray-500 font-mono">
                    <span>Model E-Learning v3.9</span>
                    <span className="w-8 h-1.5 bg-gray-300 rounded-full mx-auto"></span>
                    <span>Ready for Launch</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Target Audience / Who is this for */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e3b40] relative inline-block">
            لمن صُممت هذه الدورة؟
          </h2>
          <div className="w-16 h-1.5 bg-[#d4a373] mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            إذا كنت ترغب جدياً في تحويل الخلاف والتشنج اللفظي في منزلك إلى مساحات من التفاهم والحنان وبناء الألفة القوية، فإليك البداية:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-[#e0dcd2] shadow-sm hover:shadow-lg transition-transform hover:-translate-y-2 duration-300 text-center space-y-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 text-3xl">
              👨‍👩‍👧‍👦
            </span>
            <h3 className="text-xl font-bold text-[#1e3b40]">للمتزوجين والآباء</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              الساعين لتأمين بيئة أسرية دافئة ومستقرة للأبناء، خالية من الصراخ المستمر والمشاحنات التي تعيق التطور النفسي للطفل.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#e0dcd2] shadow-sm hover:shadow-lg transition-transform hover:-translate-y-2 duration-300 text-center space-y-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#d4a373]/10 text-[#d4a373] text-3xl">
              💬
            </span>
            <h3 className="text-xl font-bold text-[#1e3b40]">لمن يعاني من صعوبة تحكّم المشاعر</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              من يشعر بأن نوبات الغضب المفاجئة تبخر صبره تماماً وتؤثر على تواصله، فيبحث عن تقنيات تحكّم سلوكي عملية وجذرية.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#e0dcd2] shadow-sm hover:shadow-lg transition-transform hover:-translate-y-2 duration-300 text-center space-y-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e3b40]/10 text-[#1e3b40] text-3xl">
              💞
            </span>
            <h3 className="text-xl font-bold text-[#1e3b40]">للمقبلين على الزواج والشباب</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              الحريصين على الدخول في رباط ميثاق غليظ مزوّدين بأحدث العلوم حول سيكولوجية الطرف الآخر وسلوك الوعي والاتصال الناضج.
            </p>
          </div>
        </div>

        {/* Diagnostic Quick CTA */}
        <div className="mt-16 bg-[#1e3b40] text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#d4a373] opacity-5 rounded-full blur-3xl"></div>
          <div className="space-y-3 relative z-10 text-right">
            <span className="text-xs font-bold text-[#d4a373] tracking-widest block font-sans">هل تريد معرفة قدرتك العاطفية الآن؟</span>
            <h4 className="text-2xl font-black">اختبر مؤشر ذكائك العاطفي الأسري في 10 دقائق!</h4>
            <p className="text-gray-300 text-sm">صممنا مقياساً إلكترونياً مفصلاً يقيم 4 محاور في الشخصية التواصلية ويعطيك درجة فورية مع الحلول.</p>
          </div>
          <button 
            onClick={onGoToAssessment}
            className="bg-[#d4a373] hover:bg-[#c49363] text-[#1e3b40] font-bold px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all relative z-10 flex-shrink-0 text-center hover:scale-105"
          >
            📋 ابدأ التقييم الذاتي مجاناً
          </button>
        </div>
      </section>

      {/* Problem And Solution Section */}
      <section className="bg-gradient-to-r from-[#1e3b40] to-[#14282b] py-20 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white relative inline-block">
              الرحلة التحويلية للوعي الأسري
            </h2>
            <div className="w-16 h-1.5 bg-[#d4a373] mx-auto mt-4 rounded-full"></div>
            <p className="text-gray-300 mt-4 text-base sm:text-lg">
              الخيار لك: هل تود الاستمرار في نموذج الرد العشوائي الغاضب أم التميز بنجاة واعية؟
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            <div className="bg-[#112426] border border-red-900/30 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-red-950/40 pb-4 mb-4">
                  <span className="text-3xl text-red-500">✕</span>
                  <h3 className="text-2xl font-bold text-red-400">🔴 النموذج التقليدي (الحياة دون ذكاء عاطفي)</h3>
                </div>
                <ul className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-extrabold text-base mt-0.5">▪</span>
                    <span>سلسلة من النزاعات المتكررة بلا نقاش جوهري منتهي بحلول حقيقية ملموسة.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-extrabold text-base mt-0.5">▪</span>
                    <span>الاندفاع السريع في الاتهامات والصراخ ثم الندم والشعور بالذنب تجاه أبنائك.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-extrabold text-base mt-0.5">▪</span>
                    <span>بناء الصمت العقابي والجفاء كوسيلة للعقاب، مما يبعدك عن شريكك لسنوات.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-extrabold text-base mt-0.5">▪</span>
                    <span>عدم القدرة على قراءة دوافع تصرفات المحيطين بك والتعامل مع ظواهر الغضب فقط.</span>
                  </li>
                </ul>
              </div>
              <div className="text-red-400 text-xs font-semibold pt-4 border-t border-[#1a383b]">
                النتيجة: دوامة توتر دائمة وبيت بارد يفقد فيه الأطفال الأمان العاطفي.
              </div>
            </div>

            <div className="bg-[#1b4348]/50 border border-[#d4a373]/30 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 border-b border-emerald-950/40 pb-4 mb-4">
                  <span className="text-3xl text-emerald-500">✓</span>
                  <h3 className="text-2xl font-bold text-[#d4a373]">🟢 النموذج المحوّل (بعد الدورة)</h3>
                </div>
                <ul className="space-y-4 text-gray-200 text-sm leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-extrabold text-base mt-0.5">▪</span>
                    <span>القدرة على إدارة الانفعالات، وتوجيه ردة فعلك لتقترب من الفهم بدلاً من الدفاع.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-extrabold text-base mt-0.5">▪</span>
                    <span>تحليل السلوك بدقة لتفهم الاحتياج غير المشبع خلف عناد طفلك أو ثورة زوجك.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-extrabold text-base mt-0.5">▪</span>
                    <span>ممارسة لغة الأنا اللطيفة لحقن التوتر ولتذويب المشاكل قبل تفاقمها.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-extrabold text-base mt-0.5">▪</span>
                    <span>إرساء بيئة من الرحمة والتأمل المشترك ليكون منزلك ملاذ السكينة الأوحد.</span>
                  </li>
                </ul>
              </div>
              <div className="text-[#d4a373] text-xs font-semibold pt-4 border-t border-[#1b4348]">
                النتيجة الأساسية: علاقات ثابتة متماسكة وإدارة ناجحة ومريحة للحياة والمستقبل.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Course Curriculum */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e3b40] relative inline-block">
            منهج الدورة – 15 درساً مكثفاً مقسماً على 5 فصول
          </h2>
          <div className="w-16 h-1.5 bg-[#d4a373] mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            منهاج دراسي مبرهن علمياً يجمع غزارة المعرفة العاطفية وروعة التطبيقات السلوكية العملية في البيت:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((m, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#e0dcd2] shadow-sm hover:shadow-xl hover:border-[#d4a373] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 text-7xl font-black text-gray-50 opacity-40 select-none -translate-x-2 -translate-y-4 font-mono">
                {m.num}
              </div>
              <div className="space-y-3 relative z-10">
                <span className="text-4xl block mb-2">{m.icon}</span>
                <h4 className="text-xl font-bold text-[#1e3b40]">{m.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-mono">
                <span>3 دروس مكثفة مطولة + اختبار الفصل</span>
                <span className="font-semibold text-[#1e3b40]">متاح بالكامل</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Enrollment Section */}
      <section id="pricing" className="py-20 max-w-lg mx-auto px-4 sm:px-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#d4a373] to-[#1e3b40] rounded-3xl blur-md opacity-25"></div>
          <div className="relative bg-white rounded-3xl border-2 border-[#1e3b40] p-8 md:p-12 text-center space-y-6 shadow-2xl">
            <span className="bg-[#1e3b40] text-[#d4a373] px-4 py-1.5 rounded-full text-xs font-black inline-block tracking-widest leading-none">
              مفتوح ومجاني بالكامل حالياً
            </span>
            <h3 className="text-3xl font-black text-[#1e3b40]">التسجيل والانتساب المجاني</h3>
            <p className="text-gray-500 text-sm">ابدأ رحلتك التربوية اليوم مجاناً دون الحاجة لأي اشتراك أو دفع لتنشيط المنصة الذكية فوراً</p>
            
            <div className="py-2 border-y border-gray-100">
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 py-1.5 px-3.5 rounded-full inline-block">الوصول الكامل والدائم لـ 15 درساً مكثفاً ومحاكي المواقف</span>
            </div>

            <ul className="text-right text-sm text-gray-700 space-y-3.5 px-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>الوصول الكامل لـ 5 فصول تعليمية وتطبيقاتها</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>استخدام مجاني لـ "محاكي الغضب والدفاع" الذكي (AI)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>إمكانية إجراء تقييم مؤشر الذكاء العاطفي الأسري</span>
              </li>
            </ul>

            {!isEnrolled ? (
              <form onSubmit={handleEnroll} className="space-y-3 pt-4">
                <div className="flex flex-col gap-2">
                  <input 
                    type="email" 
                    required
                    placeholder="ادخل بريدك الإلكتروني للتسجيل المجاني" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full text-center py-3.5 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#1e3b40] focus:border-[#d4a373] text-sm text-gray-800"
                  />
                  <button 
                    type="submit"
                    className="w-full bg-[#d4a373] hover:bg-[#c49363] text-white font-black text-lg py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                  >
                    🚀 انضم للدورة وتنشيط المنصة فوراً
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 py-4 px-6 rounded-2xl font-bold flex flex-col items-center gap-2">
                <span className="text-sm">لقد تم الانضمام بالفعل بالبريد:</span>
                <span className="font-mono text-base">{localStorage.getItem("enrolled_email")}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1e3b40] relative inline-block">
            الأسئلة الشائعة حول الدورة والتطبيق
          </h2>
          <div className="w-16 h-1.5 bg-[#d4a373] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-[#e0dcd2] rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-right py-5 px-6 font-bold text-base sm:text-lg text-[#1e3b40] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                >
                  <span>{f.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#d4a373] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#d4a373] flex-shrink-0" />
                  )}
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] border-t border-gray-100 p-6" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {f.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Final Motivational Section (CTA) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1e3b40] to-[#2a5459] text-white text-center py-16 px-6 sm:px-12 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#d4a373] opacity-5 rounded-full blur-3xl -translate-x-12 -translate-y-12"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black leading-tight text-white border-none">الحياة المستقرة الهانئة تبدأ بقرار شجاع</h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
              أنت لا تبني مستقبلك وعلاقاتك فحسب، بل تبني واحة أمان واستقرار سيتزود منها أولادك وأسرتك لبقية العمر.
            </p>
            <div className="pt-4">
              <a 
                href="#pricing"
                className="bg-[#d4a373] hover:bg-[#c49363] text-[#1e3b40] font-black px-10 py-5 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-block"
              >
                🎯 انضم للمشتركين وطوّر أسرتك الآن
              </a>
            </div>
            <p className="text-xs text-gray-400">انضمام فوري، سهولة الدخول للأبد، ضمان الاسترداد متكامل</p>
          </div>
        </div>
      </section>

      <div className="text-center text-xs text-gray-500 mt-12 font-medium">
        جميع الحقوق محفوظة © {new Date().getFullYear()} دورة الذكاء العاطفي والأسرة | منصة الوعي والتربية الذكية
      </div>


      {/* Teaser Experience Video Modal */}
      {showTeaser && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-[#fffef9] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 text-right">
            
            <button 
              onClick={() => setShowTeaser(false)}
              className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 font-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2 border-b border-gray-150 pb-4">
              <span className="text-xs font-bold text-[#d4a373] tracking-widest block uppercase">العرض التعريفي المفتوح</span>
              <h3 className="text-2xl font-black text-[#1e3b40] flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#d4a373]" />
                مقدمة في الذكاء العاطفي الأسري
              </h3>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              يسعدنا تقديم ملخص الدرس الأول التفسيري والتمهيدي للدورة! لتجربة سريعة وتأسيسية:
            </p>

            <div className="bg-[#1e3b40] text-gray-100 rounded-2xl p-5 space-y-4">
              <div className="border-r-4 border-[#d4a373] pr-3 space-y-1">
                <h4 className="font-bold text-sm text-[#d4a373]">مفهوم 'ثنائية الرد' في الدماغ</h4>
                <p className="text-xs text-gray-300 leading-normal">
                  عند حدوث توتر أو صراخ، تستجيب الغدة اللوزية (Amygdala) فوراً وبشكل مندفع للدفاع أو الهجوم. الذكاء العاطفي يمنح القشرة الجبهية (Prefrontal Cortex) زمام الأمر لتبسيط الوضع وحله بهدوء.
                </p>
              </div>

              <div className="border-r-4 border-[#d4a373] pr-3 space-y-1">
                <h4 className="font-bold text-sm text-[#d4a373]">تطبيق 'قاعدة الـ 5 ثواني العائلية'</h4>
                <p className="text-xs text-gray-300 leading-normal">
                  قبل الرد على أي اتهام مباغت من الشريك، خذ شهيقاً صامتاً لمدة 5 ثوانٍ، تذكر فيه غايتك الأساسية (السلام والهدوء الدائم وليس الانتصار في النقاش الفرعي).
                </p>
              </div>

              <div className="border-r-4 border-[#d4a373] pr-3 space-y-1">
                <h4 className="font-bold text-sm text-[#d4a373]">البيان العاطفي العملي</h4>
                <p className="text-xs text-gray-300 leading-normal">
                  استخدم عبارات: «أنا أشعر بالضغط عندما يرتفع الصوت، وأتمنى أن نناقش هذا بوعي» بدلاً من الهجوم: «أنت دائماً تصرخ وتفسد اليوم».
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowTeaser(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-3 rounded-full text-xs transition-colors"
              >
                إغلاق النافذة
              </button>
              <a 
                href="#pricing"
                onClick={() => setShowTeaser(false)}
                className="bg-[#d4a373] hover:bg-[#c49363] text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-transform hover:scale-[1.02]"
              >
                انضم للدورة كاملة
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Reg success Modal */}
      {showRegisterSuccess && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative bg-[#fffef9] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 text-center border border-emerald-100 shadow-2xl animate-fade-in text-right">
            
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 text-4xl">
              ✓
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-black text-[#1e3b40]">تم الانضمام بنجاح!</h3>
              <p className="text-gray-600 text-sm">مبارك خطوتك الاستثنائية نحو بناء أسرة واعية تسودها السكينة والذكاء العاطفي.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-right space-y-2 text-sm text-gray-700">
              <p className="font-semibold text-[#1e3b40]">🔑 المميزات الجديدة المتاحة لك الآن:</p>
              <ul className="space-y-1 text-xs">
                <li>• منصة محاكاة الحوارات الذكية بالذكاء الاصطناعي أصبحت مفعلة بالكامل.</li>
                <li>• فحص مقياس الذكاء العاطفي والمذكرة متاحة بلا حدود لحسابك.</li>
                <li>• سنرسل كود الدخول وجدول الدورة التدريبية لبريدك الإلكتروني فوراً.</li>
              </ul>
            </div>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setShowRegisterSuccess(false)}
                className="bg-[#1e3b40] hover:bg-[#2a5459] text-white font-bold px-8 py-3 rounded-full text-sm shadow transition-transform hover:scale-105"
              >
                البدء في استخدام التطبيق المرافق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
