import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Helper function to generate routes with dashboard prefix
export function route(path = "/") {
  return (
    CONFIG.dashboard_prefix.replace(/^\/+/, "") + "/" + path.replace(/^\/+/, "")
  );
}

// Helper function to convert text to headline case
export function headline(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}
