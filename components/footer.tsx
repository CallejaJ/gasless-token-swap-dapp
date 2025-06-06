export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between text-sm">
        <p>© 2024 Gasless Token Swap. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yourusername/gasless-token-swap"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
