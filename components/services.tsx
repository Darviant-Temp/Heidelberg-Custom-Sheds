import { Warehouse, Home, Building2, PanelTop, Wrench, HardHat } from "lucide-react";

const services = [
  {
    icon: Warehouse,
    title: "Storage Sheds",
    description: "Durable storage solutions for all your equipment and belongings.",
  },
  {
    icon: Home,
    title: "Office / She Sheds",
    description: "Beautiful backyard retreats for work or relaxation.",
  },
  {
    icon: Building2,
    title: "Barn Style Sheds",
    description: "Classic barn designs with modern construction quality.",
  },
  {
    icon: PanelTop,
    title: "Lean-to Sheds",
    description: "Space-efficient designs that attach to existing structures.",
  },
  {
    icon: Wrench,
    title: "Custom Builds",
    description: "Unique designs tailored to your specific requirements.",
  },
  {
    icon: HardHat,
    title: "Shell Builds",
    description: "Structural frames ready for your finishing touches.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl md:text-4xl">What We Build</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            From storage solutions to custom retreats, we build quality sheds for every need.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl bg-card p-4 sm:p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 sm:mb-4">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-foreground sm:mb-2 sm:text-lg">{service.title}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
