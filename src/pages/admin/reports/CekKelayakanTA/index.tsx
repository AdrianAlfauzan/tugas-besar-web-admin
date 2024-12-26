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
import { motion } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminDaftarKelayakanTA = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false); // Added state for second dialog
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<any | null>(null);
  const [statusKelayakan, setStatusKelayakan] = useState("");
  const [years, setYears] = useState("");

  const { data }: any = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleClickOpenDialog = (mahasiswa: any) => {
    setSelectedMahasiswa(mahasiswa);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUploadModal = (mahasiswa: any) => {
    setSelectedMahasiswa(mahasiswa);
    setOpenUploadModal(true); // Open the second dialog for upload
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false); // Close the upload modal
  };
  const mahasiswaData = [
    { id: 1, nim: "1234545", name: "Adrian Kurniawan", jurusanMahasiswa: "Informatika" },
    { id: 2, nim: "097823", name: "Adrian Musa Alfauzan", jurusanMahasiswa: "Informatika" },
    { id: 3, nim: "2250081020", name: "Adrian Alfauzan", jurusanMahasiswa: "Informatika" },
    { id: 4, nim: "2250081021", name: "Adrian Alfauzan", jurusanMahasiswa: "Informatika" },
    { id: 5, nim: "2250081022", name: "Adrian Alfauzan", jurusanMahasiswa: "Informatika" },
    { id: 6, nim: "2250081023", name: "Adrian Alfauzan", jurusanMahasiswa: "Informatika" },
    { id: 7, nim: "2250081020", name: "Adrian Alfauzan", jurusanMahasiswa: "Informatika" },
  ];

  const handleDeleteMahasiswa = () => {
    console.log("Deleting mahasiswa:", selectedMahasiswa);
    setOpenDialog(false);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mahasiswaData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mahasiswaData.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleChangeKelayakan = (event: SelectChangeEvent) => {
    setStatusKelayakan(event.target.value as string);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setYears(event.target.value as string);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Daftar Kelayakan TA</h1>
        <h1 className="text-3xl font-semibold text-black">{data && data?.user?.fullname}</h1>
        <div className="flex items-center space-x-4">
          {/* Role Filter Dropdown */}
          <Box sx={{ minWidth: 180 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="select-year">Year</InputLabel>
              <Select labelId="select-year" id="select-year" value={years} label="Year" onChange={handleChange}>
                <MenuItem value={2020}>2020</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>

      {/* mahasiswa List Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <Grid container spacing={0} className="border-b border-gray-200">
          <Grid size={3} className="py-4 text-center font-semibold text-gray-700">
            NIM
          </Grid>
          <Grid size={3} className="py-4 text-center font-semibold text-gray-700">
            Nama Mahasiswa
          </Grid>
          <Grid size={3} className="py-4 text-center font-semibold text-gray-700">
            Jurusan Mahasiswa
          </Grid>
          <Grid size={3} className="py-4 text-center font-semibold text-gray-700">
            Action
          </Grid>
        </Grid>

        {currentItems.map((mahasiswa) => (
          <Grid key={mahasiswa.id} container className="border-b border-gray-100 hover:bg-gray-50">
            <Grid size={3} className="py-4 text-center text-gray-800">
              {mahasiswa.nim}
            </Grid>
            <Grid size={3} className="py-4 text-center text-gray-800">
              {mahasiswa.name}
            </Grid>
            <Grid size={3} className="py-4 text-center text-gray-800">
              {mahasiswa.jurusanMahasiswa}
            </Grid>
            <Grid size={3} className="py-4 text-center">
              <IconButton className="text-red-600  hover:text-red-800" aria-label="delete" onClick={() => handleClickOpenDialog(mahasiswa)}>
                <DeleteIcon color="error" />
              </IconButton>
              <IconButton className="p-0" aria-label="view" onClick={() => handleOpenUploadModal(mahasiswa)}>
                <VisibilityIcon />
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
          <Button onClick={handleDeleteMahasiswa} color="secondary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      {/* mahasiswa Role Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Dosen Pembimbing</MenuItem>
        <MenuItem onClick={handleClose}>Koordinator TA</MenuItem>
        <MenuItem onClick={handleClose}>Dosen Penguji</MenuItem>
      </Menu>

      {/* Upload Modal Dialog */}
      <Dialog open={openUploadModal} onClose={handleCloseUploadModal}>
        <motion.div
          className="text-black modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="modal-content bg-white p-8 rounded-lg w-96" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-center text-2xl mb-4">Hasil Upload Berkas</h2>
            <div className="mb-4">Hasil Uploaded Files Kartu Bimbingan</div>
            <div className="mb-4">Hasil Uploaded Surat</div>
            <div className="mb-4">Hasil Uploaded Proposal</div>

            <FormControl fullWidth margin="normal" sx={{ color: "black" }}>
              <InputLabel sx={{ color: "black" }}>Status Kelayakan</InputLabel>
              <Select className="border text-black focus:border-black " value={statusKelayakan} onChange={handleChangeKelayakan} label="Status Kelayakan">
                <MenuItem value="Ditolak">Maaf! Kelayakan Tugas Akhir Anda Ditolak.</MenuItem>
                <MenuItem value="Diterima">Selamat! Kelayakan Tugas Akhir Anda Diterima.</MenuItem>
              </Select>
            </FormControl>

            <div className="flex justify-between mt-6">
              <Button color="secondary" variant="contained" onClick={handleCloseUploadModal}>
                Batal
              </Button>
              <Button color="primary" variant="contained">
                Submit
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Dialog>
    </div>
  );
};

export default AdminDaftarKelayakanTA;
