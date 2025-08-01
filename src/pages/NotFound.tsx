import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-surface-elevated rounded-2xl p-8 shadow-elevated">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Страница не найдена
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Запрашиваемая страница не существует или была перемещена
          </p>
          <Button asChild className="min-h-[48px] shadow-soft hover:shadow-elevated">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Вернуться на главную
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
