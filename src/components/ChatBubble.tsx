import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface ChatBubbleProps {
  message: string;
  translation?: string;
  isUser?: boolean;
  showSpeaker?: boolean;
  originalGerman?: string;
  className?: string;
}

export function ChatBubble({ 
  message, 
  translation, 
  isUser = false, 
  showSpeaker = false,
  originalGerman,
  className 
}: ChatBubbleProps) {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // Always speak the German version for pronunciation practice
      const textToSpeak = originalGerman || message;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={cn(
      "flex",
      isUser ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3",
        isUser 
          ? "bg-primary text-primary-foreground rounded-br-md" 
          : "bg-muted text-foreground rounded-bl-md"
      )}>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{message}</p>
            {translation && (
              <p className={cn(
                "text-xs mt-1 italic",
                isUser ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {translation}
              </p>
            )}
          </div>
          {showSpeaker && !isUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSpeak}
              className="shrink-0 h-6 w-6 hover:bg-background/20"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
