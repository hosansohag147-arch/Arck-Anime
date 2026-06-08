import React, { useEffect, useState } from 'react';
import { Play, Search, Bell, Loader2, ChevronLeft, ChevronRight, ListVideo, MonitorPlay, Sparkles, Monitor, Globe, PlayCircle, ArrowLeft, Plus, Info } from 'lucide-react';

const DUB_OPTIONS = ["HINDI DUB", "ENGLISH DUB", "ENGLISH SUB", "JAPANESE SUB"];

const ANIMES = [
  {
    id: "anime-1",
    title: "Demon Slayer: Kimetsu no Yaiba",
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    poster: "https://images.unsplash.com/photo-1580477667995-15608321123c?auto=format&fit=crop&q=80&w=800",
    epBadge: "EP: 26",
    totalEpisodes: 26,
    episodes: Array.from({ length: 26 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/demon-slayer-kimetsu-no-yaiba-episode-${i + 1}` }))
  },
  {
    id: "anime-2",
    title: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
    poster: "https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd?auto=format&fit=crop&q=80&w=800",
    epBadge: "Season 2",
    totalEpisodes: 24,
    episodes: Array.from({ length: 24 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/jujutsu-kaisen-episode-${i + 1}` }))
  },
  {
    id: "anime-3",
    title: "Solo Leveling",
    description: "In a world where hunters with magical powers must battle deadly monsters to protect humanity, Sung Jinwoo, the weakest hunter of all mankind, finds himself in a never-ending struggle for survival.",
    poster: "https://images.unsplash.com/photo-1621416894554-18bb2a3fc42b?auto=format&fit=crop&q=80&w=800",
    epBadge: "EP: 12",
    totalEpisodes: 12,
    episodes: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/solo-leveling-episode-${i + 1}` }))
  },
  {
    id: "anime-4",
    title: "Attack on Titan",
    description: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
    poster: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=800",
    epBadge: "Completed",
    totalEpisodes: 87,
    episodes: Array.from({ length: 87 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/attack-on-titan-episode-${i + 1}` }))
  },
  {
    id: "anime-5",
    title: "Chainsaw Man",
    description: "Following a betrayal, a young man left for the dead is reborn as a powerful devil-human hybrid after merging with his pet devil and is soon enlisted into an organization dedicated to hunting devils.",
    poster: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=800",
    epBadge: "EP: 12",
    totalEpisodes: 12,
    episodes: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, targetUrl: `https://toonanime.org/watch/chainsaw-man-episode-${i + 1}` }))
  }
];

const NETWORKS = [
  { id: "net-1", name: "Crunchyroll", glow: "shadow-[0_0_20px_rgba(249,115,22,0.6)]", border: "border-orange-500", color: "from-orange-900/50 to-orange-600/20" },
  { id: "net-2", name: "Netflix", glow: "shadow-[0_0_20px_rgba(225,29,72,0.6)]", border: "border-rose-500", color: "from-rose-900/50 to-rose-600/20" },
  { id: "net-3", name: "Prime Video", glow: "shadow-[0_0_20px_rgba(56,189,248,0.6)]", border: "border-sky-500", color: "from-sky-900/50 to-sky-600/20" },
  { id: "net-4", name: "Disney+", glow: "shadow-[0_0_20px_rgba(37,99,235,0.6)]", border: "border-blue-500", color: "from-blue-900/50 to-blue-600/20" }
];

