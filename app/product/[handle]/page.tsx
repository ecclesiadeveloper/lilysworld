import { getProduct } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { VariantSelector } from '@/components/product/variant-selector';
import { AddToCart } from '@/components/cart/add-to-cart';

export async function generateMetadata({ params }: { params: { handle: string } }) {
    const product = await getProduct(params.handle);
    if (!product) return notFound();
    return {
        title: product.seo.title || product.title,
        description: product.seo.description || product.description
    };
}

export default async function ProductPage({ params, searchParams }: { params: { handle: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
    const product = await getProduct(params.handle);

    if (!product) {
        return notFound();
    }

    // Determine selected variant based on search params
    const { url: _url, ...currentOptions } = searchParams as { [key: string]: string };
    const variant = product.variants.edges.find((edge) => {
        // If no options selected, find default? 
        // If options selected, match them.
        if (Object.keys(currentOptions).length === 0) return true; // Default first one

        return edge.node.selectedOptions.every((option) => {
            return currentOptions[option.name] === option.value;
        });
    })?.node || product.variants.edges[0].node;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
                    {product.featuredImage ? (
                        <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-neutral-400">
                            No Image
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">{product.title}</h1>

                    <div className="mt-3">
                        <p className="text-2xl tracking-tight text-black dark:text-white">
                            {formatPrice(variant.price.amount, variant.price.currencyCode)}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>
                        <div className="space-y-6 text-base text-neutral-600 dark:text-neutral-400" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                    </div>

                    <div className="mt-8 border-t border-neutral-200 pt-8 dark:border-neutral-800">
                        <VariantSelector options={product.options} variants={product.variants.edges.map(e => e.node)} />

                        <AddToCart variant={variant} availableForSale={variant.availableForSale} />
                    </div>
                </div>
            </div>
        </div>
    );
}
