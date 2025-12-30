import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Star, Download, RefreshCw, Smartphone, Heart, MessageCircle, Copy, Check, Sparkles, Zap, Crown, Quote, Edit2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Wish } from '../types';

// Premium Card Themes
const cardThemes = [
  {
    id: 'midnight',
    name: 'Midnight Gold',
    bg: 'bg-gradient-to-b from-slate-900 via-[#1a1a2e] to-slate-900',
    border: 'border-yellow-500/60',
    text: 'text-yellow-100',
    accent: 'text-yellow-400',
    overlay: 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")]'
  },
  {
    id: 'royal',
    name: 'Royal Blue',
    bg: 'bg-gradient-to-b from-blue-950 via-[#0a1a3c] to-blue-950',
    border: 'border-cyan-400/50',
    text: 'text-cyan-50',
    accent: 'text-cyan-400',
    overlay: 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]'
  },
  {
    id: 'ruby',
    name: 'Ruby Sparkle',
    bg: 'bg-gradient-to-b from-[#2b0a1a] via-[#4a0e26] to-[#2b0a1a]',
    border: 'border-pink-400/50',
    text: 'text-pink-50',
    accent: 'text-pink-400',
    overlay: 'bg-[url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")]'
  },
  {
    id: 'emerald',
    name: 'Emerald City',
    bg: 'bg-gradient-to-b from-[#062c22] via-[#0b4635] to-[#062c22]',
    border: 'border-emerald-400/50',
    text: 'text-emerald-50',
    accent: 'text-emerald-400',
    overlay: 'bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'
  }
];

const englishWishes = [
  "As the clock strikes twelve, I wish you a year filled with the courage to chase your wildest dreams. May every sunrise bring you hope and every sunset bring you peace. Let 2026 be the chapter where you find your true self. Happy New Year!",
  "Happy New Year! May this year be a breakthrough for you, bringing success in every endeavor. Cherish the moments with loved ones and create memories that last a lifetime. Here is to a fresh start and a bright future.",
  "Wishing you a year that is as dazzling as the fireworks in the sky. May you find strength in challenges and joy in the little things. Let love guide your path in 2026. Have a wonderful celebration!",
  "Welcome 2026 with an open heart and a fierce spirit. May you overcome obstacles and reach new heights of prosperity. This is your year to shine brighter than ever before. Best wishes to you and your family.",
  "May the New Year bring you warmth, love, and light to guide your path. Trust in the magic of new beginnings and believe in yourself. You have the power to create a beautiful life. Happy New Year!",
  "Here's to a year of possibilities and endless opportunities. May your home be filled with laughter and your heart with contentment. Wishing you health, wealth, and abundance in 2026.",
  "As we step into another year, I pray for your happiness and well-being. May you be surrounded by positive energy and loving people. Let go of the past and embrace the future with a smile."
];

const urduWishes = [
  "Naya Saal Mubarak! Dua hai ke ye saal aapki zindagi mein dher saari khushiyan aur kamyabiyan lekar aaye. Allah aapko aur aapke khandaan ko hamesha apne hifz-o-amaan mein rakhe. Har din aapke liye nayi umeed ki kiran ho.",
  "Naye saal ki aamad par meri taraf se dili mubarakbad qabool kijiye. Allah kare ye saal aapke liye aman, sukoon aur taraqqi ka saal sabit ho. Purani pareshaniyan khatam hon aur naye raaste khulein. Ameen.",
  "Jaisa ke hum naye saal mein qadam rakh rahe hain, meri dua hai ke aapke khwab puray hon. Zindagi ke har mor par aapko sachi khushi aur mohabbat mile. Naya saal, nayi umeedain, aur nayi manzilain aapki muntazir hain.",
  "Saal-e-Nau Mubarak! Allah aapko sehat, izzat aur barkat se nawaze. Ye saal aapke liye pichle tamam saalon se behtar ho aur aapki har jayez khwahish puri ho. Khush rahein aur khushiyan baantein.",
  "Naya saal ek nayi kitab ki tarah hai, jiske safhay abhi khaali hain. Dua hai ke aap is kitab ko khubsurat yaadon aur kamyabiyon se bhar dein. Aapko aur aapke ahl-e-khana ko bohat bohat Mubarak ho."
];

