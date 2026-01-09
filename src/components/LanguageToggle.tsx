import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
    >
      <Languages className="h-4 w-4" />
      {language === 'en' ? 'DE' : 'EN'}
    </Button>
  );
}
