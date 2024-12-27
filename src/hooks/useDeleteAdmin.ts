import { useState } from "react";
import { fetchAdmins, deleteAdmin } from "@/lib/firebase/service"; // Sesuaikan dengan import yang benar

interface UseDeleteAdminResult {
  deleteAdminHandler: (selectedAdminId: string, selectedAdminRole: string, currentUserRole: string) => Promise<any>;
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

  const deleteAdminHandler = async (selectedAdminId: string, selectedAdminRole: string, currentUserRole: string): Promise<any> => {
    // Prevent deletion of the Super Admin by non-super admin
    if (selectedAdminRole === "Super Admin" && currentUserRole !== "Super Admin") {
      setAlertMessage("You cannot delete the Super Admin.");
      setIsSuccess(false); // Error message
      setTimeout(clearAlert, 3000);
      return;
    }

    // Proceed with deletion if the user has permissions
    if (currentUserRole === "Super Admin" || currentUserRole === "Admin") {
      try {
        const response = await deleteAdmin(selectedAdminId);

        if (response.success) {
          const updatedAdminData = await fetchAdmins();
          setAlertMessage("Admin has been successfully deleted.");
          setIsSuccess(true); // Success message
          setTimeout(clearAlert, 3000);
          return updatedAdminData; // Mengembalikan data admin yang diperbarui
        } else {
          setAlertMessage(response.message || "An error occurred while deleting the admin.");
          setIsSuccess(false); // Error message
          setTimeout(clearAlert, 3000);
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        setAlertMessage("An unexpected error occurred.");
        setIsSuccess(false);
        setTimeout(clearAlert, 3000);
      }
    } else {
      setAlertMessage("You do not have the necessary permissions to delete an admin.");
      setIsSuccess(false); // Error message
      setTimeout(clearAlert, 3000);
    }
  };

  return { deleteAdminHandler, alertMessage, isSuccess };
};
