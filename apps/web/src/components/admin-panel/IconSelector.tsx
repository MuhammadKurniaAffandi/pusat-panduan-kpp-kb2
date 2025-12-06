// apps/web/src/components/admin-panel/IconSelector.tsx
"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryIcons } from "@/lib/constants";

interface IconSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function IconSelector({
  value,
  onValueChange,
  disabled,
}: IconSelectorProps) {
  // Render icon component dynamically
  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[
      iconName as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>;

    if (!IconComponent) {
      return <LucideIcons.HelpCircle className="h-4 w-4" />;
    }

    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih icon">
          {value && (
            <div className="flex items-center gap-2">
              {renderIcon(value)}
              <span>{value}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {categoryIcons.map((iconName) => (
          <SelectItem key={iconName} value={iconName}>
            <div className="flex items-center gap-2">
              {renderIcon(iconName)}
              <span>{iconName}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
