import { statsData } from "../data/statsData";

const StatsSection = () => {
  return (
 // FULL-WIDTH BACKGROUND STRIP
    <section className="w-full bg-blue-50 py-10">
      {/* CENTERED CONTENT */}
      <div className="max-w-7xl mx-auto px-6">
        {/* 4 STATS LEFT → RIGHT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 text-center">
          {statsData.map((stat, index) => (
            <div key={index}>
              {/* NUMBER */}
              <div
                className="text-3xl md:text-4xl font-bold tracking-tight
                bg-linear-to-r from-blue-800 to-blue-600
                bg-clip-text text-transparent"
              >
                {stat.value}
              </div>

              {/* LABEL */}
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