const LANGUAGES = [
  { id: "lang-1", name: "HINDI DUB", poster: "https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd?auto=format&fit=crop&w=400&q=80" },
  { id: "lang-2", name: "ENGLISH DUB", poster: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=400&q=80" },
  { id: "lang-3", name: "JAPANESE SUB", poster: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=400&q=80" },
  { id: "lang-4", name: "TAMIL DUB", poster: "https://images.unsplash.com/photo-1580477667995-15608321123c?auto=format&fit=crop&w=400&q=80" }
];

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'player'>('home');
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);

  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentDub, setCurrentDub] = useState(DUB_OPTIONS[0]);

  const handleAnimeClick = (anime: any) => {
    setSelectedAnime(anime);
    setCurrentEpisode(1);
    setCurrentDub(DUB_OPTIONS[0]);
    setActivePage('player');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setActivePage('home');
    setSelectedAnime(null);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setCurrentEpisode((prev: number) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (selectedAnime) {
      setCurrentEpisode((prev: number) => Math.min(selectedAnime.totalEpisodes, prev + 1));
    }
  };

  const renderHome = () => (
    <main className="w-full bg-black pb-24 animate-in fade-in duration-500">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Netflix Style Hero Banner */}
      <div className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-start">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=2560" 
            alt="Hero Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-4 sm:px-10 lg:px-16 max-w-3xl mt-20 md:mt-32">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl mb-4 tracking-tighter uppercase">
            Attack <span className="text-[#E50914]">on</span> Titan
          </h1>
          <p className="text-neutral-300 text-sm md:text-xl font-medium mb-8 leading-snug drop-shadow-lg max-w-2xl line-clamp-3 md:line-clamp-none">
            After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.
          </p>
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => handleAnimeClick(ANIMES[3])} 
              className="flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded md:rounded-md font-bold text-base md:text-xl transition-transform hover:bg-neutral-200 hover:scale-105"
            >
              <Play className="w-5 h-5 md:w-7 md:h-7 fill-current" /> Play Now
            </button>
            <button className="flex items-center justify-center gap-2 bg-neutral-500/50 hover:bg-neutral-500/70 text-white px-6 md:px-8 py-2.5 md:py-3 rounded md:rounded-md font-bold text-base md:text-xl transition-all backdrop-blur-sm">
              <Info className="w-5 h-5 md:w-7 md:h-7" /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Row Sections */}
      <div className="relative z-20 -mt-16 sm:-mt-24 md:-mt-32 space-y-8 sm:space-y-12">
         {/* Row 1: Trending Now */}
         <div className="pl-4 sm:pl-10 lg:pl-16">
            <h2 className="text-lg md:text-2xl font-bold text-neutral-100 mb-3 md:mb-4 tracking-wide">Trending Now</h2>
            <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 md:pb-8 hide-scrollbar pr-10">
               {ANIMES.map((anime) => (
                  <div key={`trend-${anime.id}`} onClick={() => handleAnimeClick(anime)} className="group relative flex-none w-[120px] sm:w-[160px] md:w-[220px] aspect-[2/3] cursor-pointer rounded md:rounded-md overflow-hidden transition-all duration-300 hover:scale-105 md:hover:scale-110 hover:z-50 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:ring-2 hover:ring-[#E50914] origin-left">
                     <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                        <h3 className="text-white font-bold text-xs md:text-base leading-tight mb-1 md:mb-2 line-clamp-2">{anime.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#46d369]">
                           <span>{anime.epBadge}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Row 2: Popular on AnimeWorld */}
         <div className="pl-4 sm:pl-10 lg:pl-16">
            <h2 className="text-lg md:text-2xl font-bold text-neutral-100 mb-3 md:mb-4 tracking-wide">Popular on AnimeWorld</h2>
            <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 md:pb-8 hide-scrollbar pr-10">
               {ANIMES.slice().reverse().map((anime) => (
                  <div key={`pop-${anime.id}`} onClick={() => handleAnimeClick(anime)} className="group relative flex-none w-[120px] sm:w-[160px] md:w-[220px] aspect-[2/3] cursor-pointer rounded md:rounded-md overflow-hidden transition-all duration-300 hover:scale-105 md:hover:scale-110 hover:z-50 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:ring-2 hover:ring-[#E50914] origin-left">
                     <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                        <h3 className="text-white font-bold text-xs md:text-base leading-tight mb-1 md:mb-2 line-clamp-2">{anime.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#46d369]">
                           <span>{anime.epBadge}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Row 3: Action & Adventure */}
         <div className="pl-4 sm:pl-10 lg:pl-16">
            <h2 className="text-lg md:text-2xl font-bold text-neutral-100 mb-3 md:mb-4 tracking-wide">Action & Adventure</h2>
            <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 md:pb-8 hide-scrollbar pr-10">
               {[ANIMES[2], ANIMES[4], ANIMES[1], ANIMES[0], ANIMES[3]].map((anime) => (
                  <div key={`act-${anime.id}`} onClick={() => handleAnimeClick(anime)} className="group relative flex-none w-[120px] sm:w-[160px] md:w-[220px] aspect-[2/3] cursor-pointer rounded md:rounded-md overflow-hidden transition-all duration-300 hover:scale-105 md:hover:scale-110 hover:z-50 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:ring-2 hover:ring-[#E50914] origin-left">
                     <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                        <h3 className="text-white font-bold text-xs md:text-base leading-tight mb-1 md:mb-2 line-clamp-2">{anime.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#46d369]">
                           <span>{anime.epBadge}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </main>
  );

  const renderPlayer = () => {
    if (!selectedAnime) return null;
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 animate-in slide-in-from-right-8 duration-500">
        
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-wide">Back to Home</span>
          </button>
        </div>

        {/* Dynamic Video Player Section */}
        <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_50px_rgba(229,9,20,0.15)] flex items-center justify-center mb-8 relative border border-white/5">
           <div className="absolute inset-0 z-0 opacity-20">
             <img src={selectedAnime.poster} alt="blur bg" className="w-full h-full object-cover blur-2xl block" />
           </div>
           
           <div className="flex flex-col items-center z-10 p-6 text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-[#E50914] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.6)] mb-6 animate-pulse">
                 <Play className="w-10 h-10 text-white fill-white ml-2" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">Player Placeholder</h3>
              <p className="text-neutral-400 font-medium max-w-md">
                 Replace this block with your local iframe or video source for Episode {currentEpisode}. 
              </p>
              <div className="mt-6 border border-[#E50914]/30 bg-[#E50914]/10 rounded-lg px-4 py-2 flex items-center gap-2">
                 <MonitorPlay className="w-5 h-5 text-[#E50914]" />
                 <span className="text-[#E50914] font-bold text-sm tracking-wide">Ready for Integration</span>
              </div>
           </div>
        </div>

        {/* Dubbing Option Bar */}
        <div className="mb-10 p-5 rounded-2xl bg-neutral-900/50 border border-white/5 backdrop-blur-sm">
          <h3 className="text-sm font-black text-neutral-400 mb-4 uppercase tracking-widest flex items-center gap-2">
             Select Audio / Dubbing
          </h3>
          <div className="flex flex-wrap gap-3">
            {DUB_OPTIONS.map(dub => (
              <button 
                key={dub}
                onClick={() => setCurrentDub(dub)}
                className={`py-2 px-5 rounded-lg font-bold text-sm tracking-wide transition-all border ${
                  currentDub === dub 
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.15)]' 
                    : 'bg-neutral-950/80 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white'
                }`}
              >
                {dub}
              </button>
            ))}
          </div>
        </div>

        {/* Info & Quick Controls Row */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start mb-12">
           <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-md">
                {selectedAnime.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                 <span className="px-4 py-1.5 bg-purple-600 text-white text-sm font-black tracking-wider uppercase rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.4)] flex items-center gap-2">
                   <Play className="w-3.5 h-3.5 fill-current" /> EPISODE {currentEpisode}
                 </span>
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-bold uppercase rounded-lg border border-emerald-500/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div> Local Stream: {currentDub}
                 </span>
              </div>
              <p className="text-neutral-400 max-w-3xl text-sm md:text-base leading-relaxed">
                {selectedAnime.description}
              </p>
           </div>

           {/* Quick Navigation Controls */}
           <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto mt-2 h-14">
              <button 
                onClick={handlePrev}
                disabled={currentEpisode === 1}
                className="h-full flex-1 lg:flex-none flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 rounded-2xl font-black tracking-wide transition-all duration-300 shadow-md text-sm md:text-base"
              >
                <ChevronLeft className="w-5 h-5" /> PREV 
              </button>
              <button 
                onClick={handleNext}
                disabled={currentEpisode === selectedAnime.totalEpisodes}
                className="h-full flex-1 lg:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 rounded-2xl font-black tracking-wide shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-300 text-sm md:text-base"
              >
                NEXT <ChevronRight className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* Episode Grid Controller */}
        <div>
           <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
              <ListVideo className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-black text-white tracking-tight">Select Episode</h2>
           </div>
           
           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-4">
              {selectedAnime.episodes.map((ep: any) => (
                <button
                  key={ep.id}
                  onClick={() => setCurrentEpisode(ep.id)}
                  className={`
                    group relative aspect-square rounded-2xl overflow-hidden flex flex-col items-center justify-center font-black transition-all duration-300 border-2 
                    ${currentEpisode === ep.id 
                       ? 'border-purple-500 text-white bg-purple-600/20 shadow-[0_0_20px_rgba(147,51,234,0.3)]' 
                       : 'border-neutral-800 text-neutral-500 bg-neutral-900 hover:border-neutral-600 hover:text-white hover:bg-neutral-800'
                    }
                  `}
                >
                   {currentEpisode === ep.id && (
                     <div className="absolute inset-0 bg-gradient-to-t from-purple-600/40 to-transparent"></div>
                   )}
                   
                   <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5 ${currentEpisode === ep.id ? 'text-purple-300' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`}>
                     EP
                   </span>
                   <span className={`text-xl sm:text-3xl z-10 font-bold ${currentEpisode === ep.id ? 'text-white' : ''}`}>
                     {ep.id}
                   </span>
                   
                   {/* Active Indicator Line */}
                   {currentEpisode === ep.id && (
                     <div className="absolute bottom-0 left-0 w-full h-1.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]"></div>
                   )}
                </button>
              ))}
           </div>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-black text-neutral-50 font-sans selection:bg-[#E50914]/30 w-full overflow-x-hidden">
      
      {/* Global Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${activePage === 'home' ? 'bg-gradient-to-b from-black/90 to-transparent' : 'bg-black border-b border-white/5'}`}>
        <div className="px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8 md:gap-12 pl-0 sm:pl-4">
            <div 
              onClick={handleBackToHome}
              className="flex items-center gap-2 select-none cursor-pointer group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#E50914] rounded flex items-center justify-center transform transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white ml-0.5" />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight text-white hidden sm:block">
                Anime<span className="text-[#E50914]">World</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-neutral-300">
              <button onClick={handleBackToHome} className={`${activePage === 'home' ? 'text-white font-bold' : 'hover:text-white'} transition-colors`}>Home</button>
              <button className="hover:text-white transition-colors">Movies</button>
              <button className="hover:text-white transition-colors">Series</button>
              <button className="hover:text-white transition-colors">My List</button>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 pr-0 sm:pr-4">
            <button className="text-white hover:text-neutral-300 transition-colors"><Search className="w-5 h-5 md:w-6 md:h-6" /></button>
            <button className="text-white hover:text-neutral-300 transition-colors relative hidden sm:block">
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#E50914] rounded-full animate-pulse"></span>
            </button>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded cursor-pointer overflow-hidden ring-1 ring-white/20 hover:ring-white transition-all group">
              <img src="https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg" alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </nav>

      {/* Page Routing/State */}
      <div className={`${activePage === 'player' ? 'pt-24' : ''}`}>
        {activePage === 'home' ? renderHome() : renderPlayer()}
      </div>

    </div>
  );
}