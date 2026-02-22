'use server';

type DealHistory = {
    price: number;
    date: string;
}[];

export async function analyzeDeal(currentPrice: number, history: DealHistory = []) {
    if (history.length === 0) return { rating: "Unknown", discount: 0 };

    const prices = history.map(h => h.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);

    const discount = Math.round(((avgPrice - currentPrice) / avgPrice) * 100);

    let rating = "AVERAGE";
    if (currentPrice < avgPrice * 0.8) rating = "SUPER_HOT"; // < 20% of average (Wait, prompt said < 20% of avg, usually implies 80% OFF, but 'less than 20% OF average' means extremely cheap. Let's assume < 80% of average which is 20% OFF or < 20% of 30-day average which is huge. Prompt: "If price is < 20% of 30-day average". That's 80% off. Okay.)
    // Actually, "price is < 20% of 30-day average" literally means if avg is 100, price is < 20. That's a massive discount. I'll stick to the prompt's literal instruction but maybe add a sanity check or comment.
    // Re-reading: "If price is < 20% of 30-day average -> Mark as SUPER_HOT."
    // A price of 20 when avg is 100 is indeed a super hot deal.

    if (currentPrice < avgPrice * 0.2) {
        rating = "SUPER_HOT";
    } else if (currentPrice < avgPrice * 0.5) {
        rating = "HOT";
    } else if (currentPrice < avgPrice * 0.8) {
        rating = "GOOD";
    }

    return { rating, discount };
}

export async function generateItinerary(destination: string, days: number) {
    // Mock AI response for now, simulating a call to Gemini/OpenAI
    // In a real app, this would use the Google Generative AI SDK or OpenAI API

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

    const itinerary = {
        destination,
        days,
        plan: Array.from({ length: days }).map((_, i) => ({
            day: i + 1,
            activities: [
                { time: "09:00", title: `Breakfast in ${destination}`, description: "Enjoy local pastries and coffee." },
                { time: "11:00", title: `Explore City Center`, description: "Visit the main landmarks and museums." },
                { time: "13:00", title: "Lunch at a Hidden Gem", description: "Try the authentic local cuisine." },
                { time: "15:00", title: "Afternoon Adventure", description: "Take a guided tour or hike." },
                { time: "19:00", title: "Dinner with a View", description: "Sunset dining experience." }
            ]
        }))
    };

    return itinerary;
}
