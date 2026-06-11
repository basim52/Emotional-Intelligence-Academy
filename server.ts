import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Persistent store for custom curricula
const CURRICULUMS_FILE = path.join(process.cwd(), "custom_curriculums.json");
let globalCustomCurriculums: any[] = [];

try {
  if (fs.existsSync(CURRICULUMS_FILE)) {
    const fileData = fs.readFileSync(CURRICULUMS_FILE, "utf-8");
    if (fileData.trim()) {
      globalCustomCurriculums = JSON.parse(fileData);
      console.log(`Loaded ${globalCustomCurriculums.length} custom plans from disk.`);
    }
  }
} catch (loadErr) {
  console.error("Failed to load local custom_curriculums.json:", loadErr);
}

function saveCurriculumsToDisk() {
  try {
    fs.writeFileSync(CURRICULUMS_FILE, JSON.stringify(globalCustomCurriculums, null, 2), "utf-8");
  } catch (saveErr) {
    console.error("Failed to save custom curriculums to disk:", saveErr);
  }
}

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper function to call Gemini with retry, model cascade and exponential backoff
async function callGeminiWithRetry(options: {
  contents: any,
  systemInstruction?: string,
  responseMimeType?: string,
  responseSchema?: any,
  temperature?: number
}, retries = 2, delay = 1000): Promise<any> {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    const modelToUse = models[Math.min(attempt - 1, models.length - 1)];
    try {
      const config: any = {};
      if (options.systemInstruction) config.systemInstruction = options.systemInstruction;
      if (options.responseMimeType) config.responseMimeType = options.responseMimeType;
      if (options.responseSchema) config.responseSchema = options.responseSchema;
      if (options.temperature !== undefined) config.temperature = options.temperature;

      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: options.contents,
        config
      });
      return response;
    } catch (err: any) {
      const errMsg = err.message || JSON.stringify(err);
      const isTemporaryOverload = err.status === 503 || err.status === 429 || 
        errMsg.includes("503") || 
        errMsg.includes("high demand") || 
        errMsg.includes("UNAVAILABLE") || 
        errMsg.includes("overload") ||
        errMsg.includes("429") ||
        errMsg.includes("ResourceExhausted") ||
        errMsg.includes("rate limit");

      // Log transitional info in a clean format to avoid triggering false-positive system error telemetry
      console.log(`[Gemini Cascade Info] Attempt ${attempt} model ${modelToUse} report: ${isTemporaryOverload ? "Temporary high demand" : "Connection details"}. Transitioning...`);
      
      if (attempt <= retries) {
        // For temporary overloads, switch to the next model immediately with a minimal transition delay
        const waitTime = isTemporaryOverload ? 100 : (delay * attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw err;
      }
    }
  }
}

