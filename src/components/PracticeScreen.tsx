import { useState } from 'react';
import { Scenario, FeedbackData } from '@/types/scenario';
import { useProgress } from '@/hooks/useProgress';
import { generateFeedback } from '@/utils/feedback';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { FeedbackDisplay } from '@/components/FeedbackDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GermanStripe } from '@/components/GermanStripe';
import { ArrowLeft, Send, SkipForward, Volume2 } from 'lucide-react';

interface PracticeScreenProps {
  scenario: Scenario;
  onBack: () => void;
  onComplete: () => void;
}

export function PracticeScreen({ scenario, onBack, onComplete }: PracticeScreenProps) {
  const [currentPromptIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { addResponse } = useProgress();

  const currentPrompt = scenario.prompts[currentPromptIndex];

  const handleSubmit = () => {
    if (!response.trim()) return;

    const generatedFeedback = generateFeedback(response, currentPrompt, scenario);
    setFeedback(generatedFeedback);
    setShowFeedback(true);

    // Save to progress
    addResponse({
      scenarioId: scenario.id,
      promptId: currentPrompt.id,
      response: response.trim(),
      score: generatedFeedback.score,
      timestamp: Date.now(),
      attempts: 1,
    });
  };

  const handleTryAgain = () => {
    setResponse('');
    setFeedback(null);
    setShowFeedback(false);
  };

  const handleNextScenario = () => {
    onComplete();
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentPrompt.german);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
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
            Back to Scenarios
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
    <div className="min-h-screen bg-background">
      <GermanStripe />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button 
            variant="ghost" 
            className="gap-2 text-muted-foreground"
            onClick={onComplete}
          >
            <SkipForward className="h-4 w-4" />
            Skip
          </Button>
        </div>

        {/* Scenario Title */}
        <h2 className="text-2xl font-serif font-bold text-foreground mb-6 animate-fade-in">
          {scenario.title}
        </h2>

        {/* Context Banner */}
        <Card className="mb-6 border-primary/20 bg-primary/5 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Situation:</p>
            <p className="text-foreground">{scenario.context}</p>
          </CardContent>
        </Card>

        {/* Prompt */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border/50 shadow-sm">
            <div className="flex-1">
              <p className="text-lg font-medium text-foreground mb-2">
                "{currentPrompt.german}"
              </p>
              <p className="text-sm text-muted-foreground italic">
                {currentPrompt.english}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSpeak}
              className="shrink-0"
              title="Listen to pronunciation"
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Response Input */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              Your Response
            </h3>
            <VoiceRecorder 
              transcript={response}
              onTranscriptChange={setResponse}
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="hero"
            size="lg"
            className="w-full gap-2"
            onClick={handleSubmit}
            disabled={!response.trim()}
          >
            <Send className="h-4 w-4" />
            Submit Response
          </Button>
        </div>
      </div>
    </div>
  );
}
