import { featuresData } from "../data/KeyFeaturesData";

const KeyFeatures = () => {
  return (
    <section id="features" className="py-30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need to manage money smarter
          </h2>
          <p className="mt-4 text-lg md:text-sm text-muted-foreground">
            Powerful tools designed to give you complete control and clear
            insights into your finances.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {featuresData.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div key={index} className="text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-blue-100">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