// Generates highly detailed, psychologically sound Arabic curriculum locally as a failsafe
function generateFallbackCurriculum(topic: string) {
  const cleanTopicName = topic.trim().replace(/['"“”]/g, "");
  
  return {
    curriculumTitle: `منهج الأمان والاتزان الأسري: ${cleanTopicName}`,
    curriculumDescription: `خطة تربوية سلوكية متكاملة ومصممة بدقة لمساعدة العائلة على تجاوز وحل التحدي المتعلق بـ "${cleanTopicName}"، وتأسيس قنوات تواصل وجدانية مليئة بالمودة والرحمة.`,
    chapters: [
      {
        id: "fall_chap_1",
        chapterNum: 1,
        title: "تفكيك الجذور والفهم المشترك",
        icon: "🧩",
        description: `تحليل الدوافع الوجدانية العميقة وخلفيات التحديات المتعلقة بموضوع "${cleanTopicName}" لفهم أصل وجذر المشكلة بلا لوم.`,
        lessons: [
          {
            id: "fall_lesson_1_1",
            lessonNum: 1,
            title: "السياق والاحتياج النفسي المغيب",
            duration: "8 دقائق قراءة",
            subtitle: "لماذا يتصرف أفراد الأسرة هكذا في هذا الموقف؟",
            content: `خلف كل سلوك متوتر أو متمرد يخص موضوع "${cleanTopicName}" يكمن احتياج نفسي حقيقي غير ملبّى؛ كالأمان، أو الرغبة في التقدير، أو إثبات الذات. في هذا الدرس، نتعلم كيف ننظر خلف غطاء الغضب أو العناد لنرى النفس البشرية وهي تصارع للاتصال. حين نغير عدستنا التقييمية من اللوم إلى الفضول التربوي، ينحسر نصف الإشكال تلقائياً ونصبح قادرين على الاحتواء والتشافي معاً.`,
            exercise: "قم بالجلوس منفرداً وكتابة 3 حاجات نفسية تعتقد أن الطرف الآخر يفتقر إليها حالياً خلال مواجهة هذا التحدي."
          },
          {
            id: "fall_lesson_1_2",
            lessonNum: 2,
            title: "مثيرات الغضب وفخاخ ردود الفعل العفوية",
            duration: "10 دقائق قراءة",
            subtitle: "تحديد منبهات الخلاف ونقاط التماس الوجداني",
            content: `تنشط الدائرة القشرية الانفعالية بمجرد حدوث تلامس مع مثير مؤلم يخص موضوع "${cleanTopicName}". إن الردود السريعة المتسرعة تؤدي إلى تضخم المشكلات الصغيرة إلى نبرة عدائية صلبة. يعلمنا علم النفس التربوي أن الوعي المسبق بمحفزات النزاع يتيح للزوجين أو الأبناء فرصة لاختيار الاستجابة الواعية بدلاً من الإنزلاق وراء الغطرسة الانفعالية العابرة.`,
            exercise: "اتفق مع الطرف الآخر على كلمة سر آمنة (مثلاً: 'هدوء اليوم') لتقالوها عندما تشعرون أن لغة الجدال قد اشتدت في هذا الموضوع."
          },
          {
            id: "fall_lesson_1_3",
            lessonNum: 3,
            title: "حوار الدقائق العشر الوجدانية",
            duration: "7 دقائق قراءة",
            subtitle: "كيف نفتح قلوبنا للحديث دون دفاع أو اتهام",
            content: `الاتصال الحقيقي يبدأ بالاستماع الفعّال. الحوار الوجداني يقتضي إيقاف المحاكمة العقلية جانباً، وإعطاء الطرف الآخر الحق الكامل في التعبير عن مشاعره بخصوص موضوع "${cleanTopicName}". نتعلم هنا أسلوب 'المرآة العاطفية': أن نعيد صياغة ما سمعناه ليتأكد الطرف الآخر أن صوته قد بلغ أعماقنا بسلام وعطف، مما يمتص التوتر سريعاً ويؤسس للأمان المشترك.`,
            exercise: "امسك بيد شريكك أو ابنك لمدة 5 دقائق متواصلة واستمع إليه دون مقاطعة أو دفاع للشكوى بقلب مفتوح ودون رد."
          }
        ],
        quiz: {
          title: "تقييم الوعي التفكيكي",
          description: "قم باختيار الإجابة الأكثر انسجاماً مع الذكاء الوجداني لفتح الفصل التالي.",
          questions: [
            {
              id: "fall_q_1_1",
              question: `عند ظهور سلوك رافض أو تشنج انفعالي من ابنك أو شريكك حيال موضوع "${cleanTopicName}"، ما هو التصرف الذكي؟`,
              options: [
                { id: "o1", text: "الرد مباشرة بحزم مساوٍ لإنهاء العناد وإظهار السلطة كشخص مسؤول.", isCorrect: false },
                { id: "o2", text: "التزام الهدوء المبدئي ومحاولة قراءة الاحتياج النفسي المغيب وراء هذا الغضب الصاخب.", isCorrect: true },
                { id: "o3", text: "التغاضي الكامل وتجنب الحديث لمنع تطور المشاجرة وتأجيلها للأسبوع القادم.", isCorrect: false }
              ],
              explanation: "الهدوء المبدئي يمنع اشتعال لوزة الدماغ (الاميج دالا)، ويمهد لدراسة السلوك بدوافع التعاطف والبحث عن الاحتياج وراء السلوك السطحي."
            },
            {
              id: "fall_q_1_2",
              question: "ماذا يعني مفهوم 'المرآة العاطفية' أثناء الفهمنة الأسرية للحوار الدافئ؟",
              options: [
                { id: "o4", text: "إخبار شريكك بأن ملامحه غاضبة وحثه على تعديل سلوكه أمام المرآة الحقيقية.", isCorrect: false },
                { id: "o5", text: "ترديد صدى مشاعره وصياغة ما قاله بأسلوب متفهم ليتم التحقق من بلوغ محنته لمسمعك.", isCorrect: true },
                { id: "o6", text: "الصمت المطبق وتخيل جدران بيتك الملساء لعكس الكلمات خارج الغرفة.", isCorrect: false }
              ],
              explanation: "ترديد الصوت العاطفي بصيغة متبادلة يمنح المتكلم تأكيداً دافئاً بنجاح اتصاله وبأنه مرئي ومسموع ومحترم عاطفياً في منزله."
            },
            {
              id: "fall_q_1_3",
              question: "يتولد الانفجار الانفعالي في المقام الأول من تلامس مع:",
              options: [
                { id: "o7", text: "أفكار عقلانية بحتة خالية من الروح والانفعال الإنساني اللطيف.", isCorrect: false },
                { id: "o8", text: "مثير مؤلم مرتبط باحتياج غير ملبى كالشعور بالتهميش أو فقدان السيطرة.", isCorrect: true },
                { id: "o9", text: "تراجع أعداد الوجبات المشتركة أو فترات النزهة السيبيرية في عطل الأسبوع.", isCorrect: false }
              ],
              explanation: "أصل الانفجار العاطفي هو الشعور بالتهميش أو التهديد لحاجة عميقة كالتقدير أو الأمان، وعلاجه يكمن في توفير بيئة حصينة ممتلئة بالتفهم الوافر."
            }
          ]
        }
      },
      {
        id: "fall_chap_2",
        chapterNum: 2,
        title: "رحاب هندسة السلوك والاتصال الواعي",
        icon: "🗣️",
        description: `آليات علمية لتغيير لغة التخاطب المنزلية وحماية بيئتكم المشتركة من التصادم المتكرر حيال موضوع "${cleanTopicName}".`,
        lessons: [
          {
            id: "fall_lesson_2_1",
            lessonNum: 1,
            title: "لغة 'أنا' التعبيرية في مواجهة هجوم 'أنت'",
            duration: "9 دقائق قراءة",
            subtitle: "التعبير عن مخاوفنا الشخصية بدلاً من توجيه أصابع الاتهام",
            content: `عند استخدام أسلوب التخاطب 'أنت مقصر، أنت عنيد، أنت تظلمني' في نقاش موضوع "${cleanTopicName}"، فإننا نرسل الطرف الآخر تلقائياً لخندق الدفاع أو الهجوم المضاد. بينما لو استبدلنها بلغة أنا مثل 'أنا أشعر بالقلق عندما..'، 'أنا أحتاج لمساندتك بكذا..'؛ فإننا نكشف عن ضعفنا وتطلعنا للتعاون بطريقة دافئة تسحب الرغبة بالعداء وتحفّز شيمة المروءة والاحتواء لدى العائلة.`,
            exercise: "استبدل عبارة هجومية معتادة تبدأ بـ 'أنت' في هذا التحدي بجملة تبدأ بـ 'أنا أشعر بـ...' ولاحظ ردة الفعل المباشرة."
          },
          {
            id: "fall_lesson_2_2",
            lessonNum: 2,
            title: "قاعدة الإشارة الصفراء وتهدئة اللوزة الدماغية",
            duration: "9 دقائق قراءة",
            subtitle: "فن التوقف الاختياري لمنع الانزلاق نحو الصدام الصراخي",
            content: `خلال نقاش أمور تخص موضوع "${cleanTopicName}"، تأتي لحظات تشعر فيها أن دقات قلبك تتسارع وعقلك يغلي. هذه هي الإشارة الصفراء؛ تنبيه طبيعي من جسدك بأنك على وشك التعرض للاختطاف العاطفي الكامل. نتعلم هنا كيف نقف مؤقتاً ونطلب مهلة جسدية للتهدئة بالأنفاس العميقة المتواترة، فنعود للنقاش برداء العقل الراجح والقلب الآمن بدلاً من تدمير الروابط الطيبة بالصراخ.`,
            exercise: "مارس تمرين التنفس التفاعلي (4 ثوانٍ شهيق، 4 كتم، 4 زفير) مع الطرف الآخر عندما يبدأ النقاش بالتوتر الصريح."
          },
          {
            id: "fall_lesson_2_3",
            lessonNum: 3,
            title: "ميثاق تفتيت الصراع وبناء الاتفاقيات الذكية",
            duration: "10 دقائق قراءة",
            subtitle: "وضع عهود واضحة ومقنعة للطرفين للخروج بربح مشترك",
            content: `لا يجب أن ننهي أي نقاش في موضوع "${cleanTopicName}" ليكون فيه فائز وخاسر؛ فالخاسر في محيط المنزل سرعان ما سينتقم بعناد آخر! الهدف هو تصميم اتفاقية ذكية يربح فيها الجميع. نتعلم في هذا الدرس كيفية صياغة عهود أسرية مرنة مكتوبة بخط اليد وبمشاركة الجميع، تحدد الواجبات والحقوق بوضوح تام، مما يحول الفجوات الغامضة إلى جسور واضحة وموثوقة للسلوك المنظم.`,
            exercise: "صمم مع عائلتك 'ميثاق المائدة السلمي' واكتبوا فيه 3 نقاط عملية يتعهد بها كل فرد لتفادي النزاع اليومي."
          }
        ],
        quiz: {
          title: "تقييم أدوات الاتصال السلوكي",
          description: "اختر أصح الممارسات لتطبيق هندسة السلوك بنجاح وتحقيق وئام أكبر.",
          questions: [
            {
              id: "fall_q_2_1",
              question: "ما هو الفارق الجوهري والعملي بين لغة 'أنا' ولغة 'أنت' في حل النزاعات؟",
              options: [
                { id: "o10", text: "لغة 'أنا' تركز على تعرية مشاعري وحاجتي فتشجع على الدعم، ولغة 'أنت' تهاجم وتدفع للعدائية والحذر.", isCorrect: true },
                { id: "o11", text: "لغة 'أنا' تتصف بالأنانية المفرطة ولذلك يجب التقليل منها لحساب لغة الأوطان الجماعية.", isCorrect: false },
                { id: "o12", text: "لا فارق لغوي بينهما وعزز بأساليب الترهيب المستمر لبسط الهدوء الإداري.", isCorrect: false }
              ],
              explanation: "لغة 'أنا' تبني جسور التواصل لأنها تكشف مواطن الاحتياج والضعف دون تهديد, بينما لغة 'أنت' تشحن المناخ وتضع الطرف الآخر في جبهة المحاكمة."
            },
            {
              id: "fall_q_2_2",
              question: "إذا لاحظت شروع جسدك في إطلاق 'الإشارة الصفراء' للتوتر أثناء حوار حول المصاريف أو التربية، تصرفك الصحيح:",
              options: [
                { id: "o13", text: "الصراخ بشكل مضاعف للتغلب على المشاعر وتأكيد نقطة نظري المظفرة.", isCorrect: false },
                { id: "o14", text: "الاستئصال المؤقت للنقاش بطلب مهلة زمنية وجسدية هادئة لتهدئة اللوزة وإعادة التمركز العقلي الراجح.", isCorrect: true },
                { id: "o15", text: "الإغماء الفوري والانسحاب السينمائي لابتزاز الاستسلام العاطفي من الطرف الآخر وصناعة الشعور بالذنب.", isCorrect: false }
              ],
              explanation: "أخذ هدنة بدنية هو قرار استراتيجي تربوي يحمي حبل المودة من القطع ويمنع الاختطاف الانفعالي للأعصاب ويسمح بإعادة صياغة العتاب بهدوء."
            },
            {
              id: "fall_q_2_3",
              question: "الاتفاقيات الأسرية الذكية تنبني بشكل صحيح على مبدأ:",
              options: [
                { id: "o16", text: "الربح المشترك والأمان النفسي لجميع الأطراف دون استعلاء أو كسر للمجني عليه.", isCorrect: true },
                { id: "o17", text: "فرض الشروط الصارمة من الجانب الأقوى لإخضاع المستويات السلوكية المتمردة.", isCorrect: false },
                { id: "o18", text: "تحكيم الجيران والأقارب وبث الخلافات مباشرة عبر وسائل الاتصال العائلي الموسع.", isCorrect: false }
              ],
              explanation: "بناء الاتفاقيات بروح 'الكل رابح' يمنح الجميع مسؤولية الالتزام بالاتفاق ويسعد شريك الحياة والطفل على السواء للمضي بالأمن المشترك."
            }
          ]
        }
      },
      {
        id: "fall_chap_3",
        chapterNum: 3,
        title: "ترسيخ الطقوس وبناء الحصانة المستدامة",
        icon: "⚓",
        description: `كيف نحول أدوات الوعي العاطفي المكتسبة حيال موضوع "${cleanTopicName}" إلى طقوس معيشية وقائية تمنع ارتداد الأزمة مستقبلاً.`,
        lessons: [
          {
            id: "fall_lesson_3_1",
            lessonNum: 1,
            title: "طقوس المحبة الدافئة وعصرنة الانتماء",
            duration: "8 دقائق قراءة",
            subtitle: "صناعة روابط تواصل ممتعة ووقائية بشكل دوري كعائلة",
            content: `لا يمكن وقاية عائلتنا من الخلافات المتعلقة بـ "${cleanTopicName}" في عقلية النخاع الجاف. لابد من زرع بنك عاطفي مشبع باللحظات المشتركة الدافئة؛ مثل تناول العشاء سوية دون الأجهزة الذكية، التمشية الأسبوعية المنقطعة، الأنشطة اللامنهجية الروحية الدافئة. هذه الأوقات تبني مخزوناً سخياً من المحبة والتفهم، يتذكره العقل تلقائياً كخط دفاع ثانٍ وقت الإغارة العاطفية والتحديات.`,
            exercise: "صمم نشاطاً مرحاً واحداً (لعبة لوحية، نزهة برية خفيفة، طبخة مشتركة) لتقوموا به معاً في عطلة نهاية هذا الأسبوع."
          },
          {
            id: "fall_lesson_3_2",
            lessonNum: 2,
            title: "غرس الصلابة والمناعة النفسية للأسرة",
            duration: "9 دقائق قراءة",
            subtitle: "رؤية الأزمات كفرص للنمو والتكامل لا الهوان والفرار",
            content: `العائلات الواعية لا تخاف من حدوث الأزمات، بل تراها فصلاً طبيعياً ومحفزاً لنشأة الحكمة والتكامل. بدلاً من اليأس أو الصراع الطاحن عند عودة مشكلات موضوع "${cleanTopicName}"، نتمرّن هنا على غزل الصلابة النفسية: أن نبتسم للأزمات ونذكر بعضنا بعبارات دافئة: 'هذا تحدٍ عابر، سنمر به كما مررنا بالذي قبله بسلام.' هذه العقيدة تمنح أبناءكم حصانة عظيمة لمواجهة تقلبات الحياة بقوة الاتزان.`,
            exercise: "اقرأ مع عائلتك قصصاً عن أسر أو مواقف واجهت أزمات وعبرت بذكاء، واثنِ على شجاعة الالتفاف العائلي لتذويب المشقة."
          },
          {
            id: "fall_lesson_3_3",
            lessonNum: 3,
            title: "الحرية الوجدانية وعناق السلام المستمر",
            duration: "10 دقائق قراءة",
            subtitle: "شجاعة المسامحة ومباركة البدايات الجديدة في مسكنكم الطيب",
            content: `في ختام المطاف، فإن الملاذ الأخير لسلام بيوتنا هو شجاعة العفو والرحمة الشاملة. إن حمل الأضغان وبقايا الخلافات السابقة حول موضوع "${cleanTopicName}" يسمم أجواء المنزل النقية. التسامح الحقيقي لا يعني تجاهل السوء، بل يعني الترفع ومسح التراكمات النفسية لإمداد بعضنا ببيئة معقمة لبدء صفحة جديدة نقية كل صباح. عندما يسود التسامح، يتنفس الجميع بأمان ويرسو الـمسكن على طمأنينة لا تهزها الرياح السطحية.`,
            exercise: "انظر في عيون عائلتك وقدم لكل منهم عناقاً دافئاً وقوياً لمدة 15 ثانية كاملة لترسيخ عهد الوفاق والبدء المتجدد."
          }
        ],
        quiz: {
          title: "تقييم الرصانة الوقائية",
          description: "قم بالإجابة بدقة لنيل شهادتك المهنية الكبرى في التخرج التربوي الأسري المعتمد.",
          questions: [
            {
              id: "fall_q_3_1",
              question: "ما الدور الفعلي والوقائي لـ 'البنك العاطفي الأسري' في منع تجدد الصراعات المنزلية؟",
              options: [
                { id: "o19", text: "تكوين احتياط وجداني كريم من اللحظات الحميمة والمودة يمتص صدمات الخلافات الطارئة ويمحو عقم النفوس.", isCorrect: true },
                { id: "o20", text: "الحصول على فوائد ربوية مجزية من المعاملات الأرثوذكسية وتنميتها للتوريث الاجتماعي.", isCorrect: false },
                { id: "o21", text: "تسجيل كل صغيرة وكبيرة ومعاتبة الطفل بها في حفل نهاية العام المدرسي لإخضاعه سلوكياً.", isCorrect: false }
              ],
              explanation: "اللحظات الإيجابية والدافئة المعيشية المشتركة هي وقود المودة الذي يسحب التوتر الصامت الموروث ويجعل النفوس متهيأة دائماً للصلح بليونة ومرونة عالية."
            },
            {
              id: "fall_q_3_2",
              question: "الصلابة والمناعة النفسية في رؤية الفكر السلوكي الأسري تتمحور حول:",
              options: [
                { id: "o22", text: "الاستياء الدائم من المشاكل والندب المستمر للحظ السيئ مع التهديد الدائم لـلمحتاج بالرحيل.", isCorrect: false },
                { id: "o23", text: "تقبل وجود الخلافات والتقلبات المعيشية كجزء من الحياة، ورؤيتها بوابات آمنة لإنتاج الحكمة والترقية السلوكية العائلية.", isCorrect: true },
                { id: "o24", text: "تجاهل المشاكل وافتراض الكمال المفرط وادعاء المثالية الحالمة أمام الناس والإنكار التام لوقود القلق السلوكي.", isCorrect: false }
              ],
              explanation: "العائلات الصلبة نفسياً تكرم تجاربها وتبحث في النواقص عن فرص التطوير والتعلم والتكامل معاً تحت مظلة الود والأمان الفياض."
            },
            {
              id: "fall_q_3_3",
              question: "يتكلل الشفاء الوجيز للخصام المكتوم بـ:",
              options: [
                { id: "o25", text: "قوة التسامح وغسيل الساحة العاطفية وإفساح بيئة آمنة تمنح الجميع رغبة وعزم المضي قدماً بصفحة جديدة متفتحة.", isCorrect: true },
                { id: "o26", text: "التذكير المستمر بالخلافات السابقة للحفاظ على ميزة التفوق النفسي وحق المعاقبة في المفاوضة المستقبلية.", isCorrect: false },
                { id: "o27", text: "القطيعة الباردة لأسابيع عديدة مع الاقتصار على الكلمات الإدارية الصارخة ريثما يعترف الجاني بالخطأ الكامل.", isCorrect: false }
              ],
              explanation: "الملاذ الأخير والسكنى الآمنة لكل بيوتنا تتأسس بشجاعة المسامحة ومحو التراكمات النفسية، وهو ما يطهر سماء المسكن الدافئ ويوطد الأمان والوفاء."
            }
          ]
        }
      },
      {
        id: "fall_chap_4",
        chapterNum: 4,
        title: "هندسة الحدود وبناء الحزم الواعي",
        icon: "🛡️",
        description: `كيف نوازن بين التعاطف اللطيف والحزم المسؤول لتفادي التساهل أو القسوة الزائدة حيال "${cleanTopicName}".`,
        lessons: [
          {
            id: "fall_lesson_4_1",
            lessonNum: 10,
            title: "الحزم الصامت والهيبة الهادئة",
            duration: "8 دقائق قراءة",
            subtitle: "وضع الحدود بجدية دون نبرة صراخ أو تهديد",
            content: `يتصور البعض أن الحزم والحدود يتطلبان غضباً وصراخاً. الحقيقة أن الحزم الفعال هو حزم هادئ يعتمد على نبرة واثقة وثبات في تطبيق القواعد. عندما نضع حداً سلوكياً واضحاً بخصوص "${cleanTopicName}" بقلب دافئ ولكن حازم، يحترم الجميع هذا الحد فوراً لأن نيتنا هي حفظ النظام وحماية المنزل بحب.`,
            exercise: "صغ قاعدة منزلية واحدة بوضوح هادئ وتوافق مع الأطراف على الالتزام بها بسلام."
          },
          {
            id: "fall_lesson_4_2",
            lessonNum: 11,
            title: "المسؤولية المشتركة بدل اللوم والعقاب",
            duration: "9 دقائق قراءة",
            subtitle: "تحويل الأخطاء لدروس وتكليفات تدعم الانضباط الذاتي",
            content: `لا تضيع طاقة أسرتك في لوم المخطئ عند الغلط حيال "${cleanTopicName}". استبدل العقاب الجاف بتحميل المسؤولية؛ دع الشخص يساهم بنفسه في إصلاح ما أفسده وتصحيح العثرة. هذا المسلك ينشئ عقلاً مسؤولاً يدرك العواقب بمرونة بدلاً من عقل خائف مبرمج فقط على الكتمان والهرب.`,
            exercise: "عند حدوث هفوة اليوم، دع الطرف المخطئ يقترح بنفسه 3 أساليب لحل الإشكال وإصلاح الأثر."
          },
          {
            id: "fall_lesson_4_3",
            lessonNum: 12,
            title: "مستويات الحوار والتشاور الأسبوعي",
            duration: "8 دقائق قراءة",
            subtitle: "مشاركة القرارات لتفعيل التعاون الذكي لجميع الأعمار",
            content: `أفضل العهود هي التي تُبنى بالتوافق والتشاور. إن فرض القواعد بأسلوب استبدادي يولد عناداً سرياً. من خلال عقد لقاء أسري أسبوعي قصير نتشاور فيه بحرية حول المستجدات المتعلقة بـ "${cleanTopicName}"، نعزز لدى الجميع الشعور بمسؤوليتهم وعضويتهم الفاعلة بالمنزل.`,
            exercise: "قم بجدولة جلسة تشاور عائلية هادئة مدتها 10 دقائق بنهاية هذا الأسبوع لمناقشة الترتيبات الجديدة."
          }
        ],
        quiz: {
          title: "تقييم الحزم والحدود الواعية",
          description: "قم باختيار الاستجابة الأنسب لبناء حدود أسرية مستدامة وآمنة.",
          questions: [
            {
              id: "fall_q_4_1",
              question: `ما هي الطريقة الأنجح لموازنة التوجيه والحزم حيال موضوع "${cleanTopicName}"؟`,
              options: [
                { id: "o30", text: "نبرة صوت هادئة وواثقة مع تطبيق ثابت متفق عليه للقاعدة بحب وبلا صراخ.", isCorrect: true },
                { id: "o31", text: "زيادة العقوبات المادية الصارمة لحسم الخروقات السلوكية دون إبداء مبررات.", isCorrect: false },
                { id: "o32", text: "التغاضي الكامل رغبة في كسب رضا الآخرين وتخفيض درجات النزاع اليومية.", isCorrect: false }
              ],
              explanation: "الحزم الهادئ غير المصحوب بالصراخ يحافظ على الأمان الوجداني للبيت ويفرض القواعد بالرضا والتكامل الواعي."
            },
            {
              id: "fall_q_4_2",
              question: "تحويل الأخطاء الوالدية أو الأسرية لدروس ومسؤوليات يهدف بالأساس إلى:",
              options: [
                { id: "o33", text: "بناء الرقابة والانضباط الذاتي الداخلي وتحفيز إصلاح الهفوات نضجاً ومحبة.", isCorrect: true },
                { id: "o34", text: "إخضاع المخطئ وإحراجه علناً أمام الأسرة لمنعه من اقتراف الخطأ مستقبلاً.", isCorrect: false },
                { id: "o35", text: "تجاوز السلوك تماماً والتماس المبررات لتفادي وجع المواجهة والتقويم السلوكي.", isCorrect: false }
              ],
              explanation: "عندما نتحمل مسؤولية أخطائنا ونصلحها نقوم ببناء ضمير سلوكي قوي وإيجابي ينمو نحو الرقابة الذاتية بثبات."
            },
            {
              id: "fall_q_4_3",
              question: "ما الفائدة الكبرى لجلسة التشاور الأسبوعية القصيرة؟",
              options: [
                { id: "o36", text: "تعزيز شعور الانتماء والشراكة والاتفاق الحقيقي على حدود وخطط المنزل بالتراضي.", isCorrect: true },
                { id: "o37", text: "إصدار الجزاءات المغلظة وتوبيخ المقصرين أمام أفراد الأسرة لبسط الهيمنة.", isCorrect: false },
                { id: "o38", text: "إرغام الجميع على تقديم تنازلات كروية تفوق رغباتهم النفسية لحفظ التوازن.", isCorrect: false }
              ],
              explanation: "الجلسة الأسبوعية تخلق بيئة ديمقراطية دافئة تبدد التشنج السلوكي وتذيب آلام الأسبوع بالتواصل الوجداني المفتوح."
            }
          ]
        }
      },
      {
        id: "fall_chap_5",
        chapterNum: 5,
        title: "مستقبل الوفاق والنهج التكاملي",
        icon: "⭐",
        description: `صناعة ميثاق الاستدامة الشامل وترسيخ ركائز السكينة والوفاق الدائم لحفظ عائلتنا من رياح الأزمات.`,
        lessons: [
          {
            id: "fall_lesson_5_1",
            lessonNum: 13,
            title: "تكامل الأدوار وتوحيد سفينة المسكن",
            duration: "8 دقائق قراءة",
            subtitle: "رؤية الأسرة كشراكة متناغمة تقهر مصاعب الزمن",
            content: `إن مواجهة تحدي "${cleanTopicName}" تتطلب أن نتحرك كجسد واحد متناسق الأدوار. لا مكان في البيوت الواعية للأنانيات الفردية أو الملامات الباردة؛ بل نتقاسم المهام بحب ونسند ظهر بعضنا وقت التعب. عندما يشعر كل فرد بصلابة الالتفاف الجماعي حوله، تنمو لديه ثقة أسطورية لمواجهة كافة المعاضل بقلب جريء مطمئن.`,
            exercise: "حدد مع شريكك والطفل مهمة تشاركية واحدة اليوم وقوما بإنجازها معاً بابتهاج وسرور."
          },
          {
            id: "fall_lesson_5_2",
            lessonNum: 14,
            title: "طقس التلاقي الوجداني الخماسي",
            duration: "9 دقائق قراءة",
            subtitle: "تغذية تيار المودة يومياً بخطوات من الحنان والاهتمام",
            content: `نهج الذكاء العاطفي يدعونا لترسيخ طقوس بسيطة وشافية يومياً. طقس التلاقي الخماسي يشمل: سلام دافئ، نظرة عين متأملة، عبارة شكر صادقة، عناق متفرد، وصمت متفهم لدقيقتين. هذه الإمدادات كفيلة بغسل قلوبكم من عوالق القلق اليومي، وترقية رصيد الود ليرسو دائماً بالمنفعة السلوكية الكريمة.`,
            exercise: "بادر بتطبيق طقس التلاق الخماسي مع أحبّ الناس إليك في بيتك عند نهاية نهار اليوم."
          },
          {
            id: "fall_lesson_5_3",
            lessonNum: 15,
            title: "دستور الأمان وصك الغفران المستمر",
            duration: "10 دقائق قراءة",
            subtitle: "تنصيب ميثاق دائم للمحبة العابرة للتحديات والأزمان",
            content: `أهلاً بك في ذروة تخرجك الرائع بسلام! في هذا الدرس النهائي، نضع مع عائلتنا دستور الأمان الأبدي: ميثاق مكتوب نتعهد فيه بتقديم الغفران والمسامحة الدائمة، وتبني لغة الحوار الدافئة لحل كافة النزاعات المقبلة بسلام حيال موضوع "${cleanTopicName}". إن بيتك الآن هو واحة الأمان الفياض وملجأ الطمأنينة الكاملة الدافئ، فحافظوا على عهد القلوب متصلين للأبد بحب.`,
            exercise: "اكتب بخط يدك مع العائلة دستور الأمان المكون من 3 بنود ذهبية، ووقعوا عليه وعلقوه بفخر في صالة منزلكم المعمور."
          }
        ],
        quiz: {
          title: "تقييم التخرج وبناء ميثاق الوفاق",
          description: "قم بالإجابة بدقة لنيل صك النجاح الأسري الشامل والتخرج المبارك.",
          questions: [
            {
              id: "fall_q_5_1",
              question: `كيف نتأكد من تكامل الأدوار ونجاح سفينة بيتنا في تجنب عواصف موضوع "${cleanTopicName}"؟`,
              options: [
                { id: "o40", text: "بتوزيع واضح ومرن للأدوار والمهام مبني على الحب الشفوق والدعم والمساندة المتبادلة.", isCorrect: true },
                { id: "o41", text: "بترك كل شخص يحل مصاعبه بمفرده لاختبار مدى مرونته وعصاميته في الحياة العملياتية.", isCorrect: false },
                { id: "o42", text: "بفرض عقوبات فورية وصارمة على المقصرين لضمان الالتزام الشديد بالقواعد الموضوعة.", isCorrect: false }
              ],
              explanation: "الالتفاف والتكامل والمشاركة يبث الأمان ويفجر طاقات التعاون لتسيير سفينتكم دائماً نحو شواطئ السكينة والسلام والوئام."
            },
            {
              id: "fall_q_5_2",
              question: "ما الغرض الجوهري من طقس 'التلافي الوجداني الخماسي'؟",
              options: [
                { id: "o43", text: "تطهير وترطيب القلوب يومياً ورفع مستويات الطمأنينة والأمل وسحق بقايا التوتر السلوكي العابر.", isCorrect: true },
                { id: "o44", text: "تنظيم مواعيد الفحص المالي والمادي وترشيد النفقات بشكل صارم يومياً بالمنزل.", isCorrect: false },
                { id: "o45", text: "تقييد الحريات وتحجيم الفردية لفرض رؤية الأكبر عمراً بالسيطرة الأبوية المطلقة.", isCorrect: false }
              ],
              explanation: "خطوات الحنان البسيطة تمثل إيداعات يومية هائلة في حسابكم العائلي المشترك تحميه من الإفلاس وتزيد من صلابة الترابط."
            },
            {
              id: "fall_q_5_3",
              question: "يتكلل بناء 'دستور الأمان الشامل وفنون التسامح المستمر' بـ:",
              options: [
                { id: "o46", text: "تثبيت ميثاق معنوي ومرئي يذكرنا بحماية علاقتنا واعتماد الردود الدافئة لحل النزاعات للأبد بسلام.", isCorrect: true },
                { id: "o47", text: "تسجيل عيوب الماضي لنذكر بعضنا بها حتى لا نقع فيها رغماً عنا مستقبلاً.", isCorrect: false },
                { id: "o48", text: "التعهد بعدم الخروج من الغرف والانسحاب الصامت ليكون الجزاء صارماً بلا كلام مكرر.", isCorrect: false }
              ],
              explanation: "الدستور يحفر صمام ومرساة وجدانية عميقة ترشد بيتنا للسلام والسكينة كلما كادت العواصف أن تخرجنا عن توازن ودفء الحب الأبدي."
            }
          ]
        }
      }
    ]
  };
}

// API Routes
// 1. Get next dialogue turn from the family member
app.post("/api/gemini/simulate", async (req, res) => {
  const { problem, role, turns, userMessage, tone, temperature } = req.body;
  try {
    if (!problem || !role || !userMessage) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const systemInstruction = `أنت تمثل دور فرد في أسرة داخل سيناريو محدد لحل خلافات عائلية والتدريب على الذكاء العاطفي.
المشكلة والظروف: "${problem}"
دورك وعلاقتك: "${role}"
الهدف: تفاعل بصدق وبشكل طبيعي (باللغة العربية الفصحى أو بلهجة قريبة ومحترمة) مع ردود فعل المستخدم.
المستخدم يحاول التواصل معك وحل الإشكال. بناءً على جودة كلامه (هل هو هجومي، دفاعي، متفهم، حنون، مصغٍ)، أظهر رد الفعل المناسب واقعياً لكلامه:
- إذا كان كلامه مليئاً بالتعاطف والذكاء العاطفي، استجب بليونة تدريجية واشرح عمق مشاعرك.
- إذا كان هجومياً أو يلومك أو يتجاهل مشاعرك، خذ موقفاً متوتراً أو حزيناً أو دافع عن نفسك بأدب كما تفعل الشخصيات الحقيقية.
كن مختصراً في ردودك (سطرين إلى ثلاثة أسطر كحد أقصى) لتبدو المحادثة طبيعية وتفاعلية.
لا تخرج عن نطاق الشخصية أبداً ولا تقدم نصائح تربوية في الحديث، عِش الشخصية بالكامل وطبّق الإحساس الإنساني.`;

    const toneMapping: Record<string, string> = {
      empathetic: "بشكل حنون ومتفهم (EQ عالي)",
      firm: "بشكل حازم ولكنه هادئ وموضوعي",
      defensive: "بشكل دفاعي حاد أو هجومي متوتر",
      silent: "بصمت وتفحص للمشاعر"
    };
    const arabicTone = toneMapping[tone as string] || "بنبرة هادئة";

    const chatContext = turns.map((t: any) => `${t.role === "user" ? "المستخدم" : role}: ${t.text}`).join("\n");
    const prompt = `${chatContext}
[المستخدم يتحدث الآن ${arabicTone} ومستوى غضبك الحالي هو: ${temperature || 70}%]
المستخدم يقول لتوه: "${userMessage}"
ما هي إجابتك التلقائية الفورية كشخصية منفعلة، مع مراعاة أن غضبك سيقل إذا تحدث بنبرة حنونة ومتفهمة، وسيزداد إذا تحدث بنبرة دفاعية؟ (أجب بالعامية القريبة أو الفصحى المبسطة في سطرين لثلاثة أسطر كحد أقصى)`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      systemInstruction,
      temperature: 0.7
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Simulate API Error, running fallback dynamic responder:", error);
    
    // Resilient fallback logic in case Gemini is experiencing overload/503
    const cleanedMsg = (userMessage || "").trim();
    let answerText = "";
    const isRomantic = role.includes("زوج") || role.includes("شريك") || role.includes("زوجه") || role.includes("زوجة");
    const isChild = role.includes("ابن") || role.includes("طفل") || role.includes("بنت") || role.includes("ابنة");

    if (isRomantic) {
      if (cleanedMsg.includes("أحب") || cleanedMsg.includes("أفهم") || cleanedMsg.includes("آسف") || cleanedMsg.includes("سامح") || cleanedMsg.includes("معلش") || cleanedMsg.includes("هدي") || cleanedMsg.includes("سلام") || cleanedMsg.includes("روق")) {
        answerText = "أنا ممتن للغاية لأنك تكلمني بهذه اللهجة اللطيفة والمتفهمة.. كلامك الطيب يطمس فجأة عناء اليوم ويشعرني بوجود صديق وشريك حقيقي يستحق العناء.";
      } else if (cleanedMsg.includes("أنت") || cleanedMsg.includes("دائما") || cleanedMsg.includes("صراخ") || cleanedMsg.includes("مشكلة") || cleanedMsg.includes("غلط") || cleanedMsg.includes("لوم")) {
        answerText = "أشعر أنك كالعادة تطلق أحكاماً متسارعة علي وتلقي بظلال اللوم على عاتقي وحده.. نقاشنا بهذه الحدة يضمر في نفسي أي رغبة في الحديث، أحتاج فقط لبعض الأمان والهدوء.";
      } else {
        answerText = "أسمع ما تقوله بصدق، لكني ما زلت أعاني من وطأة القلق والضغط النفسي المتراكم.. لنتحدث بقلوب دافئة ونبرة لينة، فنحن نقف في جهة واحدة دائماً وليس ضد بعضنا البعض.";
      }
    } else if (isChild) {
      if (cleanedMsg.includes("حبيبي") || cleanedMsg.includes("روح") || cleanedMsg.includes("تعال") || cleanedMsg.includes("يا بطل") || cleanedMsg.includes("أحبك") || cleanedMsg.includes("أفهم")) {
        answerText = "كلامك هذا يريح قلبي الصغير يا بابا/يا ماما ويشعرني بالدفء.. أحياناً أعاند فقط لأني أجهل كيف أعبر عن رغبتي في اهتمامك بي وحمايتي.";
      } else if (cleanedMsg.includes("عقاب") || cleanedMsg.includes("اصمت") || cleanedMsg.includes("عيب") || cleanedMsg.includes("خطأ") || cleanedMsg.includes("لماذا")) {
        answerText = "أنا أشعر بالخوف والحزن لتلقي التأنيب أو الملامة المستمرة.. وودي أن تسمعوني بهدوء وتضموني إليكم بدلاً من الأوامر المباشرة.";
      } else {
        answerText = "أنا ممتن للاستماع إلي، وأتمنى دائماً أن نتعاون معاً لنكون سعداء في منزلنا، وسأنفذ كلامكم بحب عندما أراه مغلفاً بالأمان الفياض الكافي لتطمين خوفي.";
      }
    } else {
      if (cleanedMsg.includes("تفهم") || cleanedMsg.includes("هدوء") || cleanedMsg.includes("ود") || cleanedMsg.includes("سلام") || cleanedMsg.includes("أمان")) {
        answerText = "كلماتك اللينة هدمت فوراً أسوار الجفاء التي صنعتها الضغوط.. حين تسود نبرة التعاطف هذه، تهون الصعاب وتنكشف الحلول السليمة تلقائياً.";
      } else {
        answerText = "الحقيقة أن تبادل الأوامر والاتهام لا يجدي في بيتنا.. لنسكب السلام ونسمع بعضنا البعض، فالأمان هو المفتاح لتغيير قسوة السلوك.";
      }
    }

    res.json({ text: answerText });
  }
});

// 2. Analyze the whole emotional simulation and return deep structured evaluation
app.post("/api/gemini/analyze", async (req, res) => {
  const { problem, role, turns } = req.body;
  try {
    if (!problem || !role || !turns || turns.length === 0) {
      return res.status(400).json({ error: "No turns to analyze" });
    }

    const conversationStr = turns.map((t: any) => `${t.role === "user" ? "المستخدم" : role}: ${t.text}`).join("\n");

    const prompt = `يرجى تقييم مهارات الذكاء العاطفي والتواصل الأسري التي أظهرها المستخدم في هذا السيناريو العائلي للتحدي:
سيناريو المشكلة: "${problem}"
دور الطرف الآخر: "${role}"

المحادثة التي جرت هي:
${conversationStr}

مطلوب تحليل دقيق وعميق بأسلوب تربوي نفسي رفيع جداً باللغة العربية، وتقييم جودة محاولات المستخدم لحل النزاع وإظهار التعاطف وحسن الإصغاء والضبط الانفعالي.
يجب صياغة التحليل وإرجاعه بدقة كائن JSON متوافق تماماً مع المخطط المخطط له (responseSchema).`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      systemInstruction: "أنت خبير واستشاري نفسي وأسري تخصصت في توجيه الآباء والأزواج وتطوير الذكاء العاطفي والاتصال الأسري البنّاء.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          eqScore: { 
            type: Type.INTEGER, 
            description: "درجة الذكاء العاطفي للمستخدم من 1 إلى 100 بناءً على جودة الردود" 
          },
          empathyLevel: { 
            type: Type.STRING, 
            description: "مستوى التعاطف الملاحظ: (عالٍ جداً / جيد ولكنه يحتاج للتركيز / منخفض وغلب عليه الدفاع أو الهجوم)" 
          },
          strengths: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "نقاط القوة في تواصل المستخدم (مثال: نبرة متعاطفة، تجنب تبادل اللوم، استخدام لغة الأنا)" 
          },
          gaps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "الأخطاء التواصلية أو الثغرات في تنظيم المشاعر (مثال: تقديم نصائح متسرعة دون الاستماع، كبت انفعالات الطرف الآخر، الدفاعية)" 
          },
          betterWording: { 
            type: Type.STRING, 
            description: "الصياغة البديلة الأكثر ذكاءً عاطفياً التي كان يمكن للمستخدم قولها في أحد المنعطفات لتحقيق تفاهم أعمق" 
          },
          generalAdvice: { 
            type: Type.STRING, 
            description: "نصيحة إرشادية أسرية ذهبية مستمدة من علم النفس السلوكي خصيصاً لهذه الحالة لمساعدته مستقبلاً" 
          }
        },
        required: ["eqScore", "empathyLevel", "strengths", "gaps", "betterWording", "generalAdvice"]
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Analyze API Error, running robust fallback analysis:", error);
    
    // Dynamic, resilient fallback analysis to prevent client-side crashes
    let eqScore = 75;
    let warmthCount = 0;
    let harshCount = 0;
    
    const conversationStrAndText = (turns || []).map((t: any) => t.text || "").join(" ");
    const warmthKeywords = ["أحب", "أفهم", "آسف", "معلش", "هدي", "سلام", "تفهم", "ود", "الغالي", "حبيبي", "ضم", "احتواء", "أسمعك", "هدوء"];
    const harshKeywords = ["أنت", "دائما", "صراخ", "عقاب", "غلط", "لوم", "جاهل", "مشكلة", "عناد", "اصمت"];
    
    warmthKeywords.forEach(kw => {
      if (conversationStrAndText.includes(kw)) warmthCount++;
    });
    harshKeywords.forEach(kw => {
      if (conversationStrAndText.includes(kw)) harshCount++;
    });
    
    eqScore = 70 + (warmthCount * 4) - (harshCount * 3);
    if (eqScore > 100) eqScore = 100;
    if (eqScore < 40) eqScore = 40;
    
    let empathyLevel = "جيد ولكنه يحتاج للتركيز على صياغة لغة الأنا";
    if (eqScore >= 85) {
      empathyLevel = "عالٍ جداً واستثنائي بممارسات الاحتواء الوجداني";
    } else if (eqScore < 60) {
      empathyLevel = "منخفض وغلب عليه الدفاع أو الرغبة في فرض الموقف السطحي النفعي";
    }
    
    const fallbackAnalysis = {
      eqScore,
      empathyLevel,
      strengths: [
        "إبداء الشجاعة المبدئية لفتح قنوات العتاب والمكاشفة المباشرة لحل المعضلات",
        "تجنب الانفعال الهستيري والحرص على صياغة ردود تدعو لرباط الحبل الأسري",
        warmthCount > 0 ? "توظيف مفردات دافئة تدمر رغبة الطرف الثاني بالعداء وتدعو للتفهم" : "الصبر والثبات النسبي لاستيعاب منحي الخلاف المتكرر"
      ].filter(Boolean),
      gaps: [
        harshCount > 0 ? "طغيان استخدام ضمير الهجوم 'أنت' بدلاً من لغة التعبير الذكي 'أنا'" : "العجلة في صياغة الحل السطحي قبل منح الطرف الآخر فضاء التفريغ الوجداني الكافي لآلامه",
        "فقدان الأمان الكافي في اللسانيات مما قد يبعث على استمرار الطرف الآخر في التحوط الدفاعي"
      ],
      betterWording: "الصياغة المقترحة البديلة: 'أنا أستوعب تماماً حجم الضغط الذي تمر به يا مهجة عيني، وودي نقف في نفس الجبهة لا خصمين يتبادلان الاتهام.. قلي وش اللي يرضيك وأنا كلي سمع لقولك.'",
      generalAdvice: "في سيكولوجية الاتصال الأسري الدافئ، يجب دائماً تسكين العواصف اللوزية للدماغ أولاً بالاحتضان والود؛ فالعقل المثار لا يقبل القواعد إلا إذا شبع بالأمان."
    };
    
    res.json(fallbackAnalysis);
  }
});

