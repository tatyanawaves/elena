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
} from "lucide-react";
import { useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
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

  const currentLesson = lessons[activeLesson];
  const videoId = currentLesson ? extractYoutubeId(currentLesson.youtubeUrl) : null;

  // For non-YouTube courses without lessons, show course content page
  if (lessons.length === 0) {
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

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              <BookOpen className="mr-1 h-3 w-3" />
              {course.category === "game" ? "Бизнес-игра" : "Тренинг"}
            </Badge>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {course.longDescription || course.description}
            </p>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Вы записаны на этот курс</p>
                  <p className="text-sm text-muted-foreground">
                    Формат: {course.category === "game" ? "Живая бизнес-игра" : "Живой тренинг"}. 
                    Информация о расписании и доступе будет отправлена на вашу почту.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {course.programBlocks && course.programBlocks.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-bold">Программа курса</h2>
              <div className="space-y-3">
                {course.programBlocks.map((block, i) => (
                  <Card key={i}>
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{block.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {block.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
          {/* Video player - main area */}
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
                
                {/* Navigation buttons */}
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
          </div>

          {/* Lesson list sidebar */}
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
                        {/* Thumbnail */}
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
                        {/* Info */}
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
