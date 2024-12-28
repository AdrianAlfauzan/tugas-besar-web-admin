// useAddAdminDialog.ts
import { useState } from "react";

const useAddAdminDialog = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    nidn: "",
    password: "",
    dosenPengajar: "",
    jabatanDosen: "",
    role: "",
  });

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setFormData({
      email: "",
      fullname: "",
      nidn: "",
      password: "",
      dosenPengajar: "",
      jabatanDosen: "",
      role: "",
    });
  };

  const handleOpenAddDialog = () => setOpenAddDialog(true);

  return {
    openAddDialog,
    handleCloseAddDialog,
    handleOpenAddDialog,
    formData,
    setFormData,
  };
};

export default useAddAdminDialog;
