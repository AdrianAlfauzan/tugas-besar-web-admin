import type { NextApiRequest, NextApiResponse } from "next";
import { fetchAdmins } from "@/lib/firebase/service";

// Tipe untuk data admin
type AdminData = {
  id: string;
  fullname: string;
  role: string;
  nidn: string;
  email: string;
  dosenPengajar: string;
  jabatanDosen: string;
  password: string;
  image: string;
};

// Tipe untuk response API
type ResponseData = {
  status: boolean;
  statusCode: number;
  dataAdmins: AdminData[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    if (req.method === "GET") {
      // Mengambil data admin
      const data = await fetchAdmins();

      // Kirim response dengan data admin
      res.status(200).json({
        status: true,
        statusCode: 200,
        dataAdmins: data,
      });
    } else {
      // Metode selain GET tidak diizinkan
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    res.status(500).json({ status: false, statusCode: 500, dataAdmins: [] });
  }
}
