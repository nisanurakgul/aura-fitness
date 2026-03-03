import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MapPin, 
  Calendar, 
  Users, 
  ChevronRight, 
  Home, 
  Search, 
  Plus, 
  BarChart2, 
  User,
  Droplets,
  Flame,
  Footprints,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Screen = 'home' | 'explore' | 'stats' | 'profile';

interface WorkoutEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  image: string;
  category: 'Running' | 'Yoga' | 'Trekking' | 'Cycling';
  intensity: 'Low' | 'Medium' | 'High';
  stats?: {
    distance: string;
    calories: number;
    elevation: string;
    pace: string;
  };
}

// --- Mock Data ---
const MOCK_EVENTS: WorkoutEvent[] = [
  {
    id: '1',
    title: 'Belgrad Ormanı Doğa Yürüyüşü',
    location: 'Sarıyer, İstanbul',
    date: '04 Ocak 2026',
    time: '08:00',
    participants: 124,
    image: 'https://picsum.photos/seed/forest/800/600',
    category: 'Trekking',
    intensity: 'Medium',
    stats: { distance: '12.4 km', calories: 850, elevation: '340m', pace: '14:20 min/km' }
  },
  {
    id: '2',
    title: 'Manisa Koşu Arkadaşı',
    location: 'Laleli Parkı, Manisa',
    date: '12 Ocak 2026',
    time: '18:30',
    participants: 42,
    image: 'https://picsum.photos/seed/run/800/600',
    category: 'Running',
    intensity: 'High',
    stats: { distance: '5.0 km', calories: 420, elevation: '12m', pace: '05:45 min/km' }
  },
  {
    id: '3',
    title: 'Sabah Yogası',
    location: 'Maçka Parkı, İstanbul',
    date: '05 Ocak 2026',
    time: '07:00',
    participants: 18,
    image: 'https://picsum.photos/seed/yoga/800/600',
    category: 'Yoga',
    intensity: 'Low',
    stats: { distance: '0 km', calories: 150, elevation: '0m', pace: 'N/A' }
  }
];

const WEEKLY_STATS = [
  { day: 'Pzt', steps: 8400, water: 2.1 },
  { day: 'Sal', steps: 12000, water: 2.8 },
  { day: 'Çar', steps: 9500, water: 2.4 },
  { day: 'Per', steps: 11000, water: 3.0 },
  { day: 'Cum', steps: 14500, water: 3.2 },
  { day: 'Cmt', steps: 7200, water: 1.8 },
  { day: 'Paz', steps: 10200, water: 2.5 },
];

// --- Components ---

