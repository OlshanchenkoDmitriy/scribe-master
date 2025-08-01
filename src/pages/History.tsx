import { History as HistoryIcon, Clock, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function History() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">История</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Автоматическое сохранение всех обработанных текстов для быстрого доступа
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-card rounded-xl p-8 border border-border/50 text-center">
          <div className="space-y-4">
            <Clock className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Скоро появится</h2>
            <p className="text-muted-foreground">
              История будет автоматически сохранять все тексты, обработанные в разделе "Инструменты"
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs">💾</span>
                </div>
                <h3 className="font-medium mb-1">Автосохранение</h3>
                <p className="text-sm text-muted-foreground">
                  Все обработанные тексты попадают в историю автоматически
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs">🔍</span>
                </div>
                <h3 className="font-medium mb-1">Быстрый поиск</h3>
                <p className="text-sm text-muted-foreground">
                  Поиск по содержимому и дате обработки
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview of upcoming interface */}
        <div className="bg-card rounded-lg p-6 border border-border/50">
          <h3 className="text-lg font-semibold mb-4">Предварительный просмотр интерфейса</h3>
          <div className="space-y-3 opacity-50">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                    <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="ghost" size="sm" disabled>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" disabled>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}