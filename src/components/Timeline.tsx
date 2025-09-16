import React from 'react';

interface TimelineProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  minYear: number;
  maxYear: number;
}

export default function Timeline({ selectedYear, onYearChange, minYear, maxYear }: TimelineProps) {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onYearChange(parseInt(event.target.value));
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-sm text-white px-8 py-4 rounded-lg shadow-lg">
      <div className="flex items-center space-x-6 min-w-[600px]">
        <span className="text-sm font-medium whitespace-nowrap">{minYear}</span>

        <div className="relative flex-1">
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={selectedYear}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((selectedYear - minYear) / (maxYear - minYear)) * 100}%, #374151 ${((selectedYear - minYear) / (maxYear - minYear)) * 100}%, #374151 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-300 mt-2">
            <span>Industrial Revolution</span>
            <span>Modern Era Begins</span>
          </div>
        </div>

        <span className="text-sm font-medium whitespace-nowrap">{maxYear}</span>
      </div>

      <div className="text-center mt-3">
        <span className="text-2xl font-bold text-amber-400">{selectedYear}</span>
        <p className="text-sm text-gray-300 mt-1">
          {selectedYear <= 1885 ? "Early Industrial Period" :
           selectedYear <= 1900 ? "Corporate Expansion Era" :
           selectedYear <= 1910 ? "Progressive Era" : "Pre-War Modernization"}
        </p>
      </div>
    </div>
  );
}