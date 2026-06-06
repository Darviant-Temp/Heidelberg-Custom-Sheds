import type { PricingRow } from "@/lib/airtable";
import { Phone } from "lucide-react";

interface PricingProps {
  pricing: PricingRow[];
  phone?: string;
}

export function Pricing({ pricing, phone = "602-880-4087" }: PricingProps) {
  // Group pricing by size, ignoring rows without a valid Size
  const groupedPricing = pricing.reduce(
    (acc, row) => {
      const size = row.Size;
      if (!size) return acc;
      if (!acc[size]) {
        acc[size] = [];
      }
      acc[size].push(row);
      return acc;
    },
    {} as Record<string, PricingRow[]>
  );

  const sortedSizes = Object.keys(groupedPricing).sort((a, b) => {
    const parseSize = (size: string) => {
      const match = size.match(/(\d+)x(\d+)/);
      if (match) {
        return parseInt(match[1]) * parseInt(match[2]);
      }
      return 0;
    };
    return parseSize(a) - parseSize(b);
  });

  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null || price === ("" as unknown as number)) {
      return "Call for price";
    }
    return `$${Number(price).toLocaleString()}+`;
  };

  const styleOrder = ["Lean-to", "Gable", "Barn"];

  return (
    <section id="pricing" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl md:text-4xl">Transparent Pricing</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            All builds include 1 door, 1 window, shingles & paint
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-foreground" />
            <span className="text-muted-foreground">No Foundation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-blue-600" />
            <span className="text-muted-foreground">Wood Foundation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-primary" />
            <span className="text-muted-foreground">Concrete Foundation</span>
          </div>
        </div>

        {/* Pricing Tables */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSizes.map((size) => {
            const rowsByStyle = groupedPricing[size].reduce(
              (acc, row) => {
                if (row.Style) acc[row.Style] = row;
                return acc;
              },
              {} as Record<string, PricingRow>
            );

            return (
              <div key={size} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="bg-primary px-3 py-2 sm:px-4 sm:py-3">
                  <h3 className="text-center text-base font-bold text-primary-foreground sm:text-lg">{size}</h3>
                </div>
                <div className="divide-y divide-border">
                  {styleOrder.map((style) => {
                    const row = rowsByStyle[style];
                    if (!row) return null;
                    return (
                      <div key={style} className="p-3 sm:p-4">
                        <div className="mb-2 font-semibold text-foreground text-sm sm:text-base">{style}</div>
                        <div className="space-y-1 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded bg-foreground" />
                              No Foundation
                            </span>
                            <span className="font-semibold text-foreground">
                              {formatPrice(row["No Foundation"])}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded bg-blue-600" />
                              Wood Foundation
                            </span>
                            <span className="font-semibold text-blue-600">
                              {formatPrice(row["Wood Foundation"])}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded bg-primary" />
                              Concrete Foundation
                            </span>
                            <span className="font-semibold text-primary">
                              {formatPrice(row["Concrete Foundation"])}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-lg bg-muted p-6 text-center">
          <p className="text-muted-foreground">Need a custom size? We can build to your specifications.</p>
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="h-4 w-4" />
            Call {phone} for custom sizes
          </a>
        </div>
      </div>
    </section>
  );
}
