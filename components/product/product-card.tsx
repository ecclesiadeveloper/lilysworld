import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/product/${product.handle}`} className="group block">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/50 dark:bg-white/5">
                {product.featuredImage ? (
                    <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-neutral-400">
                        No Image
                    </div>
                )}
            </div>
            <div className="mt-4 flex justify-between items-baseline px-1">
                <div>
                    <h3 className="text-base font-serif font-medium text-pink-950 dark:text-white">
                        {product.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                        {product.variants.edges[0]?.node.title !== 'Default Title' ? product.variants.edges[0]?.node.title : ''}
                    </p>
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                </p>
            </div>
        </Link>
    );
}
