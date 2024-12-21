import type { NextApiRequest, NextApiResponse } from "next";
import { mengambilData } from "@/lib/firebase/service";

// Tipe untuk data produk
type Product = {
  id: string;
  name: string;
  price: number;
  size: string;
};

// Tipe untuk response API
type ResponseData = {
  status: boolean;
  statusCode: number;
  dataProduct: Product[]; // Ganti dengan tipe yang sesuai
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // Mengambil data produk
    const data = await mengambilData<Product>("products");

    // Pastikan mengirim data dalam bentuk yang sesuai
    res.status(200).json({
      status: true,
      statusCode: 200,
      dataProduct: data, // Kirim data dengan properti dataProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, statusCode: 500, dataProduct: [] }); // Perbaiki kesalahan di dataProduct
  }
}
