import { useState, useRef, useEffect } from 'react';
import { Scenario, FeedbackData } from '@/types/scenario';
import { useProgress } from '@/hooks/useProgress';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateFeedback } from '@/utils/feedback';
import { ChatInput } from '@/components/ChatInput';
import { ChatBubble } from '@/components/ChatBubble';
import { FeedbackDisplay } from '@/components/FeedbackDisplay';
import { Button } from '@/components/ui/button';
import { GermanStripe } from '@/components/GermanStripe';
import { ArrowLeft, SkipForward } from 'lucide-react';

interface PracticeScreenProps {
  scenario: Scenario;
  onBack: () => void;
  onComplete: () => void;
}

interface ChatMessage {
  id: string;
  type: 'prompt' | 'user' | 'context';
  german: string;
  english?: string;
}

export function PracticeScreen({ scenario, onBack, onComplete }: PracticeScreenProps) {
  const [currentPromptIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { addResponse } = useProgress();
  const { t } = useLanguage();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentPrompt = scenario.prompts[currentPromptIndex];

  // Initialize chat with context and first prompt
  useEffect(() => {
    setMessages([
      {
        id: 'context',
        type: 'context',
        german: scenario.context,
        english: undefined,
      },
      {
        id: currentPrompt.id,
        type: 'prompt',
        german: currentPrompt.german,
        english: currentPrompt.english,
      },
    ]);
  }, [scenario, currentPrompt]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: 'user',
      german: message,
    }]);

    setResponse(message);

    // Generate feedback after a short delay
    setTimeout(() => {
      const generatedFeedback = generateFeedback(message, currentPrompt, scenario);
      setFeedback(generatedFeedback);
      setShowFeedback(true);

      // Save to progress
      addResponse({
        scenarioId: scenario.id,
        promptId: currentPrompt.id,
        response: message.trim(),
        score: generatedFeedback.score,
        timestamp: Date.now(),
        attempts: 1,
      });
    }, 300);
  };

  const handleTryAgain = () => {
    setResponse('');
    setFeedback(null);
    setShowFeedback(false);
    // Reset to initial messages
    setMessages([
      {
        id: 'context',
        type: 'context',
        german: scenario.context,
        english: undefined,
      },
      {
        id: currentPrompt.id,
        type: 'prompt',
        german: currentPrompt.german,
        english: currentPrompt.english,
      },
    ]);
  };

  const handleNextScenario = () => {
    onComplete();
  };

  if (showFeedback && feedback) {
    return (
      <div className="min-h-screen bg-background">
        <GermanStripe />
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('practice.backToScenarios')}
          </Button>

          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            {scenario.title}
          </h2>

          <FeedbackDisplay
            feedback={feedback}
            userResponse={response}
            onTryAgain={handleTryAgain}
            onNextScenario={handleNextScenario}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GermanStripe />
      
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
              {t('practice.back')}
            </Button>
            
            <h2 className="text-lg font-serif font-semibold text-foreground">
              {scenario.title}
            </h2>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={onComplete}
            >
              <SkipForward className="h-4 w-4" />
              {t('practice.skip')}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg) => {
            if (msg.type === 'context') {
              return (
                <div 
                  key={msg.id} 
                  className="text-center py-4 animate-fade-in"
                >
                  <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm">
                    📍 {msg.german}
                  </div>
                </div>
              );
            }
            
            return (
              <ChatBubble
                key={msg.id}
                message={msg.german}
                translation={msg.english}
                isUser={msg.type === 'user'}
                showSpeaker={msg.type === 'prompt'}
                className="animate-fade-in"
              />
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-background border-t border-border sticky bottom-0">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
