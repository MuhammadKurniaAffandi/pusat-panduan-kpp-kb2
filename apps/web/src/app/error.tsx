"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h2>
      <p className="text-muted-foreground mb-6">
        Mohon maaf, terjadi kesalahan.
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  );
}
