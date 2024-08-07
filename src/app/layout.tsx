import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 Next.js 앱",
  description: "Create Next App으로 생성된 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-cookierun">
        <div className="p-10">{children}</div>
      </body>
    </html>
  );
}
