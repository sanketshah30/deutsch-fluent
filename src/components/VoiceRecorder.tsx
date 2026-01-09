import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Keyboard, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface VoiceRecorderProps {
  onTranscriptChange: (text: string) => void;
  transcript: string;
}

export function VoiceRecorder({ onTranscriptChange, transcript }: VoiceRecorderProps) {
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const { t, language } = useLanguage();
  const { 
    isRecording, 
    isSupported, 
    transcript: voiceTranscript,
    startRecording, 
    stopRecording,
    error 
  } = useVoiceRecorder();

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
      if (voiceTranscript) {
        onTranscriptChange(voiceTranscript);
      }
    } else {
      startRecording();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTranscriptChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={inputMode === 'voice' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('voice')}
          className="gap-2"
        >
          <Mic className="h-4 w-4" />
          {language === 'de' ? 'Sprechen' : 'Speak'}
        </Button>
        <Button
          variant={inputMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('text')}
          className="gap-2"
        >
          <Keyboard className="h-4 w-4" />
          {language === 'de' ? 'Tippen' : 'Type'}
        </Button>
      </div>

      {/* Voice input mode */}
      {inputMode === 'voice' && (
        <div className="flex flex-col items-center gap-4">
          {!isSupported ? (
            <div className="text-center p-4 bg-warning/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t('voice.notSupported')}
              </p>
            </div>
          ) : (
            <>
              <Button
                variant={isRecording ? 'recording' : 'outline'}
                size="icon-lg"
                onClick={handleRecordClick}
                className="relative"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-6 w-6" />
                    <span className="absolute -bottom-8 text-xs text-muted-foreground">
                      {t('voice.stop')}
                    </span>
                  </>
                ) : (
                  <>
                    <Mic className="h-6 w-6" />
                    <span className="absolute -bottom-8 text-xs text-muted-foreground">
                      {t('voice.record')}
                    </span>
                  </>
                )}
              </Button>

              {isRecording && (
                <div className="flex items-center gap-2 text-accent animate-pulse">
                  <Volume2 className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('voice.recording')}</span>
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {(voiceTranscript || transcript) && (
                <div className="w-full p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === 'de' ? 'Ihre Antwort:' : 'Your response:'}
                  </p>
                  <p className="text-foreground">{voiceTranscript || transcript}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Text input mode */}
      {inputMode === 'text' && (
        <div className="space-y-2">
          <Textarea
            placeholder={t('voice.placeholder')}
            value={transcript}
            onChange={handleTextChange}
            className="min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground text-center">
            {language === 'de' 
              ? 'Tipp: Üben Sie auch das Sprechen für authentischere Übung!' 
              : 'Tip: Try speaking for more authentic practice!'}
          </p>
        </div>
      )}
    </div>
  );
}
