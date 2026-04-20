import * as React from "react";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  fetchUrl: string;
  emptyMessage?: string;
  initialOptions?: Option[];
}

export function MultiSelect({
  value = [],
  onChange,
  placeholder = "选择...",
  fetchUrl,
  emptyMessage = "未找到结果",
  initialOptions = [],
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 1000);

  const [selectedOptions, setSelectedOptions] =
    React.useState<Option[]>(initialOptions);

  React.useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      setSelectedOptions((prev) => {
        const map = new Map(prev.map((p) => [p.value, p]));
        initialOptions.forEach((opt) => map.set(opt.value, opt));
        return Array.from(map.values());
      });
    }
  }, [initialOptions]);

  React.useEffect(() => {
    let active = true;
    setLoading(true);

    const url = new URL(fetchUrl, window.location.origin);
    if (debouncedSearch) {
      url.searchParams.set("search", debouncedSearch);
    }
    // We can also increase the pageSize so that we get more items per search
    url.searchParams.set("pageSize", "20");

    fetch(url.toString())
      .then((res) => res.json())
      .then((data: any) => {
        if (active) {
          const newOptions = (data.items || []).map((item: any) => ({
            label: item.name || item.title || item.slug,
            value: String(item.id),
          }));
          setOptions(newOptions);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setOptions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, fetchUrl]);

  const handleSelect = (option: Option) => {
    const isSelected = value.includes(option.value);
    if (isSelected) {
      onChange(value.filter((v) => v !== option.value));
      setSelectedOptions((prev) =>
        prev.filter((p) => p.value !== option.value),
      );
    } else {
      onChange([...value, option.value]);
      setSelectedOptions((prev) => {
        if (!prev.find((p) => p.value === option.value)) {
          return [...prev, option];
        }
        return prev;
      });
    }
  };

  const handleRemove = (val: string) => {
    onChange(value.filter((v) => v !== val));
    setSelectedOptions((prev) => prev.filter((p) => p.value !== val));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between min-h-10 h-auto py-1.5 px-3"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {value.length > 0 ? (
              value.map((val) => {
                const option =
                  selectedOptions.find((o) => o.value === val) ||
                  options.find((o) => o.value === val);
                return (
                  <Badge
                    variant="secondary"
                    key={val}
                    className="mr-1 mb-1 font-normal"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(val);
                    }}
                  >
                    {option?.label || val}
                    <X className="ml-1 h-3 w-3 hover:text-destructive cursor-pointer" />
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground font-normal">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="搜索..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                emptyMessage
              )}
            </CommandEmpty>
            <CommandGroup>
              {!loading &&
                options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
