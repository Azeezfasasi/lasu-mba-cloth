import React from 'react';

// Inline SVG Icons for common games (to avoid dependency issues)
// Football
const FootballIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0 0 20v-4l-3-3 3-3V2z" /><path d="M12 2v4l3 3-3 3v8" /></svg>
);

// Chess (Rook)
const ChessIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11h-2V7h-4V4H9v3H7v4H5v11h14V11zM14 4h-4" /></svg>
);

// Tennis (Ball and Racket)
const TennisIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 3v9M15 3l-3 3M9 3l3 3" /></svg>
);

// Draughts (Checkers piece) / Ludo (Dice)
const DiceIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><path d="M8 8h.01M16 8h.01M8 16h.01M16 16h.01M12 12h.01" /></svg>
);

// Traditional Game (Ayo Olopon - Seed/Pebble)
const SeedIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.9 12.6C21.4 15.1 19.9 18.2 17 19.4C14.1 20.6 10.9 20.1 8.4 18.6C5.9 17.1 5.4 14 6.6 11.1C7.8 8.2 10.9 6.7 13.4 8.2C15.9 9.7 18.4 10.1 19.9 12.6z" /></svg>
);

const LASUMBAGamesAbout = () => {
  const games = [
    {
      name: 'FOOTBALL',
      description: 'The ultimate sport of passion and teamwork.',
      icon: FootballIcon,
      color: 'bg-green-600',
    },
    {
      name: 'AYO OLOPON',
      description: 'Let’s honour our roots with this traditional game of strategy.',
      icon: SeedIcon,
      color: 'bg-yellow-600',
    },
    {
      name: 'TENNIS',
      description: 'Speed, skill, and precision will take the stage.',
      icon: TennisIcon,
      color: 'bg-indigo-600',
    },
    {
      name: 'CHESS',
      description: 'Where minds clash and kings fall.',
      icon: ChessIcon,
      color: 'bg-gray-700',
    },
    {
      name: 'DRAUGHTS',
      description: 'A classic battle of wits and patience.',
      icon: DiceIcon,
      color: 'bg-red-600',
    },
    {
      name: 'LUDO',
      description: 'Because no event is complete without the thrill of rolling dice and beating friends.',
      icon: DiceIcon,
      color: 'bg-blue-600',
    },
  ];

  return (
    <div className="bg-gray-50 py-16 sm:py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-wider text-[#EB5017] uppercase">
            It's More Than Just a Game
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            About LASUMBA Games 2026
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
            This isn't just a sports event - it’s our event, where friendships are built, rivalries are born, and champions emerge. Let’s make history together!
          </p>
        </div>

        {/* Key Stats & Callout */}
        <div className="bg-blue-700 rounded-xl p-6 sm:p-10 mb-16 shadow-2xl text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="border-b md:border-b-0 md:border-r border-white/30 pb-4 md:pb-0 md:pr-4">
                    <p className="text-4xl font-bold">2026</p>
                    <p className="text-sm uppercase tracking-wider mt-1">The Year of Glory</p>
                </div>
                <div className="border-b md:border-b-0 md:border-r border-white/30 pb-4 md:pb-0 md:px-4">
                    <p className="text-4xl font-bold">~100+</p>
                    <p className="text-sm uppercase tracking-wider mt-1">Expected Participants</p>
                </div>
                <div className="pt-4 md:pt-0 md:pl-4">
                    <p className="text-4xl font-bold">Exclusive</p>
                    <p className="text-sm uppercase tracking-wider mt-1">Open to LASUMBA Students Only</p>
                </div>
            </div>
        </div>


        {/* Games List Grid (The Competitive & Fun Blend) */}
        <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Competitive & Fun-Filled Activities
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {games.map((game, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#EB5017]"
                    >
                        <div className={`p-4 rounded-full text-white mb-4 ${game.color}`}>
                            <game.icon className="w-8 h-8"/>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h4>
                        <p className="text-gray-600 text-sm">{game.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Final Narrative Section */}
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-12 border-l-8 border-gray-900">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                The Spirit of LASUMBA
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
                The games are open exclusively to LASUMBA students, so every cheer, every goal, every victory will be personal! We’re expecting over 1500 passionate participants to compete, connect, and create unforgettable memories. It’s going to be thrilling, intense, and most importantly, full of laughter and pride.
            </p>
            <p className="mt-4 text-gray-800 text-xl font-semibold">
                — Get ready to compete, connect, and create unforgettable memories.
            </p>
        </div>

      </div>
    </div>
  );
};

export default LASUMBAGamesAbout;