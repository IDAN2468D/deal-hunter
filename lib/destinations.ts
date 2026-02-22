export const DESTINATION_IMAGES: Record<string, string> = {
    'paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    'dubai': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    'bangkok': 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?w=800&q=80',
    'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
    'amsterdam': 'https://images.unsplash.com/photo-1584003564911-1da4dad55e5c?w=800&q=80',
    'default': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
};

export const getDestinationImage = (destination: string): string => {
    const lower = destination.toLowerCase();
    for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
        if (lower.includes(key)) return url;
    }
    return DESTINATION_IMAGES['default'];
};

export function deriveDestinationId(destination: string): string {
    const hex = destination
        .toLowerCase()
        .split('')
        .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
    return (hex + '0'.repeat(24)).slice(0, 24);
}
