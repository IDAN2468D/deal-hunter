/**
 * Estimates the carbon footprint (in kg CO2) for a given flight search.
 * This is a highly simplified heuristic:
 * - Base emissions per flight hour (~90kg CO2 per hour for a short-haul economy seat)
 * - Additional emissions per stop (takeoffs are carbon intensive, +50kg per stop)
 * 
 * In a real application, this would integrate with the ICAO Carbon Emissions Calculator API
 * or use specific aircraft fuel burn rates.
 */
export function calculateCarbonFootprint(flightHours: number, stops: number): number {
    const BASE_PER_HOUR = 90;
    const PER_STOP_PENALTY = 50;

    let totalEmissions = (flightHours * BASE_PER_HOUR) + (stops * PER_STOP_PENALTY);

    // Round to 1 decimal place
    return Math.round(totalEmissions * 10) / 10;
}

/**
 * Returns a human-readable eco rating based on emissions
 */
export function getEcoRating(emissions: number): { label: string; color: string } {
    if (emissions < 300) return { label: "Excellent", color: "text-green-400 bg-green-400/10" };
    if (emissions < 600) return { label: "Standard", color: "text-yellow-400 bg-yellow-400/10" };
    return { label: "High Impact", color: "text-red-400 bg-red-400/10" };
}
