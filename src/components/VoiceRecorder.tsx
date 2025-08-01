import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceRecorder({ onTranscript, className }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ru-RU'; // Russian language support

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = "Ошибка распознавания речи";
      switch (event.error) {
        case 'not-allowed':
          errorMessage = "Доступ к микрофону запрещен. Пожалуйста, разрешите использование микрофона.";
          break;
        case 'no-speech':
          errorMessage = "Речь не обнаружена. Попробуйте говорить громче.";
          break;
        case 'network':
          errorMessage = "Ошибка сети. Проверьте подключение к интернету.";
          break;
      }
      
      toast({
        variant: "destructive",
        title: "Ошибка голосовой диктовки",
        description: errorMessage,
      });
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript, toast]);

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;

    try {
      recognitionRef.current.start();
      toast({
        title: "Голосовая диктовка активна",
        description: "Говорите в микрофон для записи текста",
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось запустить голосовую диктовку",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      toast({
        title: "Голосовая диктовка остановлена",
        description: "Запись завершена",
      });
    }
  };

  if (!isSupported) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Button variant="secondary" disabled>
          <MicOff className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Голосовая диктовка не поддерживается в вашем браузере
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        onClick={isListening ? stopListening : startListening}
        className={cn(
          "relative transition-all duration-300 shadow-soft hover:shadow-elevated active:scale-95 min-h-[44px] px-4",
          isListening
            ? "bg-gradient-voice hover:bg-gradient-voice shadow-voice scale-105"
            : "bg-gradient-primary hover:bg-gradient-primary"
        )}
        size="sm"
      >
        {isListening ? (
          <>
            <Square className="w-4 h-4 animate-pulse" />
            <span className="ml-2 font-medium">Остановить</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="ml-2 font-medium">Диктовать</span>
          </>
        )}
        
        {isListening && (
          <div className="absolute -inset-1 bg-voice-active rounded-xl opacity-20 animate-pulse" />
        )}
      </Button>
      
      {isListening && (
        <div className="flex items-center space-x-2 animate-fade-in">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-voice-active rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-voice-active rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-voice-active rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <span className="text-sm font-medium text-voice-active">
            Слушаю...
          </span>
        </div>
      )}
    </div>
  );
}