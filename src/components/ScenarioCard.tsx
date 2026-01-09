import { Scenario } from '@/types/scenario';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  onClick: () => void;
  completed?: boolean;
  score?: number | null;
}

export function ScenarioCard({ scenario, onClick, completed, score }: ScenarioCardProps) {
  return (
    <Card 
      className="card-hover cursor-pointer border-border/50 bg-card hover:border-primary/30 group relative overflow-hidden"
      onClick={onClick}
    >
      {completed && (
        <div className="absolute top-3 right-3 text-success">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-3xl transition-transform group-hover:scale-110">
            {scenario.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg text-foreground mb-1">
              {scenario.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {scenario.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="difficulty">
                {scenario.difficulty}
              </Badge>
              <Badge variant="formality">
                {scenario.formality}
              </Badge>
              {score !== null && score !== undefined && (
                <Badge variant="success">
                  Score: {score}/5
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
