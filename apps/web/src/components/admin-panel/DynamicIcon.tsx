import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  iconName?: string;
  className?: string;
  fallback?: keyof typeof LucideIcons;
}

export function DynamicIcon({
  iconName,
  className = "h-4 w-4",
  // fallback = "Folder",
}: DynamicIconProps) {
  const IconComponent = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ComponentType<{ className?: string }>;

  if (!IconComponent) {
    return <LucideIcons.HelpCircle className="h-4 w-4" />;
  }

  return <IconComponent className={className} />;
}
