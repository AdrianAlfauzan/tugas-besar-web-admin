import React from "react";
import { IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid2";
interface AdminListProps {
  adminData: any[]; // Use 'any[]' if you're not using a specific type
  currentItems: any[];
  currentPage: number;
  totalPages: number;
  handleClickOpenDialog: (admin: any) => void;
  paginate: (page: number) => void;
}

const AdminList: React.FC<AdminListProps> = ({ adminData, currentItems, currentPage, totalPages, handleClickOpenDialog, paginate }) => {
  return (
    <div>
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
                <IconButton className="text-red-600 hover:text-red-800" aria-label="delete" onClick={() => handleClickOpenDialog(admin)}>
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
    </div>
  );
};

export default AdminList;
