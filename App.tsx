import React, { useState, useEffect, useCallback } from 'react';
import { FoodDatabase, SelectedMenu, UserProfile, AdvisorResponse, UICopy, FoodItem } from './types';
import { DEFAULT_USER_PROFILE, FALLBACK_DB, FALLBACK_UI } from './constants';
import { generateFoodDatabase, analyzeMenu, generateUICopy } from './services/geminiService';
import SpinWheel from './components/SpinWheel';
import FoodCard from './components/FoodCard';
import AdvisorModal from './components/AdvisorModal';

// Helper to pick a random item
const getRandomItem = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

function App() {
  // State
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [db, setDb] = useState<FoodDatabase>(FALLBACK_DB);
  const [uiCopy, setUiCopy] = useState<UICopy>(FALLBACK_UI);
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({ main_dish: null, snack: null, drink: null });
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingDB, setIsLoadingDB] = useState(false);
  
  const [advisorResult, setAdvisorResult] = useState<AdvisorResponse | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    const initApp = async () => {
      // Fetch UI copy first for better UX
      const copy = await generateUICopy();
      setUiCopy(copy);
    };
    initApp();
  }, []);

  // Spin Logic
  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setAdvisorResult(null); // Reset previous analysis

    // Animation duration matches the wheel CSS transition (3000ms)
    setTimeout(() => {
      const main = getRandomItem(db.categories.main_dish);
      const snack = getRandomItem(db.categories.snack);
      const drink = getRandomItem(db.categories.drink);
      
      setSelectedMenu({
        main_dish: main,
        snack: snack,
        drink: drink
      });
      setIsSpinning(false);
    }, 3000);
  }, [isSpinning, db]);

  // AI Analysis Logic
  const handleAnalyze = async () => {
    if (!selectedMenu.main_dish || !selectedMenu.drink || !selectedMenu.snack) return;
    
    setIsAnalyzing(true);
    const result = await analyzeMenu(profile, selectedMenu, db);
    setAdvisorResult(result);
    setIsAnalyzing(false);
  };

  // Generate New DB Logic
  const handleRegenerateDB = async () => {
    setIsLoadingDB(true);
    const newDb = await generateFoodDatabase();
    setDb(newDb);
    setIsLoadingDB(false);
  };

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const hasSelectedMenu = selectedMenu.main_dish !== null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥑</span>
            <h1 className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              NutriWheel
            </h1>
          </div>
          <button 
            onClick={handleRegenerateDB}
            disabled={isLoadingDB}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors font-medium flex items-center gap-1"
          >
            {isLoadingDB ? (
               <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            )}
            New Menu DB
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        
        {/* Profile Summary (Compact) */}
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-sm">
           <div className="flex justify-between items-center mb-2">
             <h3 className="font-bold text-slate-700">My Profile</h3>
             <span className="text-xs text-slate-400">Edit in settings</span>
           </div>
           <div className="flex gap-4 text-slate-600">
              <div className="flex flex-col">
                 <span className="text-xs text-slate-400">Goal</span>
                 <span className="font-medium capitalize">{profile.goal.replace('_', ' ')}</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-xs text-slate-400">Caffeine Sensitive</span>
                 <span className={`font-medium ${profile.sensitive_to_caffeine ? 'text-red-500' : 'text-green-500'}`}>
                    {profile.sensitive_to_caffeine ? 'Yes' : 'No'}
                 </span>
              </div>
           </div>
        </div>

        {/* Wheel Section */}
        <section className="flex flex-col items-center justify-center mb-8">
          <SpinWheel 
            onSpin={handleSpin} 
            isSpinning={isSpinning} 
            label={uiCopy.buttons.spin_all} 
          />
          <p className="text-slate-400 text-sm mt-2 font-light">
             {isSpinning ? "Selecting your meal..." : "Spin to get a healthy combo!"}
          </p>
        </section>

        {/* Results Section */}
        {hasSelectedMenu && !isSpinning && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Your Menu Set</h2>
                <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">
                   Ready to eat?
                </div>
             </div>

             <div className="grid gap-3">
                {selectedMenu.main_dish && (
                  <FoodCard item={selectedMenu.main_dish} label="Main Course" colorClass="text-orange-500" />
                )}
                <div className="grid grid-cols-2 gap-3">
                  {selectedMenu.snack && (
                    <FoodCard item={selectedMenu.snack} label="Snack" colorClass="text-purple-500" />
                  )}
                  {selectedMenu.drink && (
                    <FoodCard item={selectedMenu.drink} label="Drink" colorClass="text-blue-500" />
                  )}
                </div>
             </div>

             {/* Action Buttons */}
             <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  {uiCopy.buttons.save_meal}
                </button>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                   {isAnalyzing ? (
                     <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                     </>
                   ) : (
                     <>
                       <span>✨</span> AI Analyze
                     </>
                   )}
                </button>
             </div>
          </div>
        )}

        {/* Motivational Message */}
        {!hasSelectedMenu && !isSpinning && (
          <div className="text-center mt-10 p-6 bg-white rounded-2xl border border-dashed border-slate-300">
             <div className="text-4xl mb-2">🥗</div>
             <p className="text-slate-500">Tap the button to discover your next meal!</p>
          </div>
        )}
      </main>

      {/* Advisor Modal */}
      {advisorResult && (
        <AdvisorModal 
          advisorData={advisorResult} 
          onClose={() => setAdvisorResult(null)} 
        />
      )}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default App;