const StatCard = ({ icon: Icon, label, value, unit, color }: { icon: any, label: string, value: string, unit: string, color: string }) => (
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-100 flex flex-col gap-2">
    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", color)}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-zinc-900">{value}</span>
        <span className="text-xs text-zinc-500 font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

function EventCard({ event, onClick }: { event: WorkoutEvent, onClick: () => void }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full h-64 rounded-[32px] overflow-hidden mb-4 cursor-pointer group"
    >
      <img 
        src={event.image} 
        alt={event.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute top-4 left-4">
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">{event.category}</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-white text-xl font-bold mb-1">{event.title}</h3>
        <div className="flex items-center gap-3 text-white/70 text-xs">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{event.participants} katılım</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main App ---

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [selectedEvent, setSelectedEvent] = useState<WorkoutEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(2400);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderScreen = () => {
    if (selectedEvent) {
      return (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex flex-col h-full bg-white"
        >
          <div className="relative h-80">
            <img 
              src={selectedEvent.image} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white"
            >
              <ChevronRight className="rotate-180" size={24} />
            </button>
          </div>

          <div className="flex-1 bg-white -mt-10 rounded-t-[40px] p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">{selectedEvent.title}</h2>
                <div className="flex items-center gap-2 text-zinc-500">
                  <MapPin size={16} />
                  <span className="text-sm">{selectedEvent.location}</span>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl font-bold text-sm">
                {selectedEvent.intensity}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-50 p-4 rounded-3xl">
                <p className="text-zinc-400 text-[10px] font-bold uppercase mb-1">Mesafe</p>
                <p className="text-lg font-bold text-zinc-900">{selectedEvent.stats?.distance}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-3xl">
                <p className="text-zinc-400 text-[10px] font-bold uppercase mb-1">Kalori</p>
                <p className="text-lg font-bold text-zinc-900">{selectedEvent.stats?.calories} kcal</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-3xl">
                <p className="text-zinc-400 text-[10px] font-bold uppercase mb-1">Yükseklik</p>
                <p className="text-lg font-bold text-zinc-900">{selectedEvent.stats?.elevation}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-3xl">
                <p className="text-zinc-400 text-[10px] font-bold uppercase mb-1">Tempo</p>
                <p className="text-lg font-bold text-zinc-900">{selectedEvent.stats?.pace}</p>
              </div>
            </div>

            <button className="w-full bg-emerald-500 text-white py-5 rounded-[24px] font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-transform">
              ETKİNLİĞE KATIL
              <ArrowUpRight size={20} />
            </button>
          </div>
        </motion.div>
      );
    }

    switch (activeScreen) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 pb-32"
          >
            <div className="flex justify-between items-center mb-8 pt-6">
              <div>
                <p className="text-zinc-400 text-sm font-medium">Günaydın,</p>
                <h1 className="text-2xl font-bold text-zinc-900">Esra Tiryaki 👋</h1>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 overflow-hidden border-2 border-white shadow-sm">
                <img src="https://i.pravatar.cc/150?u=esra" alt="Avatar" />
              </div>
            </div>

            <div className="bg-zinc-900 rounded-[32px] p-6 mb-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Günlük Hedef</p>
                    <h3 className="text-3xl font-bold">2400 <span className="text-lg font-normal text-zinc-400">/ 3400 ml</span></h3>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Droplets className="text-blue-400" />
                  </div>
                </div>
                
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <p className="text-zinc-400 text-xs">Günlük hedefine ulaşmana 1000 ml kaldı.</p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCard icon={Footprints} label="Adım" value="8,432" unit="adım" color="bg-orange-500" />
              <StatCard icon={Flame} label="Kalori" value="1,240" unit="kcal" color="bg-rose-500" />
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-zinc-900">Önerilen Egzersizler</h2>
              <button className="text-emerald-600 text-sm font-bold">Tümünü Gör</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="min-w-[280px]">
                  <EventCard event={event} onClick={() => setSelectedEvent(event)} />
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'explore':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 pb-32"
          >
            <h1 className="text-3xl font-bold text-zinc-900 mb-6 pt-6">Etkinlikler</h1>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input 
                type="text" 
                placeholder="Egzersiz ara..."
                className="w-full bg-zinc-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
              {['Tümü', 'Koşu', 'Yoga', 'Yürüyüş', 'Bisiklet'].map((cat, i) => (
                <button 
                  key={cat}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                    i === 0 ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-500"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {MOCK_EVENTS.map(event => (
              <div key={event.id}>
                <EventCard event={event} onClick={() => setSelectedEvent(event)} />
              </div>
            ))}
          </motion.div>
        );
      case 'stats':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 pb-32"
          >
            <h1 className="text-3xl font-bold text-zinc-900 mb-6 pt-6">İstatistikler</h1>
            
            <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Haftalık Adım</p>
                  <h3 className="text-2xl font-bold text-zinc-900">72,400</h3>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                  <BarChart2 size={20} />
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_STATS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
                      {WEEKLY_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 4 ? '#10b981' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <p className="text-zinc-900 font-bold">Yeni Rekor!</p>
                    <p className="text-zinc-500 text-xs">En uzun koşu: 15.2 km</p>
                  </div>
                </div>
                <ChevronRight className="text-zinc-300" />
              </div>
            </div>
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 pb-32 text-center"
          >
            <div className="pt-12 mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-[40px] bg-zinc-100 overflow-hidden border-4 border-white shadow-xl mx-auto">
                  <img src="https://i.pravatar.cc/300?u=esra" alt="Profile" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                  <Plus size={20} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mt-6">Esra Tiryaki</h2>
              <p className="text-zinc-500 text-sm">Premium Üye • İstanbul</p>
            </div>

            <div className="flex justify-center gap-8 mb-10">
              <div>
                <p className="text-xl font-bold text-zinc-900">124</p>
                <p className="text-zinc-400 text-xs font-medium">Takipçi</p>
              </div>
              <div className="w-px h-10 bg-zinc-100" />
              <div>
                <p className="text-xl font-bold text-zinc-900">86</p>
                <p className="text-zinc-400 text-xs font-medium">Takip</p>
              </div>
              <div className="w-px h-10 bg-zinc-100" />
              <div>
                <p className="text-xl font-bold text-zinc-900">12</p>
                <p className="text-zinc-400 text-xs font-medium">Rozet</p>
              </div>
            </div>

            <div className="space-y-3">
              {['Hesap Ayarları', 'Bildirimler', 'Gizlilik', 'Yardım & Destek'].map(item => (
                <button key={item} className="w-full bg-zinc-50 p-5 rounded-[24px] flex items-center justify-between group hover:bg-zinc-100 transition-colors">
                  <span className="text-zinc-700 font-bold">{item}</span>
                  <ChevronRight className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-white flex flex-col items-center justify-center p-12">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-emerald-200 mb-8"
        >
          <Activity size={48} className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Aura Fitness</h1>
        <p className="text-zinc-400 text-center text-sm">Vücudunuzu ve zihninizi hazırlıyoruz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex justify-center items-center font-sans">
      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-[430px] h-[932px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] rounded-[60px] relative overflow-hidden flex flex-col border-[8px] border-zinc-900">
        
        {/* Status Bar Mockup */}
        <div className="h-12 w-full flex justify-between items-center px-8 pt-4 z-50">
          <span className="text-sm font-bold text-zinc-900">9:41</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-4 rounded-full border-2 border-zinc-900" />
            <div className="w-4 h-4 rounded-full border-2 border-zinc-900" />
            <div className="w-6 h-3 rounded-sm border-2 border-zinc-900" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {!selectedEvent && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-t border-zinc-100 flex justify-around items-center px-6 pb-6 pt-2 z-50">
            <NavButton active={activeScreen === 'home'} icon={Home} onClick={() => setActiveScreen('home')} />
            <NavButton active={activeScreen === 'explore'} icon={Search} onClick={() => setActiveScreen('explore')} />
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 -mt-10 border-4 border-white active:scale-90 transition-transform">
              <Plus className="text-white" />
            </div>
            <NavButton active={activeScreen === 'stats'} icon={BarChart2} onClick={() => setActiveScreen('stats')} />
            <NavButton active={activeScreen === 'profile'} icon={User} onClick={() => setActiveScreen('profile')} />
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

const NavButton = ({ active, icon: Icon, onClick }: { active: boolean, icon: any, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "p-3 rounded-2xl transition-all duration-300",
      active ? "text-emerald-500 bg-emerald-50" : "text-zinc-400 hover:text-zinc-600"
    )}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
  </button>
);
