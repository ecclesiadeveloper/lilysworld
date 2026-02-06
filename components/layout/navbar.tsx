'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_NAME } from '@/lib/constants';
import SearchInput from '@/components/search/input';
import { useCart } from '../cart/cart-context';
import { OpenCart } from '../cart/open-cart';

export function Navbar() {
    const pathname = usePathname();
    const { openCart, cart } = useCart();

    return (
        <nav className="sticky top-0 z-50 flex w-full flex-col gap-4 border-b border-pink-900/10 bg-white/30 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-black/30 md:flex-row md:items-center md:gap-0">
            <div className="flex items-center justify-between w-full md:w-auto">
                <Link href="/" className="mr-8 text-lg font-medium tracking-tight text-pink-900 dark:text-pink-100 hover:opacity-80 transition-opacity">
                    <span>lily's world</span>
                </Link>

                {/* Mobile Cart Toggle (Visible only on small screens) */}
                <button onClick={openCart} aria-label="Open cart" className="md:hidden">
                    <OpenCart quantity={cart?.totalQuantity} />
                </button>
            </div>

            <ul className="hidden gap-8 text-sm md:flex font-medium tracking-wide">
                <li>
                    <Link
                        href="/shop"
                        className={`underline-offset-4 hover:underline decoration-pink-900/50 hover:text-pink-900 dark:hover:text-pink-200 ${pathname === '/shop' ? 'text-pink-900 dark:text-pink-100 font-serif italic' : 'text-neutral-600 dark:text-neutral-300'
                            }`}
                    >
                        Shop
                    </Link>
                </li>
                <li>
                    <Link
                        href="/about"
                        className={`underline-offset-4 hover:underline decoration-pink-900/50 hover:text-pink-900 dark:hover:text-pink-200 ${pathname === '/about' ? 'text-pink-900 dark:text-pink-100 font-serif italic' : 'text-neutral-600 dark:text-neutral-300'
                            }`}
                    >
                        About
                    </Link>
                </li>
            </ul>

            <div className="flex flex-1 items-center justify-end gap-4 md:ml-auto">
                <div className="hidden md:block">
                    <SearchInput />
                </div>

                {/* Desktop Cart Toggle */}
                <button onClick={openCart} aria-label="Open cart" className="hidden md:block">
                    <OpenCart quantity={cart?.totalQuantity} />
                </button>
            </div>

            {/* Mobile Search (Visible below on small screens) */}
            <div className="block md:hidden w-full">
                <SearchInput />
            </div>
        </nav>
    );
}
