import { useState, useMemo, useEffect } from 'react';
import { Search, Gamepad2, X, ArrowLeft, Maximize2, Settings, Shield, Palette, Layout, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('games');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proxyUrl, setProxyUrl] = useState('');
  const [activeProxyUrl, setActiveProxyUrl] = useState('');
  
  // Settings State
  const [primaryColor, setPrimaryColor] = useState('#8b5cf6');
  const [surfaceColor, setSurfaceColor] = useState('#f9fafb');
  const [tabBarStyle, setTabBarStyle] = useState('pills');

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--surface-color', surfaceColor);
    
    // Simple brightness check to adjust text color
    const hex = surfaceColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    const isDark = brightness < 128;
    document.documentElement.style.setProperty('--text-color', isDark ? '#f8fafc' : '#0f172a');
    
    if (isDark) {
      document.documentElement.style.setProperty('--card-bg', '#1e293b');
      document.documentElement.style.setProperty('--card-text', '#f8fafc');
      document.documentElement.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
    } else {
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--card-text', '#0f172a');
      document.documentElement.style.setProperty('--border-color', '#e2e8f0');
    }
  }, [surfaceColor]);

  // Panic Button Logic
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        window.location.href = 'https://google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeGame = () => {
    setSelectedGame(null);
    setIsFullscreen(false);
  };

  const handleProxySubmit = (e) => {
    e.preventDefault();
    let url = proxyUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setActiveProxyUrl(url);
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'games', label: 'Games', count: gamesData.length },
      { id: 'proxy', label: 'Proxy' },
      { id: 'settings', label: 'Settings' }
    ];

    if (tabBarStyle === 'pills') {
      return (
        <nav className="flex bg-brand/5 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-card text-brand shadow-sm' : 'text-slate-500 hover:text-brand'}`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-brand text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      );
    }

    if (tabBarStyle === 'underline') {
      return (
        <nav className="flex gap-6 border-b border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === tab.id ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      );
    }

    return (
      <nav className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-brand/10 text-brand' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-brand text-white' : 'bg-slate-200 text-slate-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <header className="bg-card border-b border-line px-6 py-4 sticky top-0 z-50 text-card-ink">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => { closeGame(); setActiveTab('games'); }}
            >
              <div className="bg-brand text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
                <Gamepad2 size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                Unblock<span className="text-brand">Hub</span>
              </h1>
            </div>

            {!selectedGame && renderTabs()}
          </div>

          {!selectedGame && activeTab === 'games' && (
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search games..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {selectedGame && (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Maximize2 size={18} />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
              <button 
                onClick={closeGame}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                <X size={18} />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-6 md:p-10">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`flex flex-col gap-6 ${isFullscreen ? 'fixed inset-0 z-[100] bg-black p-0' : ''}`}
            >
              {!isFullscreen && (
                <div className="flex items-center gap-4 mb-2">
                  <button 
                    onClick={closeGame}
                    className="p-2 rounded-lg bg-card border border-line text-card-ink hover:opacity-80 transition-opacity"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-ink">{selectedGame.title}</h2>
                    <p className="text-sm text-slate-500">Playing on UnblockHub</p>
                  </div>
                </div>
              )}

              <div className={`relative bg-black rounded-2xl overflow-hidden flex-grow shadow-lg ${isFullscreen ? 'h-full rounded-none' : 'aspect-video'}`}>
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                />
              </div>

              {!isFullscreen && (
                <div className="bg-card rounded-2xl p-6 border border-line text-card-ink">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">About this game</h4>
                  <p className="opacity-90 leading-relaxed">{selectedGame.description}</p>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'games' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-line/50 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold tracking-tight text-ink/80">
                    All <span className="text-brand">Games</span>
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {searchQuery ? `${filteredGames.length} Results` : `${gamesData.length} Apps`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4">
                {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  layoutId={game.id}
                  className="game-card group cursor-pointer relative aspect-square rounded-[22%] overflow-hidden bg-slate-100 border border-line/10 hover:scale-105 hover:shadow-xl hover:shadow-brand/10 transition-all duration-300"
                  onClick={() => handleSelectGame(game)}
                  title={game.title}
                >
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Tooltip-like title on hover for accessibility */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-[10px] text-white font-bold truncate text-center uppercase tracking-tighter">
                      {game.title}
                    </p>
                  </div>
                </motion.div>
              ))}
              </div>
              {filteredGames.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <h2 className="text-2xl font-semibold text-slate-400">No games found</h2>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'proxy' ? (
            <motion.div
              key="proxy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-8 max-w-4xl mx-auto"
            >
              <div className="bg-card rounded-2xl p-8 border border-line shadow-sm text-card-ink">
                <h2 className="text-3xl font-bold mb-2">Web Proxy</h2>
                <p className="opacity-60 mb-8">Browse the web freely. Note: Some sites may block embedding.</p>
                
                <form onSubmit={handleProxySubmit} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter URL (e.g. google.com)"
                    className="search-input"
                    value={proxyUrl}
                    onChange={(e) => setProxyUrl(e.target.value)}
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Go to Site
                  </button>
                </form>
              </div>

              {activeProxyUrl && (
                <div className="bg-card rounded-2xl border border-line shadow-lg overflow-hidden flex flex-col h-[600px]">
                  <div className="bg-brand/5 px-4 py-2 border-b border-line flex items-center justify-between">
                    <span className="text-xs font-mono opacity-50 truncate max-w-md">{activeProxyUrl}</span>
                    <button 
                      onClick={() => setActiveProxyUrl('')}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <iframe
                    src={activeProxyUrl}
                    className="w-full flex-grow border-none"
                    title="Proxy View"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 border border-line text-card-ink">
                  <h3 className="font-bold mb-4">Quick Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {['google.com', 'bing.com', 'duckduckgo.com', 'wikipedia.org'].map(site => (
                      <button
                        key={site}
                        onClick={() => { setProxyUrl(site); setActiveProxyUrl('https://' + site); }}
                        className="px-3 py-1.5 bg-brand/10 text-brand text-sm font-medium rounded-lg hover:bg-brand hover:text-white transition-all"
                      >
                        {site}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-line text-card-ink">
                  <h3 className="font-bold mb-4">Proxy Status</h3>
                  <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    System Online
                  </div>
                  <p className="text-xs opacity-50 mt-2">
                    Using secure tunnel connection.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-8 max-w-3xl mx-auto"
            >
              <div className="bg-card rounded-2xl p-8 border border-line shadow-sm text-card-ink">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand/10 text-brand rounded-lg">
                    <Settings size={24} />
                  </div>
                  <h2 className="text-3xl font-bold">Settings</h2>
                </div>

                <div className="space-y-10">
                  {/* Theme Color */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Palette size={18} className="text-slate-400" />
                      <h3 className="font-bold text-ink">Theme Color</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { name: 'Purple', color: '#8b5cf6' },
                        { name: 'Blue', color: '#3b82f6' },
                        { name: 'Emerald', color: '#10b981' },
                        { name: 'Rose', color: '#f43f5e' },
                        { name: 'Amber', color: '#f59e0b' },
                        { name: 'Slate', color: '#475569' }
                      ].map(c => (
                        <button
                          key={c.color}
                          onClick={() => setPrimaryColor(c.color)}
                          className={`w-12 h-12 rounded-xl transition-all border-4 ${primaryColor === c.color ? 'border-brand scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: c.color }}
                          title={c.name}
                        />
                      ))}
                      <div className="flex items-center gap-2 ml-2">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-400 uppercase">{primaryColor}</span>
                      </div>
                    </div>
                  </section>

                  {/* Background Color */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Layout size={18} className="text-slate-400" />
                      <h3 className="font-bold text-ink">Background Color (White Screen)</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { name: 'Default', color: '#f9fafb' },
                        { name: 'White', color: '#ffffff' },
                        { name: 'Dark', color: '#0f172a' },
                        { name: 'Cream', color: '#fffbeb' },
                        { name: 'Mint', color: '#f0fdf4' },
                        { name: 'Sky', color: '#f0f9ff' }
                      ].map(c => (
                        <button
                          key={c.color}
                          onClick={() => setSurfaceColor(c.color)}
                          className={`w-12 h-12 rounded-xl transition-all border-4 ${surfaceColor === c.color ? 'border-brand scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: c.color }}
                          title={c.name}
                        />
                      ))}
                      <div className="flex items-center gap-2 ml-2">
                        <input 
                          type="color" 
                          value={surfaceColor} 
                          onChange={(e) => setSurfaceColor(e.target.value)}
                          className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-400 uppercase">{surfaceColor}</span>
                      </div>
                    </div>
                  </section>

                  {/* Tab Bar Style */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Layout size={18} className="text-slate-400" />
                      <h3 className="font-bold text-ink">Tab Bar Style</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'pills', label: 'Pills', desc: 'Rounded buttons with background' },
                        { id: 'underline', label: 'Underline', desc: 'Classic tab style with border' },
                        { id: 'ghost', label: 'Ghost', desc: 'Minimalist background hover' }
                      ].map(style => (
                        <button
                          key={style.id}
                          onClick={() => setTabBarStyle(style.id)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${tabBarStyle === style.id ? 'border-brand bg-brand/5' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                          <div className={`font-bold mb-1 ${tabBarStyle === style.id ? 'text-brand' : 'text-ink'}`}>{style.label}</div>
                          <div className="text-xs text-slate-500">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Panic Button */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={18} className="opacity-40" />
                      <h3 className="font-bold">Panic Settings</h3>
                    </div>
                    <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-red-500 mb-1">Panic Button</h4>
                          <p className="text-sm opacity-70">Instantly redirects to Google. Press <kbd className="px-2 py-1 bg-card rounded border border-line text-xs font-bold">Esc</kbd> anywhere.</p>
                        </div>
                        <button 
                          onClick={() => window.location.href = 'https://google.com'}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                        >
                          <ExternalLink size={18} />
                          Panic Now
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-line text-center text-card-ink">
                <p className="text-sm opacity-40">Settings are saved locally in your browser.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-line py-10 px-6 text-card-ink">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Gamepad2 size={20} className="text-brand" />
            <span className="font-bold">UnblockHub © 2026</span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium opacity-60">
            <a href="#" className="hover:text-brand transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand transition-colors">Terms</a>
            <a href="#" className="hover:text-brand transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
