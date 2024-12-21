import type { NextApiRequest, NextApiResponse } from "next";
import { mengambilData } from "@/lib/firebase/service";

// Tipe untuk data produk
type GetUsers = {
  id: string;
  fullname: string;
  price: number;
  size: string;
};

// Tipe untuk response API
type ResponseData = {
  status: boolean;
  statusCode: number;
  dataGetUsers: GetUsers[]; // Ganti dengan tipe yang sesuai
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // Mengambil data produk
    const data = await mengambilData<GetUsers>("users");

    // Pastikan mengirim data dalam bentuk yang sesuai
    res.status(200).json({
      status: true,
      statusCode: 200,
      dataGetUsers: data, // Kirim data dengan properti dataGetUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, statusCode: 500, dataGetUsers: [] }); // Perbaiki kesalahan di dataGetUsers
  }
}
