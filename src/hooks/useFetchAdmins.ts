// hooks/useFetchAdmins.ts
import { useState, useEffect } from "react";

// Definisikan tipe untuk data admin
type Admin = {
  id: string;
  fullname: string;
  role: string;
  nidn: string;
  email: string;
  dosenPengajar: string;
  jabatanDosen: string;
  password: string;
  image: string;
};

export const useFetchAdmins = () => {
  const [adminData, setAdminData] = useState<Admin[]>([]);

  useEffect(() => {
    const fetchAdminList = async () => {
      try {
        const response = await fetch("/api/ApiGetAdmins");
        const data = await response.json();
        if (response.ok && data.status) {
          setAdminData(data.dataAdmins);
        } else {
          console.error("Failed to fetch admin data");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminList();
  }, []);

  return { adminData };
};
