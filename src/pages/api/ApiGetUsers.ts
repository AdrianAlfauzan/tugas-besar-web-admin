import type { NextApiRequest, NextApiResponse } from "next";
import { fetchStudents } from "@/lib/firebase/service";

// Tipe untuk data student
type studentData = {
  id: string;
  fullname: string;
  jurusan: string;
  nim: string;
  password: string;
  role: string;
  image: string;
};

// Tipe untuk response API
type ResponseData = {
  status: boolean;
  statusCode: number;
  dataStudents: studentData[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    if (req.method === "GET") {
      // Mengambil data student
      const data = await fetchStudents();

      // Kirim response dengan data student
      res.status(200).json({
        status: true,
        statusCode: 200,
        dataStudents: data,
      });
    } else {
      // Metode selain GET tidak diizinkan
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Failed to fetch student data:", error);
    res.status(500).json({ status: false, statusCode: 500, dataStudents: [] });
  }
}
