export const metadata = {
    title: 'About',
    description: "About lily's world.",
};

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center sm:py-24">
            <h1 className="mb-8 text-3xl font-light tracking-tight text-black dark:text-white sm:text-4xl">
                About Us
            </h1>
            <div className="space-y-6 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p>
                    lily&apos;s world was born from a desire for simplicity. In a world full of noise, we believe in the quiet power of thoughtful design.
                </p>
                <p>
                    We curate objects that bring calm to your space. Functionality is our foundation, but beauty is our language. Every item is chosen to help you live more deliberately.
                </p>
                <p>
                    Thank you for visiting our world.
                </p>
            </div>
        </div>
    );
}
