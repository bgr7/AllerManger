"use client";
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import from 'next/navigation' instead of 'next/router'
import React, { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/product/${query.trim()}`);
      console.log('searching for:', query);
    }
  };

  return (
    <div className='w-[300px] m-auto'>
      <form onSubmit={handleSearch} className="mb-4 flex justify-center items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories"
          className="border border-gray-300 rounded-lg p-2 mr-3 w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center"
        >
          Search
          <Search size={20} className='ml-2' />
        </button>
      </form>
    </div>
  );
}
