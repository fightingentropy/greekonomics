'use client';

interface CategoriesNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ['all', 'investing', 'crypto', 'personal-finance'];

const categoryDisplayNames: { [key: string]: string } = {
  'all': 'All',
  'investing': 'Investing',
  'crypto': 'Crypto',
  'personal-finance': 'Personal Finance'
};

export default function CategoriesNav({ activeCategory, onCategoryChange }: CategoriesNavProps) {
  return (
    <nav className="border-b border-gray-800 bg-[#1a1a1a]">
      <div className="container mx-auto px-6">
        <div className="flex justify-center gap-2 py-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-4 py-1.5 rounded-full text-sm transition-all
                ${activeCategory === category
                  ? 'bg-white text-black font-medium'
                  : 'bg-[#2a2a2a] text-white hover:bg-[#333333]'
                }
              `}
            >
              {categoryDisplayNames[category]}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
