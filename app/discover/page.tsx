import { prisma } from "@/lib/prisma";
import { SwipeableDeal } from "@/app/components/ai/SwipeableDeal";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DiscoverPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;

    // Get user preferences to filter out deals they've already swiped on
    const pref = await prisma.userPreference.findUnique({
        where: { userId },
    });

    const seenIds = [
        ...(pref?.likedDealIds || []),
        ...(pref?.discardedDealIds || [])
    ];

    // Fetch a batch of unseen featured deals
    const deals = await prisma.deal.findMany({
        where: {
            id: { notIn: seenIds },
            isFeatured: true,
            endDate: { gt: new Date() }
        },
        take: 10,
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-12 px-4 overflow-hidden">
            <div className="max-w-xl mx-auto w-full text-center mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                    Discover Your Next Trip
                </h1>
                <p className="text-slate-500 font-medium text-lg">
                    Swipe right to save to your watchlist and teach our AI your travel vibe.
                </p>
            </div>

            <div className="flex-1 relative max-w-sm mx-auto w-full flex items-center justify-center">
                {deals.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-3xl border shadow-sm w-full">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            🎉
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">You caught 'em all!</h3>
                        <p className="text-slate-500">Check back later for more deals matching your vibe.</p>
                    </div>
                ) : (
                    <div className="relative w-full h-[600px]">
                        {/* 
              Render deals in reverse order so the first one in the array
              is rendered last (on top) 
            */}
                        {[...deals].reverse().map((deal, index) => (
                            <SwipeableDeal
                                key={deal.id}
                                deal={deal}
                                userId={userId}
                                onSwipe={() => { }} // Could trigger a re-render/refetch if we want client-side endless scrolling
                                style={{
                                    zIndex: index, // Reverse array + z-index ensures top card matches array front
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
