import Link from "next/link";
import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-16 border-t">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Ready to start managing your money smarter?
        </h2>

        {/* Supporting line */}
        <p className="mt-3 text-sm text-muted-foreground">
          Get started with NeuroFin in minutes.
        </p>

        {/* CTA */}
        <div className="mt-6">
          <Link href="/dashboard">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
