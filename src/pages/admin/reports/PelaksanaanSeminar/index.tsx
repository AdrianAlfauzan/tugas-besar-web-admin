import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
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
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { TextField, Typography } from "@mui/material";

// MY COMPONENTS
import StudentList from "@/pages/admin/reports/PelaksanaanSeminar/components/StudentsList";

// MY UTILS
import AlertErrorForDashboard from "@/utils/AlertErrorForDashboard";
import AlertSuccessForDashboard from "@/utils/AlertSuccessForDashboard";

// MY HOOKS
import useAddPelaksanaanSeminar from "@/hooks/useAddPelaksanaanSeminar";

const AdminPelaksanaanSeminar = () => {
  const { loading, error, success, addSeminar } = useAddPelaksanaanSeminar();
  const [studentsData, setStudentsData] = useState<any[]>([]); // State to hold student data
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Store the student to delete
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete dialog
  const [openViewDialog, setOpenViewDialog] = useState(false); // State for view dialog
  const [openViewDialogData, setOpenViewDialogData] = useState(false); // State for view dialog

  // States for alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [years, setYears] = useState("");
  const { data }: any = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleClickOpenViewDialog = (student: any) => {
    setSelectedStudent(student); // Store the selected student details
    setOpenViewDialog(true); // Open the view dialog
  };
  const handleClickCloseViewDialog = () => {
    setOpenViewDialog(false); // Close the view dialog
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = studentsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(studentsData.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchStudentsList = async () => {
      try {
        const response = await fetch("/api/ApiGetUsers");
        const data = await response.json();
        if (response.ok && data.status) {
          setStudentsData(data.dataStudents);
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      }
    };

    fetchStudentsList();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setYears(event.target.value as string);
  };

  // DELETE
  const handleClickOpenDeleteDialog = (student: any) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
  };
  const handleClickCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  const handleDeleteStudents = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch("/api/ApiDeleteStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: selectedStudent.id }),
      });

      const data = await response.json();

      if (data.status) {
        setStudentsData(studentsData.filter((student) => student.id !== selectedStudent.id));
        setOpenDeleteDialog(false);
        setAlertMessage("Data berhasil dihapus.");
        setIsSuccess(true);
      } else {
        setAlertMessage("Gagal menghapus data. Coba lagi.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      setAlertMessage("Terjadi kesalahan saat menghapus data. Coba lagi nanti.");
      setIsSuccess(false);
    } finally {
      setTimeout(() => {
        setAlertMessage("");
        setIsSuccess(false);
      }, 3000);
    }
  };

  const [formData, setFormData] = useState({
    namaPeserta: selectedStudent?.fullname || "",
    nim: selectedStudent?.nim || "", // Add nim here
    judulPengumuman: "",
    deskripsiPengumuman: "",
    tanggal: "",
    waktu: "",
    komentar: "",
    nilai: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (selectedStudent) {
      setFormData((prevData) => ({
        ...prevData,
        namaPeserta: selectedStudent.fullname || "",
        nim: selectedStudent.nim || "", // Update nim when selectedStudent changes
      }));
    }
  }, [selectedStudent]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Data yang dikirim:", formData);

    try {
      setOpenViewDialog(false); // Tutup dialog
      await addSeminar(formData); // Simpan data

      setIsSuccess(true); // Set keberhasilan
      setAlertMessage("Data Berhasil terkirim!"); // Set pesan sukses
    } catch (error) {
      console.error("Gagal submit form:", error);

      setIsSuccess(false); // Set kegagalan
      setAlertMessage("Terjadi kesalahan saat menyimpan data!"); // Set pesan error
    } finally {
      // Clear alert setelah beberapa detik
      setTimeout(() => {
        setAlertMessage(null);
        setIsSuccess(null);
      }, 3000); // 3 detik
    }
  };

  const handleClickOpenViewDialogData = (student: any) => {
    setSelectedStudent(student);
    setOpenViewDialogData(true);
  };
  const handleClickCloseViewDialogData = () => {
    setOpenViewDialogData(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Daftar Pelaksanaan Seminar</h1>
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

      {/* Alert rendering */}
      {alertMessage &&
        isSuccess !== null &&
        (isSuccess ? ( // luruskan
          <AlertSuccessForDashboard message={alertMessage} />
        ) : (
          <AlertErrorForDashboard message={alertMessage} />
        ))}

      <StudentList
        studentsData={studentsData}
        currentItems={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        handleClickOpenDeleteDialog={handleClickOpenDeleteDialog}
        handleClickOpenViewDialog={handleClickOpenViewDialog}
        handleClickOpenViewDialogData={handleClickOpenViewDialogData}
        paginate={paginate}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleClickCloseDeleteDialog}>
        <DialogTitle>{"Apakah Anda Ingin Menghapus Data?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Data ini mungkin bersifat sensitif. Anda yakin akan menghapus data ini?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickCloseDeleteDialog} color="primary">
            Tidak
          </Button>
          <Button onClick={handleDeleteStudents} color="secondary">
            Ya
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewDialog} onClose={handleClickCloseViewDialog}>
        <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <motion.div
            className="relative bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-3/4 lg:w-2/3 space-y-6"
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          >
            <Typography variant="h4" className="font-bold text-center text-gray-800 mb-6">
              Kelola Seminar - {selectedStudent?.fullname} - {selectedStudent?.nim}
            </Typography>
            {/* Alert rendering */}
            {alertMessage &&
              isSuccess !== null &&
              (isSuccess ? ( // luruskan
                <AlertSuccessForDashboard message={alertMessage} />
              ) : (
                <AlertErrorForDashboard message={alertMessage} />
              ))}

            {/* Combined Form */}
            <motion.div className="p-4 bg-white shadow-md rounded-lg space-y-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Grid container spacing={2} className="space-y-4">
                {/* Mahasiswa Section */}
                <Grid item xs={12}>
                  <Typography variant="h5" className="font-semibold">
                    Mahasiswa
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="Nama Peserta" value={formData.namaPeserta} fullWidth variant="outlined" disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="NIM" value={selectedStudent?.nim || ""} fullWidth variant="outlined" disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="Email" value={selectedStudent?.email || ""} fullWidth variant="outlined" disabled />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} sm={6}>
                  <TextField label="Judul Pengumuman" fullWidth variant="outlined" name="judulPengumuman" onChange={handleInputChange} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="Deskripsi Pengumuman" fullWidth variant="outlined" multiline rows={1} name="deskripsiPengumuman" value={formData.deskripsiPengumuman} onChange={handleInputChange} />
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" type="date" label="Tanggal Seminar" name="tanggal" value={formData.tanggal} onChange={handleInputChange} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" type="time" label="Waktu Seminar" name="waktu" value={formData.waktu} onChange={handleInputChange} />
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} sm={6}>
                  <TextField label="Nilai" fullWidth variant="outlined" name="nilai" value={formData.nilai} onChange={handleInputChange} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="Komentar" fullWidth variant="outlined" multiline rows={1} name="komentar" value={formData.komentar} onChange={handleInputChange} />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12} className="flex justify-between mt-6">
                  <Button color="secondary" variant="outlined" onClick={handleClickCloseViewDialog}>
                    Batal
                  </Button>
                  <Button color="primary" variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Loading..." : "Submit"}
                  </Button>
                </Grid>
              </Grid>
            </motion.div>
          </motion.div>
        </motion.div>
      </Dialog>

      <Dialog open={openViewDialogData} onClose={handleClickCloseViewDialogData}>
        <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <motion.div
            className="relative bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-3/4 lg:w-2/3 space-y-6"
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          >
            <Typography variant="h4" className="font-bold text-center text-gray-800 mb-6">
              Hasil Data Kelola Seminar - {selectedStudent?.fullname} - {selectedStudent?.nim}
            </Typography>

            {/* Combined Form */}
            <motion.div className="p-4 bg-white shadow-md rounded-lg space-y-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Grid container spacing={2} className="space-y-4">
                {/* Mahasiswa Section */}
                <Grid item xs={12}>
                  <Typography variant="h5" className="font-semibold">
                    Mahasiswa
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="Nama Peserta" value={formData.namaPeserta} fullWidth variant="outlined" disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="NIM" value={selectedStudent?.nim || ""} fullWidth variant="outlined" disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="Email" value={selectedStudent?.email || ""} fullWidth variant="outlined" disabled />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                {/* Row 1 */}
                <Grid item xs={12} sm={6}>
                  <TextField label="Judul Pengumuman" fullWidth variant="outlined" name="judulPengumuman" onChange={handleInputChange} disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="Deskripsi Pengumuman" fullWidth variant="outlined" multiline rows={1} name="deskripsiPengumuman" value={formData.deskripsiPengumuman} onChange={handleInputChange} disabled />
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" type="date" label="Tanggal Seminar" name="tanggal" value={formData.tanggal} onChange={handleInputChange} disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" type="time" label="Waktu Seminar" name="waktu" value={formData.waktu} onChange={handleInputChange} disabled />
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} sm={6}>
                  <TextField label="Nilai" fullWidth variant="outlined" name="nilai" value={formData.nilai} onChange={handleInputChange} disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField label="Komentar" fullWidth variant="outlined" multiline rows={1} name="komentar" value={formData.komentar} onChange={handleInputChange} disabled />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12} className="flex justify-between mt-6">
                  <Button color="secondary" variant="outlined" onClick={handleClickCloseViewDialogData}>
                    Batal
                  </Button>
                </Grid>
              </Grid>
            </motion.div>
          </motion.div>
        </motion.div>
      </Dialog>
    </div>
  );
};

export default AdminPelaksanaanSeminar;
