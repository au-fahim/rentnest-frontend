"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

type SearchableMultiSelectProps = {
  id?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
};

export function SearchableMultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search options",
  emptyMessage = "No options found.",
  className,
}: SearchableMultiSelectProps) {
  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(normalizedQuery),
  );

  function toggleOption(option: string) {
    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option],
    );
  }

  return (
    <div className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className="flex min-h-10 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-left text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {value.length > 0 ? (
            value.slice(0, 3).map((item) => (
              <span
                key={item}
                className="inline-flex max-w-full items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                <span className="truncate">{item}</span>
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {value.length > 3 ? (
            <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              +{value.length - 3}
            </span>
          ) : null}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>

          <div
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            className="mt-2 max-h-60 overflow-y-auto rounded-md"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
                    onClick={() => toggleOption(option)}
                  >
                    <span>{option}</span>
                    {isSelected ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-4 text-sm text-muted-foreground">{emptyMessage}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
