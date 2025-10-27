import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface SoundButton {
  id: number;
  name: string;
  emoji: string;
  plays: number;
  audioUrl: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sounds, setSounds] = useState<SoundButton[]>([
    { id: 1, name: '1 Billion IQ', emoji: '🧠', plays: 42069, audioUrl: 'https://www.myinstants.com/media/sounds/1-000-000-000-iq.mp3' },
    { id: 2, name: 'Bruh', emoji: '😑', plays: 98765, audioUrl: 'https://www.myinstants.com/media/sounds/movie_1.mp3' },
    { id: 3, name: 'Wow', emoji: '😮', plays: 54321, audioUrl: 'https://www.myinstants.com/media/sounds/wow.mp3' },
    { id: 4, name: 'Error', emoji: '❌', plays: 33333, audioUrl: 'https://www.myinstants.com/media/sounds/error.mp3' },
    { id: 5, name: 'Victory', emoji: '🎉', plays: 77777, audioUrl: 'https://www.myinstants.com/media/sounds/victory.mp3' },
    { id: 6, name: 'Applause', emoji: '👏', plays: 66666, audioUrl: 'https://www.myinstants.com/media/sounds/applause.mp3' },
    { id: 7, name: 'Laugh', emoji: '😂', plays: 88888, audioUrl: 'https://www.myinstants.com/media/sounds/laugh.mp3' },
    { id: 8, name: 'Airhorn', emoji: '📯', plays: 12345, audioUrl: 'https://www.myinstants.com/media/sounds/air-horn.mp3' },
  ]);

  const [playingId, setPlayingId] = useState<number | null>(null);

  const playSound = (sound: SoundButton) => {
    const audio = new Audio(sound.audioUrl);
    audio.play().catch(() => {
      console.log('Audio playback failed');
    });
    
    setPlayingId(sound.id);
    setTimeout(() => setPlayingId(null), 300);
    
    setSounds(sounds.map(s => 
      s.id === sound.id ? { ...s, plays: s.plays + 1 } : s
    ));
  };

  const filteredSounds = sounds.filter(sound =>
    sound.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SoundBoard
          </h1>
          <p className="text-muted-foreground text-lg">
            Нажми на кнопку и услышь звук
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto animate-scale-in">
          <div className="relative">
            <Icon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              size={20} 
            />
            <Input
              type="text"
              placeholder="Поиск звуков..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg bg-card border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSounds.map((sound, index) => (
            <Card
              key={sound.id}
              onClick={() => playSound(sound)}
              className={`
                p-6 cursor-pointer transition-all duration-200 
                hover:scale-105 hover:shadow-xl hover:border-primary
                bg-card border-border
                ${playingId === sound.id ? 'scale-95 animate-pulse-glow' : ''}
                animate-scale-in
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="text-5xl">{sound.emoji}</div>
                <h3 className="font-semibold text-foreground text-lg">
                  {sound.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Icon name="Play" size={14} />
                  <span>{sound.plays.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSounds.length === 0 && (
          <div className="text-center py-16">
            <Icon name="SearchX" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <p className="text-xl text-muted-foreground">Звуки не найдены</p>
          </div>
        )}

        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-sm">
            Всего воспроизведений: <span className="text-primary font-bold">
              {sounds.reduce((acc, s) => acc + s.plays, 0).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
