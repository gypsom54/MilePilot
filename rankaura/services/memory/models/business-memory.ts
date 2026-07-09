/**
 * Business identity and market context memory.
 */

export interface BusinessMemory {
  businessId: string;
  name: string;
  industry: string;
  description: string;
  location: string;
  targetAudience: string;
  products: BusinessProduct[];
  services: BusinessService[];
  updatedAt: string;
}

export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
}

export interface BusinessService {
  id: string;
  name: string;
  description: string;
}
