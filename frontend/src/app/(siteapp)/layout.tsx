import { HeaderSiteApp } from "@/components/HeaderSiteApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowCare - Portal del Paciente",
  description: "Gestiona tu salud de manera eficiente",
};

export default function SiteAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSiteApp />

      {/* Main Content */}
      
        {children}
      
      
    </div>
  );
}
