import { FeedbackData, ScenarioPrompt, Scenario } from '@/types/scenario';

export function generateFeedback(
  response: string,
  prompt: ScenarioPrompt,
  scenario: Scenario
): FeedbackData {
  const normalizedResponse = response.toLowerCase().trim();
  const words = normalizedResponse.split(/\s+/);
  
  // Count keyword matches
  const keywordMatches = prompt.keywords.filter(keyword => 
    normalizedResponse.includes(keyword.toLowerCase())
  );
  
  // Calculate base score
  let score = 1;
  
  // Score based on response length
  if (words.length >= 10) {
    score += 1;
  } else if (words.length >= 5) {
    score += 0.5;
  }
  
  // Score based on keyword relevance
  if (keywordMatches.length >= 3) {
    score += 2;
  } else if (keywordMatches.length >= 2) {
    score += 1.5;
  } else if (keywordMatches.length >= 1) {
    score += 1;
  }
  
  // Bonus for proper formality
  const usesSie = normalizedResponse.includes('sie') || normalizedResponse.includes('ihnen') || normalizedResponse.includes('ihr');
  const usesDu = normalizedResponse.includes('du') || normalizedResponse.includes('dir') || normalizedResponse.includes('dein');
  
  if (scenario.formality === 'Sie' && usesSie && !usesDu) {
    score += 0.5;
  } else if (scenario.formality === 'Du' && usesDu) {
    score += 0.5;
  }
  
  // Cap score at 5
  score = Math.min(Math.round(score), 5);
  
  // Generate feedback based on score
  const whatWorkedWell: string[] = [];
  let areasToImprove = '';
  
  if (words.length >= 5) {
    whatWorkedWell.push('Good response length - shows engagement in the conversation');
  }
  
  if (keywordMatches.length >= 1) {
    whatWorkedWell.push(`Used relevant vocabulary: "${keywordMatches.slice(0, 2).join('", "')}"`);
  }
  
  const formalityCorrect = 
    (scenario.formality === 'Sie' && usesSie) || 
    (scenario.formality === 'Du' && usesDu);
  
  if (formalityCorrect) {
    whatWorkedWell.push(`Appropriate formality level (${scenario.formality})`);
  }
  
  // Areas to improve
  if (words.length < 5) {
    areasToImprove = 'Try to give more detailed responses to keep the conversation flowing naturally.';
  } else if (keywordMatches.length < 2) {
    areasToImprove = 'Include more topic-relevant vocabulary to make your response more natural.';
  } else if (!formalityCorrect && scenario.formality === 'Sie') {
    areasToImprove = 'Remember to use formal address (Sie) in professional contexts.';
  } else if (!formalityCorrect && scenario.formality === 'Du') {
    areasToImprove = 'This is an informal context - feel free to use "du" with colleagues.';
  } else {
    areasToImprove = 'Consider adding a follow-up question to show interest in the conversation.';
  }
  
  // Default feedback if none generated
  if (whatWorkedWell.length === 0) {
    whatWorkedWell.push('You attempted to respond in German - great start!');
  }
  
  return {
    score,
    whatWorkedWell,
    areasToImprove,
    suggestedResponse: prompt.suggestedResponse,
  };
}

export function getScoreLabel(score: number): { label: string; color: 'success' | 'warning' | 'destructive' } {
  if (score >= 5) return { label: 'Ausgezeichnet!', color: 'success' };
  if (score >= 4) return { label: 'Sehr gut!', color: 'success' };
  if (score >= 3) return { label: 'Gut!', color: 'warning' };
  if (score >= 2) return { label: 'Okay', color: 'warning' };
  return { label: 'Needs Improvement', color: 'destructive' };
}
