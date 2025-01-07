import { useState } from "react";
import { addPelaksanaanSeminar } from "@/lib/firebase/service"; // Pastikan fungsi ini sudah diimpor

const useAddPelaksanaanSeminar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addSeminar = async (data: {
    nim: string; //
    judulPengumuman: string;
    deskripsiPengumuman: string;
    tanggal: string;
    waktu: string;
    namaPeserta: string;
    komentar: string;
    nilai: number;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await addPelaksanaanSeminar(data);
      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Gagal menambahkan atau memperbarui pelaksanaan seminar");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    addSeminar,
  };
};

export default useAddPelaksanaanSeminar;
