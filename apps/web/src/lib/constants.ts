// ===========================================
// COLORS - Identitas Kemenkeu/DJP
// ===========================================

export const colors = {
  primary: {
    DEFAULT: "#003366",
    light: "#0052A3",
    dark: "#00264D",
    50: "#E6EBF0",
    100: "#B3C2D1",
    500: "#003366",
    600: "#002D5C",
    700: "#002652",
  },
  secondary: {
    DEFAULT: "#D4AF37",
    light: "#E5C158",
    dark: "#B8952D",
  },
  background: {
    DEFAULT: "#FFFFFF",
    alt: "#F5F7FA",
  },
  text: {
    primary: "#1F2937",
    secondary: "#6B7280",
    muted: "#9CA3AF",
  },
  border: {
    DEFAULT: "#E5E7EB",
    light: "#F3F4F6",
  },
  status: {
    success: "#059669",
    error: "#DC2626",
    warning: "#D97706",
    info: "#0284C7",
  },
} as const;

// ===========================================
// APP CONFIG
// ===========================================

export const appConfig = {
  name: "Pusat Bantuan KPP Pratama Jakarta Kebayoran Baru Dua",
  shortName: "Help Center KPP KB2",
  description: "Pusat bantuan dan panduan layanan perpajakan",
  contact: {
    address:
      "Jl. Ciputat Raya No.2, Pondok Pinang, Kebayoran Lama, Jakarta Selatan 12310",
    phone: "(021) 7394951",
    email: "kpp.013@pajak.go.id",
    kringPajak: "1500200",
    website: "www.pajak.go.id",
    coretax: "coretaxdjp.pajak.go.id",
  },
} as const;

// ===========================================
// CATEGORY ICONS (Lucide)
// ===========================================

export const categoryIcons = [
  "Users",
  "FileText",
  "CreditCard",
  "Building",
  "Calculator",
  "ClipboardList",
  "Folder",
  "HelpCircle",
  "BookOpen",
  "FileSearch",
  "Receipt",
  "Landmark",
] as const;
