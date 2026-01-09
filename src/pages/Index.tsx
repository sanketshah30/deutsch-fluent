import { useState } from 'react';
import { Scenario } from '@/types/scenario';
import { LandingPage } from '@/components/LandingPage';
import { ScenarioSelection } from '@/components/ScenarioSelection';
import { PracticeScreen } from '@/components/PracticeScreen';
import { ProgressView } from '@/components/ProgressView';

type AppView = 'landing' | 'scenarios' | 'practice' | 'progress';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const handleStartPractice = () => {
    setCurrentView('scenarios');
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentView('practice');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedScenario(null);
  };

  const handleBackToScenarios = () => {
    setCurrentView('scenarios');
    setSelectedScenario(null);
  };

  const handleViewProgress = () => {
    setCurrentView('progress');
  };

  const handlePracticeComplete = () => {
    setCurrentView('scenarios');
    setSelectedScenario(null);
  };

  switch (currentView) {
    case 'landing':
      return <LandingPage onStart={handleStartPractice} />;
    
    case 'scenarios':
      return (
        <ScenarioSelection 
          onSelectScenario={handleSelectScenario}
          onBack={handleBackToLanding}
          onViewProgress={handleViewProgress}
        />
      );
    
    case 'practice':
      if (!selectedScenario) {
        setCurrentView('scenarios');
        return null;
      }
      return (
        <PracticeScreen 
          scenario={selectedScenario}
          onBack={handleBackToScenarios}
          onComplete={handlePracticeComplete}
        />
      );
    
    case 'progress':
      return <ProgressView onBack={handleBackToScenarios} />;
    
    default:
      return <LandingPage onStart={handleStartPractice} />;
  }
};

export default Index;
