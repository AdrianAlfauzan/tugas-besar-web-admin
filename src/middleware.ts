import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Rute yang memerlukan login dan role admin
  const adminRoutes = ["/admin", "/admin/beranda", "/admin/dashboard", "/admin/DaftarMahasiswa", "/admin/report", "/admin/reports/CekKelayakanTA", "/admin/reports/PelaksanaanSeminar"];

  // Mendapatkan token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Jika tidak ada token dan rute membutuhkan login, arahkan ke halaman login
  if (!token && adminRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url)); // Ganti "/" dengan rute login Anda
  }

  // Jika ada token, periksa role admin
  if (token && adminRoutes.includes(pathname)) {
    const adminRole = token.role; // Asumsikan role disimpan dalam token (sesuaikan dengan struktur token Anda)

    if (adminRole !== "admin") {
      // Jika user bukan admin, arahkan ke halaman lain, misalnya halaman beranda
      return NextResponse.redirect(new URL("/", req.url)); // Ganti "/unauthorized" dengan halaman yang sesuai
    }
  }

  // Jika token ada dan role sesuai, atau rute tidak memerlukan login, lanjutkan
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/beranda", "/admin/dashboard", "/admin/DaftarMahasiswa", "/admin/reports", "/admin/reports/CekKelayakanTA", "/admin/reports/PelaksanaanSeminar"], // Halaman yang diproteksi
};
