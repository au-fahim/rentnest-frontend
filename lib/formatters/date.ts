const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return dateFormatter.format(new Date(value));
}
