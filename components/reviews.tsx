import { Star } from "lucide-react";
import type { Review } from "@/lib/airtable";

interface ReviewsProps {
  reviews: Review[];
}

export function Reviews({ reviews }: ReviewsProps) {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < count ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
      />
    ));
  };

  // Placeholder reviews for when no data
  const placeholderReviews: Review[] = [
    {
      id: "1",
      "Customer Name": "Doug D.",
      Location: "Glendale, AZ",
      "Review Text":
        "We called and had about 4 contractors bid the job. Tim came out and knew his stuff. He wasn't the cheapest or most expensive but him and his helper did a great job. Very happy with the quality craftsmanship on our 12x20 shed with a loft.",
      Stars: 5,
      "Service Type": "Custom Shed Build",
    },
    {
      id: "2",
      "Customer Name": "Livia R.",
      Location: "Glendale, AZ",
      "Review Text":
        "Timothy and his guys built us a beautiful shed in a timely manner. He was very communicative and respectful. I would recommend him to anyone. So glad we chose this company - honest, detailed and trustworthy!",
      Stars: 5,
      "Service Type": "Custom Shed Build",
    },
    {
      id: "3",
      "Customer Name": "Joanna C.",
      Location: "Phoenix, AZ",
      "Review Text":
        "Love the way our shed looks, great job Tim! The process and time frame was perfect. Looks exactly as we planned, thank you.",
      Stars: 5,
      "Service Type": "Shed Build",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : placeholderReviews;

  return (
    <section id="reviews" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 sm:mb-4 sm:px-4 sm:py-2">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500 sm:h-4 sm:w-4" />
            <span className="text-xs font-semibold text-amber-800 sm:text-sm">5-Star Rated on Yelp</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl md:text-4xl">What Our Clients Say</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Read reviews from our satisfied customers across Phoenix
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col rounded-xl bg-card p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-1 sm:mb-4">{renderStars(review.Stars || 5)}</div>
              <p className="mb-3 flex-1 text-sm text-foreground sm:mb-4 sm:text-base">{`"${review["Review Text"]}"`}</p>
              <div className="border-t border-border pt-3 sm:pt-4">
                <p className="text-sm font-semibold text-foreground sm:text-base">{review["Customer Name"]}</p>
                <p className="text-xs text-muted-foreground sm:text-sm">{review.Location}</p>
                {review["Service Type"] && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {review["Service Type"]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
