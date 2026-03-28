const Footer = () => (
  <footer className="border-t border-border py-6 mt-12">
    <div className="container text-center text-xs text-muted-foreground space-y-1">
      <p>Powered by <span className="text-foreground font-medium">Courtana</span> · Pickle DaaS · Built with Gemini AI + ElevenLabs</p>
      <p>
        <a href="https://github.com/PickleBill/pickle-daas-data" target="_blank" rel="noopener" className="hover:text-primary transition-colors">github.com/PickleBill/pickle-daas-data</a>
        {" | "}
        <a href="https://courtana.com" target="_blank" rel="noopener" className="hover:text-primary transition-colors">courtana.com</a>
      </p>
    </div>
  </footer>
);

export default Footer;
