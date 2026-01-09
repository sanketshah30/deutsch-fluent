import { scenarios } from '@/data/scenarios';
import { useProgress } from '@/hooks/useProgress';
import { ScenarioCard } from '@/components/ScenarioCard';
import { Button } from '@/components/ui/button';
import { GermanStripe } from '@/components/GermanStripe';
import { Scenario } from '@/types/scenario';
import { ArrowLeft, BarChart3 } from 'lucide-react';

interface ScenarioSelectionProps {
  onSelectScenario: (scenario: Scenario) => void;
  onBack: () => void;
  onViewProgress: () => void;
}

export function ScenarioSelection({ 
  onSelectScenario, 
  onBack,
  onViewProgress 
}: ScenarioSelectionProps) {
  const { progress, getScenarioScore } = useProgress();

  return (
    <div className="min-h-screen bg-background">
      <GermanStripe />
      
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={onViewProgress}
          >
            <BarChart3 className="h-4 w-4" />
            Progress
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Choose a Scenario
          </h1>
          <p className="text-muted-foreground">
            Select a workplace situation to practice
          </p>
          
          {progress.completedScenarios.length > 0 && (
            <p className="text-sm text-primary mt-2">
              {progress.completedScenarios.length} of {scenarios.length} completed
            </p>
          )}
        </div>

        {/* Scenario Grid */}
        <div className="grid gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onClick={() => onSelectScenario(scenario)}
              completed={progress.completedScenarios.includes(scenario.id)}
              score={getScenarioScore(scenario.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
