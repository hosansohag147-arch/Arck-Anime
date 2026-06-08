import React, { useState } from 'react';
import { Play, Search, Bell, ChevronLeft, ChevronRight, ListVideo, MonitorPlay, ArrowLeft, Info } from 'lucide-react';

const DUB_OPTIONS = ["HINDI DUB", "ENGLISH DUB", "ENGLISH SUB", "JAPANESE SUB"];

const ANIMES = [
  {
    id: "anime-1",
    title: "Demon Slayer: Kimetsu no Yaiba",
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko.",
    poster: "https://images.unsplash.com/photo-1580477667995-15608321123c?auto=format&fit=crop&q=80&w=800",
    epBadge: "EP: 26",
    totalEpisodes: 26,
    episodes: Array.from({ length: 26 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/demon-slayer-kimetsu-no-yaiba-episode-${i + 1}` }))
  },
  {
    id: "anime-2",
    title: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman and becomes cursed himself.",
    poster: "https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd?auto=format&fit=crop&q=80&w=800",
    epBadge: "Season 2",
    totalEpisodes: 24,
    episodes: Array.from({ length: 24 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/jujutsu-kaisen-episode-${i + 1}` }))
  },
  {
    id: "anime-3",
    title: "Solo Leveling",
    description: "In a world where hunters battle deadly monsters, Sung Jinwoo finds himself in a struggle for survival.",
    poster: "https://images.unsplash.com/photo-1621416894554-18bb2a3fc42b?auto=format&fit=crop&q=80&w=800",
    epBadge: "EP: 12",
    totalEpisodes: 12,
    episodes: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/solo-leveling-episode-${i + 1}` }))
  },
  {
    id: "anime-4",
    title: "Attack on Titan",
    description: "Young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.",
    poster: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=800",
    epBadge: "Completed",
    totalEpisodes: 87,
    episodes: Array.from({ length: 87 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/attack-on-titan-episode-${i + 1}` }))
  },
  {
    id: "anime-5",
    title: "Chainsaw Man",
    description: "A young man is reborn as a powerful devil-human hybrid.",
    poster: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800",
    epBadge: "EP: 12",
    totalEpisodes: 12,
    episodes: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/chainsaw-man-episode-${i + 1}` }))
  }
];

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'player'>('home');
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentDub, setCurrentDub] = useState(DUB_OPTIONS[0]);

  const handleAnimeClick = (anime: any) => {
    setSelectedAnime(anime);
    setCurrentEpisode(1);
    setActivePage('player');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setActivePage('home');
    setSelectedAnime(null);
  };

  const renderPlayer = () => {
    if (!selectedAnime) return null;
    const activeEp = selectedAnime.episodes.find((e: any) => e.id === currentEpisode);
    
    return (
      <main className="max-w-7xl mx-auto px-4 py-10 pb-24">
        <button onClick={handleBackToHome} className="flex items-center gap-2 text-neutral-400 mb-6 hover:text-white">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>

        {/* আসল ভিডিও প্লেয়ার আইফ্রেম */}
        <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 border border-white/10">
           <iframe 
              src={activeEp.targetUrl} 
              className="w-full h-full"
              allowFullScreen 
              title="Anime Player"
           />
        </div>

        <h1 className="text-4xl font-black text-white mb-4">{selectedAnime.title} - Episode {currentEpisode}</h1>
        
        {/* এপিসোড গ্রিড */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-3">
          {selectedAnime.episodes.map((ep: any) => (
            <button
              key={ep.id}
              onClick={() => setCurrentEpisode(ep.id)}
              className={`p-3 rounded-lg font-bold text-center border ${currentEpisode === ep.id ? 'bg-purple-600 border-purple-500' : 'bg-neutral-900 border-neutral-700'}`}
            >
              {ep.id}
            </button>
          ))}
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {activePage === 'home' ? (
         <div className="p-10">
           <h1 className="text-5xl font-black mb-10">Anime<span className="text-[#E50914]">World</span></h1>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
             {ANIMES.map(anime => (
               <div key={anime.id} onClick={() => handleAnimeClick(anime)} className="cursor-pointer hover:scale-105 transition-transform">
                 <img src={anime.poster} className="rounded-lg h-64 w-full object-cover" />
                 <h2 className="mt-2 font-bold">{anime.title}</h2>
               </div>
             ))}
           </div>
         </div>
      ) : renderPlayer()}
    </div>
  );
}