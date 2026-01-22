import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar productos por nombre..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
    </div>
  );
}
