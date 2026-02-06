import { ComponentProps } from 'react';
import { clsx } from 'clsx';

export function OpenCart({
    className,
    quantity
}: {
    className?: string;
    quantity?: number;
} & ComponentProps<'div'>) {
    return (
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-pink-900/20 text-black transition-colors hover:border-pink-900 hover:bg-pink-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={clsx('h-4 w-4 transition-all ease-in-out hover:scale-110', className)}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
            </svg>
            {quantity ? (
                <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-black text-[11px] font-medium text-white dark:bg-white dark:text-black">
                    {quantity}
                </div>
            ) : null}
        </div>
    );
}