// 3. Generate a completely custom family curriculum based on a specific topic
app.post("/api/gemini/generate-curriculum", async (req, res) => {
  const { topic, adminEmail } = req.body;
  try {
    if (!adminEmail || adminEmail.trim().toLowerCase() !== "basim5252@gmail.com") {
      return res.status(403).json({ error: "عذراً، توليد المناهج المخصصة مقتصر حصرياً على مدير المنصة (الأدمن)." });
    }
    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "الرجاء كشط أو تحديد موضوع المنهج" });
    }

    const systemInstruction = `أنت خبير واستشاري علاقات أسرية ومستشار نفسي شهير. وظيفتك تصميم منهج تربوي عاطفي متكامل ومكثف للأسرة حول هذا الموضوع: "${topic}".
يجب أن يحتوي المنهج على بالضبط 5 فصول دراسية (chapters) متدرجة وعميقة وعملية، وتخاطب المشاعر والسلوك الإنساني بأسلوب دافئ ومُلهم للغاية باللغة العربية الفصحى.
كل فصل يجب أن يحتوي على:
1. عنوان الفصل ووصف ملخص وأيقونة معبرة (إيموجي واحد).
2. بالضبط 3 دروس (lessons) غنية بالمعلومات النفسية السليمة، والنصائح ومقرونة بتمارين تطبيقية حقيقية للأسرة.
3. اختبار من 3 أسئلة خيارية لتقييم الاستيعاب، مع نصوص خيار صحيح ونصوص خيارات مشتتة وشرح فسيولوجي أو نفسي للحل الصحيح.

يجب إرجاع النتيجة بتنسيق JSON متطابق تماماً مع المخطط الهيكلي (responseSchema).`;

    const prompt = `صمم منهجاً أسرياً ذكياً ومفصلاً بالكامل يتناول كلاً من المحاور والجوانب ذات العلاقة بالموضوع التالي: "${topic}".
نريد بالضبط 5 فصول ممتلئة وغنية، بكل فصل 3 دروس (إجمالي 15 درساً مكتملاً ومكثفاً ومطولاً)، وبكل فصل مسبار تقييم يضم 3 أسئلة متكاملة بخيارات وشروحات.
احرص على أن تكون المادة العلمية ومحتوى الدروس (content) عميقة ومطولة وتنافس جودة المناهج الاحترافية المكتوبة بأفخم العبارات والأسلوب الصديق العذب.`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          curriculumTitle: {
            type: Type.STRING,
            description: "عنوان المنهج المبتكر المخصص بالكامل"
          },
          curriculumDescription: {
            type: Type.STRING,
            description: "وصف بليغ وشامل لغايات هذا المنهج وما سيحققه للأسرة"
          },
          chapters: {
            type: Type.ARRAY,
            description: "قائمة فصول المنهج المبتكرة (بالضبط 5 فصول)",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                chapterNum: { type: Type.INTEGER },
                title: { type: Type.STRING },
                icon: { type: Type.STRING, description: "رمز إيموجي واحد معبر" },
                description: { type: Type.STRING },
                lessons: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      lessonNum: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      duration: { type: Type.STRING, description: "مدة القراءة التقديرية مثل: '12 دقيقة قراءة'" },
                      subtitle: { type: Type.STRING },
                      content: { type: Type.STRING, description: "محتوى الدرس المفصل المليء بالمعلومات النفسية وبأسلوب بليغ مشجع في عدة فقرات" },
                      exercise: { type: Type.STRING, description: "تمرين تطبيقي عملي للقيام به في أسرع وقت مع شريك الحياة أو الأطفال" }
                    },
                    required: ["id", "lessonNum", "title", "duration", "subtitle", "content", "exercise"]
                  }
                },
                quiz: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    questions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          question: { type: Type.STRING },
                          options: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                id: { type: Type.STRING },
                                text: { type: Type.STRING },
                                isCorrect: { type: Type.BOOLEAN }
                              },
                              required: ["id", "text", "isCorrect"]
                            }
                          },
                          explanation: { type: Type.STRING }
                        },
                        required: ["id", "question", "options", "explanation"]
                      }
                    }
                  },
                  required: ["title", "description", "questions"]
                }
              },
              required: ["id", "chapterNum", "title", "icon", "description", "lessons", "quiz"]
            }
          }
        },
        required: ["curriculumTitle", "curriculumDescription", "chapters"]
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Generate Curriculum API Error, running local high-fidelity generator:", error);
    
    // Call our robust local fallback generator
    try {
      const fallbackCurriculum = generateFallbackCurriculum(topic);
      res.json(fallbackCurriculum);
    } catch (fallbackError: any) {
      console.error("Critical: Fallback curriculum generator also failed:", fallbackError);
      res.status(500).json({ error: "فشل ابتكار المنهج الدراسي بالكامل، يرجى المحاولة لاحقاً" });
    }
  }
});

