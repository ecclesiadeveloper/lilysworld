# lily's world - Headless Shopify Storefront

A specific, minimalist, high-converting headless storefront built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Features

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (Floral/Retro Theme)
- **Typography**: Custom Font "Ahsing" (Headers) + Inter (Body)
- **Integration**: Shopify Storefront API (GraphQL)
- **State**: Global Cart Context (LocalStorage persistence)
- **Zero External UI Libraries**: Pure Tailwind + React

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A Shopify Store
- Shopify Storefront Access Token

### 2. Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/lilys-world.git
    cd lilys-world
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Configure Environment Variables:
    Copy `.env.example` to `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
    Update `.env.local` with your Shopify credentials:
    ```env
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token
    NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
    ```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.

## Shopify Configuration

To generate the required credentials:
1.  Go to your Shopify Admin -> **Settings** -> **Apps and sales channels**.
2.  Click **Develop apps** -> **Create an app**.
3.  Name it "Headless Storefront".
4.  Go to **Configuration** -> **Storefront API integration**.
5.  Select the following scopes:
    - `unauthenticated_read_product_listings`
    - `unauthenticated_read_product_tags`
    - `unauthenticated_read_products`
    - `unauthenticated_read_collection_listings`
    - `unauthenticated_write_checkouts` (if available, otherwise Cart API handles this)
    - `unauthenticated_read_checkouts`
6.  Click **Save** -> **Install app**.
7.  Copy the **Storefront API access token** into your `.env.local`.

## Deployment

Deploy easily to Vercel:

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add the Environment Variables in Vercel Project Settings.
4.  Deploy.

## Troubleshooting

- **Products not showing?**
    - Ensure your products are "Active" and available to the "Headless Storefront" channel (or whichever app you created).
    - Check your API Token scopes.
- **Images missing?**
    - Next.js requires `images.remotePatterns` in `next.config.js` if you are pulling from external domains other than `cdn.shopify.com`. This project defaults to standard Shopify CDN (configured automatically by some setups, but you may need to add it if using a custom domain).

## License

MIT
