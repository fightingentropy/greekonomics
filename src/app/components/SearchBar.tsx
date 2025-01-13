'use client';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <svg 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M21 21L15.5 15.5M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        placeholder="Search Greekonomics"
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-full pl-12 pr-4 py-2.5 bg-[#2a2a2a] text-white placeholder-gray-400 rounded-full border border-transparent focus:outline-none focus:border-gray-700 transition-all text-lg"
      />
    </div>
  );
}
