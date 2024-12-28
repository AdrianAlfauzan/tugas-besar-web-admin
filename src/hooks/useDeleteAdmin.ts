import { useState } from "react";
import { fetchAdmins, deleteAdmin } from "@/lib/firebase/service";

interface UseDeleteAdminResult {
  deleteAdminHandler: (
    selectedAdminId: string,
    selectedAdminRole: string,
    selectedAdminNidn: string, // Tambah parameter NIDN admin yang akan dihapus
    currentUserRole: string,
    currentUserNidn: string // NIDN user yang sedang login
  ) => Promise<any>;
  alertMessage: string | null;
  isSuccess: boolean | null;
}

export const useDeleteAdmin = (): UseDeleteAdminResult => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const clearAlert = () => {
    setAlertMessage(null);
    setIsSuccess(null);
  };

  const deleteAdminHandler = async (
    selectedAdminId: string,
    selectedAdminRole: string,
    selectedAdminNidn: string, // NIDN admin yang akan dihapus
    currentUserRole: string,
    currentUserNidn: string // NIDN user yang sedang login
  ): Promise<any> => {
    // Mencegah penghapusan diri sendiri
    if (selectedAdminNidn === currentUserNidn) {
      setAlertMessage("Anda tidak dapat menghapus akun Anda sendiri.");
      setIsSuccess(false);
      setTimeout(clearAlert, 3000);
      return;
    }

    // Prevent deletion of the Super Admin by non-super admin
    if (selectedAdminRole === "Super Admin" && currentUserRole !== "Super Admin") {
      setAlertMessage("Anda tidak dapat menghapus Super Admin.");
      setIsSuccess(false);
      setTimeout(clearAlert, 3000);
      return;
    }

    // Proceed with deletion if the user has permissions
    if (currentUserRole === "Super Admin" || currentUserRole === "Admin") {
      try {
        const response = await deleteAdmin(selectedAdminId);

        if (response.success) {
          const updatedAdminData = await fetchAdmins();
          setAlertMessage("Admin berhasil dihapus.");
          setIsSuccess(true);
          setTimeout(clearAlert, 3000);
          return updatedAdminData;
        } else {
          setAlertMessage(response.message || "Terjadi kesalahan saat menghapus admin.");
          setIsSuccess(false);
          setTimeout(clearAlert, 3000);
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        setAlertMessage("Terjadi kesalahan yang tidak diharapkan.");
        setIsSuccess(false);
        setTimeout(clearAlert, 3000);
      }
    } else {
      setAlertMessage("Anda tidak memiliki izin yang diperlukan untuk menghapus admin.");
      setIsSuccess(false);
      setTimeout(clearAlert, 3000);
    }
  };

  return { deleteAdminHandler, alertMessage, isSuccess };
};
