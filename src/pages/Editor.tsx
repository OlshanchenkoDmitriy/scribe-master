import { useState, useEffect } from "react";
import { 
  Undo2, 
  Redo2, 
  Copy, 
  Trash2, 
  ZoomIn, 
  ZoomOut,
  Plus,
  FileText,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Editor() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();

  const currentNote = currentNoteId ? notes.find(note => note.id === currentNoteId) : null;

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('linguascribe-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setCurrentNoteId(parsedNotes[0].id);
        setContent(parsedNotes[0].content);
      }
    } else {
      // Create first note if none exist
      createNewNote();
    }
  }, []);

  // Save notes to localStorage when notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('linguascribe-notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Update history when content changes
  useEffect(() => {
    if (content !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [content]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Новая заметка",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setCurrentNoteId(newNote.id);
    setContent("");
    setHistory([""]);
    setHistoryIndex(0);
  };

  const updateCurrentNote = (newContent: string) => {
    if (!currentNoteId) return;
    
    setContent(newContent);
    
    // Generate title from first line
    const firstLine = newContent.split('\n')[0].trim();
    const title = firstLine || "Новая заметка";
    
    setNotes(prev => prev.map(note => 
      note.id === currentNoteId 
        ? { ...note, title, content: newContent, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    
    if (noteId === currentNoteId) {
      const remainingNotes = notes.filter(note => note.id !== noteId);
      if (remainingNotes.length > 0) {
        setCurrentNoteId(remainingNotes[0].id);
        setContent(remainingNotes[0].content);
      } else {
        createNewNote();
      }
    }
    
    toast({
      title: "Заметка удалена",
      description: "Заметка была успешно удалена",
    });
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
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

  const clearContent = () => {
    updateCurrentNote("");
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      updateCurrentNote(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      updateCurrentNote(history[newIndex]);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    // Add transcript to current content with proper spacing
    const newContent = content + (content ? ' ' : '') + transcript;
    updateCurrentNote(newContent);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar with notes - Hidden on mobile, overlay on tablet */}
      <div className="hidden lg:flex w-80 bg-surface-elevated border-r border-border/50 flex-col shadow-soft">
        <div className="p-4 border-b border-border/50">
          <Button onClick={createNewNote} className="w-full shadow-soft hover:shadow-elevated transition-all duration-300" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Новая заметка
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setCurrentNoteId(note.id);
                setContent(note.content);
              }}
              className={cn(
                "p-4 rounded-xl cursor-pointer transition-all duration-300 group hover:scale-[1.02]",
                currentNoteId === note.id
                  ? "bg-gradient-primary text-white shadow-soft"
                  : "bg-card hover:bg-accent hover:shadow-elevated"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-editor-accent flex-shrink-0" />
                    <h3 className="font-medium truncate">{note.title}</h3>
                  </div>
                  <p className="text-sm opacity-80 line-clamp-2 leading-relaxed">
                    {note.content || "Пустая заметка"}
                  </p>
                  <p className="text-xs opacity-60 mt-2">
                    {note.updatedAt.toLocaleDateString('ru-RU')}
                  </p>
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 hover:bg-destructive/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Notes Toggle (only on small screens) */}
        <div className="lg:hidden bg-surface-elevated border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <Button onClick={createNewNote} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Заметка
            </Button>
            <div className="text-sm text-muted-foreground">
              {currentNote?.title || "Новая заметка"}
            </div>
          </div>
        </div>

        {/* Toolbar - Mobile optimized */}
        <div className="bg-surface-elevated border-b border-border/50 p-3 lg:p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            {/* Voice Recorder - Primary on mobile */}
            <div className="flex-1 lg:flex-none">
              <VoiceRecorder onTranscript={handleVoiceTranscript} />
            </div>
            
            {/* Action buttons - Responsive grid */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  variant="outline"
                  size="sm"
                  className="hover:shadow-soft"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  variant="outline"
                  size="sm"
                  className="hover:shadow-soft"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </div>
              
              <Button onClick={copyContent} variant="outline" size="sm" className="hover:shadow-soft">
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Копировать</span>
              </Button>
              
              <Button onClick={clearContent} variant="outline" size="sm" className="hover:shadow-soft">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Очистить</span>
              </Button>
              
              {/* Zoom controls - Desktop only */}
              <div className="hidden lg:flex items-center space-x-1">
                <Button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  variant="outline"
                  size="sm"
                  className="hover:shadow-soft"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                
                <span className="text-sm text-muted-foreground px-2 min-w-[3rem] text-center">
                  {fontSize}px
                </span>
                
                <Button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  variant="outline"
                  size="sm"
                  className="hover:shadow-soft"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor - Mobile optimized */}
        <div className="flex-1 p-4 lg:p-6 overflow-hidden">
          <div className="h-full">
            <textarea
              value={content}
              onChange={(e) => updateCurrentNote(e.target.value)}
              placeholder="Начните писать или используйте голосовую диктовку..."
              className="w-full h-full resize-none bg-editor-bg border-0 outline-none text-foreground placeholder:text-muted-foreground font-mono leading-relaxed rounded-xl p-4 lg:p-6 shadow-soft focus:shadow-elevated transition-all duration-300"
              style={{ 
                fontSize: `${Math.max(14, fontSize)}px`,
                lineHeight: '1.6'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}