import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold">NeuroFin</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Smarter money decisions powered by intelligent insights.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/#features">Features</Link></li>
                <li><Link href="https://github.com/Devanshujangid/NeuroFin-AI-Finance-Management-app">Github</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Contact</Link></li>
                <li><Link href="#">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} NeuroFin. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
