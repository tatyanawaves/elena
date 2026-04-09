import { useQuery } from "convex/react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Lock,
  FileText,
  Target,
  Users,
  Lightbulb,
  Rocket,
  Brain,
  BarChart3,
  Heart,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import { useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

const blockIcons = [BarChart3, Brain, Heart, Rocket, Target, Lightbulb, Sparkles];

function getCategoryLabel(category: string, badge?: string) {
  if (badge === "Трансформационная игра") return "Трансформационная игра";
  if (badge === "Бизнес-игра") return "Бизнес-игра";
  if (category === "game") return "Игра";
  if (category === "youtube") return "Видеокурс";
  return "Тренинг";
}

export default function CourseViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = useQuery(api.courses.getBySlug, slug ? { slug } : "skip");
  const lessons = useQuery(
    api.courses.getLessons,
    course ? { courseId: course._id as Id<"courses"> } : "skip",
  );
  const isEnrolled = useQuery(
    api.enrollments.isEnrolled,
    course ? { courseId: course._id as Id<"courses"> } : "skip",
  );

  const [activeLesson, setActiveLesson] = useState<number>(0);

  if (course === undefined || lessons === undefined || isEnrolled === undefined) {
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
        <Button onClick={() => navigate("/my-courses")}>К моим курсам</Button>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Lock className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="text-2xl font-bold">Доступ закрыт</h2>
        <p className="text-muted-foreground">
          Вы не записаны на этот курс
        </p>
        <Button onClick={() => navigate(`/course/${slug}`)}>
          Перейти к описанию курса
        </Button>
      </div>
    );
  }

  const currentLesson = lessons.length > 0 ? lessons[activeLesson] : null;
  const videoId = currentLesson ? extractYoutubeId(currentLesson.youtubeUrl) : null;
  const categoryLabel = getCategoryLabel(course.category, course.badge ?? undefined);

  // ── VIDEO COURSE WITH LESSONS ───────────────────────────────
  if (lessons.length > 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <div className="border-b bg-card px-4 py-3">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => navigate("/my-courses")}
            >
              <ArrowLeft className="h-4 w-4" /> Мои курсы
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-sm font-semibold truncate">{course.title}</h1>
            <Badge variant="outline" className="ml-auto shrink-0">
              {activeLesson + 1} / {lessons.length}
            </Badge>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Video player */}
            <div className="lg:col-span-2 space-y-4">
              {videoId ? (
                <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-lg" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title={currentLesson?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
                  <Play className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}

              {/* Current lesson info */}
              {currentLesson && (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                    <div className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {currentLesson.durationMinutes} мин
                    </div>
                  </div>
                  {currentLesson.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {currentLesson.description}
                    </p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={activeLesson === 0}
                      onClick={() => setActiveLesson((p) => p - 1)}
                    >
                      ← Предыдущий
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={activeLesson === lessons.length - 1}
                      onClick={() => setActiveLesson((p) => p + 1)}
                    >
                      Следующий →
                    </Button>
                  </div>
                </div>
              )}

              {/* Course description below the video */}
              {course.longDescription && (
                <div className="mt-6 rounded-xl border bg-card p-6">
                  <h3 className="mb-3 text-lg font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    О курсе
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.longDescription}
                  </p>
                </div>
              )}

              {/* What you'll learn */}
              {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Чему вы научитесь
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {course.whatYouLearn.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Lesson sidebar */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                <FileText className="h-4 w-4" />
                Уроки курса ({lessons.length})
              </h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isActive = index === activeLesson;
                  const lessonVideoId = extractYoutubeId(lesson.youtubeUrl);
                  return (
                    <Card
                      key={lesson._id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "hover:border-primary/30"
                      }`}
                      onClick={() => setActiveLesson(index)}
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                            {lessonVideoId ? (
                              <img
                                src={`https://img.youtube.com/vi/${lessonVideoId}/mqdefault.jpg`}
                                alt={lesson.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Play className="h-6 w-6 text-muted-foreground/40" />
                              </div>
                            )}
                            {isActive && (
                              <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                                <Play className="h-5 w-5 text-primary fill-primary" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-1">
                              <span className="shrink-0 text-xs font-medium text-primary">
                                {index + 1}.
                              </span>
                              <p className={`text-sm leading-tight ${isActive ? "font-semibold" : "font-medium"}`}>
                                {lesson.title}
                              </p>
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {lesson.durationMinutes} мин
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── NON-VIDEO COURSE (training, game, etc.) ─────────────────
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-1"
        onClick={() => navigate("/my-courses")}
      >
        <ArrowLeft className="h-4 w-4" /> Мои курсы
      </Button>

      <div className="space-y-8">
        {/* Hero */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="gap-1">
              {course.category === "game" ? (
                <Gamepad2 className="h-3 w-3" />
              ) : (
                <BookOpen className="h-3 w-3" />
              )}
              {categoryLabel}
            </Badge>
            {course.badge && course.badge !== "Трансформационная игра" && course.badge !== "Бизнес-игра" && (
              <Badge className="bg-primary/10 text-primary border-primary/20">{course.badge}</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          {course.duration && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Длительность: {course.duration}
            </div>
          )}
        </div>

        {/* Enrolled status */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Вы записаны на этот курс</p>
                <p className="text-sm text-green-700">
                  {course.category === "game"
                    ? "Информация о расписании и доступе будет отправлена на вашу почту."
                    : "Материалы курса доступны. Информация о расписании на вашей почте."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {course.longDescription && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              О курсе
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              {course.longDescription}
            </p>
          </div>
        )}

        {/* What you'll learn */}
        {course.whatYouLearn && course.whatYouLearn.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Чему вы научитесь
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {course.whatYouLearn.map((item, i) => (
                <Card key={i} className="border-green-100">
                  <CardContent className="flex items-start gap-3 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-sm">{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* For whom */}
        {course.forWhom && course.forWhom.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Для кого
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {course.forWhom.map((item, i) => (
                <Card key={i}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary/60" />
                    <span className="text-sm">{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Program blocks */}
        {course.programBlocks && course.programBlocks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Программа курса
            </h2>
            <div className="space-y-3">
              {course.programBlocks.map((block, i) => {
                const Icon = blockIcons[i % blockIcons.length];
                return (
                  <Card key={i} className="overflow-hidden transition hover:shadow-md">
                    <CardContent className="flex gap-4 p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1">
                          Модуль {i + 1}
                        </Badge>
                        <h3 className="font-semibold">{block.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {block.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
