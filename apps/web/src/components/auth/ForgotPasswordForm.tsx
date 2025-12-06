"use client";

import { useState } from "react";
import { useForgotPassword } from "@/hooks/use-password-reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const forgotPassword = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi email
    if (!email || !email.includes("@")) {
      return;
    }

    forgotPassword.mutate({ email });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Lupa Password?</CardTitle>
        <CardDescription className="text-center">
          Masukkan email Anda dan kami akan mengirimkan tautan untuk reset
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@kpp-kb2.go.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={forgotPassword.isPending}
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={forgotPassword.isPending || !email}
          >
            {forgotPassword.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim Email...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Kirim Link Reset Password
              </>
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Login
            </Link>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>📧 Info:</strong> Email akan dikirim jika alamat terdaftar
            di sistem. Periksa inbox dan folder spam Anda.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
