import { Button } from '@/components/ui/button';
import { GermanStripe } from '@/components/GermanStripe';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, MessageCircle, Mic, Target } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <GermanStripe />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-lg">🇩🇪</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            {t('landing.title')}
          </h1>
          <p className="text-xl text-primary font-medium mb-6">
            {t('landing.subtitle')}
          </p>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto text-balance">
            {t('landing.description')}
          </p>

          {/* CTA Button */}
          <Button 
            variant="hero" 
            size="xl" 
            className="gap-3 mb-12"
            onClick={onStart}
          >
            {t('landing.cta')}
            <ArrowRight className="h-5 w-5" />
          </Button>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{t('landing.feature1.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('landing.feature1.desc')}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <Mic className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{t('landing.feature2.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('landing.feature2.desc')}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center mb-3">
                <Target className="h-5 w-5 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{t('landing.feature3.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('landing.feature3.desc')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>{t('landing.footer')}</p>
      </footer>
    </div>
  );
}
