'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart } from '@/types';
import { createCart, getCart, addToCart, removeFromCart, updateCart } from '@/lib/shopify';

type CartContextType = {
    cart: Cart | undefined;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (variantId: string, quantity: number) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
    updateItem: (lineId: string, variantId: string, quantity: number) => Promise<void>;
    isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initialize cart on mount
        const initializeCart = async () => {
            const cartId = localStorage.getItem('lilysWorldCartId');
            if (cartId) {
                try {
                    const existingCart = await getCart(cartId);
                    if (existingCart) {
                        setCart(existingCart);
                        return;
                    }
                } catch (e) {
                    console.error('Failed to fetch existing cart', e);
                }
            }

            // If no valid cart exists, we'll create one lazily when the user first adds an item,
            // OR we can create one upfront. For now, let's wait until interaction or just leave it empty.
            // But typically for a smooth experience we might check validity. 
        };

        initializeCart();
    }, []);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const addItem = async (variantId: string, quantity: number) => {
        setIsLoading(true);
        try {
            let cartId = cart?.id;
            if (!cartId) {
                cartId = localStorage.getItem('lilysWorldCartId') || undefined;
            }

            let newCart: Cart;

            if (!cartId) {
                newCart = await createCart();
                cartId = newCart.id;
                localStorage.setItem('lilysWorldCartId', cartId);
                // If we just created the cart, we need to add the item now
                newCart = await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
            } else {
                newCart = await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
            }

            setCart(newCart);
            openCart();
        } catch (e) {
            console.error('Error adding to cart', e);
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (lineId: string) => {
        if (!cart?.id) return;
        setIsLoading(true);
        try {
            const newCart = await removeFromCart(cart.id, [lineId]);
            setCart(newCart);
        } catch (e) {
            console.error('Error removing from cart', e);
        } finally {
            setIsLoading(false);
        }
    };

    const updateItem = async (lineId: string, variantId: string, quantity: number) => {
        if (!cart?.id) return;
        setIsLoading(true);
        try {
            const newCart = await updateCart(cart.id, [{ id: lineId, merchandiseId: variantId, quantity }]);
            setCart(newCart);
        } catch (e) {
            console.error('Error updating cart', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ cart, isOpen, openCart, closeCart, addItem, removeItem, updateItem, isLoading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
