"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TestAPIPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await api.get("/public/categories");
        setData(response.data);
        setStatus("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    };

    testAPI();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>

      {status === "loading" && <p>Loading...</p>}

      {status === "success" && (
        <div className="bg-green-50 p-4 rounded">
          <p className="text-green-600 font-bold">✅ API Connected!</p>
          <pre className="mt-4 bg-white p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 p-4 rounded">
          <p className="text-red-600 font-bold">❌ API Connection Failed</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
