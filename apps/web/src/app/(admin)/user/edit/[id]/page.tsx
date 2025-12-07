// Ini adalah Server Component (default)
"use client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { UserFormWrapper } from "@/components/admin-panel/user-components/UserFormWrapper";
import { useParams } from "next/navigation";
// interface EditUserPageProps {
//   params: {
//     id: string; // ID dijamin string karena diakses di Server Component
//   };
// }

export default function EditUserPage() {
  //  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  // const { id } = params; // Akses params.id di Server Component (Tidak ada error promise)

  // Kita gunakan Suspense untuk fallback yang lebih baik saat fetching data
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      {/* Pass ID ke Client Component Wrapper */}
      <UserFormWrapper userId={id} fullName="User" />
    </Suspense>
  );
}
