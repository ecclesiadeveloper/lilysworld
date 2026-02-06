import Link from 'next/link';
import { SITE_TAGLINE } from '@/lib/constants';

export function Hero() {
    return (
        <div className="relative flex min-h-[70vh] w-full flex-col items-center justify-center bg-white text-center dark:bg-black">
            <div className="mx-auto max-w-2xl px-4">
                <h1 className="mb-6 text-5xl font-serif font-medium tracking-tight text-pink-900 dark:text-pink-100 sm:text-7xl">
                    lily&apos;s world
                </h1>
                <p className="mb-10 text-xl text-neutral-700 dark:text-neutral-300 font-light italic">
                    {SITE_TAGLINE}
                </p>
                <Link
                    href="/shop"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-pink-900 px-8 text-base font-medium text-white transition-transform hover:scale-105 hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-900 focus:ring-offset-2 dark:bg-pink-100 dark:text-pink-900 dark:hover:bg-white"
                >
                    Shop All
                </Link>
            </div>
        </div>
    );
}
