import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedCourses = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("courses").first();
    if (existing) {
      console.log("Courses already seeded, skipping");
      return null;
    }

    // Training courses from the original site
    const courses = [
      {
        slug: "formula-schastya",
        title: "Формула счастья предпринимателя",
        description:
          "Масштабный 6-месячный авторский тренинг. Три самостоятельных блока — управление бизнесом, собой и деньгами — объединяются в единую систему, усиливая друг друга.",
        longDescription:
          "Авторский тренинг Елены Колос, разработанный за 30+ лет практики. Формула счастья — это уникальная методика, которая объединяет три ключевых блока: управление бизнесом, управление собой и управление финансами. Каждый блок работает самостоятельно, но вместе они создают мощный синергетический эффект. За 6 месяцев вы пройдёте путь от хаоса к системе, от выгорания к вдохновению.",
        whatYouLearn: [
          "Выстраивать стратегию бизнеса на 3-5 лет вперёд",
          "Управлять стрессом и предотвращать выгорание",
          "Грамотно распоряжаться личными и бизнес-финансами",
          "Находить баланс между работой и личной жизнью",
          "Принимать решения в условиях неопределённости",
          "Мотивировать себя и команду на результат",
        ],
        forWhom: [
          "Предприниматели с опытом от 2 лет",
          "Руководители малого и среднего бизнеса",
          "Те, кто чувствует выгорание и потерю мотивации",
          "Бизнесмены, которые хотят выйти на новый уровень",
        ],
        programBlocks: [
          { title: "Блок 1: Управление бизнесом", description: "Стратегическое планирование, антикризисное управление, построение системы в бизнесе" },
          { title: "Блок 2: Управление собой", description: "Тайм-менеджмент, эмоциональный интеллект, профилактика выгорания, лидерство" },
          { title: "Блок 3: Управление деньгами", description: "Финансовая грамотность, бюджетирование, инвестиции, разделение личных и бизнес-финансов" },
        ],
        duration: "6 месяцев",
        priceKzt: 150000,
        originalPriceKzt: 200000,
        badge: "Хит продаж",
        category: "training" as const,
        order: 1,
        isActive: true,
      },
      {
        slug: "upravlenie-vremenem",
        title: "Эффективное управление временем",
        description:
          "Тренинг по тайм-менеджменту в жизни и бизнесе. Научитесь расставлять приоритеты, планировать и достигать целей без выгорания.",
        longDescription:
          "Интенсивный 5-дневный тренинг, который навсегда изменит ваше отношение ко времени. Вы научитесь не просто планировать день, а выстраивать систему, которая работает на вас. Практические инструменты, которые вы сможете применить уже в первый день.",
        whatYouLearn: [
          "Расставлять приоритеты по методу Елены Колос",
          "Планировать день, неделю и месяц эффективно",
          "Делегировать задачи без потери контроля",
          "Избавиться от прокрастинации",
          "Находить время на семью, здоровье и отдых",
        ],
        forWhom: [
          "Предприниматели и руководители",
          "Те, кто постоянно не успевает",
          "Люди, стремящиеся к work-life balance",
        ],
        programBlocks: [
          { title: "День 1: Аудит времени", description: "Анализируем, куда уходит ваше время. Находим «чёрные дыры» и точки роста" },
          { title: "День 2: Система приоритетов", description: "Учимся отличать важное от срочного. Матрица Эйзенхауэра на практике" },
          { title: "День 3: Планирование", description: "Создаём персональную систему планирования. Ежедневные, недельные, месячные ритуалы" },
          { title: "День 4: Делегирование", description: "Что делегировать, кому и как. Контроль без микроменеджмента" },
          { title: "День 5: Интеграция", description: "Собираем всё в единую систему. Практика и закрепление" },
        ],
        duration: "5 дней",
        priceKzt: 30000,
        originalPriceKzt: 45000,
        badge: "Популярный",
        category: "training" as const,
        order: 2,
        isActive: true,
      },
      {
        slug: "upravlenie-biznesom",
        title: "Управление бизнесом",
        description:
          "Стратегический тренинг для предпринимателей. Антикризисное управление, риск-менеджмент, выбор оптимальной стратегии развития.",
        longDescription:
          "Индивидуальная программа для предпринимателей, которые хотят вывести бизнес на новый уровень. Работаем над конкретными задачами вашего бизнеса: стратегия, финансы, команда, клиенты. Программа адаптируется под ваши цели.",
        whatYouLearn: [
          "Выбирать оптимальную стратегию развития",
          "Управлять рисками и кризисами",
          "Строить эффективную команду",
          "Масштабировать бизнес системно",
          "Анализировать рынок и конкурентов",
        ],
        forWhom: [
          "Собственники бизнеса",
          "Топ-менеджеры компаний",
          "Начинающие предприниматели с амбициями роста",
        ],
        programBlocks: [
          { title: "Стратегический анализ", description: "SWOT-анализ, анализ рынка, определение конкурентных преимуществ" },
          { title: "Финансовое управление", description: "Бюджетирование, управление cash flow, финансовое планирование" },
          { title: "Команда и лидерство", description: "Подбор, мотивация и развитие команды. Стили управления" },
          { title: "Маркетинг и продажи", description: "Стратегия привлечения и удержания клиентов" },
        ],
        duration: "Индивидуально",
        category: "training" as const,
        order: 3,
        isActive: true,
      },
      {
        slug: "upravlenie-dengami",
        title: "Управление деньгами",
        description:
          "Финансовая грамотность для предпринимателей и их семей. Эффективное управление личными и бизнес-финансами.",
        longDescription:
          "Программа финансовой грамотности, которая меняет отношение к деньгам. Вы научитесь разделять личные и бизнес-финансы, создавать подушку безопасности и инвестировать. Подходит как для предпринимателей, так и для их семей.",
        whatYouLearn: [
          "Разделять личные и бизнес-финансы",
          "Создавать и контролировать бюджет",
          "Формировать финансовую подушку безопасности",
          "Основы инвестирования для предпринимателей",
          "Планировать финансовое будущее семьи",
        ],
        forWhom: [
          "Предприниматели и их семьи",
          "Те, кто хочет навести порядок в финансах",
          "Руководители, управляющие бюджетами",
        ],
        programBlocks: [
          { title: "Финансовый аудит", description: "Анализ текущей финансовой ситуации, выявление проблемных зон" },
          { title: "Бюджетирование", description: "Создание системы учёта доходов и расходов, личных и бизнес" },
          { title: "Накопления и инвестиции", description: "Формирование подушки безопасности, основы инвестирования" },
          { title: "Финансовый план", description: "Построение долгосрочного финансового плана для семьи и бизнеса" },
        ],
        duration: "Индивидуально",
        category: "training" as const,
        order: 4,
        isActive: true,
      },
      {
        slug: "klientoorientirovannost",
        title: "Клиентоориентированность",
        description:
          "Бизнес-игра для команд. Отработка навыков работы с клиентами, моделирование реальных бизнес-ситуаций, поиск нестандартных решений.",
        longDescription:
          "Авторская бизнес-игра Елены Колос для корпоративных команд. За один день ваша команда проживёт десятки клиентских ситуаций, научится находить нестандартные решения и работать сообща. Игровой формат делает обучение увлекательным и запоминающимся.",
        whatYouLearn: [
          "Понимать потребности клиентов на глубинном уровне",
          "Работать с возражениями и жалобами",
          "Находить нестандартные решения в сложных ситуациях",
          "Работать в команде для достижения общей цели",
          "Превращать недовольных клиентов в лояльных",
        ],
        forWhom: [
          "Корпоративные команды от 6 человек",
          "Отделы продаж и сервиса",
          "Руководители, которые хотят улучшить клиентский сервис",
        ],
        programBlocks: [
          { title: "Разминка и знакомство", description: "Командообразующие упражнения, настройка на игру" },
          { title: "Игровые раунды", description: "Моделирование реальных бизнес-ситуаций с клиентами" },
          { title: "Рефлексия и разбор", description: "Анализ решений, обратная связь, выводы для реальной работы" },
        ],
        duration: "1 день",
        priceKzt: 5000,
        originalPriceKzt: 7500,
        badge: "Игра",
        category: "game" as const,
        order: 5,
        isActive: true,
      },
      // YouTube courses
      {
        slug: "maraton-konflikty",
        title: "Марафон: Управление конфликтами",
        description:
          "3-дневный марафон по управлению конфликтами в семье и коллективе. Практические инструменты для разрешения конфликтов без стресса.",
        longDescription:
          "Авторский 3-дневный марафон Елены Колос, посвящённый управлению конфликтами. Вы узнаете, как перестать конфликтовать со взрослыми детьми, как выйти из конфликта сохранив спокойствие, и как избежать стресса в семье и коллективе.",
        whatYouLearn: [
          "Распознавать конфликт на ранней стадии",
          "Управлять эмоциями в конфликтных ситуациях",
          "Находить компромиссы со взрослыми детьми",
          "Выходить из конфликта без стресса",
          "Строить гармоничные отношения в семье и на работе",
        ],
        forWhom: [
          "Родители взрослых детей",
          "Руководители и менеджеры",
          "Все, кто хочет улучшить отношения в семье",
        ],
        duration: "3 дня",
        priceKzt: 5000,
        badge: "Видеокурс",
        category: "youtube" as const,
        order: 6,
        isActive: true,
      },
      {
        slug: "strategiya-biznesa",
        title: "Как выбрать эффективную стратегию бизнеса",
        description:
          "Мастер-класс по выбору стратегии развития бизнеса. Анализ, планирование и реализация стратегических решений.",
        longDescription:
          "Глубокий мастер-класс от Елены Колос о том, как выбрать правильную стратегию для вашего бизнеса. Разбираем реальные кейсы, анализируем типичные ошибки предпринимателей и строим план действий.",
        whatYouLearn: [
          "Анализировать текущую позицию бизнеса",
          "Выбирать стратегию из нескольких вариантов",
          "Оценивать риски каждой стратегии",
          "Составлять план реализации стратегии",
        ],
        forWhom: [
          "Предприниматели на стадии роста",
          "Владельцы бизнеса, планирующие изменения",
          "Начинающие бизнесмены",
        ],
        duration: "1 час 13 мин",
        priceKzt: 3000,
        badge: "Видеокурс",
        category: "youtube" as const,
        order: 7,
        isActive: true,
      },
      {
        slug: "vzaimootnosheniya-v-semye",
        title: "Взаимоотношения в семье",
        description:
          "Как строить гармоничные отношения в семье. Практические советы от психолога и коуча с 30-летним опытом.",
        longDescription:
          "Практические советы и техники от Елены Колос для построения гармоничных семейных отношений. Основано на 30-летнем опыте коучинга семей предпринимателей.",
        whatYouLearn: [
          "Понимать потребности каждого члена семьи",
          "Выстраивать доверительные отношения",
          "Решать семейные вопросы без конфликтов",
          "Поддерживать баланс между семьёй и работой",
        ],
        forWhom: [
          "Семейные пары",
          "Предприниматели, которые много работают",
          "Родители, которые хотят улучшить отношения с детьми",
        ],
        duration: "38 мин",
        priceKzt: 2000,
        badge: "Видеокурс",
        category: "youtube" as const,
        order: 8,
        isActive: true,
      },
    ];

    for (const course of courses) {
      const courseId = await ctx.db.insert("courses", course);

      // Add lessons for YouTube courses
      if (course.slug === "maraton-konflikty") {
        await ctx.db.insert("lessons", {
          courseId,
          title:
            "День 1: Как перестать конфликтовать со своими взрослыми детьми",
          youtubeUrl: "https://www.youtube.com/watch?v=-h0o1gDMhAo",
          durationMinutes: 70,
          order: 1,
        });
        await ctx.db.insert("lessons", {
          courseId,
          title:
            "День 2: Как выйти из конфликта с детьми, сохранив спокойствие и нервы",
          youtubeUrl: "https://www.youtube.com/watch?v=qxa0ReI4vkM",
          durationMinutes: 49,
          order: 2,
        });
        await ctx.db.insert("lessons", {
          courseId,
          title:
            "День 3: Как выйти из конфликта без стресса в семье и коллективе",
          youtubeUrl: "https://www.youtube.com/watch?v=T7oK56ePsMY",
          durationMinutes: 56,
          order: 3,
        });
      } else if (course.slug === "strategiya-biznesa") {
        await ctx.db.insert("lessons", {
          courseId,
          title: "Как выбрать эффективную стратегию бизнеса",
          youtubeUrl: "https://www.youtube.com/watch?v=p7UrzFD38i4",
          durationMinutes: 73,
          order: 1,
        });
      } else if (course.slug === "vzaimootnosheniya-v-semye") {
        await ctx.db.insert("lessons", {
          courseId,
          title: "Взаимоотношения в семье",
          youtubeUrl: "https://www.youtube.com/watch?v=MBqXupmfDYQ",
          durationMinutes: 38,
          order: 1,
        });
      }
    }

    console.log("Seeded courses and lessons successfully!");
    return null;
  },
});

