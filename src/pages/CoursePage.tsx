import { useQuery, useMutation } from "convex/react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Heart,
  HelpCircle,
  Lightbulb,
  Lock,
  MessageCircle,
  Play,
  Rocket,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Sparkles,
  Calendar,
  Zap,
  CircleDot,
} from "lucide-react";
import { useConvexAuth } from "convex/react";
import { toast } from "sonner";
import { useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";

function formatPrice(kzt: number) {
  return new Intl.NumberFormat("ru-KZ").format(kzt) + " ₸";
}

// Icons for program blocks
const blockIcons = [Target, BookOpen, GraduationCap, Star, Trophy, Sparkles];

// Course preview illustrations (SVG patterns per category)
function CourseIllustration({ category }: { category: string }) {
  const colors: Record<string, { primary: string; secondary: string; accent: string }> = {
    training: { primary: "#f59e0b", secondary: "#f97316", accent: "#fbbf24" },
    game: { primary: "#f97316", secondary: "#e11d48", accent: "#fb923c" },
    youtube: { primary: "#ef4444", secondary: "#f97316", accent: "#fbbf24" },
  };
  const c = colors[category] || colors.training;

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.08" />
          <stop offset="100%" stopColor={c.secondary} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.primary} />
          <stop offset="100%" stopColor={c.secondary} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#bg-grad)" rx="16" />
      {/* Decorative circles */}
      <circle cx="320" cy="60" r="80" fill={c.primary} opacity="0.06" />
      <circle cx="80" cy="240" r="60" fill={c.secondary} opacity="0.06" />
      <circle cx="200" cy="150" r="100" fill={c.accent} opacity="0.04" />
      {/* Central icon */}
      <g transform="translate(160, 110)">
        <rect width="80" height="80" rx="20" fill="url(#icon-grad)" opacity="0.15" />
        <g transform="translate(20, 20)" fill={c.primary}>
          {category === "training" ? (
            <>
              <path d="M20 4L4 12l16 8 16-8-16-8zM4 20l16 8 16-8M4 12v8" stroke={c.primary} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : category === "game" ? (
            <>
              <path d="M6 12h4l2-8 4 16 4-16 2 8h4" stroke={c.primary} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            <>
              <polygon points="10,4 4,20 20,12 0,12 16,20" stroke={c.primary} strokeWidth="1.5" fill="none" />
            </>
          )}
        </g>
      </g>
      {/* Decorative dots */}
      {[50, 100, 150, 250, 300, 350].map((x, i) => (
        <circle key={i} cx={x} cy={i % 2 ? 30 : 270} r="3" fill={c.primary} opacity="0.15" />
      ))}
    </svg>
  );
}

// FAQ data per course category
const faqsByCategory: Record<string, Array<{ q: string; a: string }>> = {
  training: [
    { q: "Как проходит обучение?", a: "Обучение проходит в формате живых тренингов с Еленой Колос. Вы получаете теорию, практические задания и обратную связь от автора." },
    { q: "Можно ли оплатить частями?", a: "Да, мы предоставляем рассрочку. Свяжитесь с нами для уточнения условий." },
    { q: "Что если мне не подойдёт курс?", a: "Мы уверены в качестве наших программ. Если в течение первой недели вы поймёте, что курс не для вас — вернём полную стоимость." },
    { q: "Получу ли я сертификат?", a: "Да, по окончании курса вы получите именной сертификат от Елены Колос." },
  ],
  game: [
    { q: "Сколько человек нужно для игры?", a: "Оптимальный размер группы — от 6 до 20 человек. Это позволяет создать динамичную и продуктивную атмосферу." },
    { q: "Нужна ли подготовка?", a: "Никакой специальной подготовки не требуется. Все правила и инструкции даются в начале игры." },
    { q: "Можно ли провести игру для нашей компании?", a: "Да, мы проводим корпоративные игры. Свяжитесь с нами для обсуждения даты и формата." },
  ],
  youtube: [
    { q: "Как долго будет доступен курс?", a: "После покупки курс доступен навсегда. Вы можете пересматривать видео столько раз, сколько нужно." },
    { q: "Можно ли смотреть с телефона?", a: "Да, курс доступен на любом устройстве — компьютере, планшете или телефоне." },
    { q: "Есть ли дополнительные материалы?", a: "К видеоурокам прилагаются практические задания и конспекты для закрепления материала." },
  ],
};

