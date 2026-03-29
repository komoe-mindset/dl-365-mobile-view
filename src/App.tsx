/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Play, 
  Pause,
  Clock, 
  BookOpen, 
  Hourglass, 
  Flame, 
  Brain, 
  Lock, 
  SkipForward, 
  Calendar, 
  Library, 
  BarChart3,
  Loader2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Meditation {
  no: string;
  dayCount: string;
  date: string;
  fileName: string;
  shareLink: string;
  audioUrl: string;
}

// --- Components ---

const Header = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button className="text-primary hover:bg-surface-container-highest/40 transition-colors p-2 rounded-full">
        <Menu size={24} />
      </button>
      <h1 className="text-2xl serif text-primary tracking-tight">Dhammalann Meditation</h1>
    </div>
    <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
      <img 
        alt="User profile" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5KkMW61Bb8z9fj9a1F1KCk4tqS57cZnAzWCueJWRHaOjS5TxlcJmkfo5JfYaqPMuipP9QjcqsEuqzjD4_3pueitV8yQ7b_Sve5j9Miii7BFElLqGZ7t0p1GYpLYtCzyQCRsuq1LXIjoMIxOhqmgZW-5W-uPOzJZJ0VgcxMSg3YpTJaLXLeVi5clB2iLN4kLPXVDmLnjm01QQq3OG0u1pMfLY6gfFACNYond8iFf8OraFyyE1f-jtgfKRetkUg2WDMpz9Nz9x22yE"
        referrerPolicy="no-referrer"
      />
    </div>
  </header>
);

