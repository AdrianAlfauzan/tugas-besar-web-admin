import type { NextApiRequest, NextApiResponse } from "next";
import { fetchSeminar } from "@/lib/firebase/service";

// Tipe untuk data student
type dataPelaksanaanSeminar = {
  nim: string; //
  judulPengumuman: string;
  deskripsiPengumuman: string;
  tanggal: string;
  waktu: string;
  namaPeserta: string;
  komentar: string;
  nilai: number;
};

// Tipe untuk response API
type ResponseData = {
  status: boolean;
  statusCode: number;
  dataSeminar: dataPelaksanaanSeminar[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    if (req.method === "GET") {
      // Mengambil data student
      const data = await fetchSeminar();

      // Kirim response dengan data student
      res.status(200).json({
        status: true,
        statusCode: 200,
        dataSeminar: data,
      });
    } else {
      // Metode selain GET tidak diizinkan
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Failed to fetch student data:", error);
    res.status(500).json({ status: false, statusCode: 500, dataSeminar: [] });
  }
}
