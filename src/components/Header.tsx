import { useConvexAuth } from "convex/react";
import { GraduationCap, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const NAV_LINKS = [
  { label: "Обо мне", href: "#about" },
  { label: "Курсы", href: "#courses" },
  { label: "Достижения", href: "#achievements" },
  { label: "Игры", href: "#games" },
  { label: "Контакты", href: "#contact" },
];

export function Header() {
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-flat.jpeg" alt="Логотип" className="h-8 w-8 rounded-md" />
          <span className="text-lg font-bold">
            <span className="text-foreground">Елена </span>
            <span className="text-primary">Колос</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => scrollTo(link.href)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate("/my-courses")} className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Мои курсы
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="gap-1">
                <LogIn className="h-4 w-4" />
                Войти
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")}>
                Записаться
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition hover:bg-accent"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-2 border-t pt-2">
              {isAuthenticated ? (
                <Button className="w-full gap-2" size="sm" onClick={() => { setMobileOpen(false); navigate("/my-courses"); }}>
                  <GraduationCap className="h-4 w-4" />
                  Мои курсы
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setMobileOpen(false); navigate("/login"); }}>
                    Войти
                  </Button>
                  <Button size="sm" onClick={() => { setMobileOpen(false); navigate("/signup"); }}>
                    Записаться
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
