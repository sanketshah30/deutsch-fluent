import { FeedbackData } from '@/types/scenario';
import { getScoreLabel } from '@/utils/feedback';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Lightbulb, RotateCcw, ArrowRight } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: FeedbackData;
  userResponse: string;
  onTryAgain: () => void;
  onNextScenario: () => void;
}

export function FeedbackDisplay({ 
  feedback, 
  userResponse, 
  onTryAgain, 
  onNextScenario 
}: FeedbackDisplayProps) {
  const { label, color } = getScoreLabel(feedback.score);
  const { t } = useLanguage();
  
  const scoreColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  };

  const scoreWidth = (feedback.score / 5) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Section */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif">{t('feedback.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`score-bar ${scoreColors[color]}`}
                style={{ width: `${scoreWidth}%` }}
              />
            </div>
            <span className="text-2xl font-bold font-serif">{feedback.score}/5</span>
          </div>
          <p className={`text-sm font-semibold text-${color}`}>{label}</p>
        </CardContent>
      </Card>

      {/* Your Response */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif">{t('feedback.yourResponse')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground bg-muted p-3 rounded-lg italic">
            "{userResponse}"
          </p>
        </CardContent>
      </Card>

      {/* Feedback Details */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif">{t('feedback.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* What worked well */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium text-sm">{t('feedback.whatWorked')}</span>
            </div>
            <ul className="space-y-1 pl-6">
              {feedback.whatWorkedWell.map((point, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Area to improve */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium text-sm">{t('feedback.improvement')}</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              {feedback.areasToImprove}
            </p>
          </div>

          {/* Suggested response */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="h-4 w-4" />
              <span className="font-medium text-sm">{t('feedback.suggested')}</span>
            </div>
            <p className="text-sm text-foreground pl-6 bg-primary/5 p-3 rounded-lg border border-primary/20">
              "{feedback.suggestedResponse}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          className="flex-1 gap-2"
          onClick={onTryAgain}
        >
          <RotateCcw className="h-4 w-4" />
          {t('feedback.tryAgain')}
        </Button>
        <Button 
          variant="hero" 
          className="flex-1 gap-2"
          onClick={onNextScenario}
        >
          {t('feedback.nextScenario')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
