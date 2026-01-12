import { useState, useRef, useEffect } from 'react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const { 
    isRecording, 
    isSupported, 
    transcript,
    startRecording, 
    stopRecording,
    resetTranscript
  } = useVoiceRecorder();

  // Update message when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSend(message.trim());
    setMessage('');
    resetTranscript();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setMessage('');
      startRecording();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-full shadow-sm">
      {/* Voice button */}
      {isSupported && (
        <Button
          variant={isRecording ? 'recording' : 'ghost'}
          size="icon"
          onClick={handleMicClick}
          disabled={disabled}
          className="shrink-0"
        >
          {isRecording ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Text input */}
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isRecording 
            ? (language === 'de' ? 'Aufnahme läuft...' : 'Recording...') 
            : (language === 'de' ? 'Antwort eingeben...' : 'Type your response...')
        }
        disabled={disabled || isRecording}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
      />

      {/* Send button */}
      <Button
        variant="hero"
        size="icon"
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="shrink-0 rounded-full"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
