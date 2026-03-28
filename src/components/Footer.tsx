const Footer = () => (
  <footer className="border-t border-border py-6 mt-12" style={{ background: "hsl(222 47% 4%)" }}>
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">
        Powered by <span className="text-foreground font-medium">Courtana</span> · Pickle DaaS · AI-Driven Sports Intelligence
      </p>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
        Built with AI
      </span>
      <a
        href="https://courtana.com"
        target="_blank"
        rel="noopener"
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        courtana.com
      </a>
    </div>
  </footer>
);

export default Footer;
