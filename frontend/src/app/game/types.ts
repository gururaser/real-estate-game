export interface Property {
  id: string;
  realId: string; // Real ID from Superlinked schema
  fields: {
    description: string;
    streetAddress: string;
    city: string;
    state: string;
    county: string;
    price: number;
    pricePerSquareFoot: number;
    yearBuilt: number;
    zipcode: number;
    longitude: number;
    latitude: number;
    livingArea: number;
    livingAreaValue: number;
    bathrooms: number;
    bedrooms: number;
    buildingArea: number;
    garageSpaces: number;
    levels: string;
    country: string;
    datePostedString: string;
    event: string;
    currency: string;
    lotAreaUnits: string;
    homeType: string;
    is_bankOwned: number;
    is_forAuction: number;
    parking: number;
    hasGarage: number;
    pool: number;
    spa: number;
    isNewConstruction: number;
    hasPetsAllowed: number;
    time: number;
  };
  metadata?: {
    score: number;
  };
}

export interface SearchResult {
  entries: Property[];
  metadata: any;
}

export interface GameResult {
  success: boolean;
  medal?: 'gold' | 'silver' | 'bronze';
  message: string;
  guess?: number;
  actualPrice?: number;
  deviation?: number;
}