const WishesSection: React.FC = () => {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [generatedWish, setGeneratedWish] = useState<Wish | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(cardThemes[0]);
  const [shake, setShake] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Wall state
  const [wishes, setWishes] = useState<Wish[]>([
    { 
        id: '1', 
        name: 'Ahmed', 
        message: 'Naya Saal Mubarak! Dua hai ke ye saal aapki zindagi mein dher saari khushiyan aur kamyabiyan lekar aaye. Allah aapko aur aapke khandaan ko hamesha apne hifz-o-amaan mein rakhe.', 
        color: cardThemes[0].bg, 
        likes: 12, 
        lang: 'ur' 
    },
    { 
        id: '2', 
        name: 'Sarah', 
        message: 'Happy New Year! May this year be a breakthrough for you, bringing success in every endeavor. Cherish the moments with loved ones and create memories that last a lifetime.', 
        color: cardThemes[2].bg, 
        likes: 8, 
        lang: 'en' 
    },
    { 
        id: '3', 
        name: 'John', 
        message: 'Welcome 2026 with an open heart and a fierce spirit. May you overcome obstacles and reach new heights of prosperity. This is your year to shine brighter than ever before.', 
        color: cardThemes[1].bg, 
        likes: 25, 
        lang: 'en' 
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load name from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('veloris_user_name');
    if (savedName) setName(savedName);
  }, []);

  const generateWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Save to local storage
    localStorage.setItem('veloris_user_name', name);

    const messages = language === 'en' ? englishWishes : urduWishes;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const theme = cardThemes[Math.floor(Math.random() * cardThemes.length)];
    setSelectedTheme(theme);
    setCustomMessage(randomMessage);
    setIsEditing(false);

    const newWish: Wish = {
      id: Date.now().toString(),
      name: name,
      message: randomMessage,
      color: theme.bg,
      likes: 0,
      lang: language
    };

    setGeneratedWish(newWish);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const toggleEdit = () => {
    if (isEditing && generatedWish) {
        // Saving changes
        setGeneratedWish({
            ...generatedWish,
            message: customMessage
        });
    }
    setIsEditing(!isEditing);
  };

  const postToWall = () => {
    if (generatedWish) {
      setWishes([generatedWish, ...wishes]);
      setGeneratedWish(null); 
      // Keep name for convenience
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const downloadCard = async () => {
    if (cardRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `Hello2026-${name || 'Wish'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Could not download image', err);
    }
  };

  const handleLike = (id: string) => {
    setWishes(current => 
        current.map(wish => 
            wish.id === id ? { ...wish, likes: wish.likes + 1 } : wish
        )
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareToWhatsapp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="wishes" className="relative py-24 px-4 min-h-screen overflow-hidden">
      
      {/* High Level Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#050510] to-black z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
          <span className="inline-block py-1 px-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            Spread the Magic
          </span>
          <h2 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-600 drop-shadow-sm">Golden Wish</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Design a premium greeting card instantly. Select your language, enter your name, and let Hello2026 create magic.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Generator Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              {/* Subtle sheen effect on form */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Crown className="text-yellow-400 mr-3" />
                Wish Generator
              </h3>
              
              <form onSubmit={generateWish} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder-gray-600 font-medium"
                    placeholder="Enter your name..."
                    maxLength={25}
                  />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Language</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setLanguage('en')}
                            className={`py-3 rounded-xl text-sm font-bold transition-all border ${language === 'en' ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-black/40 text-gray-400 border-gray-700/50 hover:bg-white/5'}`}
                        >
                            English
                        </button>
                        <button
                            type="button"
                            onClick={() => setLanguage('ur')}
                            className={`py-3 rounded-xl text-sm font-bold transition-all border ${language === 'ur' ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-black/40 text-gray-400 border-gray-700/50 hover:bg-white/5'}`}
                        >
                            Urdu (اردو)
                        </button>
                    </div>
                </div>

                <button
                  type="submit"
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center">
                     <Zap size={20} className="mr-2 fill-black" />
                     {generatedWish ? 'Regenerate Wish' : 'Generate Magic Wish'}
                  </span>
                  <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </form>
            </div>

            {/* Generated Card Preview */}
            <AnimatePresence>
                {generatedWish && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center px-1">
                             <div className="flex items-center space-x-2">
                                <Sparkles size={16} className="text-yellow-400" />
                                <h4 className="text-white font-medium text-sm">Preview Your Masterpiece</h4>
                             </div>
                             <div className="flex items-center gap-3">
                                 <button
                                    onClick={toggleEdit}
                                    className="text-xs font-bold text-blue-400 flex items-center hover:text-blue-300 transition-colors uppercase tracking-wider"
                                 >
                                    <Edit2 size={14} className="mr-1" /> {isEditing ? 'Save' : 'Edit Text'}
                                 </button>
                                 <button 
                                    onClick={triggerShake} 
                                    className="text-xs font-bold text-yellow-400 flex items-center hover:text-yellow-200 transition-colors uppercase tracking-wider"
                                 >
                                    <Smartphone size={14} className="mr-1" /> Shake
                                 </button>
                             </div>
                        </div>

                        {/* HIGH LEVEL CARD DESIGN */}
                        <div className="relative group perspective-1000">
                            <motion.div 
                                ref={cardRef}
                                animate={shake ? { x: [-5, 5, -5, 5, 0], rotate: [-1, 1, -1, 1, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                className={`relative overflow-hidden rounded-xl p-8 aspect-[4/5] flex flex-col items-center justify-center text-center shadow-2xl ${selectedTheme.bg}`}
                            >
                                {/* Animated Texture Overlay */}
                                <motion.div 
                                    animate={{ 
                                        backgroundPosition: ["0% 0%", "50% 50%"],
                                        opacity: [0.2, 0.3, 0.2]
                                    }}
                                    transition={{ 
                                        backgroundPosition: { duration: 15, repeat: Infinity, ease: "linear" },
                                        opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className={`absolute inset-0 mix-blend-overlay ${selectedTheme.overlay}`} 
                                />
                                
                                {/* Golden Sheen Effect */}
                                <motion.div
                                    animate={{
                                        x: ['-100%', '200%']
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatDelay: 4,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                                />
                                
                                {/* Inner Ornamental Border */}
                                <div className={`absolute inset-3 border-2 ${selectedTheme.border} rounded-lg opacity-80 pointer-events-none flex flex-col justify-between p-2`}>
                                     <div className="flex justify-between">
                                        <div className={`w-6 h-6 border-t-4 border-l-4 ${selectedTheme.border}`} />
                                        <div className={`w-6 h-6 border-t-4 border-r-4 ${selectedTheme.border}`} />
                                     </div>
                                     <div className="flex justify-between">
                                        <div className={`w-6 h-6 border-b-4 border-l-4 ${selectedTheme.border}`} />
                                        <div className={`w-6 h-6 border-b-4 border-r-4 ${selectedTheme.border}`} />
                                     </div>
                                </div>

                                {/* Content Layer */}
                                <div className="relative z-10 w-full flex flex-col h-full justify-between py-8">
                                    <div className="space-y-3">
                                        <div className={`mx-auto mb-2 ${selectedTheme.accent} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
                                            <Crown size={36} strokeWidth={1.5} />
                                        </div>
                                        <h3 className={`text-sm font-serif font-bold tracking-[0.3em] uppercase ${selectedTheme.text} opacity-80 border-b border-white/20 pb-2 inline-block px-8`}>
                                            Hello2026 New Year
                                        </h3>
                                    </div>

                                    <div className="my-auto relative px-2">
                                        <Quote size={24} className={`absolute -top-6 left-0 ${selectedTheme.accent} opacity-50`} />
                                        
                                        {isEditing ? (
                                            <textarea
                                                value={customMessage}
                                                onChange={(e) => setCustomMessage(e.target.value)}
                                                className={`w-full bg-black/30 border border-white/20 rounded p-2 text-sm md:text-base font-serif text-white text-center focus:outline-none resize-none leading-relaxed`}
                                                rows={6}
                                            />
                                        ) : (
                                            <p className={`text-sm md:text-lg font-medium leading-relaxed drop-shadow-xl ${selectedTheme.text} ${generatedWish.lang === 'ur' ? 'font-urdu py-2 text-right' : 'font-serif italic'}`}>
                                                "{generatedWish.message}"
                                            </p>
                                        )}
                                        
                                        <Quote size={24} className={`absolute -bottom-6 right-0 ${selectedTheme.accent} opacity-50 rotate-180`} />
                                    </div>

                                    <div className="mt-auto pt-6 w-4/5 mx-auto">
                                        <div className={`h-px w-full bg-gradient-to-r from-transparent via-${selectedTheme.border.replace('border-', '')} to-transparent opacity-50 mb-4`} />
                                        <p className={`text-xs uppercase tracking-widest mb-1 ${selectedTheme.text} opacity-70`}>
                                            Best Wishes From
                                        </p>
                                        <p className={`text-2xl font-bold tracking-wide ${selectedTheme.accent} drop-shadow-md`}>
                                            {generatedWish.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Watermark */}
                                <div className="absolute bottom-3 right-4 flex items-center space-x-1 opacity-50">
                                    <Sparkles size={10} className="text-white" />
                                    <span className="text-[9px] text-white font-mono uppercase tracking-widest">Hello2026</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={downloadCard}
                                className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg"
                            >
                                <Download size={18} className="mr-2" /> 
                                <span className="text-sm">Save Image</span>
                            </button>
                            <button
                                onClick={postToWall}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/25"
                            >
                                <Send size={18} className="mr-2" /> 
                                <span className="text-sm">Post to Wall</span>
                            </button>
                        </div>
                         <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => shareToWhatsapp(`${generatedWish.message} - ${generatedWish.name} (Created via Hello2026)`)}
                                className="bg-[#128C7E] hover:bg-[#25D366] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg"
                            >
                                <MessageCircle size={18} className="mr-2" /> 
                                <span className="text-sm">WhatsApp</span>
                            </button>
                            <button
                                onClick={() => copyToClipboard(generatedWish.message, 'gen')}
                                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors relative shadow-lg"
                            >
                                {copiedId === 'gen' ? <Check size={18} className="mr-2 text-green-400" /> : <Copy size={18} className="mr-2" />}
                                <span className="text-sm">Copy</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Wall Feed */}
          <div className="lg:col-span-7">
             <div className="flex items-center justify-between mb-8 pl-2">
                <div>
                    <h3 className="text-3xl font-serif font-bold text-white">Latest Wishes</h3>
                    <p className="text-gray-400 text-sm mt-1">Community celebrations from around the world</p>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-gray-300">
                    {wishes.length} POSTS
                </div>
             </div>

             <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {wishes.map((wish) => (
                        <motion.div
                            key={wish.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className="bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all group relative overflow-hidden backdrop-blur-md"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black border border-white/10 text-white font-serif font-bold text-xl shadow-inner">
                                        {wish.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-white font-bold text-lg">{wish.name}</h4>
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">Verified Wish</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleLike(wish.id)}
                                    className="flex flex-col items-center group/btn"
                                >
                                    <Heart size={20} className={`transition-all duration-300 ${wish.likes > 0 ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-500 group-hover/btn:text-red-400'}`} />
                                    <span className="text-[10px] text-gray-500 mt-1 font-mono">{wish.likes}</span>
                                </button>
                            </div>
                            
                            <div className="relative z-10 pl-16">
                                <p className={`text-gray-200 text-sm md:text-base leading-relaxed mb-4 ${wish.lang === 'ur' ? 'font-urdu text-right text-lg' : 'font-light'}`}>
                                    "{wish.message}"
                                </p>

                                <div className="flex items-center space-x-4 pt-4 border-t border-white/5">
                                    <button 
                                        onClick={() => copyToClipboard(wish.message, wish.id)}
                                        className="text-xs text-gray-500 hover:text-white flex items-center transition-colors"
                                    >
                                        {copiedId === wish.id ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                                        Copy
                                    </button>
                                    <button 
                                        onClick={() => shareToWhatsapp(`${wish.message} - ${wish.name}`)}
                                        className="text-xs text-gray-500 hover:text-[#25D366] flex items-center transition-colors"
                                    >
                                        <MessageCircle size={12} className="mr-1" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WishesSection;