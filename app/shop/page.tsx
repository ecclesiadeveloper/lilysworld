import { ProductCard } from '@/components/product/product-card';
import { getProducts } from '@/lib/shopify';
import { sorting } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
    title: 'Shop',
    description: 'Shop all products.',
};

export default async function ShopPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const { sort } = searchParams as { [key: string]: string };

    // Find the sort item
    const sortItem = sorting.find((item) => item.slug === sort) || sorting[0];

    const products = await getProducts({
        sortKey: sortItem.sortKey,
        reverse: sortItem.reverse
    });

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 md:flex-row md:items-center">
                <h1 className="text-3xl font-light tracking-tight text-black dark:text-white">All Products</h1>

                <div className="flex gap-2 text-sm text-neutral-500">
                    <span className="mr-2">Sort by:</span>
                    <div className="flex gap-4">
                        {sorting.map((item) => (
                            <Link
                                key={item.title}
                                href={item.slug ? `/shop?sort=${item.slug}` : '/shop'}
                                className={`hover:text-black dark:hover:text-white \${
                  (sort === item.slug || (!sort && !item.slug)) ? 'font-semibold text-black dark:text-white underline' : ''
                }`}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {products.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-neutral-500">No products found.</p>
                </div>
            )}
        </div>
    );
}
