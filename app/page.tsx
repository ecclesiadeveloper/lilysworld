import { Hero } from '@/components/ui/hero';
import { ProductCard } from '@/components/product/product-card';
import { getProducts } from '@/lib/shopify';

export default async function Home() {
  const products = await getProducts({ sortKey: 'BEST_SELLING' });

  // Take top 4 products
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-light tracking-tight text-black dark:text-white">Featured</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {featuredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-500">No products found. Please check your Shopify configuration.</p>
          </div>
        )}
      </section>
    </>
  );
}
