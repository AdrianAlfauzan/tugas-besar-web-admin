import { NextApiRequest, NextApiResponse } from "next";
import { deleteStudent } from "@/lib/firebase/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ status: false, message: "Student ID is required" });
    }

    try {
      const result = await deleteStudent(studentId);
      if (result.success) {
        return res.status(200).json({ status: true, message: result.message });
      } else {
        return res.status(500).json({ status: false, message: result.message });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: "Error deleting student" });
    }
  } else {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }
}
