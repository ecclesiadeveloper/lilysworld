'use client';

import { useCart } from './cart-context';
import { ProductVariant } from '@/types';
import { clsx } from 'clsx';

export function AddToCart({
    variant,
    availableForSale
}: {
    variant: ProductVariant;
    availableForSale: boolean;
}) {
    const { addItem, isLoading } = useCart();

    const handleAddToCart = async () => {
        if (!availableForSale) return;
        await addItem(variant.id, 1);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={!availableForSale || isLoading}
            className={clsx(
                'flex w-full items-center justify-center rounded-full bg-black px-8 py-4 text-base font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-neutral-200',
                {
                    'cursor-not-allowed opacity-60': !availableForSale || isLoading,
                    'opacity-100': availableForSale && !isLoading
                }
            )}
        >
            {isLoading ? 'Adding...' : availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </button>
    );
}
