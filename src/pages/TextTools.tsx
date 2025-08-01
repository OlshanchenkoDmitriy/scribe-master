import { useState } from "react";
import { 
  Copy, 
  Trash2, 
  Undo2, 
  Redo2,
  ClipboardPaste,
  Search,
  Replace
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function TextTools() {
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [history, setHistory] = useState<string[]>([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const { toast } = useToast();

  const addToHistory = (newText: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setText(newText);
  };

  const pasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      addToHistory(clipboardText);
      toast({
        title: "Вставлено",
        description: "Текст вставлен из буфера обмена",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось получить доступ к буферу обмена",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Скопировано",
        description: "Текст скопирован в буфер обмена",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось скопировать текст",
      });
    }
  };

  const clearText = () => {
    addToHistory("");
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const findAndReplace = () => {
    if (!searchText) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите текст для поиска",
      });
      return;
    }

    const newText = text.replace(new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceText);
    const replacements = text.split(searchText).length - 1;
    
    addToHistory(newText);
    
    toast({
      title: "Замена выполнена",
      description: `Заменено вхождений: ${replacements}`,
    });
  };

  const removeCharacter = (char: string) => {
    const newText = text.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), "");
    const removed = text.length - newText.length;
    
    addToHistory(newText);
    
    toast({
      title: "Символы удалены",
      description: `Удалено символов "${char}": ${removed}`,
    });
  };

  const specialCharacters = [
    { char: ",", label: "Запятые" },
    { char: ".", label: "Точки" },
    { char: "!", label: "Восклицательные знаки" },
    { char: "?", label: "Вопросительные знаки" },
    { char: ";", label: "Точки с запятой" },
    { char: ":", label: "Двоеточия" },
    { char: '"', label: "Кавычки" },
    { char: "'", label: "Апострофы" },
    { char: "-", label: "Дефисы" },
    { char: "(", label: "Скобки (" },
    { char: ")", label: "Скобки )" },
    { char: "[", label: "Квадратные скобки [" },
    { char: "]", label: "Квадратные скобки ]" }
  ];

  const formatCase = (type: 'upper' | 'lower' | 'title') => {
    let newText = text;
    switch (type) {
      case 'upper':
        newText = text.toUpperCase();
        break;
      case 'lower':
        newText = text.toLowerCase();
        break;
      case 'title':
        newText = text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
    }
    addToHistory(newText);
  };

  const cleanText = (type: 'spaces' | 'lines' | 'numbers' | 'emojis') => {
    let newText = text;
    switch (type) {
      case 'spaces':
        newText = text.replace(/\s+/g, ' ').trim();
        break;
      case 'lines':
        newText = text.replace(/\n\s*\n/g, '\n').trim();
        break;
      case 'numbers':
        newText = text.replace(/\d/g, '');
        break;
      case 'emojis':
        newText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
        break;
    }
    addToHistory(newText);
  };

  const getTextStats = () => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const uniqueWords = new Set(words.map(word => word.toLowerCase()));
    const readingTime = Math.ceil(words.length / 200); // 200 words per minute

    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      uniqueWords: uniqueWords.size,
      readingTime
    };
  };

  const stats = getTextStats();

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Инструменты для текста
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Мощные инструменты для обработки и преобразования текста
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface-elevated rounded-xl p-4 lg:p-6 border border-border/50 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 lg:gap-3">
            <Button onClick={pasteFromClipboard} variant="outline" size="sm" className="hover:shadow-soft transition-all duration-300">
              <ClipboardPaste className="w-4 h-4 lg:mr-2" />
              <span className="hidden sm:inline">Вставить</span>
            </Button>
            <Button onClick={copyToClipboard} variant="outline" size="sm" className="hover:shadow-soft transition-all duration-300">
              <Copy className="w-4 h-4 lg:mr-2" />
              <span className="hidden sm:inline">Копировать</span>
            </Button>
            <Button onClick={clearText} variant="outline" size="sm" className="hover:shadow-soft transition-all duration-300">
              <Trash2 className="w-4 h-4 lg:mr-2" />
              <span className="hidden sm:inline">Очистить</span>
            </Button>
            <Button onClick={undo} disabled={historyIndex <= 0} variant="outline" size="sm" className="hover:shadow-soft transition-all duration-300">
              <Undo2 className="w-4 h-4 lg:mr-2" />
              <span className="hidden sm:inline">Отменить</span>
            </Button>
            <Button onClick={redo} disabled={historyIndex >= history.length - 1} variant="outline" size="sm" className="hover:shadow-soft transition-all duration-300">
              <Redo2 className="w-4 h-4 lg:mr-2" />
              <span className="hidden sm:inline">Повторить</span>
            </Button>
          </div>
        </div>

        {/* Main Text Area */}
        <div className="bg-surface-elevated rounded-xl p-4 lg:p-6 border border-border/50 shadow-soft">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите или вставьте текст для обработки..."
            className="min-h-[250px] lg:min-h-[300px] font-mono bg-editor-bg border-border/30 rounded-xl shadow-soft focus:shadow-elevated transition-all duration-300 text-sm lg:text-base"
          />
        </div>

        {/* Search and Replace */}
        <div className="bg-surface-elevated rounded-xl p-4 lg:p-6 border border-border/50 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Поиск и замена</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Найти..."
              className="bg-editor-bg border-border/30 rounded-lg"
            />
            <Input
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Заменить на..."
              className="bg-editor-bg border-border/30 rounded-lg"
            />
            <Button onClick={findAndReplace} className="w-full min-h-[44px] shadow-soft hover:shadow-elevated transition-all duration-300">
              <Replace className="w-4 h-4 mr-2" />
              Заменить все
            </Button>
          </div>
        </div>

        {/* Remove Special Characters - Mobile responsive */}
        <div className="bg-surface-elevated rounded-xl p-4 lg:p-6 border border-border/50 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Удаление символов</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {specialCharacters.map(({ char, label }) => (
              <Button
                key={char}
                onClick={() => removeCharacter(char)}
                variant="outline"
                size="sm"
                title={`Удалить ${label}`}
                className="min-h-[44px] hover:shadow-soft transition-all duration-300 active:scale-95"
              >
                <span className="text-base font-mono">{char}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Text Formatting */}
        <div className="bg-surface-elevated rounded-xl p-4 lg:p-6 border border-border/50 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Форматирование регистра</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              onClick={() => formatCase('upper')} 
              variant="outline" 
              size="sm" 
              className="min-h-[44px] hover:shadow-soft transition-all duration-300"
            >
              ВЕРХНИЙ РЕГИСТР
            </Button>
            <Button 
              onClick={() => formatCase('lower')} 
              variant="outline" 
              size="sm"
              className="min-h-[44px] hover:shadow-soft transition-all duration-300"
            >
              нижний регистр
            </Button>
            <Button 
              onClick={() => formatCase('title')} 
              variant="outline" 
              size="sm"
              className="min-h-[44px] hover:shadow-soft transition-all duration-300"
            >
              Заглавные Буквы
            </Button>
          </div>
        </div>

        {/* Text Cleaning */}
        <div className="bg-surface-elevated rounded-xl p-4 lg:p-6 border border-border/50 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Очистка текста</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-3">
            <Button 
              onClick={() => cleanText('spaces')} 
              variant="outline" 
              size="sm"
              className="min-h-[44px] hover:shadow-soft transition-all duration-300"
            >
              Пробелы
            </Button>
            <Button 
              onClick={() => cleanText('lines')} 
              variant="outline" 
              size="sm"
              className="min-h-[44px] hover:shadow-soft transition-all duration-300"
            >
              Строки
            </Button>
            <Button 
              onClick={() => cleanText('numbers')} 
              variant="outline" 
              size="sm"
              className="min-h-[44px] hover:shadow-soft transition-all duration-300"
            >
              Цифры
            </Button>
            <Button 
              onClick={() => cleanText('emojis')} 
              variant="outline" 
              size="sm"
              className="min-h-[44px] hover:shadow-soft transition-all duration-300"
            >
              Эмодзи
            </Button>
          </div>
        </div>

        {/* Text Statistics - Mobile optimized */}
        <div className="bg-surface-elevated rounded-xl p-4 lg:p-6 border border-border/50 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Статистика текста</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-surface rounded-lg">
              <div className="text-xl lg:text-2xl font-bold text-primary">{stats.characters}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Символов</div>
            </div>
            <div className="text-center p-3 bg-gradient-surface rounded-lg">
              <div className="text-xl lg:text-2xl font-bold text-primary">{stats.words}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Слов</div>
            </div>
            <div className="text-center p-3 bg-gradient-surface rounded-lg">
              <div className="text-xl lg:text-2xl font-bold text-primary">{stats.sentences}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Предложений</div>
            </div>
            <div className="text-center p-3 bg-gradient-surface rounded-lg">
              <div className="text-xl lg:text-2xl font-bold text-primary">{stats.readingTime}</div>
              <div className="text-xs lg:text-sm text-muted-foreground">Мин. чтения</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}