// Learning process steps
const learningSteps = [
  { icon: Rocket, title: "Записываетесь", description: "Оформляете подписку и получаете мгновенный доступ к материалам курса" },
  { icon: BookOpen, title: "Изучаете", description: "Проходите уроки в своём темпе, выполняете практические задания" },
  { icon: MessageCircle, title: "Практикуете", description: "Применяете знания на практике и получаете обратную связь" },
  { icon: Award, title: "Получаете результат", description: "Достигаете поставленных целей и получаете сертификат" },
];

// Results / outcomes
const outcomesByCategory: Record<string, Array<{ icon: typeof Star; title: string; stat: string }>> = {
  training: [
    { icon: TrendingUp, title: "Рост бизнеса", stat: "до 40%" },
    { icon: Clock, title: "Экономия времени", stat: "3+ часа/день" },
    { icon: Heart, title: "Баланс жизни", stat: "100%" },
    { icon: Users, title: "Выпускников", stat: "1000+" },
  ],
  game: [
    { icon: Zap, title: "Энергия команды", stat: "+80%" },
    { icon: Users, title: "Сплочённость", stat: "до 95%" },
    { icon: Lightbulb, title: "Новых решений", stat: "50+" },
    { icon: Star, title: "Отзывов 5★", stat: "98%" },
  ],
  youtube: [
    { icon: Play, title: "Часов контента", stat: "3+" },
    { icon: CheckCircle2, title: "Практических заданий", stat: "10+" },
    { icon: Clock, title: "Доступ", stat: "Навсегда" },
    { icon: Star, title: "Рейтинг", stat: "4.9/5" },
  ],
};

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();
  const course = useQuery(api.courses.getBySlug, slug ? { slug } : "skip");
  const lessons = useQuery(
    api.courses.getLessons,
    course ? { courseId: course._id } : "skip",
  );
  const enrolled = useQuery(
    api.enrollments.isEnrolled,
    course ? { courseId: course._id } : "skip",
  );
  const enrollMut = useMutation(api.enrollments.enroll);
  const [enrolling, setEnrolling] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (course === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Курс не найден</h2>
        <Button variant="outline" onClick={() => navigate("/")}>
          На главную
        </Button>
      </div>
    );
  }

  const hasLessons = lessons && lessons.length > 0;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    setEnrolling(true);
    try {
      await enrollMut({ courseId: course._id as Id<"courses"> });
      toast.success("Вы записаны на курс!");
    } catch {
      toast.error("Ошибка при записи. Попробуйте позже.");
    } finally {
      setEnrolling(false);
    }
  };

  // Decorative gradient based on category
  const gradients: Record<string, string> = {
    training: "from-amber-600 via-orange-500 to-yellow-500",
    game: "from-orange-500 via-rose-500 to-pink-500",
    youtube: "from-red-500 via-orange-500 to-amber-500",
  };
  const gradient = gradients[course.category] || gradients.training;

  const categoryLabels: Record<string, string> = {
    training: "Тренинг",
    game: "Бизнес-игра",
    youtube: "Видеокурс",
  };

  const faqs = faqsByCategory[course.category] || faqsByCategory.training;
  const outcomes = outcomesByCategory[course.category] || outcomesByCategory.training;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner — larger and more immersive */}
      <div className={`relative bg-gradient-to-br ${gradient} py-16 lg:py-24`}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-white opacity-[0.07]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white opacity-[0.05]" />
          <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-white opacity-[0.06]" />
          <div className="absolute bottom-1/4 left-1/3 h-24 w-24 rounded-full bg-white opacity-[0.08]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        <div className="container relative mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-white/80 hover:bg-white/20 hover:text-white"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" /> На главную
            </Button>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-3 py-1.5">
                {categoryLabels[course.category]}
              </Badge>
              {course.badge && (
                <Badge className="bg-white text-primary border-0 text-sm px-3 py-1.5">
                  {course.badge}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-5 items-center">
            {/* Left: Text content */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <h1 className="text-3xl font-bold text-white lg:text-5xl leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
                {course.longDescription || course.description}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {course.duration}
                </div>
                {hasLessons && (
                  <div className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    {lessons.length}{" "}
                    {lessons.length === 1 ? "урок" : lessons.length < 5 ? "урока" : "уроков"}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Елена Колос
                </div>
              </div>

              {/* CTA in hero */}
              <div className="mt-4 flex flex-wrap gap-3">
                {enrolled ? (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-5 py-3 text-white">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Вы записаны на курс</span>
                  </div>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 gap-2 h-12 text-base shadow-lg"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? "Записываем..." : "Записаться на курс"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    {course.priceKzt && (
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-2xl font-bold">{formatPrice(course.priceKzt)}</span>
                        {course.originalPriceKzt && (
                          <span className="text-lg text-white/60 line-through">{formatPrice(course.originalPriceKzt)}</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right: Course illustration / preview */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="relative">
                <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-1 shadow-2xl">
                  <div className="rounded-xl overflow-hidden bg-white/5">
                    <CourseIllustration category={course.category} />
                  </div>
                </div>
                {/* Floating stats */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Формат</div>
                    <div className="text-sm font-semibold">
                      {course.category === "youtube" ? "Видео" : course.category === "game" ? "Игра" : "Живой"}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Автор</div>
                    <div className="text-sm font-semibold">Д.э.н., 30+ лет</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Outcomes Bar */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            {outcomes.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{item.stat}</div>
                    <div className="text-xs text-muted-foreground">{item.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content - Left 2 cols */}
          <div className="lg:col-span-2 space-y-14">
            {/* What You'll Learn */}
            {course.whatYouLearn && course.whatYouLearn.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  Чему вы научитесь
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {course.whatYouLearn.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border bg-gradient-to-br from-white to-orange-50/30 p-4 transition hover:shadow-md hover:-translate-y-0.5"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* For Whom */}
            {course.forWhom && course.forWhom.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  Для кого этот курс
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {course.forWhom.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border p-4 transition hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Learning Process */}
            <section>
              <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                Как проходит обучение
              </h2>
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/5 hidden sm:block" />
                <div className="grid gap-4 sm:gap-6">
                  {learningSteps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-400 shadow-lg shadow-primary/20">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">Шаг {i + 1}</span>
                            <h3 className="font-semibold">{step.title}</h3>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Program */}
            {course.programBlocks && course.programBlocks.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  Программа курса
                </h2>
                <div className="space-y-4">
                  {course.programBlocks.map((block, i) => {
                    const Icon = blockIcons[i % blockIcons.length];
                    return (
                      <Card key={i} className="overflow-hidden transition hover:shadow-md group">
                        <CardContent className="flex gap-4 p-5">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Модуль {i + 1}</Badge>
                            </div>
                            <h3 className="font-semibold text-base mt-1">{block.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                              {block.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Lessons (for YouTube courses) */}
            {hasLessons && (
              <section>
                <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  Видеоуроки
                  <Badge variant="secondary" className="ml-auto">{lessons.length} {lessons.length === 1 ? "видео" : "видео"}</Badge>
                </h2>
                <div className="space-y-3">
                  {lessons.map((lesson, i) => (
                    <Card key={lesson._id} className="transition hover:shadow-md group">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary group-hover:bg-primary group-hover:text-white transition">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{lesson.title}</h3>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          )}
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.durationMinutes} мин
                          </div>
                        </div>
                        {enrolled ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <Play className="h-4 w-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <Lock className="h-4 w-4 text-muted-foreground/50" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* If enrolled, show videos */}
            {enrolled && hasLessons && (
              <section className="space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Play className="h-5 w-5 text-green-600" />
                  </div>
                  Смотреть уроки
                </h2>
                {lessons.map((lesson, i) => {
                  const videoId = lesson.youtubeUrl.match(
                    /(?:v=|\/)([\\w-]{11})/,
                  )?.[1];
                  return (
                    <div key={lesson._id} className="space-y-3">
                      <h3 className="font-semibold">
                        Урок {i + 1}: {lesson.title}
                      </h3>
                      {videoId && (
                        <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={lesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {/* FAQ Section */}
            <section>
              <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                Часто задаваемые вопросы
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <Card
                    key={i}
                    className={`cursor-pointer transition hover:shadow-md overflow-hidden ${openFaq === i ? "ring-2 ring-primary/20" : ""}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CircleDot className={`h-4 w-4 transition ${openFaq === i ? "text-primary" : "text-muted-foreground"}`} />
                          <h3 className="font-medium text-sm">{faq.q}</h3>
                        </div>
                        <ArrowRight className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                      </div>
                      {openFaq === i && (
                        <p className="mt-3 ml-7 text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1">
                          {faq.a}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* About Author */}
            <section>
              <h2 className="mb-6 text-2xl font-bold flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                Об авторе курса
              </h2>
              <Card className="overflow-hidden bg-gradient-to-br from-white to-orange-50/30">
                <CardContent className="flex flex-col sm:flex-row gap-6 p-6">
                  <div className="shrink-0">
                    <img
                      src="/elena-portrait.jpg"
                      alt="Елена Колос"
                      className="h-36 w-36 rounded-2xl object-cover shadow-md ring-4 ring-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold">Елена Колос</h3>
                    <p className="text-xs text-primary font-medium">
                      Доктор экономических наук · Академик Международной академии информатизации · MBA
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Стратегический коуч и бизнес-тренер с более чем 30-летним опытом в сфере 
                      управления и развития бизнеса. Автор более 200 научных публикаций, уникальных 
                      трансформационных и бизнес-игр. Директор Международного образовательного центра «ICE», 
                      основатель Академии «Учись и развивайся». Победитель в номинации «Бизнес-тренер 2023» 
                      и «Бизнес-консультант года 2023».
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 shadow-sm">
                        <Trophy className="h-4 w-4 text-primary" /> 30+ лет опыта
                      </span>
                      <span className="flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 shadow-sm">
                        <GraduationCap className="h-4 w-4 text-primary" /> Доктор наук
                      </span>
                      <span className="flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 shadow-sm">
                        <Star className="h-4 w-4 text-primary" /> 200+ публикаций
                      </span>
                      <span className="flex items-center gap-1 bg-white rounded-lg px-3 py-1.5 shadow-sm">
                        <Award className="h-4 w-4 text-primary" /> Академик МАИ
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Bottom CTA */}
            <section className={`rounded-2xl bg-gradient-to-br ${gradient} p-8 text-white`}>
              <div className="max-w-lg">
                <h2 className="text-2xl font-bold mb-3">Готовы начать?</h2>
                <p className="text-white/80 mb-6">
                  Присоединяйтесь к {course.category === "game" ? "игре" : "курсу"} и начните свой путь к новым результатам уже сегодня.
                </p>
                {enrolled ? (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-5 py-3 w-fit">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Вы уже записаны</span>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 gap-2 shadow-lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? "Записываем..." : "Записаться на курс"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar - Enrollment card */}
          <div>
            <Card className="sticky top-8 shadow-lg border-t-4 border-t-primary">
              <CardContent className="p-6 space-y-5">
                {/* Preview thumbnail */}
                <div className="rounded-xl overflow-hidden border bg-muted/30">
                  <CourseIllustration category={course.category} />
                </div>

                {/* Price */}
                {course.priceKzt ? (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Стоимость</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(course.priceKzt)}
                      </span>
                    </div>
                    {course.originalPriceKzt && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(course.originalPriceKzt)}
                        </span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          −{Math.round((1 - course.priceKzt / course.originalPriceKzt) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Стоимость</div>
                    <div className="text-xl font-semibold">По запросу</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Индивидуальная программа под ваши задачи
                    </p>
                  </div>
                )}

                <div className="border-t pt-4" />

                {enrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Вы записаны на курс</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hasLessons ? "Видеоуроки доступны ниже ↓" : "Материалы курса скоро будут доступны"}
                    </p>
                  </div>
                ) : course.priceKzt ? (
                  <Button
                    className="w-full gap-2 h-12 text-base"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    <ShieldCheck className="h-5 w-5" />
                    {enrolling ? "Записываем..." : "Записаться на курс"}
                  </Button>
                ) : (
                  <Button
                    className="w-full h-12 text-base"
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      } else {
                        navigate("/#contact");
                      }
                    }}
                  >
                    Оставить заявку
                  </Button>
                )}

                {/* Course details */}
                <div className="space-y-3 border-t pt-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Длительность</div>
                      <div className="text-muted-foreground">{course.duration}</div>
                    </div>
                  </div>
                  {hasLessons && (
                    <div className="flex items-center gap-3">
                      <Play className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">Видеоуроков</div>
                        <div className="text-muted-foreground">{lessons.length}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Формат</div>
                      <div className="text-muted-foreground">
                        {course.category === "youtube" ? "Видео + практика" :
                         course.category === "game" ? "Игровой формат" :
                         "Живой тренинг"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Гарантия</div>
                      <div className="text-muted-foreground">Безопасная оплата</div>
                    </div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="border-t pt-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <ShieldCheck className="h-3 w-3" /> Гарантия возврата
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <Clock className="h-3 w-3" /> Поддержка 24/7
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5">
                    <Award className="h-3 w-3" /> Сертификат
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
