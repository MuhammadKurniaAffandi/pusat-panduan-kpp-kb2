import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="bg-background-alt">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-1 text-primary-light hover:underline"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-primary-light hover:underline truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-secondary truncate max-w-[150px] sm:max-w-xs">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
