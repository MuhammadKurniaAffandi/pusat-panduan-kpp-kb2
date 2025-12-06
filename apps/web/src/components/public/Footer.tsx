import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import { appConfig } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">
              KPP Pratama Jakarta Kebayoran Baru Dua
            </h4>
            <div className="space-y-2 text-sm opacity-90">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{appConfig.contact.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{appConfig.contact.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{appConfig.contact.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Instagram className="w-4 h-4 flex-shrink-0" />
                <Link
                  href="https://www.instagram.com/pajakkebayoranbaru2"
                  target="_blank"
                >
                  <span>{appConfig.contact.instagram}</span>
                </Link>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Layanan Nasional</h4>
            <div className="space-y-2 text-sm opacity-90">
              <p>
                Kring Pajak: <strong>1500200</strong>
              </p>
              <p>
                Website: <strong>www.pajak.go.id</strong>
              </p>
              <p>
                Coretax: <strong>coretaxdjp.pajak.go.id</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-sm opacity-75 border-t border-white/20">
          © {currentYear} KPP Pratama Jakarta Kebayoran Baru Dua. Direktorat
          Jenderal Pajak.
        </div>
      </div>
    </footer>
  );
}
