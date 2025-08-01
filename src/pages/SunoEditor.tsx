import { Music, Clock, Tag } from "lucide-react";

export default function SunoEditor() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Suno Редактор</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Специализированный редактор для написания и структурирования текстов песен
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-card rounded-xl p-8 border border-border/50 text-center">
          <div className="space-y-4">
            <Clock className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Скоро появится</h2>
            <p className="text-muted-foreground">
              Мы работаем над созданием мощного редактора для песен с поддержкой:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Tag className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-medium mb-1">Структурные теги</h3>
                <p className="text-sm text-muted-foreground">
                  [Intro], [Verse], [Chorus], [Bridge]
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <Music className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-medium mb-1">Теги стилей</h3>
                <p className="text-sm text-muted-foreground">
                  Автоматические предложения жанров и настроений
                </p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <h3 className="font-medium mb-1">Анализатор структуры</h3>
                <p className="text-sm text-muted-foreground">
                  Проверка и предпросмотр финального результата
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview of upcoming features */}
        <div className="bg-card rounded-lg p-6 border border-border/50">
          <h3 className="text-lg font-semibold mb-4">Предварительный просмотр интерфейса</h3>
          <div className="space-y-4 opacity-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Название песни</label>
                <div className="h-10 bg-muted rounded border mt-1"></div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Теги стиля</label>
                <div className="h-10 bg-muted rounded border mt-1"></div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Текст песни</label>
              <div className="h-64 bg-muted rounded border mt-1 p-4">
                <div className="text-muted-foreground/50 font-mono text-sm">
                  [Intro]<br/>
                  <br/>
                  [Verse 1]<br/>
                  <br/>
                  [Chorus]<br/>
                  <br/>
                  [Verse 2]<br/>
                  <br/>
                  [Chorus]<br/>
                  <br/>
                  [Bridge]<br/>
                  <br/>
                  [Chorus]<br/>
                  <br/>
                  [Outro]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}