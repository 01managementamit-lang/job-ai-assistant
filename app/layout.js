import "./globals.css";
export const metadata = { title: "JobAI Assistant", description: "Your AI Career Coach" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
