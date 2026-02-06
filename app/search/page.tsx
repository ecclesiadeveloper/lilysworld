import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/product/product-card';

export const metadata = {
    title: 'Search',
    description: 'Search for products in the store.',
};

export default async function SearchPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const { q: searchValue } = searchParams as { [key: string]: string };
    const products = await getProducts({ query: searchValue });
    const resultsText = products.length > 1 ? 'results' : 'result';

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {searchValue ? (
                <p className="mb-4">
                    {products.length === 0
                        ? 'There are no products that match '
                        : `Showing ${products.length} ${resultsText} for `}
                    <span className="font-bold">&quot;{searchValue}&quot;</span>
                </p>
            ) : null}

            {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
