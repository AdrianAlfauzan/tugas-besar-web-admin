import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SidebarAdmin from "@/components/Sidebar";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import Custom404 from "@/pages/404"; // Import halaman 404 (opsional jika ingin dibandingkan)

const disableNavbar = ["/"];

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { pathname } = useRouter();

  // Cek apakah halaman adalah 404
  const is404Page = Component === Custom404;

  return (
    <SessionProvider session={session}>
      {!disableNavbar.includes(pathname) && !is404Page && <SidebarAdmin />}
      <Component {...pageProps} />
    </SessionProvider>
  );
}
