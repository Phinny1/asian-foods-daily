import { useState, useMemo, useRef, useEffect } from 'react';

interface Recipe {
  title: string;
  slug: string;
  image?: string;
  category?: string;
}

interface RecipeSliderProps {
  recipes: Recipe[];
  title?: string;
}

export function RecipeSlider({ recipes, title = "Explore More Asian Recipes" }: RecipeSliderProps) {
  const [search, setSearch] = useState('');
  const [modalSearch, setModalSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredRecipes = useMemo(() => {
    if (!search.trim()) return recipes;
    const lower = search.toLowerCase();
    return recipes.filter(r => 
      r.title.toLowerCase().includes(lower) || 
      r.category?.toLowerCase().includes(lower)
    );
  }, [search, recipes]);

  const modalFilteredRecipes = useMemo(() => {
    if (!modalSearch.trim()) return recipes;
    const lower = modalSearch.toLowerCase();
    return recipes.filter(r => 
      r.title.toLowerCase().includes(lower) || 
      r.category?.toLowerCase().includes(lower)
    );
  }, [modalSearch, recipes]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Handle horizontal scroll with mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="mt-16 border-t border-gray-100 pt-16 pb-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 m-0">
            {title}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="search text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scroll('left')}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 focus:outline-none cursor-pointer"
                aria-label="Previous recipes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 focus:outline-none cursor-pointer"
                aria-label="Next recipes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
              
              <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest hover:text-red-700 transition-colors shrink-0 cursor-pointer focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                SHOW ALL
              </button>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x cursor-grab active:cursor-grabbing scroll-smooth"
          onWheel={handleWheel}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredRecipes.map((recipe) => (
            <a 
              key={recipe.slug}
              href={`/recipes/${recipe.slug}/`}
              className="flex-shrink-0 w-[calc(25%-0.75rem)] md:w-[calc(25%-1.125rem)] min-w-[160px] group snap-start"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={recipe.image || 'https://cdn.pagesmith.app/97394d4a/images/Screenshot-2026-02-19-085606-768-768.webp'} 
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                   <span className="text-[10px] font-bold text-gray-700">{Math.floor(Math.random() * 200) + 50}</span>
                </div>
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                {recipe.title}
              </h3>
            </a>
          ))}
          
          {filteredRecipes.length === 0 && (
            <div className="w-full py-20 text-center text-gray-500 font-medium">
              No recipes found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/10 backdrop-blur-md transition-opacity duration-300"
            onClick={() => {
              setIsModalOpen(false);
              setModalSearch('');
            }}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white sticky top-0 z-10">
              <h3 className="text-2xl font-serif font-bold text-gray-900 m-0 shrink-0">All Recipes</h3>
              
              <div className="flex-1 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search all recipes..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalSearch('');
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer focus:outline-none shrink-0"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              {modalFilteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {modalFilteredRecipes.map((recipe) => (
                  <a 
                    key={recipe.slug + '-modal'}
                    href={`/recipes/${recipe.slug}/`}
                    className="group"
                  >
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                      <img 
                        src={recipe.image || 'https://cdn.pagesmith.app/97394d4a/images/Screenshot-2026-02-19-085606-768-768.webp'} 
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="font-serif font-bold text-base text-gray-900 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors m-0">
                      {recipe.title}
                    </h4>
                  </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-gray-900 mb-2">No recipes found</h4>
                  <p className="text-gray-500">We couldn't find any recipes matching "{modalSearch}"</p>
                  <button 
                    onClick={() => setModalSearch('')}
                    className="mt-4 text-red-600 font-bold text-sm uppercase tracking-widest hover:text-red-700 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
