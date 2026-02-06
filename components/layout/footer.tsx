import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-neutral-200 bg-white px-6 py-12 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-neutral-400">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                <Link href="/" className="mr-8 text-lg font-medium tracking-tight text-pink-900 dark:text-pink-100 hover:opacity-80 transition-opacity">
                    <span>lily's world</span>
                </Link>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:gap-6">
                    <Link href="/shop" className="hover:text-black dark:hover:text-white">Shop</Link>
                    <Link href="/about" className="hover:text-black dark:hover:text-white">About</Link>
                </div>
                <div className="md:ml-auto">
                    <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
