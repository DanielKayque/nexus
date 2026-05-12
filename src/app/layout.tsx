import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus - Agente de IA para compra de computadores",
  description: "Nexus é um assistente virtual de IA que ajuda os usuários a tomar decisões informadas na compra de computadores e notebooks, oferecendo recomendações personalizadas com base em suas necessidades e orçamento.",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
