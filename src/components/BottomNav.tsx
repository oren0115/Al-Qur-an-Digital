import { Link, useLocation } from "react-router-dom";
import { BookOpen, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: BookOpen, label: "Qur'an" },
    { path: "/bookmark", icon: Bookmark, label: "Bookmark" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === "/" && location.pathname.startsWith("/surah"));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2.5 text-xs transition-all",
                "hover:bg-accent/50 rounded-lg mx-1",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "relative",
                  isActive && "after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-primary after:rounded-full"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