// Reseed: delete all courses and re-add them (for updating content)
export const reseedCourses = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Delete existing courses and lessons
    const courses = await ctx.db.query("courses").collect();
    for (const course of courses) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_course", (q) => q.eq("courseId", course._id))
        .collect();
      for (const lesson of lessons) {
        await ctx.db.delete(lesson._id);
      }
      // Delete enrollments for this course
      const enrollments = await ctx.db.query("enrollments").collect();
      for (const e of enrollments) {
        if (e.courseId === course._id) {
          await ctx.db.delete(e._id);
        }
      }
      await ctx.db.delete(course._id);
    }
    console.log("Deleted all courses, lessons, and related enrollments");
    return null;
  },
});

// Enroll a user in all courses (for testing)
export const enrollUserInAll = internalMutation({
  args: { email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find user by email
    const authAccounts = await ctx.db.query("authAccounts").collect();
    let userId = null;
    for (const account of authAccounts) {
      if ((account as any).providerAccountId === args.email || (account as any).email === args.email) {
        userId = account.userId;
        break;
      }
    }

    if (!userId) {
      console.log("User not found with email:", args.email);
      return null;
    }

    const courses = await ctx.db.query("courses").collect();
    let enrolled = 0;

    for (const course of courses) {
      // Check if already enrolled
      const existing = await ctx.db
        .query("enrollments")
        .withIndex("by_user_course", (q) =>
          q.eq("userId", userId).eq("courseId", course._id),
        )
        .unique();
      
      if (!existing) {
        await ctx.db.insert("enrollments", {
          userId,
          courseId: course._id,
          enrolledAt: Date.now(),
          status: "active",
        });
        enrolled++;
      }
    }
    console.log(`Enrolled user in ${enrolled} courses (${courses.length} total)`);
    return null;
  },
});
