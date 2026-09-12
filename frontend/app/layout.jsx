import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/motion/PageTransition";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800", "900"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "YumTreat | Food, Delivered With Flavor",
  description:
    "YumTreat is a modern food ordering experience — browse the menu, book a table, and get your favorites delivered hot and fast.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
