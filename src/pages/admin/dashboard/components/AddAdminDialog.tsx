import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { addAdmin } from "@/lib/firebase/service"; // Import fungsi addAdmin
import AlertErrorForDashboard from "@/utils/AlertErrorForDashboard";
import AlertSuccessForDashboard from "@/utils/AlertSuccessForDashboard";
import { useSession } from "next-auth/react";

const AddAdminDialog = ({ open, onClose, formData, setFormData }: any) => {
  const { data }: any = useSession(); // Mendapatkan data session
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  // Pastikan session tersedia dan memiliki data pengguna
  const selectedRole = data?.user?.role; // Role pengguna yang sedang login
  console.log("Role pengguna saat ini:", selectedRole); // Menampilkan role pengguna saat ini

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    console.log("Form data role yang ingin ditambahkan:", formData.role); // Menampilkan role yang dipilih pada form

    // Verifikasi bahwa admin biasa tidak bisa menambahkan Super Admin
    if (selectedRole === "Admin" && formData.role === "Super Admin") {
      setAlertMessage("Admin biasa tidak dapat menambahkan Super Admin");
      setIsSuccess(false);
      resetAlert();
      return;
    }

    // Verifikasi bahwa hanya Super Admin yang dapat menambahkan admin dengan role Super Admin
    if (formData.role === "Super Admin" && selectedRole !== "Super Admin") {
      setAlertMessage("Hanya Super Admin yang dapat menambahkan admin dengan role Super Admin");
      setIsSuccess(false);
      resetAlert();
      return;
    }

    const response = await addAdmin(formData, selectedRole); // Kirim role pengguna yang sedang login

    if (response.success) {
      setAlertMessage(response.message);
      setIsSuccess(true);
      resetAlert();
      onClose(); // Tutup dialog setelah berhasil
    } else {
      setAlertMessage(response.message);
      setIsSuccess(false);
      resetAlert();
    }
  };

  const resetAlert = () => {
    setTimeout(() => {
      setAlertMessage(null);
      setIsSuccess(null);
    }, 3000); // Reset setelah 3 detik
  };

  return (
    <>
      {alertMessage && isSuccess !== null && (isSuccess ? <AlertSuccessForDashboard message={alertMessage} /> : <AlertErrorForDashboard message={alertMessage} />)}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Tambah Admin - {selectedRole}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <TextField margin="dense" name="email" label="Email" type="email" fullWidth value={formData.email} onChange={handleChange} />
            <TextField margin="dense" name="fullname" label="Full Name" type="text" fullWidth value={formData.fullname} onChange={handleChange} />
            <TextField margin="dense" name="nidn" label="NIDN" type="text" fullWidth value={formData.nidn} onChange={handleChange} />
            <TextField margin="dense" name="password" label="Password" type="password" fullWidth value={formData.password} onChange={handleChange} />

            <FormControl fullWidth margin="dense" className="mb-4">
              <InputLabel id="select-dosenPengajar">Dosen Pengajar</InputLabel>
              <Select labelId="select-dosenPengajar" name="dosenPengajar" value={formData.dosenPengajar} onChange={handleChange} label="Dosen Pengajar">
                <MenuItem value="DSE">DSE</MenuItem>
                <MenuItem value="AIG">AIG</MenuItem>
                <MenuItem value="CYBER SECURITY">CYBER SECURITY</MenuItem>
              </Select>
            </FormControl>
            {/* Dropdown for Jabatan Dosen */}
            <FormControl fullWidth margin="dense">
              <InputLabel id="jabatanDosen-label">Jabatan Dosen</InputLabel>
              <Select labelId="jabatanDosen-label" name="jabatanDosen" value={formData.jabatanDosen} onChange={handleChange} label="Jabatan Dosen">
                <MenuItem value="Dosen Pembimbing">Dosen Pembimbing</MenuItem>
                <MenuItem value="Koordinator TA">Koordinator TA</MenuItem>
                <MenuItem value="Dosen Penguji">Dosen Penguji</MenuItem>
              </Select>
            </FormControl>

            {/* Dropdown untuk Role */}
            <FormControl fullWidth margin="dense">
              <InputLabel id="role-label">Role</InputLabel>
              <Select labelId="role-label" name="role" value={formData.role} onChange={handleChange}>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddAdminDialog;
