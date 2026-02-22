'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (destination) params.set('dest', destination);
        if (startDate) params.set('start', startDate);
        if (endDate) params.set('end', endDate);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
            <div className="flex-1">
                <label htmlFor="destination" className="block text-sm font-medium text-white mb-1">לאן?</label>
                <div className="relative">
                    {/* Icon placeholder if lucide-react not available immediately */}
                    <span className="absolute left-3 top-3 text-gray-400">📍</span>
                    <input
                        type="text"
                        id="destination"
                        placeholder="נסה 'פריס' או 'תאילנד'"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 border-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-4 flex-1">
                <div className="flex-1">
                    <label htmlFor="startDate" className="block text-sm font-medium text-white mb-1">מתאריך</label>
                    <input
                        type="date"
                        id="startDate"
                        className="w-full px-4 py-2 rounded-lg bg-white/90 border-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="endDate" className="block text-sm font-medium text-white mb-1">עד תאריך</label>
                    <input
                        type="date"
                        id="endDate"
                        className="w-full px-4 py-2 rounded-lg bg-white/90 border-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-end">
                <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    מצא עסקאות ✈️
                </button>
            </div>
        </form>
    );
}
