'use client';

import { motion } from 'framer-motion';
import DealCard from '../DealCard';

import { DealWithDestination } from '@/types';

interface SearchResultsListProps {
    deals: DealWithDestination[];
}

export default function SearchResultsList({ deals }: SearchResultsListProps) {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
            {deals.map((deal) => (
                <motion.div
                    key={deal.id}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                    }}
                >
                    <DealCard
                        id={deal.id}
                        title={deal.title}
                        price={deal.price}
                        originalPrice={deal.originalPrice}
                        currency={deal.currency}
                        imageUrl={deal.imageUrl}
                        aiRating={deal.aiRating}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