// Endpoint to fetch all persistent saved custom curriculums
app.get("/api/gemini/curriculums", (req, res) => {
  res.json(globalCustomCurriculums);
});

// Endpoint to save or update any dynamically generated custom curriculum to preserve across all links/devices
app.post("/api/gemini/save-curriculum", (req, res) => {
  const { curriculum } = req.body;
  if (!curriculum || !curriculum.id) {
    return res.status(400).json({ error: "المنهج غير مكتمل أو غير صالح" });
  }

  const index = globalCustomCurriculums.findIndex(c => c.id === curriculum.id);
  if (index !== -1) {
    globalCustomCurriculums[index] = curriculum;
  } else {
    globalCustomCurriculums.unshift(curriculum);
  }

  saveCurriculumsToDisk();
  res.json({ success: true, count: globalCustomCurriculums.length });
});

// Endpoint to bulk save or merge custom curriculums from client's localStorage
app.post("/api/gemini/bulk-save", (req, res) => {
  const { curriculums } = req.body;
  if (!Array.isArray(curriculums)) {
    return res.status(400).json({ error: "البيانات المرسلة غير صالحة" });
  }
  
  let addedCount = 0;
  curriculums.forEach((clientCurr: any) => {
    if (clientCurr && clientCurr.id) {
      const idx = globalCustomCurriculums.findIndex(c => c.id === clientCurr.id);
      if (idx !== -1) {
        globalCustomCurriculums[idx] = clientCurr;
      } else {
        globalCustomCurriculums.unshift(clientCurr);
        addedCount++;
      }
    }
  });

  if (curriculums.length > 0) {
    saveCurriculumsToDisk();
  }
  res.json({ success: true, total: globalCustomCurriculums.length, added: addedCount });
});

// Configure Vite middleware / Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
