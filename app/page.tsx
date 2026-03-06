import ArticleFeed from "@/components/articleFeed";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-14 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#555] mb-4">
          Endless Knowledge
        </p>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 leading-none">
          Wiki<span className="text-[#555]">Scroll</span>
        </h1>
        <p className="text-[#555] font-mono text-sm">
          Random articles from Wikipedia: scroll forever, learn something new.
        </p>
      </header>
      {/* Feed */}
      <ArticleFeed />
    </main>
  );
}
