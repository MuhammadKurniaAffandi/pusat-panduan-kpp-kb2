"use client";

import { useState, useEffect } from "react";
import {
  useVerifyResetToken,
  useResetPassword,
} from "@/hooks/use-password-reset";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const {
    data: tokenData,
    isLoading: isVerifying,
    error: verifyError,
  } = useVerifyResetToken(token);
  const resetPassword = useResetPassword();

  // Validasi password match
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError("Password tidak cocok");
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (newPassword.length < 6) {
      setPasswordError("Password minimal 6 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Password tidak cocok");
      return;
    }

    resetPassword.mutate({
      token,
      newPassword,
    });
  };

  // Loading state saat verify token
  if (isVerifying) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Memverifikasi token...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state jika token invalid
  if (verifyError || !tokenData?.valid) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Token Tidak Valid
          </CardTitle>
          <CardDescription className="text-center">
            Link reset password tidak valid atau sudah kadaluarsa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Token reset password mungkin sudah digunakan atau sudah lebih dari
              1 jam. Silakan minta link reset password baru.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/forgot-password">Minta Link Baru</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Kembali ke Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Form reset password
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Buat password baru untuk akun{" "}
          <strong className="text-foreground">{tokenData.email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Baru */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={resetPassword.isPending}
                autoFocus
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={resetPassword.isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {newPassword && newPassword.length < 6 && (
              <p className="text-xs text-destructive">
                Password minimal 6 karakter
              </p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ketik ulang password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={resetPassword.isPending}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={resetPassword.isPending}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {passwordError}
              </p>
            )}
            {confirmPassword &&
              newPassword === confirmPassword &&
              newPassword.length >= 6 && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Password cocok
                </p>
              )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              resetPassword.isPending ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword ||
              newPassword.length < 6
            }
          >
            {resetPassword.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mereset Password...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Reset Password
              </>
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Kembali ke Login
            </Link>
          </div>
        </form>

        {/* Security Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🔒 Keamanan:</strong> Setelah reset password, Anda akan
            logout dari semua perangkat dan perlu login ulang.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
