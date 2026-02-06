export const SITE_NAME = "lily's world";
export const SITE_TAGLINE = "Simple storage, simple living.";
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2024-01/graphql.json";

export type SortFilterItem = {
    title: string;
    slug: string | null;
    sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
    reverse: boolean;
};

export const defaultSort: SortFilterItem = {
    title: 'Relevance',
    slug: null,
    sortKey: 'RELEVANCE',
    reverse: false
};

export const sorting: SortFilterItem[] = [
    defaultSort,
    { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false }, // Ascending on false? No, typically best selling is global.
    { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
    { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false },
    { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];
