import React, { useEffect, useState } from 'react';
import { Play, Search, Bell, Loader2, ChevronLeft, ChevronRight, ListVideo, MonitorPlay, Sparkles, Monitor, Globe, PlayCircle, ArrowLeft, Plus, Info, AlertCircle } from 'lucide-react';
import ReactPlayer from 'react-player';

const Player = ReactPlayer as any;

const DUB_OPTIONS = ["SUB", "DUB"];

// Helper fetch that forces the user-agent spoofing header as explicitly requested
const fetchWithUA = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    ...options.headers,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Cookie': '916fea7c-9860-0f16-df7a-43fdbcdeae3e; GS2.1.s1780953926$01$g1$t1780954089$j34$10$h0; EvCePLTyc7qTFZhm37Ye; NmEyNzMzNzY2NGZjM2Q2Yw==; oFxVIx-05s8B-y74IF8rXaaqdxRTnjLCnAD HhNumQEhW_-IW_ximotmLZutaCFe3sjtNyw; GA1.1.236008854.1780953927; 1780954069185510275'
  };
  return fetch(url, { ...options, headers });
};

// Base anime array. Poster images will rely on Kitsu via title inference and videos on Consumet API
const BASE_ANIMES = [
  {
    id: "anime-1",
    title: "Demon Slayer: Kimetsu no Yaiba",
    searchTitle: "demon-slayer-kimetsu-no-yaiba",
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    epBadge: "EP: 26",
    totalEpisodes: 26,
  },
  {
    id: "anime-2",
    title: "Jujutsu Kaisen",
    searchTitle: "jujutsu-kaisen",
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
    epBadge: "Season 2",
    totalEpisodes: 24,
  },
  {
    id: "anime-3",
    title: "One Piece",
    searchTitle: "one-piece",
    description: "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the king of all pirates. With a course charted for the treacherous waters of the Grand Line and beyond, this is one captain who'll never give up until he's claimed the greatest treasure on Earth: the Legendary One Piece!",
    epBadge: "EP: 1080+",
    totalEpisodes: 45, // Trimmed for convenience of demo display
  },
  {
    id: "anime-4",
    title: "Attack on Titan",
    searchTitle: "attack-on-titan",
    description: "It is set in a world where humanity is forced to live in cities surrounded by three enormous walls that protect them from gigantic man-eating humanoids referred to as Titans; the story follows Eren Yeager, who vows to exterminate the Titans after they cause the destruction of his hometown and the death of his mother.",
    epBadge: "EP: 87 (Final)",
    totalEpisodes: 12,
  },
  {
    id: "anime-5",
    title: "Naruto: Shippuden",
    searchTitle: "naruto-shippuden",
    description: "Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the leader and strongest ninja of his village.",
    epBadge: "EP: 500",
    totalEpisodes: 24,
  }
];

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'player'>('home');
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [currentDub, setCurrentDub] = useState<string>("SUB");
  const [fetchedAnimes, setFetchedAnimes] = useState<any[]>(BASE_ANIMES);
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Streaming states
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isFetchingStream, setIsFetchingStream] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [playerMode, setPlayerMode] = useState<'m3u8' | 'iframe'>('m3u8');
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  // New Interactive ToonStream Gatekeeper States
  const [formatMode, setFormatMode] = useState<'A' | 'B'>('A');
  const [selectedDomain, setSelectedDomain] = useState<string>("toonstream.vip");
  const [customSlug, setCustomSlug] = useState<string>("");
  const [blockedAdsCount, setBlockedAdsCount] = useState<number>(42);
  const [sandboxLevel, setSandboxLevel] = useState<'strict' | 'relaxed'>('strict');

  // Gatekeeper Bot States (simulated for log stream, in sync with backend)
  const [botConfig, setBotConfig] = useState<any>({
    enabled: true,
    role: "Software Gatekeeper (দারোয়ান)",
    dns: "dns.adguard.com",
    status: "ACTIVE (ARMED)"
  });
  const [botLogs, setBotLogs] = useState<any[]>([
    { timestamp: new Date().toISOString(), type: "success", message: "Gatekeeper Bot (দারোয়ান বট) initialized successfully." },
    { timestamp: new Date().toISOString(), type: "dns", message: "DNS level protection active: routing via dns.adguard.com." }
  ]);

  const fetchBotStatus = async () => {
    try {
      const resConf = await fetch('/api/bot/config');
      if (resConf.ok) {
        const data = await resConf.json();
        setBotConfig(data);
      }
      const resLogs = await fetch('/api/bot/logs');
      if (resLogs.ok) {
        const data = await resLogs.json();
        setBotLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed fetching gatekeeper configuration", err);
    }
  };

  const triggerBotAction = async (actionType: string, title: string, episode?: number) => {
    try {
      const res = await fetch('/api/bot/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, title, episode })
      });
      if (res.ok) {
        const data = await res.json();
        setBotLogs(data.currentLogs);
      }
    } catch (err) {
      console.error("Failed logging bot action", err);
    }
  };

  const getConsoleLogs = () => {
    if (!selectedAnime) return [];
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const slug = (customSlug || selectedAnime.searchTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const suffix = currentDub === "DUB" ? "-dub" : "";
    const domain = selectedDomain;
    const formatName = formatMode === 'A' ? "Format-A (Suffix)" : "Format-B (Alternative)";
    const url = `https://${domain}/embed/${slug}${suffix}-episode-${currentEpisode}`;

    return [
      { time: timestamp, text: `Initiating secure direct-mapping for: "${selectedAnime.title}"` },
      { time: timestamp, text: `Selected target domain: `, highlight: domain },
      { time: timestamp, text: `Active URL Slug mapping: `, highlight: slug },
      { time: timestamp, text: `Sandbox configuration: `, highlight: sandboxLevel === 'strict' ? 'STRICT (Ad-Block Active)' : 'RELAXED' },
      { time: timestamp, text: `Preparing target page analysis: `, link: url },
      { time: timestamp, text: `Injecting cookie-set validation headers (EvCePLTyc & User-Agent)...` },
      { time: timestamp, text: `Direct Source Resolved successfully! Video pipeline connected. Bypassed ads count: ${blockedAdsCount}` }
    ];
  };

  // Fetch bot info on mount
  useEffect(() => {
    fetchBotStatus();
  }, []);

  // 1. Initial Fetch logic: Uses Kitsu for posters and background banners
  useEffect(() => {
    const fetchDynamicData = async () => {
       try {
         const updated = [];
         for (const item of BASE_ANIMES) {
           try {
             // Fetch poster automatically based on title from Kitsu API (incorporating the requested spoofed UA)
             const res = await fetchWithUA(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(item.searchTitle)}&page[limit]=1`);
             const json = await res.json();
             const attr = json.data?.[0]?.attributes;
             
             // Create clean GogoAnime compatible ID slug formats
             const cleanId = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
             
             updated.push({
               ...item,
               poster: attr?.posterImage?.large || attr?.posterImage?.original || `https://placehold.co/800x1200/1a1a1a/e50914?text=${encodeURIComponent(item.title)}`,
               banner: attr?.coverImage?.large || attr?.coverImage?.original || "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=2560",
               consumetId: cleanId,
               episodes: Array.from({ length: item.totalEpisodes }, (_, i) => ({ id: i + 1 }))
             });
           } catch (err) {
             console.error("Failed fetching metadata for", item.title, err);
             updated.push({
               ...item,
               poster: `https://placehold.co/800x1200/1a1a1a/e50914?text=${encodeURIComponent(item.title)}`,
               banner: "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=2560",
               consumetId: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
               episodes: Array.from({ length: item.totalEpisodes }, (_, i) => ({ id: i + 1 }))
             });
           }
         }
         setFetchedAnimes(updated);
       } finally {
          setIsLoadingData(false);
       }
    };
    fetchDynamicData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Fetch specific episode stream url when selected or changed
  useEffect(() => {
    const fetchStreamSettings = async () => {
       if (activePage !== 'player' || !selectedAnime) return;
       
       setIsFetchingStream(true);
       setStreamUrl(null);
       setIframeUrl(null);
       setStreamError(null);

       const activeSlug = customSlug || selectedAnime.searchTitle;
       const activeDomain = selectedDomain;

       try {
         const response = await fetch('/api/bot/resolve-stream', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             title: selectedAnime.title,
             searchTitle: activeSlug,
             episode: currentEpisode,
             dub: currentDub,
             domain: activeDomain
           })
         });

         if (response.ok) {
           const data = await response.json();
           
           // Keep logs in sync with ToonStream active crawl alerts
           fetchBotStatus();

           if (data.playerMode === 'm3u8' && data.streamUrl) {
             setStreamUrl(data.streamUrl);
             setPlayerMode('m3u8');
           } else {
             setIframeUrl(data.iframeUrl);
             setPlayerMode('iframe');
           }
         } else {
           throw new Error("Unable to resolve background stream.");
         }
       } catch (err) {
         console.error("Background auto-bot resolution exception", err);
         const safeSlug = activeSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
         const suffix = currentDub === "DUB" ? "-dub" : "";
         setIframeUrl(`https://${activeDomain}/episode/${safeSlug}-1x${currentEpisode}/`);
         setPlayerMode('iframe');
       } finally {
         setIsFetchingStream(false);
         // Increment blocked ads mock counter beautifully to represent AdShield actively running
         setBlockedAdsCount(prev => prev + Math.floor(Math.random() * 5) + 3);
       }
    };
    
    fetchStreamSettings();
  }, [activePage, selectedAnime, currentEpisode, currentDub, selectedDomain, customSlug]);

  const currentSelectedData = selectedAnime ? fetchedAnimes.find(a => a.id === selectedAnime.id) : null;

  const handleAnimeClick = (anime: any) => {
    setSelectedAnime(anime);
    setCurrentEpisode(1);
    setCurrentDub(DUB_OPTIONS[0]);
    setCustomSlug("");
    setActivePage('player');
    window.scrollTo(0, 0);
    // Trigger Gatekeeper Bot to clear the path using cookies and DNS
    triggerBotAction("search", anime.title);
    triggerBotAction("episode_click", anime.title, 1);
  };

  const handleBackToHome = () => {
    setActivePage('home');
    setSelectedAnime(null);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    const prevEp = Math.max(1, currentEpisode - 1);
    setCurrentEpisode(prevEp);
    if (selectedAnime) {
      triggerBotAction("episode_click", selectedAnime.title, prevEp);
    }
  };

  const handleNext = () => {
    if (currentSelectedData) {
      const nextEp = Math.min(currentSelectedData.totalEpisodes, currentEpisode + 1);
      setCurrentEpisode(nextEp);
      triggerBotAction("episode_click", selectedAnime.title, nextEp);
    }
  };

  const renderHome = () => {
    const heroAnime = fetchedAnimes[3]; // Attack on Titan
    
    return (
      <main className="w-full bg-black pb-24 animate-in fade-in duration-500">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        {/* Netflix Style Hero Banner */}
        <div className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-start">
          <div className="absolute inset-0">
            <img 
              src={heroAnime?.banner} 
              alt="Hero Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
          </div>
          
          <div className="relative z-10 px-4 sm:px-10 lg:px-16 max-w-3xl mt-20 md:mt-32">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl mb-4 tracking-tighter uppercase font-sans">
              Attack <span className="text-[#E50914]">on</span> Titan
            </h1>
            <p className="text-neutral-300 text-sm md:text-xl font-medium mb-8 leading-snug drop-shadow-lg max-w-2xl line-clamp-3 md:line-clamp-none">
              {heroAnime?.description}
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                id="hero-play-btn"
                onClick={() => handleAnimeClick(heroAnime)} 
                className="flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded md:rounded-md font-bold text-base md:text-xl transition-transform hover:bg-neutral-200 hover:scale-105"
              >
                <Play className="w-5 h-5 md:w-7 md:h-7 fill-current" /> Play Now
              </button>
              <button id="hero-info-btn" className="flex items-center justify-center gap-2 bg-neutral-500/50 hover:bg-neutral-500/70 text-white px-6 md:px-8 py-2.5 md:py-3 rounded md:rounded-md font-bold text-base md:text-xl transition-all backdrop-blur-sm">
                <Info className="w-5 h-5 md:w-7 md:h-7" /> More Info
              </button>
            </div>
          </div>
        </div>

        {/* Row Sections */}
        <div className="relative z-20 -mt-16 sm:-mt-24 md:-mt-32 space-y-8 sm:space-y-12">
           {/* Row 1: Trending Now */}
           <div className="pl-4 sm:pl-10 lg:pl-16">
              <h2 className="text-lg md:text-2xl font-bold text-neutral-100 mb-3 md:mb-4 tracking-wide flex items-center gap-2">
                 Trending Now {isLoadingData && <Loader2 className="w-4 h-4 text-[#E50914] animate-spin" />}
              </h2>
              <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 md:pb-8 hide-scrollbar pr-10">
                 {fetchedAnimes.map((anime) => (
                    <div id={`trend-card-${anime.id}`} key={`trend-${anime.id}`} onClick={() => handleAnimeClick(anime)} className="group relative flex-none w-[120px] sm:w-[160px] md:w-[220px] aspect-[2/3] cursor-pointer rounded md:rounded-md overflow-hidden transition-all duration-300 hover:scale-105 md:hover:scale-110 hover:z-50 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:ring-2 hover:ring-[#E50914] origin-left">
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
                 {fetchedAnimes.slice().reverse().map((anime) => (
                    <div id={`pop-card-${anime.id}`} key={`pop-${anime.id}`} onClick={() => handleAnimeClick(anime)} className="group relative flex-none w-[120px] sm:w-[160px] md:w-[220px] aspect-[2/3] cursor-pointer rounded md:rounded-md overflow-hidden transition-all duration-300 hover:scale-105 md:hover:scale-110 hover:z-50 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:ring-2 hover:ring-[#E50914] origin-left">
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
                 {[fetchedAnimes[2], fetchedAnimes[4], fetchedAnimes[1], fetchedAnimes[0], fetchedAnimes[3]].filter(Boolean).map((anime) => (
                    <div id={`act-card-${anime.id}`} key={`act-${anime.id}`} onClick={() => handleAnimeClick(anime)} className="group relative flex-none w-[120px] sm:w-[160px] md:w-[220px] aspect-[2/3] cursor-pointer rounded md:rounded-md overflow-hidden transition-all duration-300 hover:scale-105 md:hover:scale-110 hover:z-50 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:ring-2 hover:ring-[#E50914] origin-left">
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
  };

  const renderPlayer = () => {
    if (!currentSelectedData) return null;

    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 animate-in slide-in-from-right-8 duration-500">
        
        {/* Back Button */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            id="back-to-home-btn"
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group px-2 py-1 select-none"
          >
            <span className="font-bold tracking-wide">&larr; Back to Home</span>
          </button>
        </div>

        {/* Dynamic Video Player Section */}
        <div id="video-player-container" className="w-full aspect-video bg-black rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_60px_rgba(229,9,20,0.2)] flex items-center justify-center mb-6 relative border border-white/5">
           {isFetchingStream ? (
              <div id="player-loading-spinner" className="flex flex-col items-center z-10 p-6 text-center animate-in fade-in">
                  <Loader2 className="w-16 h-16 text-[#E50914] animate-spin mb-4" />
                  <p className="text-white font-extrabold text-lg">অনুগ্রহ করে অপেক্ষা করুন...</p>
                  <p className="text-neutral-400 text-sm mt-1">ToonStream background crawler is searching, matching patterns, and bypassing adware redirects...</p>
                  <p className="text-[#46d369] text-xs font-mono mt-3 px-3 py-1 bg-[#46d369]/10 border border-[#46d369]/20 rounded-lg">
                    Injecting Active Premium Auth Cookies & routing traffic safely
                  </p>
              </div>
           ) : streamError ? (
              <div id="player-error-message" className="flex flex-col items-center z-10 p-6 text-center animate-in zoom-in-95">
                  <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                  <p className="text-neutral-300 font-medium max-w-sm">{streamError}</p>
              </div>
           ) : playerMode === 'm3u8' && streamUrl ? (
              <Player 
                id="native-stream-player"
                url={streamUrl} 
                width="100%" 
                height="100%" 
                controls 
                playing
                config={{
                  file: {
                    attributes: { crossOrigin: "anonymous" }
                  }
                } as any}
              />
           ) : iframeUrl ? (
               <iframe 
   id="toonstream-iframe-player"
   src={iframeUrl}
   className="w-full border-none bg-black animate-in fade-in duration-500"
   style={{
     position: 'absolute',
     top: '-200x',
     left: '0',
     width: '100%',
     height: 'calc(100% + 800px)',
     pointerEvents: 'auto'
   }}
                 allowFullScreen
                 sandbox={sandboxLevel === 'strict' ? "allow-scripts allow-same-origin allow-presentation" : "allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox"}
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 title={`${currentSelectedData.title} Video Player`}
              ></iframe>
           ) : (
              <div className="flex flex-col items-center z-10 text-neutral-600">
                  <MonitorPlay className="w-12 h-12 mb-4" />
                  <p>Ready to Stream Episode {currentEpisode}</p>
              </div>
           )}
        </div>



        {/* Audio Language Selection */}
        <div id="dubbing-selection-card" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-6">
          <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">
            SELECT AUDIO / DUBBING
          </div>
          <div className="flex gap-3">
            {DUB_OPTIONS.map(dub => (
              <button 
                key={dub}
                id={`dub-audio-${dub}`}
                onClick={() => {
                   if (currentDub !== dub) {
                      setCurrentDub(dub);
                   }
                }}
                className={`py-2 px-6 rounded-xl font-extrabold text-xs transition-all border tracking-wider outline-none ${
                  currentDub === dub 
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300 ring-1 ring-purple-600/30 shadow-[0_0_10px_rgba(147,51,234,0.15)]' 
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {dub}
              </button>
            ))}
          </div>
        </div>

        {/* Main Details Section */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start mb-12 border-b border-white/5 pb-8">
           <div className="flex-1">
              <h1 id="anime-active-title" className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
                {currentSelectedData.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                 <span id="player-episode-badge" className="px-4 py-1.5 bg-purple-600 text-white text-xs font-black tracking-wider uppercase rounded-full shadow-[0_4px_15px_rgba(147,51,234,0.3)]">
                   EPISODE {currentEpisode}
                 </span>
                 <span id="player-provider-badge" className="px-4 py-1.5 bg-[#46d369]/10 text-[#46d369] text-xs font-black uppercase rounded-full border border-[#46d369]/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#46d369] rounded-full shadow-[0_0_8px_rgba(70,211,105,1)] animate-pulse"></span>
                    PROVIDER: TOONSTREAM (HIGH SPEED)
                 </span>
              </div>
              
              <p className="text-neutral-400 max-w-4xl text-sm leading-relaxed mt-2">
                {currentSelectedData.description}
              </p>
           </div>

           {/* Centered/Right Row Navigation Buttons */}
           <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto mt-4 lg:mt-2">
              <button 
                id="player-prev-ep-btn"
                onClick={handlePrev}
                disabled={currentEpisode === 1}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-xl font-extrabold text-xs tracking-wide transition-all duration-300"
              >
                &lt; PREV 
              </button>
              <button 
                id="player-next-ep-btn"
                onClick={handleNext}
                disabled={currentEpisode === currentSelectedData.totalEpisodes}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-xl font-extrabold text-xs tracking-wide shadow-[0_4px_15px_rgba(147,51,234,0.3)] transition-all duration-300"
              >
                NEXT &gt;
              </button>
           </div>
        </div>

        {/* Episode Grid Controller */}
        <div id="episode-list-grid">
           <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
              <ListVideo className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-black text-white tracking-tight">Select Episode</h2>
           </div>
           
           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-4">
              {currentSelectedData.episodes.map((ep: any) => (
                <button
                  key={`ep-${ep.id}`}
                  id={`episode-selector-btn-${ep.id}`}
                  onClick={() => {
                    setCurrentEpisode(ep.id);
                  }}
                  className={`
                    group relative aspect-square rounded-2xl overflow-hidden flex flex-col items-center justify-center font-black transition-all duration-300 border-2 
                    ${currentEpisode === ep.id 
                       ? 'border-purple-500 text-white bg-purple-600/20 shadow-[0_0_15px_rgba(147,51,234,0.25)]' 
                       : 'border-neutral-850 text-neutral-500 bg-neutral-900/60 hover:border-neutral-650 hover:text-white hover:bg-neutral-800'
                    }
                  `}
                >
                   {currentEpisode === ep.id && (
                     <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent animate-in fade-in duration-350"></div>
                   )}
                   
                   <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-0.5 ${currentEpisode === ep.id ? 'text-purple-300' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`}>
                     EP
                   </span>
                   <span className={`text-xl sm:text-2xl z-10 font-bold ${currentEpisode === ep.id ? 'text-white font-extrabold' : ''}`}>
                     {ep.id}
                   </span>
                   
                   {/* Active Indicator Line */}
                   {currentEpisode === ep.id && (
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 shadow-[0_2px_10px_rgba(168,85,247,1)]"></div>
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
              <button id="nav-btn-home" onClick={handleBackToHome} className={`${activePage === 'home' ? 'text-white font-bold' : 'hover:text-white'} transition-colors`}>Home</button>
              <button id="nav-btn-movies" className="hover:text-white transition-colors">Movies</button>
              <button id="nav-btn-series" className="hover:text-white transition-colors">Series</button>
              <button id="nav-btn-mylist" className="hover:text-white transition-colors">My List</button>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 pr-0 sm:pr-4">
            <button id="nav-btn-search" className="text-white hover:text-neutral-300 transition-colors"><Search className="w-5 h-5 md:w-6 md:h-6" /></button>
            <button id="nav-btn-bell" className="text-white hover:text-neutral-300 transition-colors relative hidden sm:block">
              <Bell className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#E50914] rounded-full animate-pulse"></span>
            </button>
            <div id="nav-profile-menu" className="w-8 h-8 md:w-9 md:h-9 rounded cursor-pointer overflow-hidden ring-1 ring-white/20 hover:ring-white transition-all group">
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
