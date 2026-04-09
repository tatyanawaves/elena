import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Play } from "lucide-react";

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const enrollments = useQuery(api.enrollments.myEnrollments);
  const allCourses = useQuery(api.courses.list);

  if (enrollments === undefined || allCourses === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const enrolledCourseIds = new Set(
    enrollments.filter((e) => e.status === "active").map((e) => e.courseId),
  );
  const myCourses = allCourses.filter((c) => enrolledCourseIds.has(c._id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Мои курсы</h1>
        <p className="mt-2 text-muted-foreground">
          Курсы, на которые вы записаны
        </p>
      </div>

      {myCourses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <GraduationCap className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="mb-2 text-lg font-semibold">Нет активных курсов</h3>
            <p className="mb-6 max-w-sm text-muted-foreground">
              Вы ещё не записались ни на один курс. Посмотрите доступные
              программы обучения.
            </p>
            <Button onClick={() => navigate("/")}>Смотреть курсы</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => (
            <Card
              key={course._id}
              className="group cursor-pointer transition hover:shadow-lg"
              onClick={() => navigate(`/course/${course.slug}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {course.category === "youtube" ? (
                    <Badge variant="secondary" className="gap-1">
                      <Play className="h-3 w-3" /> Видеокурс
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="h-3 w-3" /> Тренинг
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {course.description}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  {course.category === "youtube" ? (
                    <>
                      <Play className="h-4 w-4" /> Смотреть уроки
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4" /> Открыть курс
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
