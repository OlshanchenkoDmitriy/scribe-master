import { Link, useLocation } from "react-router-dom";
import { 
  Edit3, 
  Settings, 
  Music, 
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Редактор",
    href: "/",
    icon: Edit3,
    description: "Основной редактор с голосовой диктовкой"
  },
  {
    name: "Инструменты",
    href: "/tools",
    icon: Settings,
    description: "Обработка и преобразование текста"
  },
  {
    name: "Suno",
    href: "/suno",
    icon: Music,
    description: "Редактор для написания песен"
  },
  {
    name: "История",
    href: "/history",
    icon: History,
    description: "История обработанных текстов"
  }
];

export function Navigation() {
  const location = useLocation();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="bg-surface-elevated border-b border-border/50 px-4 py-3 flex-shrink-0 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          <h1 className=\"text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent\">\n
            LinguaScribe
          </h1>
        </div>
      </header>

      {/* Main Content Area - This will be filled by route content */}
      <div className="flex-1 overflow-auto">
        {/* Content rendered by App.tsx routing */}
      </div>

      {/* Bottom Navigation - Mobile-optimized with safe area */}
      <nav className="bg-surface-elevated border-t border-border/50 flex-shrink-0 px-3 py-3 pb-safe-bottom shadow-elevated">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 min-w-[72px] min-h-[64px] group active:scale-95 touch-manipulation",
                  isActive
                    ? "bg-gradient-primary text-white shadow-soft scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-soft"
                )}
                aria-label={item.description}
              >
                <Icon className={cn(
                  "w-6 h-6 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:scale-105"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-all duration-300 text-center",
                  isActive ? "text-white" : "text-inherit"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}