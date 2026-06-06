import { Award, Clock, Heart, MapPin } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Quality Craftsmanship",
    description: "Every shed is built with premium materials and attention to detail.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We respect your time and complete projects when promised.",
  },
  {
    icon: Heart,
    title: "Honest & Transparent",
    description: "No hidden fees. What we quote is what you pay.",
  },
  {
    icon: MapPin,
    title: "Local Phoenix Company",
    description: "Proudly serving the Phoenix metro area with personalized service.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl md:text-4xl">Why Choose Us</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Experience the Heidelberg difference
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col items-center rounded-xl bg-card p-4 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 sm:p-6"
            >
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:mb-4">
                <reason.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-foreground sm:mb-2 sm:text-lg">{reason.title}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
