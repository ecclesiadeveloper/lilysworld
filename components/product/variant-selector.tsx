'use client';

import { ProductOption } from '@/types';
import { clsx } from 'clsx';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function VariantSelector({
    options,
    variants
}: {
    options: ProductOption[];
    variants: any[]; // Using any for simplicity in matching logic, ideally strict typed
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const hasNoOptionsOrJustOneOption =
        !options.length || (options.length === 1 && options[0]?.values.length === 1);

    if (hasNoOptionsOrJustOneOption) {
        return null;
    }

    const createUrl = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        return params.toString();
    };

    return (
        <dl className="mb-8">
            {options.map((option) => (
                <div key={option.id} className="mb-4">
                    <dt className="mb-2 text-sm text-neutral-500 uppercase tracking-wide">
                        {option.name}
                    </dt>
                    <dd className="flex flex-wrap gap-3">
                        {option.values.map((value) => {
                            // Check if currently active from URL search params
                            const paramValue = searchParams.get(option.name);
                            const isActive = paramValue === value;
                            // If not present in params, maybe checks default? For now, simple.

                            const isAvailableForSale = variants.some((variant) => {
                                // Logic to check if this specific combination exists and is available
                                // This requires checking all selected options + this one. 
                                // Simple version: just check if any variant has this option value and is available.
                                return variant.availableForSale && variant.selectedOptions.some((o: any) => o.name === option.name && o.value === value);
                            });

                            return (
                                <button
                                    key={value}
                                    onClick={() => {
                                        router.replace(`${pathname}?${createUrl(option.name, value)}`, {
                                            scroll: false
                                        });
                                    }}
                                    disabled={!isAvailableForSale}
                                    className={clsx(
                                        'flex items-center justify-center rounded-full border px-4 py-2 text-sm transition-all',
                                        {
                                            'cursor-default ring-2 ring-black dark:ring-white': isActive,
                                            'ring-1 ring-neutral-200 hover:ring-black dark:ring-neutral-800 dark:hover:ring-white': !isActive && isAvailableForSale,
                                            'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700': !isAvailableForSale
                                        }
                                    )}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
