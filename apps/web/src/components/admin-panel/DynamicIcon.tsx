// apps/web/src/components/admin-panel/DynamicIcon.tsx
import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  iconName?: string;
  className?: string;
  fallback?: keyof typeof LucideIcons;
}

export function DynamicIcon({
  iconName,
  className = "h-4 w-4",
  fallback = "Folder",
}: DynamicIconProps) {
  const IconComponent = (
    iconName
      ? LucideIcons[iconName as keyof typeof LucideIcons]
      : LucideIcons[fallback]
  ) as React.ComponentType<{ className?: string }>;

  if (!IconComponent) {
    const FallbackIcon = LucideIcons[fallback] as React.ComponentType<{
      className?: string;
    }>;
    return <FallbackIcon className={className} />;
  }

  return <IconComponent className={className} />;
}
