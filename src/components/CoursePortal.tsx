import { useState, useEffect, FormEvent } from "react";
import { 
  BookOpen, 
  CheckCircle,
  HelpCircle, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Star, 
  Check, 
  Sparkles, 
  User, 
  Clock, 
  ChevronDown, 
  Lock, 
  BookOpenCheck,
  RotateCcw,
  BookType
} from "lucide-react";
import { courseChapters } from "../data/lessonsData";
import { CourseChapter, CourseLesson, QuizQuestion } from "../types";

export default function CoursePortal() {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState<number | null>(0); // null means Chapter Quiz is active!
  
  // Choose curriculum (standard or custom AI-generated)
  const [activeCurriculum, setActiveCurriculum] = useState<"standard" | "custom">(() => {
    return (localStorage.getItem("ei_active_curriculum") as "standard" | "custom") || "standard";
  });

  const [customCurriculums, setCustomCurriculums] = useState<{
    id: string;
    topic: string;
    curriculumTitle: string;
    curriculumDescription: string;
    chapters: CourseChapter[];
    createdAt?: string;
  }[]>(() => {
    const saved = localStorage.getItem("ei_custom_curriculums");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Backward compatibility check with single saved curriculum
    const singleSaved = localStorage.getItem("ei_custom_curriculum");
    if (singleSaved) {
      try {
        const parsed = JSON.parse(singleSaved);
        if (parsed) {
          const item = {
            id: parsed.id || "legacy_custom",
            topic: parsed.topic || "موضوع مخصص سابق",
            ...parsed
          };
          return [item];
        }
      } catch (e) {}
    }
    return [];
  });

  const [activeCustomCurriculumId, setActiveCustomCurriculumId] = useState<string>(() => {
    return localStorage.getItem("ei_active_custom_curriculum_id") || "";
  });

  // Find currently active custom curriculum
  const customCurriculum = customCurriculums.find(c => c.id === activeCustomCurriculumId) || customCurriculums[0] || null;

  // Admin and Generator states
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem("enrolled_email") || "";
  });
  const [adminEmailInput, setAdminEmailInput] = useState<string>("");
  const [adminLoginError, setAdminLoginError] = useState<string>("");

  const isAdmin = currentUserEmail.trim().toLowerCase() === "basim5252@gmail.com";

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    const email = adminEmailInput.trim().toLowerCase();
    if (email === "basim5252@gmail.com") {
      localStorage.setItem("enrolled_email", "basim5252@gmail.com");
      localStorage.setItem("is_enrolled_ei", "true");
      setCurrentUserEmail("basim5252@gmail.com");
      setAdminLoginError("");
    } else {
      setAdminLoginError("عذراً، هذا البريد ليس لمدير النظام (الأدمن). الميزة مخصصة للمدير فقط.");
    }
  };

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationTopic, setGenerationTopic] = useState<string>("");
  const [generationError, setGenerationError] = useState<string>("");
  const [showGeneratorModal, setShowGeneratorModal] = useState<boolean>(false);
  const [newlyGeneratedCurriculum, setNewlyGeneratedCurriculum] = useState<{
    id: string;
    topic: string;
    curriculumTitle: string;
    curriculumDescription: string;
    chapters: CourseChapter[];
  } | null>(null);

  // Persistence states
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem("ei_completed_lessons");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("ei_completed_quizzes");
    return saved ? JSON.parse(saved) : {};
  });

  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem("ei_student_name") || "";
  });

  const [isNameSaved, setIsNameSaved] = useState<boolean>(() => {
    return !!localStorage.getItem("ei_student_name");
  });

  // Reading settings
  const [readerFontSize, setReaderFontSize] = useState<"base" | "lg" | "xl">("lg");

  // Quiz active states
  const [quizQuestionIdx, setQuizQuestionIdx] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({}); // { questionId: optionId }
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Sync completion states to localStorage
  useEffect(() => {
    localStorage.setItem("ei_completed_lessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem("ei_completed_quizzes", JSON.stringify(completedQuizzes));
  }, [completedQuizzes]);

  useEffect(() => {
    localStorage.setItem("ei_active_curriculum", activeCurriculum);
  }, [activeCurriculum]);

  useEffect(() => {
    localStorage.setItem("ei_custom_curriculums", JSON.stringify(customCurriculums));
  }, [customCurriculums]);

  useEffect(() => {
    localStorage.setItem("ei_active_custom_curriculum_id", activeCustomCurriculumId);
  }, [activeCustomCurriculumId]);

  useEffect(() => {
    if (customCurriculum) {
      localStorage.setItem("ei_custom_curriculum", JSON.stringify(customCurriculum));
    } else {
      localStorage.removeItem("ei_custom_curriculum");
    }
  }, [customCurriculum]);

  // Determine chapters to use
  const chaptersToUse = activeCurriculum === "custom" && customCurriculum ? customCurriculum.chapters : courseChapters;

  // Safeguard index to avoid out of bounds
  const safeChapterIdx = activeChapterIdx >= chaptersToUse.length ? 0 : activeChapterIdx;
  const currentChapter = chaptersToUse[safeChapterIdx] || chaptersToUse[0];
  const currentLesson = activeLessonIdx !== null ? currentChapter.lessons[activeLessonIdx] : null;

  // Calculators
  const actualChapterLessons = chaptersToUse.map(chap => chap.lessons.map(l => l.id)).flat();
  const completedLessonsInActiveCurriculumCount = completedLessons.filter(id => actualChapterLessons.includes(id)).length;
  
  const totalLessonsCount = chaptersToUse.reduce((acc, chap) => acc + chap.lessons.length, 0);
  const progressPercentage = totalLessonsCount > 0 ? Math.round((completedLessonsInActiveCurriculumCount / totalLessonsCount) * 100) : 0;

  const totalQuizzesCount = chaptersToUse.length;
  const completedQuizzesCount = chaptersToUse.filter(chap => !!completedQuizzes[chap.id]).length;

  const handleMarkLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
    }
  };

  const handleLessonSelect = (chapIdx: number, lesIdx: number) => {
    setActiveChapterIdx(chapIdx);
    setActiveLessonIdx(lesIdx);
    setShowQuizResult(false);
  };

  const handleQuizSelect = (chapIdx: number) => {
    setActiveChapterIdx(chapIdx);
    setActiveLessonIdx(null); // Switch to quiz view
    setQuizQuestionIdx(0);
    setQuizAnswers({});
    setShowQuizResult(false);
  };

  const handleAnswerSubmit = (qId: string, optId: string) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleGradeQuiz = () => {
    const questions = currentChapter.quiz.questions;
    let score = 0;
    questions.forEach(q => {
      const chosenOpt = q.options.find(opt => opt.id === quizAnswers[q.id]);
      if (chosenOpt?.isCorrect) {
        score += 1;
      }
    });

    setQuizScore(score);
    setShowQuizResult(true);

    // Save quiz pass if score is >= 2 (out of 3)
    if (score >= 2) {
      setCompletedQuizzes(prev => ({ ...prev, [currentChapter.id]: score }));
    }
  };

  const restartQuiz = () => {
    setQuizQuestionIdx(0);
    setQuizAnswers({});
    setShowQuizResult(false);
  };

  const handleSaveName = (e: FormEvent) => {
    e.preventDefault();
    if (studentName.trim()) {
      localStorage.setItem("ei_student_name", studentName.trim());
      setIsNameSaved(true);
    }
  };

  const handleResetCourse = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إعادة تصفير تقدمك بالكامل والبدء من جديد؟")) {
      setCompletedLessons([]);
      setCompletedQuizzes({});
      localStorage.removeItem("ei_completed_lessons");
      localStorage.removeItem("ei_completed_quizzes");
      setActiveChapterIdx(0);
      setActiveLessonIdx(0);
      setShowQuizResult(false);
    }
  };

  // Switcher with boundary checks
  const handleToggleCurriculum = (mode: "standard" | "custom") => {
    setActiveCurriculum(mode);
    setActiveChapterIdx(0);
    setActiveLessonIdx(0);
    setShowQuizResult(false);
  };

  const handleGenerateCurriculum = async (topicStr: string) => {
    setIsGenerating(true);
    setGenerationError("");
    try {
      const response = await fetch("/api/gemini/generate-curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: topicStr,
          adminEmail: currentUserEmail
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل توليد المنهج المخصص");
      }
      const data = await response.json();
      if (data && data.chapters && data.chapters.length > 0) {
        const newCurriculumId = `custom_${Date.now()}`;
        
        // Prefix child IDs with unique curriculum ID to track progress independently for each curriculum
        const processedChapters = data.chapters.map((chap: any, cIdx: number) => {
          const chapId = `${newCurriculumId}_c_${chap.id || chap.chapterNum || cIdx}`;
          return {
            ...chap,
            id: chapId,
            lessons: (chap.lessons || []).map((les: any, lIdx: number) => ({
              ...les,
              id: `${newCurriculumId}_l_${les.id || les.lessonNum || `${cIdx}_${lIdx}`}`
            })),
            quiz: chap.quiz ? {
              ...chap.quiz,
              questions: (chap.quiz.questions || []).map((q: any, qIdx: number) => ({
                ...q,
                id: `${newCurriculumId}_q_${q.id || qIdx}`,
                options: (q.options || []).map((o: any, oIdx: number) => ({
                  ...o,
                  id: `${newCurriculumId}_o_${o.id || `${qIdx}_${oIdx}`}`
                }))
              }))
            } : chap.quiz
          };
        });

        const newCurriculum = {
          id: newCurriculumId,
          topic: topicStr,
          curriculumTitle: data.curriculumTitle || `منهج مخصص: ${topicStr}`,
          curriculumDescription: data.curriculumDescription || "منهج مصمم بالذكاء الاصطناعي خصيصاً لتحديات عائلتك.",
          chapters: processedChapters,
          createdAt: new Date().toISOString()
        };

        setCustomCurriculums(prev => [newCurriculum, ...prev]);
        setActiveCustomCurriculumId(newCurriculumId);
        setActiveCurriculum("custom");
        setActiveChapterIdx(0);
        setActiveLessonIdx(0);
        setShowQuizResult(false);
        setNewlyGeneratedCurriculum(newCurriculum);
      } else {
        throw new Error("تنسيق المنهج المولّد غير صالح");
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "حدث خطأ غير متوقع أثناء تصميم المنهج الدراسي");
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if ALL lessons are read and ALL quizzes are passed (at least 2 score on each)
  const isCourseFullyCompleted = completedLessonsInActiveCurriculumCount === totalLessonsCount && completedQuizzesCount === totalQuizzesCount;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Course Banner Info */}
      <div className="bg-[#1e3b40] text-white py-12 px-4 shadow-md border-b-4 border-[#d4a373]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 text-right">
            <span className="inline-block bg-[#d4a373]/20 text-[#d4a373] text-xs font-black tracking-widest px-3 py-1 rounded-full uppercase">
              {activeCurriculum === "custom" && customCurriculum ? "منهج أسري ذكي مخصص 🧠" : "أكاديمية الذكاء العاطفي الأسري 🎓"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-tajawal">
              {activeCurriculum === "custom" && customCurriculum 
                ? customCurriculum.curriculumTitle 
                : "منصة الماجستير التربوي المصغر"}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {activeCurriculum === "custom" && customCurriculum 
                ? customCurriculum.curriculumDescription 
                : "15 درساً مكثفاً مطولاً مقسمة على 5 فصول علمية متقدمة في هندسة المشاعر وحل النزاعات مع اختبارات فورية وشهادة تخرج معتمدة."}
            </p>
          </div>

          {/* Quick Progress Circle / Widget */}
          <div className="bg-[#122427] border border-[#d4a373]/30 p-6 rounded-2xl flex items-center gap-4 w-full md:w-auto relative overflow-hidden flex-shrink-0">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#d4a373] opacity-5 rounded-full blur-2xl"></div>
            
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-[#0e1c1e]" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  className="stroke-[#d4a373] transition-all duration-500" 
                  strokeWidth="8" 
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progressPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-100">
                {progressPercentage}%
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] text-[#d4a373] tracking-wider block font-bold">نسبة إتمام المنهج الحالي</span>
              <p className="text-xs font-semibold text-gray-200">
                تمت قراءة <strong className="text-white font-black text-sm">{completedLessonsInActiveCurriculumCount}</strong> من {totalLessonsCount} درس
              </p>
              <p className="text-[11px] text-gray-400">
                الفحوصات المجتازة: <strong className="text-[#d4a373] font-bold">{completedQuizzesCount} / {totalQuizzesCount}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* TAB SWITCHER: Choose Between Standard Curriculum & AI Custom Curriculum */}
        <div className="mb-8 bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
            <div className="text-right space-y-1">
              <h3 className="font-extrabold text-base text-[#1e3b40] flex items-center gap-2">
                <BookType className="w-5 h-5 text-[#d4a373]" />
                مسارات التعلم الأسرية المتوفرة
              </h3>
              <p className="text-gray-500 text-xs">
                اختر بين كتاب المناهج الأساسي المعتمد أو قم بتصميم دليل مخصص لظروف ومشاكل عائلتك الخاصة فوراً بالذكاء الاصطناعي.
              </p>
            </div>
            
            <button
              onClick={() => {
                setGenerationTopic("");
                setGenerationError("");
                setNewlyGeneratedCurriculum(null);
                setShowGeneratorModal(true);
              }}
              className="bg-[#d4a373] hover:bg-[#c29262] text-white px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-white" />
              توليد منهج مخصص لظروف عائلتك 🪄
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard option card */}
            <button
              onClick={() => handleToggleCurriculum("standard")}
              className={`p-4 rounded-2xl border text-right transition-all flex gap-3.5 items-start ${
                activeCurriculum === "standard"
                  ? "border-[#1e3b40] bg-[#1e3b40]/5 ring-2 ring-[#1e3b40]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="bg-[#1e3b40] text-white p-2.5 rounded-xl">
                🎓
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[#d4a373] font-bold block">الخيار الافتراضي المتكامل</span>
                <h4 className="font-extrabold text-[#1e3b40] text-sm">منهج الماجستير الأساسي للذكاء العاطفي</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  15 درساً تغطي الوعي بالنفس، كبح الغضب، حل الخلافات الأسرية الشائعة وبناء المودة المستدامة.
                </p>
              </div>
            </button>

            {/* AI Custom option card */}
            {customCurriculum ? (
              <div
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col gap-3.5 relative overflow-hidden ${
                  activeCurriculum === "custom"
                    ? "border-[#d4a373] bg-[#fffef9] ring-2 ring-[#d4a373]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div 
                  onClick={() => handleToggleCurriculum("custom")}
                  className="flex gap-3.5 items-start cursor-pointer group"
                >
                  <div className="bg-[#d4a373] text-white p-2.5 rounded-xl flex-shrink-0">
                    🧠
                  </div>
                  <div className="space-y-1 flex-grow">
                    <span className="text-[10px] text-[#d4a373] font-bold block">منهج مخصص نشط ({customCurriculums.length} مناهج محفوظة)</span>
                    <h4 className="font-extrabold text-[#1e3b40] text-sm group-hover:text-[#d4a373] transition-colors">{customCurriculum.curriculumTitle}</h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
                      {customCurriculum.curriculumDescription}
                    </p>
                  </div>
                  
                  {/* Secondary badge indicator */}
                  <div className="absolute left-3 top-3 bg-teal-50 text-teal-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase pointer-events-none">
                    مولّد ومفعّل ✨
                  </div>
                </div>

                {/* Switcher & Manager element */}
                <div className="pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-grow">
                    <label htmlFor="curriculum-select" className="text-[10px] text-gray-500 font-bold whitespace-nowrap">المنهج النشط:</label>
                    <select
                      id="curriculum-select"
                      value={activeCustomCurriculumId || customCurriculum.id}
                      onChange={(e) => {
                        const selId = e.target.value;
                        setActiveCustomCurriculumId(selId);
                        setActiveCurriculum("custom");
                        setActiveChapterIdx(0);
                        setActiveLessonIdx(0);
                        setShowQuizResult(false);
                      }}
                      className="bg-white border border-gray-200 text-[#1e3b40] text-[11px] font-bold py-1 px-2.5 rounded-lg focus:ring-1 focus:ring-[#d4a373] focus:outline-none cursor-pointer max-w-[200px] flex-grow"
                    >
                      {customCurriculums.map((curr) => (
                        <option key={curr.id} value={curr.id}>
                          {curr.curriculumTitle || curr.topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنهج المخصص نهائياً؟")) {
                        const updated = customCurriculums.filter(c => c.id !== customCurriculum.id);
                        setCustomCurriculums(updated);
                        if (updated.length > 0) {
                          setActiveCustomCurriculumId(updated[0].id);
                        } else {
                          setActiveCustomCurriculumId("");
                          setActiveCurriculum("standard");
                        }
                        setActiveChapterIdx(0);
                        setActiveLessonIdx(0);
                        setShowQuizResult(false);
                      }
                    }}
                    className="text-red-500 hover:text-red-750 hover:bg-red-50 p-1 rounded-md transition-all text-[11px] flex items-center justify-center gap-1 font-bold border border-transparent hover:border-red-200 active:scale-95"
                    title="حذف هذا المنهج"
                  >
                    <span>🗑️ حذف المنهج</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setGenerationTopic("");
                  setGenerationError("");
                  setNewlyGeneratedCurriculum(null);
                  setShowGeneratorModal(true);
                }}
                className="p-4 rounded-2xl border-2 border-dashed border-gray-300 text-right hover:border-[#d4a373] hover:bg-amber-50/10 transition-all flex gap-3.5 items-start group"
              >
                <div className="bg-gray-100 text-gray-400 group-hover:bg-amber-100 group-hover:text-[#d4a373] p-2.5 rounded-xl transition-colors">
                  🪄
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">الذكاء الاصطناعي التوليدي</span>
                  <h4 className="font-extrabold text-gray-700 group-hover:text-[#1e3b40] text-sm transition-colors">هل تواجه تحدياً خاصاً؟ صمم له منهجاً دراسياً الآن</h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    انقر هنا لكتابة أي مشكلة أو نمط متكرر بالمنزل وسيتولى الخبير الذكي نسج مادة علمية عملية مخصصة لك بالكامل.
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Curriculum Visual Roadmap (Proposal 1: Visual Learning Roadmapping) */}
        <div id="curriculum-roadmap" className="mb-10 bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#1e3b40]/5 rounded-full pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <div className="space-y-1 text-right">
              <h3 className="font-extrabold text-lg text-[#1e3b40] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4a373]" />
                خريطة الرحلة التعليمية والتقدم الوجداني المباشر
              </h3>
              <p className="text-gray-500 text-xs">
                خريطة بصرية تفاعلية توضح تقدمك عبر فصول الدورة الـ {chaptersToUse.length}. اضغط على أي فصل للانتقال إليه فوراً وتنشيط دروسه.
              </p>
            </div>
            <div className="bg-[#1e3b40]/5 py-1 px-3.5 rounded-full text-[11px] font-black text-[#1e3b40] whitespace-nowrap self-end sm:self-auto uppercase">
               مخطط المنهج البصري 🗺️
            </div>
          </div>

          {/* Interactive Steps */}
          <div className="relative">
            {/* Horizontal line connector (hidden on mobile, visible on medium+ screens) */}
            <div className="absolute top-[40%] left-6 right-6 h-1 bg-gray-100 -translate-y-1/2 hidden md:block z-0" style={{ transform: 'translateY(-50%)' }}></div>
            
            {/* Moving active bar highlights */}
            <div 
              className="absolute top-[40%] h-1 bg-gradient-to-r from-[#d4a373] to-[#1e3b40] -translate-y-1/2 hidden md:block z-0 transition-all duration-500"
              style={{
                right: '4%',
                left: `${100 - (safeChapterIdx * (84 / (chaptersToUse.length - 1 || 1)) + 8)}%`,
                transform: 'translateY(-50%)'
              }}
            ></div>

            {/* Slide guide hint on mobile only */}
            <div className="md:hidden flex items-center justify-between text-[10px] text-gray-400 font-bold px-2 mb-2">
              <span>← اسحب لليسار لعرض باقي الفصول التعليمية →</span>
              <span>الفصل الحالي: {safeChapterIdx + 1}</span>
            </div>

            <div className={`flex overflow-x-auto no-scrollbar pb-3 md:grid ${chaptersToUse.length === 3 ? "md:grid-cols-3" : "md:grid-cols-5"} gap-4 relative z-10 snap-x snap-mandatory scroll-smooth`}>
              {chaptersToUse.map((chap, idx) => {
                const isActive = safeChapterIdx === idx;
                const completedLessonsInChap = chap.lessons.filter(l => completedLessons.includes(l.id)).length;
                const quizCompleted = !!completedQuizzes[chap.id];
                const isCompleted = completedLessonsInChap === chap.lessons.length && quizCompleted;

                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setActiveChapterIdx(idx);
                      setActiveLessonIdx(0);
                      setShowQuizResult(false);
                    }}
                    className={`flex-shrink-0 snap-center w-[250px] md:w-full text-right md:text-center p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
                      isActive
                        ? "bg-[#fffef9] border-[#d4a373] shadow-md ring-2 ring-[#d4a373]/10 scale-[1.02]"
                        : isCompleted
                          ? "bg-[#fafbf9] border-emerald-300 hover:border-emerald-400"
                          : "bg-white border-gray-200 hover:border-[#1e3b40]/30 hover:shadow-xs"
                    }`}
                  >
                    {/* Circle Indicator */}
                    <div className="absolute top-4 left-4 md:relative md:top-auto md:left-auto md:mx-auto md:mb-3 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-all ${
                        isActive
                          ? "bg-[#1e3b40] text-white ring-4 ring-[#1e3b40]/10"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}>
                        {isCompleted ? "✓" : chap.chapterNum}
                      </div>
                    </div>

                    {/* Chapter Visual Icon */}
                    <div className="hidden md:block text-2xl mb-1.5 transform group-hover:scale-110 transition-transform">{chap.icon}</div>

                    {/* Content Details */}
                    <div className="pr-12 md:pr-0">
                      <span className="text-[10px] text-[#d4a373] font-black block uppercase tracking-wider">
                        الفصل {chap.chapterNum}
                      </span>
                      <h4 className={`text-xs sm:text-sm font-black mt-0.5 line-clamp-1 transition-colors ${
                        isActive ? "text-[#1e3b40]" : "text-gray-700 group-hover:text-[#1e3b40]"
                      }`}>
                        {chap.title}
                      </h4>
                      
                      {/* Progress Badges */}
                      <div className="mt-2.5 flex items-center justify-start md:justify-center gap-2 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-bold inline-block ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-800"
                            : completedLessonsInChap > 0
                              ? "bg-amber-50 text-amber-800"
                              : "bg-gray-100 text-gray-500"
                        }`}>
                          دروس: {completedLessonsInChap}/{chap.lessons.length}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded-full font-bold inline-block ${
                          quizCompleted
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          الفحص: {quizCompleted ? "✓" : "⏳"}
                        </span>
                      </div>
                    </div>

                    {/* Active Bottom Bar Decor */}
                    {isActive && (
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#d4a373] rounded-full hidden md:block"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* RIGHT SIDEBAR: Curriculum Navigation and Chapters (4 cols) */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            
            <div className="bg-white border border-[#e0dcd2] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-base text-[#1e3b40] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#d4a373]" />
                  فهرس الفصول والدروس الـ {totalLessonsCount}
                </h3>
                <button 
                  onClick={handleResetCourse}
                  title="تصفير التقدم"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Accordion / List of Chapters */}
              <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
                {chaptersToUse.map((chap, chapIdx) => {
                  const isCurrentChapter = safeChapterIdx === chapIdx;
                  const quizCompleted = !!completedQuizzes[chap.id];
                  const completedLessonsInChapCount = chap.lessons.filter(l => completedLessons.includes(l.id)).length;
                  const isChapterFullyRead = completedLessonsInChapCount === chap.lessons.length;

                  return (
                    <div 
                      key={chap.id} 
                      className={`rounded-2xl border transition-all ${
                        isCurrentChapter 
                          ? "border-[#d4a373] bg-[#fffef9] shadow-sm" 
                          : "border-[#e0dcd2] bg-white hover:border-gray-300"
                      }`}
                    >
                      {/* Chapter Header Link */}
                      <button
                        onClick={() => handleLessonSelect(chapIdx, 0)}
                        className="w-full text-right p-4 flex gap-3 items-start justify-between"
                      >
                        <div className="flex gap-3 items-start">
                          <span className="text-2xl pt-1">{chap.icon}</span>
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#d4a373] font-bold block">الفصل {chap.chapterNum}</span>
                            <h4 className="font-extrabold text-[#1e3b40] text-sm leading-snug">{chap.title}</h4>
                            <span className="text-[10px] text-gray-500 block">
                              المقروء: {completedLessonsInChapCount} / 3 دروس
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          {quizCompleted ? (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-black flex items-center gap-0.5">
                              <Check className="w-3 h-3 text-emerald-600" /> مكتمل
                            </span>
                          ) : isChapterFullyRead ? (
                            <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded font-black flex items-center gap-0.5">
                              ⚠️ متاح الاختبار
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold">
                              جاري التعلم
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Dropdown Lessons of Chapter */}
                      <div className="px-3 pb-3 pt-1 border-t border-gray-100 space-y-1.5 bg-gray-50/50 rounded-b-2xl">
                        {chap.lessons.map((les, lesIdx) => {
                          const isCurrentLesson = isCurrentChapter && activeLessonIdx === lesIdx;
                          const isRead = completedLessons.includes(les.id);

                          return (
                            <button
                              key={les.id}
                              onClick={() => handleLessonSelect(chapIdx, lesIdx)}
                              className={`w-full text-right p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border transition-all ${
                                isCurrentLesson 
                                  ? "bg-[#1e3b40] text-white border-[#1e3b40] shadow-sm" 
                                  : "bg-white hover:bg-[#faf8f5] text-gray-700 border-gray-100"
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                                  isCurrentLesson 
                                    ? "bg-[#d4a373] text-white" 
                                    : isRead 
                                      ? "bg-emerald-150 text-emerald-800" 
                                      : "bg-gray-100 text-gray-500"
                                }`}>
                                  {isRead ? "✓" : les.lessonNum}
                                </span>
                                <span className="truncate">{les.title}</span>
                              </div>
                              <span className="text-[9px] text-gray-400 font-mono whitespace-nowrap">{les.duration.split(" ")[0]} د</span>
                            </button>
                          );
                        })}

                        {/* Chapter Quiz Trigger block */}
                        <button
                          onClick={() => handleQuizSelect(chapIdx)}
                          className={`w-full text-right p-3 rounded-xl text-xs font-black flex items-center justify-between gap-2 border transition-all ${
                            activeLessonIdx === null && isCurrentChapter
                              ? "bg-[#d4a373] text-[#1e3b40] border-[#d4a373] shadow-md"
                              : "bg-[#1e3b40]/5 hover:bg-[#1e3b40]/10 text-[#1e3b40] border-dashed border-[#1e3b40]/25"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 flex-shrink-0 text-[#d4a373]" />
                            <span>مسبار تقييم الفصل (اختباري)</span>
                          </div>
                          {quizCompleted ? (
                            <span className="text-[10px] text-emerald-700 font-black">اجترزت بنجاح</span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-medium">3 أسئلة</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Locked Certificate block on Sidebar */}
            <div className="bg-gradient-to-br from-[#1e3b40] to-[#2a5459] text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-44 h-44 bg-[#d4a373] opacity-5 rounded-full blur-2xl"></div>
              <div className="flex justify-between items-start">
                <Award className="w-12 h-12 text-[#d4a373]" />
                <span className="text-[10px] font-black uppercase text-[#d4a373] tracking-widest">متحرك</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-[#d4a373]">الشهادة المهنية الكبرى</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  عند إكمال قراءة الدروس الـ {totalLessonsCount} كاملة واجتياز فحوصات الفصول الـ {totalQuizzesCount}، يفتح لك التطبيق فوراً شهادة تخرج قابلة للطباعة باسمك الشخصي لتخليد إنجاز عائلتك السلوكي.
                </p>
              </div>

              {isCourseFullyCompleted ? (
                <div className="bg-emerald-800 text-white p-3 rounded-xl text-center text-xs font-black border border-emerald-500 animate-pulse">
                  🎉 مبروك! الشهادة جاهزة بالأسفل
                </div>
              ) : (
                <div className="bg-black/25 text-gray-300 p-3 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-semibold">
                  <Lock className="w-3.5 h-3.5 text-[#d4a373]" />
                  <span>انجز المتبقي: ({totalLessonsCount - completedLessonsInActiveCurriculumCount}) درس و ({totalQuizzesCount - completedQuizzesCount}) فحص لفتحها.</span>
                </div>
              )}
            </div>

          </div>

          {/* LEFT CHIEF CONTAINER: Main Content Reader or Quiz Engine (8 cols) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            
            {/* 1. LESSON READER VIEW */}
            {activeLessonIdx !== null && currentLesson && (
              <div className="bg-white border border-[#e0dcd2] rounded-3xl shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
                {/* Visual Glow Header */}
                <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l from-[#d4a373] to-[#1e3b40]"></div>

                {/* Lesson Header Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-black tracking-wider text-[#d4a373] uppercase font-mono">
                      الدرس {currentLesson.lessonNum} من {totalLessonsCount} • {currentChapter.title}
                    </span>
                    <h2 className="text-2xl font-black text-[#1e3b40] font-tajawal leading-tight">{currentLesson.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-semibold italic">{currentLesson.subtitle}</p>
                  </div>

                  {/* Reading Font Size selector and Status */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="bg-gray-100 p-1.5 rounded-xl flex items-center gap-1">
                      <button 
                        onClick={() => setReaderFontSize("base")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${readerFontSize === "base" ? "bg-white text-[#1e3b40] shadow-xs" : "text-gray-500"}`}
                      >
                        صالح
                      </button>
                      <button 
                        onClick={() => setReaderFontSize("lg")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${readerFontSize === "lg" ? "bg-white text-[#1e3b40] shadow-xs" : "text-gray-500"}`}
                      >
                        كبير
                      </button>
                      <button 
                        onClick={() => setReaderFontSize("xl")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${readerFontSize === "xl" ? "bg-white text-[#1e3b40] shadow-xs" : "text-gray-500"}`}
                      >
                        ضخم
                      </button>
                    </div>
                  </div>
                </div>

                {/* LESSON WRITTEN INTENSIVE BODY */}
                <div className={`text-[#1e3b40] space-y-6 text-right leading-relaxed font-tajawal whitespace-pre-wrap ${
                  readerFontSize === "base" 
                    ? "text-base" 
                    : readerFontSize === "lg" 
                      ? "text-lg" 
                      : "text-xl font-medium"
                }`}>
                  {currentLesson.content}
                </div>

                {/* PRACTICAL HOMEWORK ASSIGNMENT EXERCISE */}
                <div className="bg-[#fffef9] border-2 border-dashed border-[#d4a373]/40 rounded-2xl p-6 space-y-3 relative overflow-hidden text-right">
                  <div className="absolute left-[-15px] bottom-[-15px] opacity-10 select-none text-8xl">✍️</div>
                  <div className="flex items-center gap-2 text-[#d4a373] font-black text-sm uppercase tracking-wider font-mono">
                    <Sparkles className="w-5 h-5" />
                    <span>التمرين السلوكي والممارسة المنزلية المفروضة:</span>
                  </div>
                  <h4 className="font-extrabold text-[#1e3b40] text-base">«التطبيق اليومي الموجه»</h4>
                  <p className="text-[#1e3b40] text-sm leading-relaxed font-semibold">
                    {currentLesson.exercise}
                  </p>
                </div>

                {/* Reader Controls: Complete Lesson & Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="flex gap-2">
                    {/* Mark complete trigger */}
                    {completedLessons.includes(currentLesson.id) ? (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold text-xs px-5 py-3 rounded-full flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>قرأت هذا الدرس بنجاح ✓</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkLessonComplete(currentLesson.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4 text-[#d4a373]" />
                        <span>علم كـ مقروء ومكتمل</span>
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* Previous/Next Lesson logic inline */}
                    <button
                      disabled={activeLessonIdx === 0 && activeChapterIdx === 0}
                      onClick={() => {
                        if (activeLessonIdx > 0) {
                          setActiveLessonIdx(activeLessonIdx - 1);
                        } else if (activeChapterIdx > 0) {
                          setActiveChapterIdx(activeChapterIdx - 1);
                          setActiveLessonIdx(2);
                        }
                      }}
                      className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold text-xs py-3.5 px-4 rounded-full transition-colors flex items-center justify-center gap-1"
                    >
                      <span>السابق</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        handleMarkLessonComplete(currentLesson.id); // auto complete
                        if (activeLessonIdx < 2) {
                          setActiveLessonIdx(activeLessonIdx + 1);
                        } else {
                          // Goes to quiz page of this chapter
                          handleQuizSelect(activeChapterIdx);
                        }
                      }}
                      className="flex-1 sm:flex-initial bg-[#1e3b40] hover:bg-[#2a5459] text-white font-black text-xs py-3.5 px-6 rounded-full shadow transition-all hover:scale-105 flex items-center justify-center gap-1"
                    >
                      <span>التالي</span>
                      <ChevronRight className="w-4 h-4 text-[#d4a373]" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 2. CHAPTER QUIZ ENGINE VIEW */}
            {activeLessonIdx === null && (
              <div className="bg-white border border-[#e0dcd2] rounded-3xl shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
                {/* Header pattern */}
                <div className="absolute top-0 right-0 left-0 h-2 bg-[#d4a373]"></div>

                <div className="space-y-2 text-right border-b border-gray-100 pb-4">
                  <span className="inline-block bg-[#1e3b40]/10 text-[#1e3b40] text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full">
                    فحص الفصل {currentChapter.chapterNum} التفاعلي 📊
                  </span>
                  <h2 className="text-2xl font-black text-[#1e3b40] font-tajawal">{currentChapter.quiz.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold">{currentChapter.quiz.description}</p>
                </div>

                {!showQuizResult ? (
                  // Active Question View
                  <div className="space-y-6 text-right">
                    {currentChapter.quiz.questions.map((q, qIndex) => {
                      const isAnswered = !!quizAnswers[q.id];
                      return (
                        <div key={q.id} className="p-5 border border-[#e0dcd2] rounded-2xl space-y-4 bg-[#fffef9]">
                          <span className="inline-block text-[10px] uppercase font-black px-2 py-0.5 rounded bg-[#d4a373]/10 text-[#d4a373]">
                            السؤال {qIndex + 1} من 3
                          </span>
                          <h4 className="font-extrabold text-[#1e3b40] text-sm leading-relaxed">{q.question}</h4>

                          <div className="space-y-2 pt-2">
                            {q.options.map(opt => {
                              const isSelected = quizAnswers[q.id] === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleAnswerSubmit(q.id, opt.id)}
                                  className={`w-full text-right p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-colors ${
                                    isSelected 
                                      ? "bg-[#1e3b40] text-white border-[#1e3b40]" 
                                      : "bg-white border-[#e0dcd2] hover:bg-gray-50 text-gray-800"
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isSelected ? "bg-[#d4a373] text-[#1e3b40]" : "bg-gray-100 text-gray-500"}`}>
                                    {isSelected ? "★" : "○"}
                                  </span>
                                  <span>{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold">تأكد من إجابة كافة التساؤلات لحساب درجات النضج.</p>
                      
                      <button
                        onClick={handleGradeQuiz}
                        disabled={Object.keys(quizAnswers).length < currentChapter.quiz.questions.length}
                        className="bg-[#d4a373] hover:bg-[#c49363] disabled:opacity-40 text-white font-black text-xs py-3 px-6 rounded-full shadow-md transition-all flex items-center gap-1"
                      >
                        <span>إرسال الإجابات والدرجة</span>
                        <ChevronRight className="w-4 h-4 text-white" />
                      </button>
                    </div>

                  </div>
                ) : (
                  // Quiz Score and Corrections
                  <div className="space-y-6 text-right animate-fade-in">
                    
                    {/* Score display block */}
                    <div className="p-8 text-center rounded-2xl bg-gradient-to-tr from-[#1e3b40] to-[#2a5459] text-white space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-[#d4a373] text-3xl font-black">
                        {quizScore} / 3
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-extrabold text-[#d4a373]">
                          {quizScore >= 2 ? "🎉 رائع! تجوزت هذا المسبار بنجاح" : "⚠️ بحاجة لمراجعة دقيقة"}
                        </h4>
                        <p className="text-xs text-gray-200">
                          درجة التحقق العاطفي في هذا البعد السلوكي هي {Math.round((quizScore / 3) * 100)}%.
                        </p>
                      </div>

                      {quizScore < 2 && (
                        <p className="text-xs text-rose-300 max-w-sm mx-auto">
                          يلزمك إجابة صحيحة لسؤالين على الأقل لتمرير تقدم هذا الفصل للشهادة. لا تقلق، اقرأ التوضيحات بالأسفل وأعد الاختبار مجدداً.
                        </p>
                      )}
                    </div>

                    {/* Explanations & Corrections list */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-[#1e3b40] border-b border-gray-100 pb-2">التصحيح وتوضيحات الخبراء العلمية:</h4>
                      
                      {currentChapter.quiz.questions.map(q => {
                        const chosenOpt = q.options.find(opt => opt.id === quizAnswers[q.id]);
                        const isCorrect = !!chosenOpt?.isCorrect;
                        const correctOpt = q.options.find(opt => opt.isCorrect);

                        return (
                          <div key={q.id} className="p-4 rounded-xl border border-gray-150 space-y-2.5 text-xs bg-gray-50/50">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-gray-800">{q.question}</span>
                              <span className={`px-2.5 py-0.5 rounded font-black ${isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                                {isCorrect ? "إجابة صحيحة ✓" : "غلط ✕"}
                              </span>
                            </div>

                            <div className="space-y-1.5 pl-3 border-r-2 border-[#d4a373] pr-2.5 text-gray-600">
                              <p>رأيك: <strong className={isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>{chosenOpt?.text}</strong></p>
                              {!isCorrect && <p>الاستجابة الصحيحة تربوياً: <strong className="text-emerald-700 font-bold">{correctOpt?.text}</strong></p>}
                              <p className="text-[11px] italic font-medium leading-relaxed text-gray-500 pt-1 border-t border-gray-200/50">
                                💡 تفسير الحل: {q.explanation}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button 
                        onClick={restartQuiz}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-3 rounded-full transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#d4a373]" />
                        <span>إعادة إجراء الفحص الحالي</span>
                      </button>

                      {quizScore >= 2 && activeChapterIdx < 4 ? (
                        <button
                          onClick={() => {
                            setActiveChapterIdx(prev => prev + 1);
                            setActiveLessonIdx(0);
                            setShowQuizResult(false);
                          }}
                          className="bg-[#1e3b40] text-white font-black text-xs px-6 py-3.5 rounded-full shadow hover:bg-[#2a5459] transition-transform hover:scale-105"
                        >
                          انتقل للفصل الموالي
                        </button>
                      ) : quizScore >= 2 && activeChapterIdx === 4 ? (
                        <span className="text-xs text-emerald-800 font-black bg-emerald-50 py-2 px-4 rounded-xl border border-emerald-300">
                          🎉 اجتزت فحوصات الدورة كاملة بنجاح!
                        </span>
                      ) : null}
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* 3. DYNAMIC CERTIFICATE GENERATION VIEW (Appears once active course is fully completed) */}
            {isCourseFullyCompleted && (
              <div className="mt-8 bg-white border border-[#e0dcd2] rounded-3xl p-6 sm:p-10 shadow-md space-y-6 text-right animate-fade-in font-tajawal">
                <div className="space-y-1 text-right">
                  <span className="text-[#d4a373] font-black text-xs uppercase tracking-widest font-mono">بوابة التكريم والتخرج 🎖️</span>
                  <h3 className="text-2xl font-black text-[#1e3b40]">وثيقة التخرج المهنية المعتمدة</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    مبارك جهدك! بعد تصفحك للدروس الـ {totalLessonsCount} واجتياز الفحوصات المعنوية بنجاح، يرجى كتابة اسمك في المربع بالأسفل لتنطبع شهادتك للتنزيل والطباعة.
                  </p>
                </div>

                {!isNameSaved ? (
                  // Form to register name
                  <form onSubmit={handleSaveName} className="flex gap-2 max-w-md pt-2">
                    <input 
                      type="text" 
                      required
                      placeholder="ادخل اسمك الكامل ثلاثياً باللغة العربية" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="flex-grow text-sm py-3 px-4 rounded-xl border border-[#e0dcd2] focus:ring-2 focus:ring-[#1e3b40] focus:outline-none text-right"
                    />
                    <button 
                      type="submit"
                      className="bg-[#d4a373] text-white font-black text-xs px-5 rounded-xl hover:bg-[#c49363] transition-colors whitespace-nowrap"
                    >
                      إشهار الشهادة والختم
                    </button>
                  </form>
                ) : (
                  // Render Beautiful Certificate Paper
                  <div className="space-y-6">
                    <div className="p-1 bg-[#1e3b40] rounded-3xl">
                      <div className="bg-[#fffef9] border-4 border-double border-[#d4a373] rounded-2xl p-6 sm:p-12 text-center relative overflow-hidden flex flex-col items-center justify-center space-y-8">
                        {/* Decorative watermark / frames */}
                        <div className="absolute top-2 right-2 opacity-10 select-none text-9xl">🌿</div>
                        <div className="absolute bottom-2 left-2 opacity-10 select-none text-9xl">🏛️</div>

                        <div className="space-y-2">
                          <h1 className="text-xs tracking-widest font-mono text-gray-400 font-extrabold uppercase text-center">Emotional Intelligence Family Academy</h1>
                          <h2 className="text-[#1e3b40] text-xl sm:text-2xl font-black text-center">شهادة واحة الأمان المستقر للذكاء العاطفي الأسري</h2>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 italic font-semibold text-center">تشهد الأكاديمية والمدير العلمي للدورات بسعادة أن:</p>
                          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#d4a373] border-b-2 border-dashed border-[#e0dcd2] px-10 py-1.5 inline-block text-center">
                            {studentName}
                          </h3>
                        </div>

                        <div className="max-w-xl mx-auto space-y-2 leading-relaxed text-xs sm:text-sm text-gray-700 font-semibold text-center">
                          <p>
                            قد أنهى بتميز استثنائي وحضور مستمر دراسة الـ <strong>{totalLessonsCount} درساً مكثفاً</strong> المقررة في برنامجنا المتقدم: 
                            <span className="text-[#1e3b40] font-black"> {activeCurriculum === "custom" && customCurriculum ? `« ${customCurriculum.curriculumTitle} »` : "«أساسيات الذكاء العاطفي الأسري وحل النزاعات»"} </span> 
                            واجتاز كافة مسبارات التقييم المعرفية بنجاح مشهود ليكون مرساة سلام وأمان لمنزله.
                          </p>
                        </div>

                        {/* Signatures and seals */}
                        <div className="w-full flex justify-between items-center pt-8 border-t border-gray-150 text-[10px] text-gray-500 font-semibold px-4 sm:px-12">
                          <div className="text-right space-y-1">
                            <p>المدير واستشاري الدورة:</p>
                            <h5 className="font-extrabold text-gray-800 text-xs text-right">د. عاصم الخالدي</h5>
                            <span className="text-[9px] block text-right">توقيع معتمد</span>
                          </div>

                          <div className="flex flex-col items-center justify-center">
                            {/* Visual Golden Seal */}
                            <div className="w-16 h-16 rounded-full bg-[#d4a373] flex items-center justify-center text-white font-black text-[10px] shadow-lg border-4 border-[#fffef9] animate-pulse">
                              EI SEAL
                            </div>
                            <span className="text-[8px] text-[#d4a373] font-mono mt-1">EST. 2026</span>
                          </div>

                          <div className="text-left space-y-1">
                            <p className="text-left">التاريخ والمطابقة:</p>
                            <span className="font-mono block text-left">{new Date().toLocaleDateString("ar-EG")}</span>
                            <span className="text-[9px] text-[#d4a373] block font-mono text-left">STATUS: VERIFIED</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => {
                          setIsNameSaved(false);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-3 rounded-full transition-colors"
                      >
                        تعديل الاسم المكتوب
                      </button>
                      <button 
                        onClick={() => {
                          window.print();
                        }}
                        className="bg-[#d4a373] hover:bg-[#c49363] text-white font-black text-xs px-6 py-3 rounded-full shadow transition-all hover:scale-105"
                      >
                        🖨️ طباعة الشهادة أو حفظ كـ PDF
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </div>

      {/* AI CUSTOM CURRICULUM GENERATOR MODAL POPUP */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-tajawal animate-fade-in">
          <div className="bg-white border-2 border-[#d4a373] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-right flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#1e3b40] text-white p-6 shadow-md border-b-2 border-[#d4a373]">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    setNewlyGeneratedCurriculum(null);
                    setShowGeneratorModal(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-xl font-bold"
                  disabled={isGenerating}
                >
                  ✕
                </button>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#d4a373] flex items-center gap-2 justify-end">
                    {newlyGeneratedCurriculum ? "تم توليد وتفعيل المنهج التربوي! 🎉" : "تصميم منهج أسري مخصص بالذكاء الاصطناعي"}
                    <Sparkles className="w-5 h-5" />
                  </h3>
                  <p className="text-gray-350 text-xs text-right">
                    {newlyGeneratedCurriculum ? "تم تفعيل الدليل التعليمي وحفظه كمنهاجك النشط الصالح للدراسة" : "تفرّد بدليل تعليمي تفاعلي يركز على تفتيت المشكلات العائلية اليومية لأسرتك"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
              
              {newlyGeneratedCurriculum ? (
                /* Success screen showing generated curriculum results clearly */
                <div className="py-2 flex flex-col space-y-5 text-right font-tajawal animate-fade-in">
                  <div className="flex flex-col items-center justify-center space-y-3 text-center mb-1">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl animate-bounce shadow-inner border border-emerald-200">
                      🎉
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-emerald-800">تهانينا! تم تصميم وتفعيل منهجك المخصص بنجاح</h4>
                      <p className="text-xs text-gray-500 font-bold max-w-md mt-1 mx-auto leading-relaxed">
                        لقد تم دمج التوجيهات ومسارات الذكاء العاطفي الموجه لتفكيك المعضلات التي طرحتها، ونسج منهج دراسي تفاعلي استثنائي لأسرتك.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#1e3b40] text-white p-5 rounded-2xl space-y-2.5 border-b-4 border-[#d4a373] relative overflow-hidden shadow-sm">
                    <div className="absolute left-3 top-3 opacity-15 select-none text-6xl">🧠</div>
                    <span className="text-[10px] text-[#d4a373] font-black uppercase tracking-widest block">المنهج النشط الجديد حالياً</span>
                    <h5 className="font-extrabold text-[#fffef9] text-base leading-snug">{newlyGeneratedCurriculum.curriculumTitle}</h5>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {newlyGeneratedCurriculum.curriculumDescription}
                    </p>
                    <div className="pt-2 px-1 border-t border-[#faf8f5]/10 flex flex-wrap items-center justify-between text-[10px] text-gray-300 gap-2">
                      <span>الفصول الدراسية: <strong className="text-white font-extrabold">{newlyGeneratedCurriculum.chapters.length} فصول تفاعلية</strong></span>
                      <span>تحدي عائلتك: <strong className="text-[#d4a373] font-extrabold">« {newlyGeneratedCurriculum.topic} »</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h5 className="text-xs font-black text-[#1e3b40] mr-1">📚 الفصول التعليمية ومسارات الفحص التي تمت صياغتها:</h5>
                    <div className="grid grid-cols-1 gap-2.5">
                      {newlyGeneratedCurriculum.chapters.map((chap, cIdx) => (
                        <div key={chap.id} className="flex gap-3.5 items-center justify-start text-right bg-white p-3 rounded-2xl border border-gray-150 shadow-xs relative overflow-hidden">
                          <span className="text-2xl bg-[#faf8f5] p-2.5 rounded-xl border border-gray-100 flex-shrink-0">{chap.icon || "📖"}</span>
                          <div className="space-y-0.5 flex-grow">
                            <span className="text-[9px] text-[#d4a373] font-black block">الفصل {cIdx + 1}</span>
                            <h6 className="font-extrabold text-[#1e3b40] text-xs sm:text-sm">{chap.title}</h6>
                            <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                              المحتوى: {chap.lessons.length} دروس مطولة معمقة + اختبار نهاية الفصل تفاعلي ومسبار معرفي.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-250 text-emerald-850 text-xs font-semibold rounded-2xl p-4 flex gap-3 items-start leading-relaxed shadow-xs">
                    <div className="text-xl flex-shrink-0">✨</div>
                    <p>
                      <strong>دليل التفعيل والاستمرار:</strong> تم تثبيت وحفظ هذا المنهج تلقائياً في قائمة مناهجك المخصصة وتفعيله كمنهج دراسي أساسي لرحلتك. يمكنك الآن الانتقال للصفحة وقراءة دروسه، وخوض تقييماته، وطباعة شهادة ممتازة باسمك عند الانتهاء والنجاح!
                    </p>
                  </div>

                  {/* Start learning Action */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setNewlyGeneratedCurriculum(null);
                        setShowGeneratorModal(false);
                      }}
                      className="flex-grow bg-[#1e3b40] hover:bg-[#2a5459] text-white py-3.5 px-6 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95"
                    >
                      <span>ابدأ دراسة منهج عائلتك المخصص الآن 🚀</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewlyGeneratedCurriculum(null);
                        setGenerationTopic("");
                        setGenerationError("");
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 border border-gray-200"
                    >
                      <span>🔧 تصميم منهج آخر</span>
                    </button>
                  </div>
                </div>
              ) : !isAdmin ? (
                /* Elegant Admin Login/Passcode Lock Screen */
                <form onSubmit={handleAdminLogin} className="py-4 flex flex-col space-y-4 text-right animate-fade-in max-w-md mx-auto">
                  <div className="flex flex-col items-center text-center space-y-3 mb-2">
                    <div className="w-16 h-16 rounded-full bg-amber-50 border border-[#d4a373] text-amber-655 flex items-center justify-center text-2xl shadow-inner">
                      🔒
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#1e3b40]">خاص بمدير النظام والمسؤول (الأدمن)</h4>
                      <p className="text-xs text-gray-500 font-black max-w-sm mx-auto leading-relaxed mt-1">
                        عذراً، توليد الأجهزة التعليمية والمناهج المخصصة ميزة متقدمة وحصرية لمدير المنصة وقائد الأكاديمية فقط.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 max-w-sm mx-auto w-full">
                    <label className="block text-xs font-black text-gray-500 mr-1">
                      البريد الإلكتروني للأدمن المسؤول:
                    </label>
                    <input
                      type="email"
                      required
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      placeholder="example@domain.com"
                      className="w-full text-center text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3b40] focus:border-transparent font-mono"
                      dir="ltr"
                    />
                  </div>

                  {adminLoginError && (
                    <div className="bg-red-50 border border-red-150 text-red-800 p-3 rounded-xl text-xs font-bold leading-normal max-w-sm mx-auto w-full">
                      ⚠️ {adminLoginError}
                    </div>
                  )}

                  <div className="pt-3 max-w-sm mx-auto w-full flex gap-3">
                    <button
                      type="submit"
                      className="flex-grow bg-[#1e3b40] hover:bg-[#2a5459] text-white py-3 px-5 rounded-sm text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 rounded-xl"
                    >
                      تأكيد الدخول كمسؤول 🛡️
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGeneratorModal(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-5 rounded-xl text-xs font-semibold transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              ) : !isGenerating ? (
                <>
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-[#1e3b40] mr-1">
                      اكتب التحدي، المشكلة أو الموضوع المراد تكييف المنهج له:
                    </label>
                    <textarea
                      rows={4}
                      value={generationTopic}
                      onChange={(e) => setGenerationTopic(e.target.value)}
                      placeholder="امثلة: 'تربية مراهق هادئ عن المذاكرة وعنيد جداً'، 'تخفيف المشاحنات الزوجية اليومية الناجمة عن ضغط المصاريف'، 'إدارة الغضب مع الأطفال عند التمرد'، 'تأسيس ثقافة الحوار الإيجابي بدلاً من الصراخ واللوم المتكرر'..."
                      className="w-full text-sm p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3b40] focus:border-transparent text-right resize-none"
                    />
                  </div>

                  {/* Suggestions tags */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500 mr-1">أفكار ومقترحات مقترحة لتبدأ بها:</span>
                    <div className="flex flex-wrap gap-2.5 justify-start">
                      {[
                        "الزوجان: استعادة لغة المشاعر والأمان بعد الخلاف والفتور",
                        "تربية المراهقين: التواصل الذكي وبناء الثقة دون صدام",
                        "الوالدية الهادئة: التحكم بالانفعالات وتجنب الصراخ مع الأطفال",
                        "الصلابة النفسية للأسرة وقت التوتر المالي والضغوط المعيشية"
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setGenerationTopic(tag)}
                          className="bg-[#faf8f5] hover:bg-[#1e3b40]/5 border border-gray-150 hover:border-[#d4a373] text-gray-750 text-xs py-2 px-3.5 rounded-full transition-all text-right font-medium"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {generationError && (
                    <div className="bg-red-50 border border-red-200 text-red-850 p-4 rounded-2xl text-xs font-semibold leading-relaxed">
                      ⚠️ {generationError}
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleGenerateCurriculum(generationTopic)}
                      disabled={!generationTopic.trim()}
                      className="flex-1 bg-[#1e3b40] hover:bg-[#2a5459] disabled:opacity-40 disabled:hover:bg-[#1e3b40] text-white py-3.5 px-6 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg animate-pulse-slow"
                    >
                      <Sparkles className="w-4 h-4 text-[#d4a373]" />
                      صمم المهج التفاعلي المخصص الآن
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGeneratorModal(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-6 rounded-2xl text-sm font-semibold transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              ) : (
                /* Sophisticated, engaging loading screen representing professional family advice weaving */
                <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
                  
                  {/* Decorative golden progress spinner */}
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-[#1e3b40]/10"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#d4a373] border-r-[#d4a373] animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">🪄</div>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h4 className="text-lg font-black text-[#1e3b40] animate-pulse">جاري غزل المنهج الدراسي الجديد...</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      يقوم مستشار العلاقات والذكاء العاطفي بمراجعة المعاضل التربوية والسلوكية، ورسم 3 فصول دراسية غنية تشمل 9 دروس مفصلة مدعومة بالواجبات السلوكية المنزلية لتطبيقها مع الأزواج والأبناء.
                    </p>
                  </div>

                  {/* Faux steps progress indicating professional grade execution */}
                  <div className="w-full max-w-sm space-y-2 bg-[#faf8f5] p-4 rounded-2xl border border-gray-150 text-right">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#1e3b40]">
                      <span className="text-[#d4a373] font-bold">نشط...</span>
                      <span>1. تحليل نمط التحديات الأسرية وتحديد المحفزات</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-450">
                      <span>الانتظار...</span>
                      <span>2. صياغة 3 مستويات من الدروس والتمارين التطبيقية</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-450">
                      <span>الانتظار...</span>
                      <span>3. إرساء أسئلة ومسبارات الفحص الذاتي التفاعلية</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 font-mono text-center">ESTIMATED TIME: 10-15s • DO NOT REFRESH OR CLOSE</p>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