const FeaturedCard = ({ meditation, onPlay }: { meditation: Meditation | null, onPlay: (m: Meditation) => void }) => {
  if (!meditation) return null;
  
  return (
    <section className="relative group px-6">
      <div className="absolute -inset-1 bg-primary/10 rounded-2xl blur-xl group-hover:bg-primary/20 transition duration-1000"></div>
      <div className="relative bg-surface-container-low rounded-2xl overflow-hidden">
        <div className="aspect-[4/5] relative">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARoisptP49I07eu6spcPlNQ3f8K5c_di6rpJXOLKumq-FMg8oTZ_-83N0vGyB9aTV062NYEwnwNCejRBp3_W1LnceGD0frPTboKl7SbTrHB9PXe1wbuYgsBIyC9BqDEDubMajdgPTa_PRgQxVbrs9kmpPEb2YiQBXbeUBbXr9S0NVQ9sAlC4KTFuMQ5wMd10g9UuyNGjJU2NufhschGShN5In01VIOkZLsTpKJpJcx8CTA31d8rE-_fR8TcaSHgdkVcmJmuocPNGw"
            alt="Ancient forest"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4">
            <div className="space-y-1">
              <span className="serif text-primary text-xl italic">{meditation.dayCount}</span>
              <h3 className="serif text-3xl font-bold leading-tight">{meditation.fileName}</h3>
            </div>
            <div className="flex items-center gap-4 py-2 text-on-surface-variant text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{meditation.date}</span>
              </div>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlay(meditation)}
              className="main-gradient text-on-primary font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 shadow-lg shadow-primary/10 transition-transform"
            >
              <Play size={20} fill="currentColor" />
              <span className="text-sm tracking-wider uppercase">Listen Now</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProgressCard = ({ completedCount, totalCount }: { completedCount: number, totalCount: number }) => (
  <section className="px-6">
    <div className="bg-surface-container-high p-6 rounded-2xl flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <p className="text-[10px] text-on-surface-variant font-medium tracking-widest uppercase">Your Path</p>
          <h4 className="serif text-2xl">Sacred Commitment</h4>
        </div>
        <Hourglass className="text-primary-container" size={32} />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-bold serif text-primary">{completedCount} <span className="text-lg text-on-surface-variant font-normal">/ {totalCount}</span></span>
          <span className="text-xs text-on-surface-variant mb-1">{Math.round((completedCount / totalCount) * 100)}% Completed</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </div>
    </div>
  </section>
);

const StatsGrid = () => (
  <section className="grid grid-cols-2 gap-4 px-6">
    <div className="bg-surface-container p-5 rounded-2xl space-y-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <Flame size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold serif">0</p>
        <p className="text-xs text-on-surface-variant">Day Streak</p>
      </div>
    </div>
    <div className="bg-surface-container p-5 rounded-2xl space-y-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <Brain size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold serif">0</p>
        <p className="text-xs text-on-surface-variant">Minutes Listened</p>
      </div>
    </div>
  </section>
);

const UpcomingMeditations = ({ meditations, onPlay }: { meditations: Meditation[], onPlay: (m: Meditation) => void }) => (
  <section className="space-y-4 px-6">
    <div className="flex justify-between items-center px-1">
      <h4 className="serif text-xl font-medium">Coming Silence</h4>
      <button className="text-primary text-[10px] font-medium uppercase tracking-widest">See Full Path</button>
    </div>
    <div className="space-y-3">
      {meditations.map((lesson, i) => (
        <motion.div 
          key={lesson.no}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPlay(lesson)}
          className={`flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl cursor-pointer hover:bg-surface-container-high transition-colors`}
        >
          <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
            <Play size={20} fill="currentColor" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] text-on-surface-variant">{lesson.dayCount} • {lesson.date}</p>
            <p className="serif font-medium truncate">{lesson.fileName}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const MiniPlayer = ({ currentMeditation, isPlaying, onTogglePlay }: { currentMeditation: Meditation | null, isPlaying: boolean, onTogglePlay: () => void }) => {
  if (!currentMeditation) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 glass-player p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-highest">
        <img 
          alt="Current track art" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzJanAniohO-ocF8MAkiIJsooWSnUXVz8fTEoHCDNxUmc0XYknaXF-ijGowijk47IjkYWm5vIBqr2T15IoHkdNPUjqjEbyASj_OUigZ08TwZfnAfNxBMflvp-gkgak90kUDXsC-dRgKwTIcM-tZZqoyRe8h7357omW6rfZKt1MgTbWq3jLlrk6MZopirMQDGDEOXODBCgX6RtKC98AzVrJrOStrYjz2n3bFB109kTT_Wl5UypBp8xEIV3_mw5Dgf8oSolYiKNu6kI"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-semibold truncate">{currentMeditation.fileName}</p>
        <p className="text-xs text-on-surface-variant truncate">{currentMeditation.dayCount} • {currentMeditation.date}</p>
      </div>
      <div className="flex items-center gap-2 pr-2">
        <a 
          href={currentMeditation.shareLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-on-surface-variant hover:text-primary transition-colors"
          title="Download / Open in Drive"
        >
          <Download size={20} />
        </a>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full main-gradient text-on-primary flex items-center justify-center shadow-lg"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </motion.button>
      </div>
    </div>
  );
};

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-background rounded-t-2xl shadow-[0_-4px_24px_rgba(212,160,23,0.06)]">
    <button className="flex flex-col items-center justify-center bg-primary/20 text-primary rounded-2xl px-5 py-2">
      <Calendar size={20} />
      <span className="serif text-[10px] tracking-wide mt-1">Today</span>
    </button>
    <button className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary transition-all px-5 py-2">
      <Library size={20} />
      <span className="serif text-[10px] tracking-wide mt-1">Library</span>
    </button>
    <button className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary transition-all px-5 py-2">
      <BarChart3 size={20} />
      <span className="serif text-[10px] tracking-wide mt-1">Progress</span>
    </button>
  </nav>
);

// --- Main App ---

export default function App() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMeditation, setCurrentMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const response = await fetch('/api/meditations');
        const data = await response.json();
        setMeditations(data);
        if (data.length > 0) {
          // Default to the first one if none selected
          // setCurrentMeditation(data[0]);
        }
      } catch (error) {
        console.error("Error loading meditations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeditations();
  }, []);

  const [audioError, setAudioError] = useState<string | null>(null);

  const handlePlay = (meditation: Meditation) => {
    if (!meditation.audioUrl) {
      setAudioError("No audio source found for this meditation.");
      return;
    }
    
    setAudioError(null);
    if (currentMeditation?.no === meditation.no) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentMeditation(meditation);
      setIsPlaying(true);
    }
  };

  // Handle playback state changes
  useEffect(() => {
    if (!audioRef.current || !currentMeditation) return;

    const audio = audioRef.current;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Playback error:", err);
            setAudioError("Failed to play audio. The link might be restricted or corrupted.");
            setIsPlaying(false);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [currentMeditation?.no, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAudioError = (e: any) => {
    console.error("Audio tag error event triggered", e);
    const audio = e.target as HTMLAudioElement;
    if (audio.src && currentMeditation) {
      setAudioError("Failed to load audio source. This often happens with restricted Google Drive links.");
      setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-primary animate-spin" size={48} />
        <p className="serif text-primary animate-pulse">Entering the Sanctuary...</p>
      </div>
    );
  }

  const featuredMeditation = meditations.length > 0 ? meditations[0] : null;
  const upcomingMeditations = meditations.slice(1);

  return (
    <div className="min-h-screen bg-background text-on-surface pb-40 selection:bg-primary/30">
      <Header />
      
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
      />

      <AnimatePresence>
        {audioError && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-40 left-6 right-6 z-50 glass-player p-5 rounded-2xl shadow-2xl border border-primary/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
                <Lock size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface mb-1">Playback Issue</h4>
                <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">{audioError}</p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => {
                      setAudioError(null);
                      setIsPlaying(true);
                    }}
                    className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Retry Playback
                  </button>
                  {currentMeditation && (
                    <a 
                      href={currentMeditation.shareLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors"
                    >
                      Open in Drive
                    </a>
                  )}
                  <button 
                    onClick={() => setAudioError(null)}
                    className="px-4 py-2 text-on-surface-variant text-xs font-bold hover:text-on-surface transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-2xl mx-auto space-y-8 pt-4">
        {/* Welcome Section */}
        <section className="px-6 space-y-1">
          <p className="text-primary font-medium tracking-widest text-[10px] uppercase">Your Journey Begins</p>
          <h2 className="serif text-4xl text-on-surface font-bold">Good Morning</h2>
        </section>

        <FeaturedCard meditation={featuredMeditation} onPlay={handlePlay} />
        
        <ProgressCard completedCount={0} totalCount={meditations.length || 365} />
        
        <StatsGrid />
        
        <UpcomingMeditations meditations={upcomingMeditations} onPlay={handlePlay} />
      </main>

      <MiniPlayer 
        currentMeditation={currentMeditation} 
        isPlaying={isPlaying} 
        onTogglePlay={togglePlay} 
      />
      <BottomNav />
    </div>
  );
}
