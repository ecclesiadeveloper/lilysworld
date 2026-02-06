'use client';

import { useCart } from './cart-context';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export function CartDrawer() {
    const { cart, isOpen, closeCart, updateItem, removeItem } = useCart();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                drawerRef.current &&
                !drawerRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                closeCart();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeCart]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div
                ref={drawerRef}
                className="h-full w-full max-w-md border-l border-neutral-200 bg-white p-6 shadow-xl transition-all duration-300 dark:border-neutral-800 dark:bg-black"
                role="dialog"
            >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <button
                        onClick={closeCart}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!cart || cart.lines.edges.length === 0 ? (
                    <div className="mt-20 flex flex-col items-center justify-center space-y-4 text-center">
                        <p className="text-neutral-500">Your cart is empty.</p>
                        <button
                            onClick={closeCart}
                            className="text-sm underline underline-offset-4 hover:text-black dark:hover:text-white"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex h-full flex-col justify-between overflow-hidden">
                        <ul className="flex-grow overflow-y-auto py-4">
                            {cart.lines.edges.map(({ node: item }) => (
                                <li key={item.id} className="flex flex-col border-b border-neutral-100 py-4 dark:border-neutral-800">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                                            {item.merchandise.product.featuredImage && (
                                                <Image
                                                    src={item.merchandise.product.featuredImage.url}
                                                    alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col text-base">
                                            <span className="font-medium leading-tight">{item.merchandise.product.title}</span>
                                            {item.merchandise.title !== 'Default Title' && (
                                                <p className="text-sm text-neutral-500">{item.merchandise.title}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end space-y-2">
                                            <p className="text-sm">
                                                {formatPrice(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode)}
                                            </p>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-xs text-neutral-500 hover:text-red-600 underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs text-neutral-500">Qty:</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, item.merchandise.id, parseInt(e.target.value))}
                                            className="h-8 w-16 rounded border border-neutral-200 px-2 text-xs focus:ring-black dark:border-neutral-800"
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-neutral-200 py-4 dark:border-neutral-800">
                            <div className="mb-4 flex items-center justify-between font-medium">
                                <span>Subtotal</span>
                                <span>{formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}</span>
                            </div>
                            <p className="mb-4 text-xs text-neutral-500">
                                Taxes and shipping calculated at checkout.
                            </p>
                            <a
                                href={cart.checkoutUrl}
                                className="block w-full rounded-full bg-black p-3 text-center text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
                            >
                                Proceed to Checkout
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
