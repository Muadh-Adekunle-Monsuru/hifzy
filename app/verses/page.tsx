'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VerseCard } from '@/components/verse-card';
import { quranVerses } from '@/lib/data/quranic-verses';

export default function VersesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);

  // Get unique surahs
  const surahs = useMemo(() => {
    const unique = Array.from(new Set(quranVerses.map((v) => v.surahNumber)));
    return unique.sort((a, b) => a - b);
  }, []);

  // Filter verses
  const filteredVerses = useMemo(() => {
    return quranVerses.filter((verse) => {
      const matchesSearch =
        searchQuery === '' ||
        verse.arabicText.includes(searchQuery) ||
        verse.surahName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verse.translation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSurah =
        selectedSurah === null || verse.surahNumber === selectedSurah;

      return matchesSearch && matchesSurah;
    });
  }, [searchQuery, selectedSurah]);

  return (
    <main className="flex-1 bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Verse Library</h1>
            <p className="text-gray-600 mt-2">
              Browse and explore Quranic verses
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">← Back Home</Button>
          </Link>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Verses
            </label>
            <Input
              type="text"
              placeholder="Search by surah name, translation, or Arabic text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Surah Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Surah
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSurah === null ? 'default' : 'outline'}
                onClick={() => setSelectedSurah(null)}
                size="sm"
              >
                All Surahs
              </Button>
              {surahs.map((surahNum) => {
                const surahName = quranVerses.find(
                  (v) => v.surahNumber === surahNum
                )?.surahName;
                return (
                  <Button
                    key={surahNum}
                    variant={
                      selectedSurah === surahNum ? 'default' : 'outline'
                    }
                    onClick={() => setSelectedSurah(surahNum)}
                    size="sm"
                  >
                    {surahName}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredVerses.length} verse
            {filteredVerses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Verses Grid */}
        {filteredVerses.length > 0 ? (
          <div className="grid gap-6 mb-8">
            {filteredVerses.map((verse) => (
              <VerseCard key={verse.id} verse={verse} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No verses found matching your search.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedSurah(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
