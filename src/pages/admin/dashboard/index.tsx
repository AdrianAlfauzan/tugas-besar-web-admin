import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Add as AddIcon } from "@mui/icons-material";

// MY LIBRARY
import { fetchAdmins } from "@/lib/firebase/service";

// MY UTILS
import AlertErrorForDashboard from "@/utils/AlertErrorForDashboard";
import AlertSuccessForDashboard from "@/utils/AlertSuccessForDashboard";

// MY HOOKS
import { useDeleteAdmin } from "@/hooks/useDeleteAdmin";
import useAddAdminDialog from "@/hooks/useAddAdminDialog";
// MY COMPONENTS
import AddAdminDialog from "@/pages/admin/dashboard/components/AddAdminDialog";
import AdminList from "@/pages/admin/dashboard/components/AdminList";

const AdminDashboardAdminPage = () => {
  const { data }: any = useSession();
  const { deleteAdminHandler, alertMessage, isSuccess } = useDeleteAdmin();
  const { openAddDialog, handleCloseAddDialog, handleOpenAddDialog, formData, setFormData } = useAddAdminDialog(); // Use the hook for managing dialog state and form data
  const [adminData, setAdminData] = useState<any[]>([]);
  const [position, setPosition] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = adminData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(adminData.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleClickOpenDialog = (admin: any) => {
    setSelectedAdmin(admin);
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin || !data?.user) return;

    try {
      await deleteAdminHandler(selectedAdmin.id, selectedAdmin.role, selectedAdmin.nidn, data.user.role, data.user.nidn);
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handleChangeDosen = (event: SelectChangeEvent) => {
    setPosition(event.target.value as string);
  };

  useEffect(() => {
    const fetchAdminList = async () => {
      try {
        const data = await fetchAdmins();
        setAdminData(data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };
    fetchAdminList();
  }, []);
  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Daftar Admin</h1>
          <h1 className="text-3xl font-semibold text-black">{data?.user?.fullname}</h1>
          <div className="flex items-center space-x-4">
            <Box sx={{ minWidth: 180 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="select-position" className="font-medium">
                  Jabatan Dosen
                </InputLabel>
                <Select labelId="select-position" id="select-position" value={position} label="Jabatan Dosen" onChange={handleChangeDosen}>
                  <MenuItem value="Dosen Pembimbing">Dosen Pembimbing</MenuItem>
                  <MenuItem value="Koordinator TA">Koordinator TA</MenuItem>
                  <MenuItem value="Dosen Penguji">Dosen Penguji</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
              Tambah Admin
            </Button>
            <AddAdminDialog open={openAddDialog} onClose={handleCloseAddDialog} formData={formData} setFormData={setFormData} /> {/* Pass hook state as props */}
            <Button variant="outlined" color="secondary" onClick={() => signOut()} className="rounded-lg px-6 py-2">
              Logout
            </Button>
          </div>
          {alertMessage && isSuccess !== null && (isSuccess ? <AlertSuccessForDashboard message={alertMessage} /> : <AlertErrorForDashboard message={alertMessage} />)}
        </div>

        <AdminList
          adminData={adminData} // lurutkan
          currentItems={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          handleClickOpenDialog={handleClickOpenDialog}
          paginate={paginate}
        />

        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>{"Apakah Anda Ingin Menghapus Data?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>Data ini mungkin bersifat sensitif. Anda yakin akan menghapus data ini?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="primary">
              Disagree
            </Button>
            <Button onClick={handleDeleteAdmin} color="secondary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AdminDashboardAdminPage;
