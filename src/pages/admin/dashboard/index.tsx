import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
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

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Add as AddIcon } from "@mui/icons-material";
import AddAdminDialog from "@/pages/admin/dashboard/components/AddAdminDialog";
import { fetchAdmins } from "@/lib/firebase/service"; // Assume you have a function to fetch admins
import AlertErrorForDashboard from "@/utils/AlertErrorForDashboard";
import AlertSuccessForDashboard from "@/utils/AlertSuccessForDashboard";
import { useDeleteAdmin } from "@/hooks/useDeleteAdmin";

const AdminDashboardAdminPage = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const { data }: any = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { deleteAdminHandler, alertMessage, isSuccess } = useDeleteAdmin();

  // State for dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    nidn: "",
    password: "",
    dosenPengajar: "",
    jabatanDosen: "",
    role: "",
  });

  // Admin data state
  const [adminData, setAdminData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the initial list of admins when the page loads
    const fetchAdminList = async () => {
      const data = await fetchAdmins();
      setAdminData(data);
    };
    fetchAdminList();
  }, []); // Empty array ensures this runs only once on component mount

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

  const handleClickOpenDialog = (admin: any) => {
    setSelectedAdmin(admin);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;
    await deleteAdminHandler(selectedAdmin.id, selectedAdmin.role, "Admin"); // Ganti dengan role admin yang login
    setOpenDialog(false); // Close dialog setelah aksi delete
  };

  const [position, setPosition] = React.useState("");
  const handleChangeDosen = (event: SelectChangeEvent) => {
    setPosition(event.target.value as string);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = adminData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(adminData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (!data) {
      console.warn("Session data is undefined");
      return;
    }

    const role = data?.user?.role;
    if (!role) {
      console.error("Role pengguna tidak tersedia");
    } else {
      console.log(`Role pengguna saat ini: ${role}`);
    }
  }, [data]);

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Daftar Admin</h1>

          <h1 className="text-3xl font-semibold text-black">{data && data?.user?.fullname}</h1>
          <div className="flex items-center space-x-4">
            {/* Jabatan Dosen Dropdown */}
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

            {/* Add Admin Button */}
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
              Tambah Admin
            </Button>

            {/* Add Admin Dialog */}
            <AddAdminDialog
              open={openAddDialog} //luruskan
              onClose={handleCloseAddDialog}
              formData={formData}
              setFormData={setFormData}
            />

            {/* Logout Button */}
            <Button variant="outlined" color="secondary" onClick={() => signOut()} className="rounded-lg px-6 py-2">
              Logout
            </Button>
          </div>
          {alertMessage && isSuccess !== null && (isSuccess ? <AlertSuccessForDashboard message={alertMessage} /> : <AlertErrorForDashboard message={alertMessage} />)}
        </div>

        {/* Admin List Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <Grid container spacing={0} className="border-b border-gray-200">
            <Grid size={2} className="py-4 bg-yellow-300 text-center font-semibold text-gray-700">
              NIDN
            </Grid>
            <Grid size={3} className="py-4 text-center font-semibold text-gray-700">
              Nama Dosen
            </Grid>
            <Grid size={2} className="py-4 text-center font-semibold text-gray-700">
              Dosen Pengajar
            </Grid>
            <Grid size={3} className="py-4 text-center font-semibold text-gray-700">
              Jabatan Dosen
            </Grid>
            <Grid size={2} className="py-4 text-center font-semibold text-gray-700">
              Action
            </Grid>
          </Grid>

          {adminData.length === 0 ? (
            <div className="text-center py-6 text-gray-600">Tidak Ada data disini</div>
          ) : (
            currentItems.map((admin) => (
              <Grid key={admin.id} container className="border-b border-gray-100 hover:bg-gray-50">
                <Grid size={2} className="py-4 text-center text-gray-800">
                  {admin.nidn}
                </Grid>
                <Grid size={3} className="py-4 text-center text-gray-800">
                  {admin.fullname}
                </Grid>
                <Grid size={2} className="py-4 text-center text-gray-800">
                  {admin.dosenPengajar}
                </Grid>
                <Grid size={3} className="py-4 text-center text-gray-800">
                  {admin.jabatanDosen}
                </Grid>
                <Grid size={2} className="py-4 text-center">
                  <IconButton className="text-red-600  hover:text-red-800" aria-label="delete" onClick={() => handleClickOpenDialog(admin)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              </Grid>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 mt-6">
          <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"Apakah Anda Ingin Menghapus Data?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>Data ini mungkin bersifat sensitif. Anda yakin akan menghapus data ini?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
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
