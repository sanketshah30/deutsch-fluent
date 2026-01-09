import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Landing Page
    'landing.title': 'Deutsch Üben',
    'landing.subtitle': 'Workplace Conversation Practice',
    'landing.description': 'Perfect for professionals who can read German but need confidence speaking in workplace situations. Practice real scenarios, get instant feedback.',
    'landing.cta': 'Start Practice',
    'landing.feature1.title': 'Real Scenarios',
    'landing.feature1.desc': "Practice conversations you'll actually have at work",
    'landing.feature2.title': 'Voice Practice',
    'landing.feature2.desc': 'Speak your responses for authentic practice',
    'landing.feature3.title': 'Instant Feedback',
    'landing.feature3.desc': 'Get scores and suggestions to improve',
    'landing.footer': 'Built for workplace communication confidence',
    
    // Scenario Selection
    'scenarios.title': 'Choose a Scenario',
    'scenarios.subtitle': 'Select a workplace situation to practice',
    'scenarios.completed': 'completed',
    'scenarios.of': 'of',
    'scenarios.back': 'Back',
    'scenarios.progress': 'Progress',
    
    // Practice Screen
    'practice.back': 'Back',
    'practice.backToScenarios': 'Back to Scenarios',
    'practice.skip': 'Skip',
    'practice.situation': 'Situation:',
    'practice.yourResponse': 'Your Response',
    'practice.submit': 'Submit Response',
    
    // Feedback
    'feedback.title': 'Your Feedback',
    'feedback.yourResponse': 'Your Response',
    'feedback.whatWorked': 'What worked well',
    'feedback.improvement': 'Area to improve',
    'feedback.suggested': 'Suggested response',
    'feedback.tryAgain': 'Try Again',
    'feedback.nextScenario': 'Next Scenario',
    
    // Progress
    'progress.title': 'Your Progress',
    'progress.completed': 'Scenarios Completed',
    'progress.average': 'Average Score',
    'progress.attempts': 'Total Attempts',
    'progress.history': 'Practice History',
    'progress.noHistory': 'No practice history yet. Start practicing to see your progress!',
    'progress.back': 'Back',
    
    // Voice Recorder
    'voice.record': 'Click to record',
    'voice.recording': 'Recording...',
    'voice.stop': 'Click to stop',
    'voice.notSupported': 'Voice recording is not supported in your browser. Please type your response instead.',
    'voice.placeholder': 'Type your response in German...',
    
    // Badges
    'badge.beginner': 'Beginner',
    'badge.intermediate': 'Intermediate',
    
    // Score labels
    'score.excellent': 'Excellent',
    'score.good': 'Good',
    'score.needsImprovement': 'Needs Improvement',
  },
  de: {
    // Landing Page
    'landing.title': 'Deutsch Üben',
    'landing.subtitle': 'Gesprächspraxis am Arbeitsplatz',
    'landing.description': 'Perfekt für Berufstätige, die Deutsch lesen können, aber mehr Selbstvertrauen beim Sprechen brauchen. Üben Sie echte Szenarien, erhalten Sie sofortiges Feedback.',
    'landing.cta': 'Übung starten',
    'landing.feature1.title': 'Echte Szenarien',
    'landing.feature1.desc': 'Üben Sie Gespräche, die Sie bei der Arbeit führen werden',
    'landing.feature2.title': 'Sprachübung',
    'landing.feature2.desc': 'Sprechen Sie Ihre Antworten für authentische Praxis',
    'landing.feature3.title': 'Sofortiges Feedback',
    'landing.feature3.desc': 'Erhalten Sie Punkte und Verbesserungsvorschläge',
    'landing.footer': 'Für mehr Selbstvertrauen in der Kommunikation am Arbeitsplatz',
    
    // Scenario Selection
    'scenarios.title': 'Wählen Sie ein Szenario',
    'scenarios.subtitle': 'Wählen Sie eine Arbeitssituation zum Üben',
    'scenarios.completed': 'abgeschlossen',
    'scenarios.of': 'von',
    'scenarios.back': 'Zurück',
    'scenarios.progress': 'Fortschritt',
    
    // Practice Screen
    'practice.back': 'Zurück',
    'practice.backToScenarios': 'Zurück zu Szenarien',
    'practice.skip': 'Überspringen',
    'practice.situation': 'Situation:',
    'practice.yourResponse': 'Ihre Antwort',
    'practice.submit': 'Antwort senden',
    
    // Feedback
    'feedback.title': 'Ihr Feedback',
    'feedback.yourResponse': 'Ihre Antwort',
    'feedback.whatWorked': 'Was gut funktioniert hat',
    'feedback.improvement': 'Verbesserungsbereich',
    'feedback.suggested': 'Vorgeschlagene Antwort',
    'feedback.tryAgain': 'Nochmal versuchen',
    'feedback.nextScenario': 'Nächstes Szenario',
    
    // Progress
    'progress.title': 'Ihr Fortschritt',
    'progress.completed': 'Abgeschlossene Szenarien',
    'progress.average': 'Durchschnittliche Punktzahl',
    'progress.attempts': 'Gesamtversuche',
    'progress.history': 'Übungshistorie',
    'progress.noHistory': 'Noch keine Übungshistorie. Beginnen Sie zu üben, um Ihren Fortschritt zu sehen!',
    'progress.back': 'Zurück',
    
    // Voice Recorder
    'voice.record': 'Klicken zum Aufnehmen',
    'voice.recording': 'Aufnahme läuft...',
    'voice.stop': 'Klicken zum Stoppen',
    'voice.notSupported': 'Sprachaufnahme wird in Ihrem Browser nicht unterstützt. Bitte tippen Sie Ihre Antwort ein.',
    'voice.placeholder': 'Tippen Sie Ihre Antwort auf Deutsch...',
    
    // Badges
    'badge.beginner': 'Anfänger',
    'badge.intermediate': 'Fortgeschritten',
    
    // Score labels
    'score.excellent': 'Ausgezeichnet',
    'score.good': 'Gut',
    'score.needsImprovement': 'Verbesserungsbedürftig',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'de' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
