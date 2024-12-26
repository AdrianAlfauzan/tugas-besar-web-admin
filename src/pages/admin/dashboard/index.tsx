import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
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
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Add as AddIcon } from "@mui/icons-material";
import AddAdminDialog from "@/pages/admin/dashboard/components/AddAdminDialog";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminDashboardAdminPage = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const { data }: any = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // State untuk dialog tambah admin
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  // State untuk form input
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    nidn: "",
    password: "",
    dosenPengajar: "",
    jabatanDosen: "",
    role: "",
  });

  // Handler untuk menu tambah admin
  const handleOpenMenu = (event: any) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenAddDialog = (role: any) => {
    setSelectedRole(role);
    setOpenAddDialog(true);
    handleCloseMenu();
  };

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

  const handleSubmit = () => {
    console.log("Submitted data: ", formData);
    handleCloseAddDialog();
  };
  const handleClickOpenDialog = (admin: any) => {
    setSelectedAdmin(admin);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [position, setPosition] = React.useState("");
  const handleChangeDosen = (event: SelectChangeEvent) => {
    setPosition(event.target.value as string);
  };

  const adminData = [
    { id: 1, nidn: "1234545", name: "Adrian Kurniawan", dosenPengajar: "DSE", jabatanDosen: "Dosen Pembimbing" },
    { id: 2, nidn: "097823", name: "Adrian Musa Alfauzan", dosenPengajar: "AIG", jabatanDosen: "Dosen Pembimbing" },
    { id: 3, nidn: "2250081020", name: "Adrian Alfauzan", dosenPengajar: "DSE", jabatanDosen: "Dosen Penguji" },
    { id: 4, nidn: "2250081021", name: "Adrian Alfauzan", dosenPengajar: "DSE", jabatanDosen: "Dosen Penguji" },
    { id: 5, nidn: "2250081022", name: "Adrian Alfauzan", dosenPengajar: "DSE", jabatanDosen: "Dosen Koordinator TA" },
    { id: 6, nidn: "2250081023", name: "Adrian Alfauzan", dosenPengajar: "DSE", jabatanDosen: "Dosen Koordinator TA" },
    { id: 7, nidn: "2250081020", name: "Adrian Alfauzan", dosenPengajar: "DSE", jabatanDosen: "Dosen Koordinator TA" },
  ];

  const handleDeleteAdmin = () => {
    console.log("Deleting Admin:", selectedAdmin);
    setOpenDialog(false);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = adminData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(adminData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-100 min-h-screen ">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Daftar Admin</h1>
        <h1 className="text-3xl font-semibold text-black">{data && data?.user?.fullname}</h1>
        <div className="flex items-center space-x-4">
          {/* Role Filter Dropdown */}
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
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenMenu}>
            Tambah Admin
          </Button>

          {/* Menu Tambah Admin */}
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleOpenAddDialog("Dosen Pembimbing")}>Dosen Pembimbing</MenuItem>
            <MenuItem onClick={() => handleOpenAddDialog("Koordinator TA")}>Koordinator TA</MenuItem>
            <MenuItem onClick={() => handleOpenAddDialog("Dosen Penguji")}>Dosen Penguji</MenuItem>
          </Menu>

          {/* Add Admin Dialog */}
          <AddAdminDialog
            open={openAddDialog} //luruskan
            onClose={handleCloseAddDialog}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            selectedRole={selectedRole}
          />

          {/* Logout Button */}
          <Button variant="outlined" color="secondary" onClick={() => signOut()} className="rounded-lg px-6 py-2">
            Logout
          </Button>
        </div>
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

        {currentItems.map((admin) => (
          <Grid key={admin.id} container className="border-b border-gray-100 hover:bg-gray-50">
            <Grid size={2} className="py-4 text-center text-gray-800">
              {admin.nidn}
            </Grid>
            <Grid size={3} className="py-4 text-center text-gray-800">
              {admin.name}
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
        ))}
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
      <Dialog open={openDialog} TransitionComponent={Transition} keepMounted onClose={handleCloseDialog} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Apakah Anda Ingin Menghapus Data?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Data ini mungkin bersifat sensitif. Anda yakin akan menghapus data ini?</DialogContentText>
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
  );
};

export default AdminDashboardAdminPage;
