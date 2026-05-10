export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OncoVision XAI — Research prototype.</p>
        <p className="text-xs">Not a medical device. For research and educational use only.</p>
      </div>
    </footer>
  );
}
