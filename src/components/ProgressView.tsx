import { useProgress } from '@/hooks/useProgress';
import { scenarios } from '@/data/scenarios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, RotateCcw, Target } from 'lucide-react';
import { getScoreLabel } from '@/utils/feedback';

interface ProgressViewProps {
  onBack: () => void;
}

export function ProgressView({ onBack }: ProgressViewProps) {
  const { progress, getScenarioScore, getScenarioAttempts, resetProgress } = useProgress();

  const completedCount = progress.completedScenarios.length;
  const totalScenarios = scenarios.length;
  const averageScore = progress.responses.length > 0
    ? (progress.totalScore / progress.responses.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scenarios
        </Button>

        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
          Your Progress
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <p className="text-3xl font-bold font-serif text-foreground">
                {completedCount}/{totalScenarios}
              </p>
              <p className="text-sm text-muted-foreground">Scenarios Completed</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold font-serif text-foreground">
                {averageScore}
              </p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Scenario List */}
        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="font-serif">Scenario Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scenarios.map((scenario) => {
              const score = getScenarioScore(scenario.id);
              const attempts = getScenarioAttempts(scenario.id);
              const isCompleted = progress.completedScenarios.includes(scenario.id);
              const scoreInfo = score !== null ? getScoreLabel(score) : null;

              return (
                <div 
                  key={scenario.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{scenario.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{scenario.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {attempts > 0 ? `${attempts} attempt${attempts > 1 ? 's' : ''}` : 'Not attempted'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isCompleted && score !== null ? (
                      <Badge variant={scoreInfo?.color === 'success' ? 'success' : scoreInfo?.color === 'warning' ? 'warning' : 'destructive'}>
                        {score}/5
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not completed</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Reset Progress */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            className="gap-2 text-muted-foreground hover:text-destructive"
            onClick={() => {
              if (confirm('Are you sure you want to reset all progress?')) {
                resetProgress();
              }
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </Button>
        </div>
      </div>
    </div>
  );
}
