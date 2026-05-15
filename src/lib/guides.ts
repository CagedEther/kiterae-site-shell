import type { CollectionEntry } from "astro:content";

export function sortGuides(guides: CollectionEntry<"blog">[]) {
  return guides.sort((a, b) => {
    const orderDelta = a.data.order - b.data.order;
    if (orderDelta !== 0) return orderDelta;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
