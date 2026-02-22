import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Post {
  slug: string;
  collection?: string;
  data: {
    title: string;
    description: string;
    image?: string;
    category?: string;
  };
}

export default function SearchOverlay({ posts }: { posts: Post[] }) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.getElementById('search-input-field')?.focus();
      }, 100);
    };

    window.addEventListener('open-search', handleOpenSearch);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-search', handleOpenSearch);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeSearch = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    setInputValue('');
  };

  const filteredPosts = useMemo(() => {
    if (!inputValue.trim()) return [];
    const lower = inputValue.toLowerCase();
    return posts.filter(post => 
      post.data.title.toLowerCase().includes(lower) || 
      post.data.description.toLowerCase().includes(lower) ||
      post.data.category?.toLowerCase().includes(lower)
    ).slice(0, 6);
  }, [inputValue, posts]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white/98 backdrop-blur-2xl animate-fade-in flex flex-col">
      {/* Top Bar with Close Button */}
      <div className="container mx-auto px-4 py-6 flex justify-end">
        <button 
          onClick={closeSearch}
          className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all group"
          aria-label="Close search"
        >
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div className="container mx-auto px-4 flex-1 flex flex-col max-w-4xl pb-12">
        
        {/* Search Input Section */}
        <div className="w-full mb-12 mt-4">
          <label htmlFor="search-input-field" className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Search</label>
          <div className="relative group">
            <input 
              id="search-input-field"
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What are you craving?" 
              className="w-full bg-transparent border-b-4 border-zinc-100 py-6 pr-16 text-4xl md:text-6xl font-black text-zinc-900 placeholder-zinc-300 focus:border-red-600 transition-colors outline-none"
              autoFocus
              autoComplete="off"
            />
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-red-600 transition-colors p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!inputValue && (
            <div className="animate-fade-in">
              <p className="text-zinc-400 font-bold uppercase text-sm tracking-widest mb-6">Popular Searches</p>
              <div className="flex flex-wrap gap-3">
                {['Noodles', 'Spicy', 'Stir Fry', 'Rice', 'Curry', 'Dumplings'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setInputValue(tag)}
                    className="px-6 py-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 hover:border-zinc-200 rounded-full text-zinc-600 font-bold text-lg transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
              {filteredPosts.map((post) => (
                <a 
                  key={post.slug}
                  href={`/${post.collection === 'recipes' ? 'recipes' : 'blog'}/${post.slug}`}
                  className="flex items-center gap-6 p-4 rounded-3xl hover:bg-zinc-50 transition-all group"
                  onClick={closeSearch}
                >
                  {post.data.image && (
                    <img src={post.data.image} alt="" className="w-24 h-24 object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-1 bg-zinc-100 text-zinc-500 text-xs font-bold uppercase tracking-wider rounded-md mb-2">{post.data.category || 'Recipe'}</span>
                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">{post.data.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          )}
            
          {inputValue.trim() !== '' && filteredPosts.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <p className="text-zinc-300 text-6xl mb-4 font-black">?</p>
              <p className="text-zinc-500 font-bold text-xl">No results found for "{inputValue}"</p>
              <p className="text-zinc-400 mt-2">Try checking your spelling or use different keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
