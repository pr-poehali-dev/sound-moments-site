import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface SoundButton {
  id: number;
  name: string;
  emoji: string;
  plays: number;
  audio_url: string;
}

const API_URL = 'https://functions.poehali.dev/c25272e6-43c9-4c6e-836e-b533dbeeae57';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sounds, setSounds] = useState<SoundButton[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newSound, setNewSound] = useState({
    name: '',
    emoji: '🔊',
    audio_url: ''
  });

  useEffect(() => {
    fetchSounds();
  }, []);

  const fetchSounds = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSounds(data);
    } catch (error) {
      console.error('Failed to fetch sounds:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить звуки',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const playSound = async (sound: SoundButton) => {
    const audio = new Audio(sound.audio_url);
    audio.play().catch(() => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось воспроизвести звук',
        variant: 'destructive'
      });
    });
    
    setPlayingId(sound.id);
    setTimeout(() => setPlayingId(null), 300);
    
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sound.id })
      });
      
      setSounds(sounds.map(s => 
        s.id === sound.id ? { ...s, plays: s.plays + 1 } : s
      ));
    } catch (error) {
      console.error('Failed to update play count:', error);
    }
  };

  const addSound = async () => {
    if (!newSound.name || !newSound.audio_url) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и ссылку на аудио',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSound)
      });

      if (response.ok) {
        const addedSound = await response.json();
        setSounds([...sounds, addedSound]);
        setNewSound({ name: '', emoji: '🔊', audio_url: '' });
        setIsDialogOpen(false);
        toast({
          title: 'Успешно',
          description: 'Звук добавлен!'
        });
      }
    } catch (error) {
      console.error('Failed to add sound:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить звук',
        variant: 'destructive'
      });
    }
  };

  const filteredSounds = sounds.filter(sound =>
    sound.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔊</div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

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

        <div className="mb-8 max-w-md mx-auto flex gap-2 animate-scale-in">
          <div className="relative flex-1">
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6" size="lg">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Добавить новый звук</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    value={newSound.name}
                    onChange={(e) => setNewSound({ ...newSound, name: e.target.value })}
                    placeholder="Например: Wow"
                    className="mt-1 bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="emoji">Эмодзи</Label>
                  <Input
                    id="emoji"
                    value={newSound.emoji}
                    onChange={(e) => setNewSound({ ...newSound, emoji: e.target.value })}
                    placeholder="🔊"
                    className="mt-1 bg-background"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="audio_url">Ссылка на аудио</Label>
                  <Input
                    id="audio_url"
                    value={newSound.audio_url}
                    onChange={(e) => setNewSound({ ...newSound, audio_url: e.target.value })}
                    placeholder="https://example.com/sound.mp3"
                    className="mt-1 bg-background"
                  />
                </div>
                <Button onClick={addSound} className="w-full">
                  Добавить звук
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
