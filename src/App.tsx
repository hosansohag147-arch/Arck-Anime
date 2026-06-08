import React, { useState } from 'react';
import { Play, Search, Bell, ListVideo, MonitorPlay, ArrowLeft } from 'lucide-react';

const DUB_OPTIONS = ["HINDI DUB", "ENGLISH DUB", "ENGLISH SUB", "JAPANESE SUB"];

const ANIMES = [
  {
    id: "anime-1",
    title: "Demon Slayer: Kimetsu no Yaiba",
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko.",
    poster: "[https://images.unsplash.com/photo-1580477667995-15608321123c?auto=format&fit=crop&q=80&w=800](https://images.unsplash.com/photo-1580477667995-15608321123c?auto=format&fit=crop&q=80&w=800)",
    epBadge: "EP: 26",
    totalEpisodes: 26,
    episodes: Array.from({ length: 26 }, (_, i) => ({ id: i + 1, targetUrl: `[https://toonanime.org/watch/demon-slayer-kimetsu-no-yaiba-episode-${i](https://toonanime.org/watch/demon-slayer-kimetsu-no-yaiba-episode-${i) + 1}` }))
  },
  {
    id: "anime-2",
    title: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman and becomes cursed himself.",
    poster: "[https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd?auto=format&fit=crop&q=80&w=800](https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd?auto=format&fit=crop&q=80&w=800)",
    epBadge: "Season 2",
    totalEpisodes: 24,
    episodes: Array.from({ length: 24 }, (_, i) => ({ id: i + 1, targetUrl: `[https://toonanime.org/watch/jujutsu-kaisen-episode-${i](https://toonanime.org/watch/jujutsu-kaisen-episode-${i) + 1}` }))
  },
  {
    id: "anime-3",
    title: "Solo Leveling",
    description: "In a world where hunters battle deadly monsters, Sung Jinwoo finds himself in a struggle for survival.",
    poster: "[https://images.unsplash.com/photo-1621416894554-18bb2a3fc42b?auto=format&fit=crop&q=80&w=800](https://images.unsplash.com/photo-1621416894554-18bb2a3fc42b?auto=format&fit=crop&q=80&w=800)",
    epBadge: "EP: 12",
    totalEpisodes: 12,
    episodes: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, targetUrl: `[https://toonanime.org/watch/solo-leveling-episode-${i](https://toonanime.org/watch/solo-leveling-episode-${i) + 1}` }))
  },
  {
    id: "anime-4",
    title: "Attack on Titan",
    description: "Young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.",
    poster: "[https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=800](https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=800)",
    epBadge: "Completed",
    totalEpisodes: 87,
    episodes: Array.from({ length: 87 }, (_, i) => ({ id: i + 1, targetUrl: `[https://toonanime.org/watch/attack-on-titan-episode-${i](https://toonanime.org/watch/attack-on-titan-episode-${i) + 1}` }))
  },
  {
    id: "anime-5",
    title: "Chainsaw Man",
    description: "A young man is reborn as a powerful devil-human hybrid.",
    poster: "[https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800](https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800)",
    epBadge: "EP: 12",
    totalEpisodes: 12,
    episodes: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, targetUrl: `[https://toonanime.org/watch/chainsaw-man-episode-${i](https://toonanime.org/watch/chainsaw-man-episode-${i) + 1}` }))
  }
];

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentDub, setCurrentDub] = useState(DUB_OPTIONS[0]);

  const handleAnimeClick = (anime) => {
    setSelectedAnime(anime);
    setCurrentEpisode(1);
    setActivePage('player');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setActivePage('home');
    setSelectedAnime(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToHome}>
          <MonitorPlay className="w-8 h-8 text-red-500" />
          <span className="text-xl font-black tracking-wider uppercase">TOON<span className="text-red-500">ANIME</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search anime..." className="bg-neutral-800 text-sm pl-10 pr-4 py-2 rounded-full border border-white/5 focus:outline-none focus:border-red-500 w-64 transition-all" />
          </div>
          <Bell className="w-6 h-6 text-neutral-400 hover:text-white cursor-pointer" />
        </div>
      </header>

      {activePage === 'home' ? (
        <main className="max-w-7xl mx-auto px-6 py-10">
          {/* Hero Banner */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 group">
            <img src={ANIMES[0].poster} alt={ANIMES[0].title} className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent flex flex-col justify-end p-8 md:p-12">
              <span className="px-3 py-1 bg-red-600 text-xs font-bold rounded-md uppercase w-max mb-4 tracking-widest">Trending #1</span>
              <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">{ANIMES[0].title}</h2>
              <p className="text-neutral-300 max-w-2xl text-sm md:text-base mb-6 line-clamp-2">{ANIMES[0].description}</p>
              <button onClick={() => handleAnimeClick(ANIMES[0])} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-red-500 hover:text-white transition-all w-max shadow-lg">
                <Play className="w-5 h-5 fill-current" /> Play Now
              </button>
            </div>
          </div>

          {/* Anime List Grid */}
          <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><ListVideo className="text-red-500" /> Popular Anime</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {ANIMES.map((anime) => (
              <div key={anime.id} onClick={() => handleAnimeClick(anime)} className="group cursor-pointer bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-300">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                  <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-[10px] font-black rounded border border-white/10 uppercase">{anime.epBadge}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">{anime.title}</h4>
                  <p className="text-neutral-500 text-xs mt-1 line-clamp-1">{anime.description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        selectedAnime && (
          <main className="max-w-7xl mx-auto px-6 py-10">
            <button onClick={handleBackToHome} className="flex items-center gap-2 text-neutral-400 mb-6 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to Home
            </button>

            {/* Video Player */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-6 border border-white/10 relative">
                  <iframe 
                    src={selectedAnime.episodes.find((e) => e.id === currentEpisode)?.targetUrl} 
                    className="w-full h-full"
                    allowFullScreen 
                    title="Anime Player"
                  />
                </div>
                <h1 className="text-2xl md:text-3xl font-black mb-2">{selectedAnime.title} - Episode {currentEpisode}</h1>
                <p className="text-neutral-400 text-sm mb-6">{selectedAnime.description}</p>
                
                {/* Dub/Sub Options */}
                <div className="flex flex-wrap gap-2">
                  {DUB_OPTIONS.map((dub) => (
                    <button key={dub} onClick={() => setCurrentDub(dub)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentDub === dub ? 'bg-red-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'}`}>
                      {dub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episodes List */}
              <div className="bg-neutral-900 rounded-3xl p-6 border border-white/5 h-[600px] flex flex-col">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2"><ListVideo className="text-red-500" /> Episode List</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {selectedAnime.episodes.map((ep) => (
                    <button key={ep.id} onClick={() => setCurrentEpisode(ep.id)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${currentEpisode === ep.id ? 'bg-red-600/20 text-red-500 border border-red-500/30' : 'bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300'}`}>
                      <span>Episode {ep.id}</span>
                      {currentEpisode === ep.id && <Play className="w-4 h-4 fill-current" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )
      )}
    </div>
  );
    }
