import { useQuery } from "convex/react";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Clock,
  GraduationCap,
  MapPin,
  MessageCircle,
  Play,
  Quote,
  Send,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation } from "convex/react";

/* ─── helpers ─── */
function formatPrice(kzt: number) {
  return new Intl.NumberFormat("ru-KZ").format(kzt) + " ₸";
}

const GAMES = [
  { n: 1, title: "«Трансформация нас и нашего бизнеса»", sub: "Авторская уникальная трансформационная игра", tag: "Авторская" },
  { n: 2, title: "«Радость и вдохновение: путь к успеху»", sub: "Авторская уникальная трансформационная игра", tag: "Авторская" },
  { n: 3, title: "Управление стрессами", sub: "Бизнес-игра" },
  { n: 4, title: "Управление конфликтами", sub: "Бизнес-игра" },
  { n: 5, title: "Тайм-менеджмент", sub: "Бизнес-игра" },
  { n: 6, title: "Клиентоориентированность", sub: "Бизнес-игра" },
  { n: 7, title: "Стратегическое управление", sub: "Бизнес-игра" },
];

const TESTIMONIALS = [
  {
    text: "Елена помогла мне увидеть точки роста в бизнесе, о которых я даже не подозревала. После тренинга мои доходы выросли в 2 раза за полгода.",
    name: "Анна К.",
    role: "Владелица салона красоты",
  },
  {
    text: "Деловые игры Елены — это невероятный опыт. Решения и инсайты приходят прямо в процессе. Рекомендую каждому предпринимателю!",
    name: "Марат С.",
    role: "Предприниматель",
  },
  {
    text: "Благодаря программе «Формула счастья предпринимателя» я не только улучшила бизнес-показатели, но и справилась с выгоранием.",
    name: "Ольга Т.",
    role: "Управляющая сетью магазинов",
  },
];

const ACHIEVEMENTS = [
  { title: "Бизнес-тренер 2023", sub: "Телевизионная премия", icon: Trophy },
  { title: "Бизнес-консультант года", sub: "People Awards Professional, журнал Teens and People, 2023", icon: Award },
  { title: "Академик", sub: "Международная академия информатизации", icon: GraduationCap },
  { title: "Доктор экономических наук", sub: "Единственная в Казахстане доктор экон. наук по специальности «Управление в социальных и экономических системах»", icon: Star },
];

