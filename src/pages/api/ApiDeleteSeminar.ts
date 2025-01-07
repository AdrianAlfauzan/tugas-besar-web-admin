import type { NextApiRequest, NextApiResponse } from "next";
import { deleteSeminarByStudentId } from "@/lib/firebase/service"; // Import fungsi deleteSeminarByStudentId

type ResponseData = {
  status: boolean;
  statusCode: number;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    if (req.method === "POST") {
      const { nim } = req.body;

      if (!nim) {
        return res.status(400).json({ status: false, statusCode: 400, message: "NIM is required" });
      }

      // Menghapus seminar data berdasarkan nim
      const deletionResult = await deleteSeminarByStudentId(nim);

      if (deletionResult) {
        return res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Seminar data deleted successfully",
        });
      } else {
        return res.status(404).json({
          status: false,
          statusCode: 404,
          message: "No seminar data found for this nim",
        });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error deleting seminar data:", error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
}
