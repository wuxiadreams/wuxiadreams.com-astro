import * as React from "react";
import {
  Settings2,
  Type,
  ArrowUpDown,
  Minus,
  Plus,
  AlignLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChapterSettingsProps {
  // Can be expanded to pass other props if needed
}

export function ChapterSettings({}: ChapterSettingsProps) {
  // State for settings
  const [fontSize, setFontSize] = React.useState<number>(18); // Default font size 18px
  const [lineHeight, setLineHeight] = React.useState<number>(1.8); // Default line height 1.8
  const [paragraphSpacing, setParagraphSpacing] = React.useState<number>(1.5); // Default paragraph spacing 1.5em

  // Load from local storage on mount
  React.useEffect(() => {
    const savedFontSize = localStorage.getItem("wd-chapter-font-size");
    const savedLineHeight = localStorage.getItem("wd-chapter-line-height");
    const savedParagraphSpacing = localStorage.getItem(
      "wd-chapter-paragraph-spacing",
    );

    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
    if (savedParagraphSpacing)
      setParagraphSpacing(Number(savedParagraphSpacing));
  }, []);

  // Update CSS variables and local storage when settings change
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--chapter-font-size",
      `${fontSize}px`,
    );
    document.documentElement.style.setProperty(
      "--chapter-line-height",
      `${lineHeight}`,
    );
    document.documentElement.style.setProperty(
      "--chapter-paragraph-spacing",
      `${paragraphSpacing}em`,
    );

    localStorage.setItem("wd-chapter-font-size", fontSize.toString());
    localStorage.setItem("wd-chapter-line-height", lineHeight.toString());
    localStorage.setItem(
      "wd-chapter-paragraph-spacing",
      paragraphSpacing.toString(),
    );
  }, [fontSize, lineHeight, paragraphSpacing]);

  // Handlers
  const increaseFontSize = (e: React.MouseEvent) => {
    e.preventDefault();
    setFontSize((prev) => Math.min(prev + 2, 32)); // Max 32px
  };

  const decreaseFontSize = (e: React.MouseEvent) => {
    e.preventDefault();
    setFontSize((prev) => Math.max(prev - 2, 12)); // Min 12px
  };

  const increaseLineHeight = (e: React.MouseEvent) => {
    e.preventDefault();
    setLineHeight((prev) => Math.min(prev + 0.2, 3.0)); // Max 3.0
  };

  const decreaseLineHeight = (e: React.MouseEvent) => {
    e.preventDefault();
    setLineHeight((prev) => Math.max(prev - 0.2, 1.2)); // Min 1.2
  };

  const increaseParagraphSpacing = (e: React.MouseEvent) => {
    e.preventDefault();
    setParagraphSpacing((prev) => Math.min(prev + 0.5, 4.0)); // Max 4.0em
  };

  const decreaseParagraphSpacing = (e: React.MouseEvent) => {
    e.preventDefault();
    setParagraphSpacing((prev) => Math.max(prev - 0.5, 0.5)); // Min 0.5em
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-10 items-center justify-center rounded-xl bg-secondary px-4 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
          aria-label="Chapter Settings"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel>Display Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Font Size Control */}
        <DropdownMenuGroup className="p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <Type className="mr-2 h-4 w-4" />
              Font Size
            </div>
            <span className="text-xs text-muted-foreground">{fontSize}px</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={decreaseFontSize}
              disabled={fontSize <= 12}
              className="flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={increaseFontSize}
              disabled={fontSize >= 32}
              className="flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Line Height Control */}
        <DropdownMenuGroup className="p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Line Height
            </div>
            <span className="text-xs text-muted-foreground">
              {lineHeight.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={decreaseLineHeight}
              disabled={lineHeight <= 1.2}
              className="flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={increaseLineHeight}
              disabled={lineHeight >= 3.0}
              className="flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Paragraph Spacing Control */}
        <DropdownMenuGroup className="p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <AlignLeft className="mr-2 h-4 w-4" />
              Spacing
            </div>
            <span className="text-xs text-muted-foreground">
              {paragraphSpacing.toFixed(1)}em
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={decreaseParagraphSpacing}
              disabled={paragraphSpacing <= 0.5}
              className="flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={increaseParagraphSpacing}
              disabled={paragraphSpacing >= 4.0}
              className="flex h-8 w-full items-center justify-center rounded-md border border-border bg-background hover:bg-muted disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
