import "reactflow/dist/style.css";
import "./globals.css";

export const metadata = {
  title: "Mindmap AI",
  description: "Hybrid mindmap app with AI assistance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
