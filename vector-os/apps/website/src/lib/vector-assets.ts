export const VECTOR_ASSETS = {
  hero: '/assets/vector/vector-hero-packaging.png',
  packagingSystem: '/assets/vector/vector-packaging-system.png',
  products: {
    retatrutide: '/assets/vector/vector-product-retatrutide.png',
    bpc: '/assets/vector/vector-product-bpc.png',
    nad: '/assets/vector/vector-product-nad.png',
    ghk: '/assets/vector/vector-product-ghk.png',
  },
} as const;

export type ProductAssetKey = keyof typeof VECTOR_ASSETS.products;