/* ─── Main component ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const courses = useQuery(api.courses.list);
  const submitApp = useMutation(api.applications.submit);
  const [appForm, setAppForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [appCourse, setAppCourse] = useState("");
  const [sending, setSending] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitApp({
        name: appForm.name,
        email: appForm.email,
        phone: appForm.phone || undefined,
        courseName: appCourse || "Общая заявка",
        message: appForm.message || undefined,
      });
      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
      setAppForm({ name: "", email: "", phone: "", message: "" });
      setAppCourse("");
    } catch {
      toast.error("Ошибка при отправке заявки. Попробуйте позже.");
    } finally {
      setSending(false);
    }
  };

  const trainings = courses?.filter((c) => c.category === "training" || c.category === "game") ?? [];
  const ytCourses = courses?.filter((c) => c.category === "youtube") ?? [];

  function getCategoryTag(course: { category: string; badge?: string }) {
    if (course.badge === "Трансформационная игра") return "Трансформационная игра";
    if (course.badge === "Бизнес-игра") return "Бизнес-игра";
    if (course.category === "game") return "Игра";
    if (course.category === "youtube") return "Видеокурс";
    return "Тренинг";
  }

  return (
    <div className="min-h-screen">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/50 to-white py-16 lg:py-24">
        {/* decorative shapes */}
        <div className="absolute top-10 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
            {/* left text */}
            <div className="max-w-xl text-center lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Антистресс для предпринимателей
              </div>

              <h1 className="mb-2 text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
                Елена
              </h1>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-primary lg:text-7xl">
                Колос
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-muted-foreground lg:text-xl">
                Доктор экономических наук, стратегический коуч и бизнес-тренер с 30-летним опытом в Усть-Каменогорске.
                Помогаю предпринимателям находить эффективные стратегии, справляться с выгоранием и развивать креативное мышление.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="lg" className="gap-2 text-base" onClick={() => scrollTo("courses")}>
                  Смотреть курсы <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-base" onClick={() => scrollTo("about")}>
                  Обо мне
                </Button>
              </div>

              {/* stats row */}
              <div className="mt-10 flex justify-center gap-8 lg:justify-start">
                {[
                  { value: "30+", label: "лет опыта" },
                  { value: "200+", label: "публикаций" },
                  { value: "MBA", label: "степень" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl font-bold text-primary">{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* right: portrait */}
            <div className="relative">
              <div className="relative h-80 w-80 overflow-hidden rounded-3xl shadow-2xl ring-4 ring-primary/10 lg:h-[28rem] lg:w-[24rem]">
                <img
                  src="/elena-portrait.jpg"
                  alt="Елена Колос"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* floating badges */}
              <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {["Коуч", "Тренер", "MBA", "Академик"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-md"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ABOUT ═══════ */}
      <section id="about" className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-primary">
            Обо мне
          </div>
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">
            Путь от преподавателя вуза <br className="hidden sm:block" />
            к наставнику предпринимателей
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Елена Колос — единственная в Казахстане доктор экономических наук по специальности «Управление
                в социальных и экономических системах», академик Международной академии информатизации,
                мастер делового администрирования (MBA), стратегический коуч, бизнес-тренер и эксперт по управлению.
              </p>
              <p>
                С 1994 по 2024 год работала в Восточно-Казахстанском техническом университете им. Д. Серикбаева,
                пройдя путь от доцента до заведующей кафедрой «Инновационный менеджмент», начальника отдела
                стратегического развития и профессора.
              </p>
              <p>
                Сегодня Елена — директор ИП «Международный образовательный центр ICE», основатель
                Академии «Учись и развивайся» и заведующая отделом креативной экономики КГУ «Центр развития
                креативной индустрии» акимата г. Усть-Каменогорска.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: GraduationCap,
                  title: "Образование",
                  text: "Доктор экономических наук (2007). Аспирантура СПбГИЭУ.",
                },
                {
                  icon: BriefcaseBusiness,
                  title: "Деятельность",
                  text: "Директор МОЦ «ICE». Основатель Академии «Учись и развивайся».",
                },
                {
                  icon: BookOpen,
                  title: "Специализация",
                  text: "Стратегический и антикризисный менеджмент. Коучинг. Деловые игры.",
                },
                {
                  icon: Users,
                  title: "Аудитория",
                  text: "Предприниматели, руководители. Помогаю справляться с выгоранием.",
                },
              ].map((card) => (
                <Card key={card.title} className="border-none bg-accent/50 shadow-none">
                  <CardContent className="p-5">
                    <card.icon className="mb-3 h-8 w-8 text-primary" />
                    <h3 className="mb-1 font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* big stat counters */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "30+", label: "Лет опыта в обучении и менеджменте" },
              { value: "200+", label: "Научных публикаций и статей" },
              { value: "100+", label: "Бесплатных прямых эфиров проведено" },
              { value: "33", label: "Года в игропрактике" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center">
                <div className="text-4xl font-bold text-primary">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ COURSES ═══════ */}
      <section id="courses" className="bg-secondary/30 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-primary">
            Курсы и тренинги
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold lg:text-4xl">Программы обучения</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Авторские курсы, тренинги и бизнес-игры для предпринимателей, руководителей
            и всех, кто хочет развиваться
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainings.map((course) => (
              <Card key={course._id} className="group relative flex flex-col overflow-hidden transition hover:shadow-lg">
                {course.badge && course.badge !== "Тренинг" && course.badge !== "Бизнес-игра" && course.badge !== "Трансформационная игра" && (
                  <Badge className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground">
                    {course.badge}
                  </Badge>
                )}
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 mb-1">
                    {getCategoryTag(course)}
                  </Badge>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                  {course.priceKzt ? (
                    <div>
                      <span className="text-xl font-bold text-primary">{formatPrice(course.priceKzt)}</span>
                      {course.originalPriceKzt && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          {formatPrice(course.originalPriceKzt)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">По запросу</span>
                  )}
                  <Button
                    size="sm"
                    variant={course.priceKzt ? "default" : "outline"}
                    onClick={() => {
                      if (course.priceKzt) {
                        navigate(`/course/${course.slug}`);
                      } else {
                        setAppCourse(course.title);
                        scrollTo("contact");
                      }
                    }}
                  >
                    {course.priceKzt ? "Подробнее" : "Оставить заявку"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* YouTube video courses */}
          {ytCourses.length > 0 && (
            <>
              <h3 className="mb-6 mt-16 text-center text-2xl font-bold">
                <Play className="mr-2 inline-block h-6 w-6 text-primary" />
                Видеокурсы
              </h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ytCourses.map((course) => (
                  <Card key={course._id} className="group flex flex-col overflow-hidden transition hover:shadow-lg">
                    <CardHeader className="relative pb-2">
                      <Badge className="w-fit bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 mb-1">
                        <Play className="mr-1 h-3 w-3" />
                        Видеокурс
                      </Badge>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4">
                      <span className="text-xl font-bold text-primary">
                        {course.priceKzt ? formatPrice(course.priceKzt) : "Бесплатно"}
                      </span>
                      <Button size="sm" onClick={() => navigate(`/course/${course.slug}`)}>
                        Подробнее
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══════ ACHIEVEMENTS ═══════ */}
      <section id="achievements" className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-primary">
            Признание
          </div>
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">Награды и достижения</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ACHIEVEMENTS.map((a) => (
              <Card key={a.title} className="group text-center transition hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:bg-primary/20">
                    <a.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-bold">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ GAMES ═══════ */}
      <section id="games" className="bg-secondary/30 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-primary">
            Авторские разработки
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold lg:text-4xl">
            Деловые и трансформационные игры
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Более 33 лет опыта в игропрактике. Авторские уникальные трансформационные игры
            и бизнес-игры по темам управления стрессами, конфликтами, тайм-менеджмента,
            клиентоориентированности и стратегического управления.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GAMES.map((g) => (
              <div
                key={g.n}
                className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {g.n}
                </div>
                <div>
                  <h3 className="font-semibold">{g.title}</h3>
                  <p className="text-sm text-muted-foreground">{g.sub}</p>
                  {g.tag && (
                    <Badge variant="outline" className="mt-2 text-xs text-primary border-primary/30">
                      {g.tag}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-primary">
            Отзывы
          </div>
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">Что говорят участники</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-none bg-accent/40 shadow-none">
                <CardContent className="p-6">
                  <Quote className="mb-4 h-8 w-8 text-primary/30" />
                  <p className="mb-6 italic text-muted-foreground leading-relaxed">«{t.text}»</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-primary/5 to-primary/10 p-8 text-center lg:p-12">
            <p className="mx-auto max-w-xl text-xl font-medium italic text-foreground lg:text-2xl">
              «Для меня деньги никогда не были главным.
              <br />
              Главное — помогать с пользой.»
            </p>
            <p className="mt-4 font-semibold text-primary">— Елена Колос</p>
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT ═══════ */}
      <section id="contact" className="bg-secondary/30 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-primary">
            Контакты
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold lg:text-4xl">Свяжитесь со мной</h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Готовы развивать свой бизнес? Запишитесь на консультацию или выберите подходящий курс
          </p>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* contact form */}
            <Card>
              <CardHeader>
                <CardTitle>Оставить заявку</CardTitle>
                <CardDescription>
                  {appCourse
                    ? `Заявка на курс: ${appCourse}`
                    : "Заполните форму и мы свяжемся с вами"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApply} className="space-y-4">
                  <Input
                    placeholder="Ваше имя *"
                    required
                    value={appForm.name}
                    onChange={(e) => setAppForm((p) => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    type="email"
                    placeholder="Email *"
                    required
                    value={appForm.email}
                    onChange={(e) => setAppForm((p) => ({ ...p, email: e.target.value }))}
                  />
                  <Input
                    type="tel"
                    placeholder="Телефон"
                    value={appForm.phone}
                    onChange={(e) => setAppForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Сообщение"
                    rows={3}
                    value={appForm.message}
                    onChange={(e) => setAppForm((p) => ({ ...p, message: e.target.value }))}
                  />
                  <Button type="submit" className="w-full gap-2" disabled={sending}>
                    <Send className="h-4 w-4" />
                    {sending ? "Отправка..." : "Отправить заявку"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* contact info */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Местоположение</h3>
                  <p className="text-muted-foreground">г. Усть-Каменогорск (Өскемен), Казахстан</p>
                </div>
              </div>

              <a
                href="https://vk.ru/elenakolos2022"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-accent/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">ВКонтакте</h3>
                  <p className="text-muted-foreground">Личная страница</p>
                </div>
              </a>

              <a
                href="https://vk.ru/club211083229"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-accent/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Сообщество</h3>
                  <p className="text-muted-foreground">Антистресс для предпринимателей</p>
                </div>
              </a>

              <a
                href="https://vk.ru/elenakolos2022"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-accent/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">ВКонтакте</h3>
                  <p className="text-muted-foreground">Елена Колос</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 ИП Международный образовательный центр "ICE". Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
