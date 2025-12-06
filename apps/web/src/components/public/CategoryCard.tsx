import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  articleCount: number;
}

export function CategoryCard({
  name,
  slug,
  description,
  icon,
  articleCount,
}: CategoryCardProps) {
  // Get icon dynamically
  const IconComponent = (icon && Icons[icon as keyof typeof Icons]) as
    | LucideIcon
    | undefined;
  const FallbackIcon = Icons.Folder;
  const DisplayIcon = IconComponent || FallbackIcon;

  return (
    <Link href={`/bantuan/${slug}`}>
      <div className="bg-white p-6 rounded-xl border border-border cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary-light group h-full">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
            <DisplayIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base mb-1 group-hover:text-primary-light transition-colors truncate">
              {name}
            </h4>
            <p className="text-sm text-text-secondary mb-2 line-clamp-2">
              {description || "Klik untuk melihat informasi layanan"}
            </p>
            <span className="text-xs px-2 py-1 rounded-full bg-background-alt text-text-secondary">
              {articleCount} Informasi layanan
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
