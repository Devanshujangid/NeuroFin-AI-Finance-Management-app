import { howItWorksData } from "../data/HowitWorksData";

const HowItWorks = () => {
  return (
    <section className="py-15">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            How NeuroFin works
          </h2>
          <p className="mt-4 text-muted-foreground">
            A simple, intelligent process designed to help you make better
            financial decisions.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-16 text-center">
          {howItWorksData.map((item, index) => (
            <div key={index}>
              {/* Step number */}
              <div className="text-blue-600 font-bold text-2xl tracking-wider">
                {item.step}
              </div>

              {/* Title */}
              <h3 className="mt-3 text-lg font-semibold">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
