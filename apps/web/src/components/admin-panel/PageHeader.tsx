// apps/web/src/components/admin-panel/PageHeader.tsx
import { ReactNode } from "react";
import { CardDescription, CardTitle } from "../ui/card";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <>
      <div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>

      {action && <>{action}</>}
    </>
  );
}
