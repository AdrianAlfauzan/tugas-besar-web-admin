// hooks/useProfileAdmin.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SelectChangeEvent } from "@mui/material/Select";
import { updateProfile, getUserData } from "@/lib/firebase/service";

export const useProfileAdmin = () => {
  const { data }: any = useSession();
  const [formData, setFormData] = useState({
    email: data?.user?.email || "",
    fullname: data?.user?.fullname || "",
    nidn: data?.user?.nidn || "",
    password: data?.user?.password || "",
    dosenPengajar: data?.user?.dosenPengajar || "",
    jabatanDosen: data?.user?.jabatanDosen || "",
    role: data?.user?.role || "",
  });

  const [jabatanDosen, setJabatanDosen] = useState(formData.jabatanDosen);
  const [dosenPengajar, setDosenPengajar] = useState(formData.dosenPengajar);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeRole = (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      role: event.target.value as string,
    });
  };

  const handleChangeDosen = (event: SelectChangeEvent) => {
    setJabatanDosen(event.target.value as string);
  };

  const handleChangeDosenPengajar = (event: SelectChangeEvent) => {
    setDosenPengajar(event.target.value as string);
  };

  const refreshUserData = async () => {
    try {
      const updatedUser = await getUserData(data?.user?.nidn);
      const mappedUser = {
        email: updatedUser.email || "",
        fullname: updatedUser.fullname || "",
        nidn: updatedUser.nidn || "",
        password: updatedUser.password || "",
        dosenPengajar: updatedUser.dosenPengajar || "",
        jabatanDosen: updatedUser.jabatanDosen || "",
        role: updatedUser.role || "",
      };
      setFormData(mappedUser);
      setJabatanDosen(updatedUser.jabatanDosen);
      setDosenPengajar(updatedUser.dosenPengajar);
    } catch (error) {
      console.error("Error refreshing user data: ", error);
    }
  };

  const handleSubmit = async () => {
    const updatedData = {
      ...formData,
      jabatanDosen,
      dosenPengajar,
    };

    // Validation
    if (!formData.nidn) {
      setAlertType("error");
      setAlertMessage("NIDN is required.");
      return;
    }

    try {
      const result = await updateProfile(formData.nidn, updatedData);
      if (result.success) {
        setAlertType("success");
        setAlertMessage(result.message);
        refreshUserData();
      } else {
        setAlertType("error");
        setAlertMessage(result.message);
      }
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlertMessage("An error occurred while updating profile.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const updatedUser = await getUserData(data?.user?.nidn);
      setFormData(updatedUser);
      setJabatanDosen(updatedUser.jabatanDosen);
      setDosenPengajar(updatedUser.dosenPengajar);
    };

    if (data?.user?.nidn) {
      fetchUserData();
    }
  }, [data?.user?.nidn]);

  return {
    formData,
    jabatanDosen,
    dosenPengajar,
    alertMessage,
    alertType,
    handleChange,
    handleChangeRole,
    handleChangeDosen,
    handleChangeDosenPengajar,
    handleSubmit,
  };
};
