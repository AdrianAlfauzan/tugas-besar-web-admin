import React from "react";
import { IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface StudentsListProps {
  studentsData: any[]; // Use 'any[]' if you're not using a specific type
  currentItems: any[];
  currentPage: number;
  totalPages: number;
  handleClickOpenDeleteDialog: (student: any) => void;
  handleClickOpenViewDialog: (student: any) => void;
  handleClickOpenViewDialogData: (student: any) => void;
  paginate: (page: number) => void;
}

const studentList: React.FC<StudentsListProps> = ({ studentsData, currentItems, currentPage, totalPages, handleClickOpenDeleteDialog, handleClickOpenViewDialog, handleClickOpenViewDialogData, paginate }) => {
  return (
    <div>
      {/* student List Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <Grid container spacing={0} className="border-b border-gray-200">
          <Grid size={2} className="py-4 bg-yellow-300 text-center font-semibold text-gray-700">
            NIM
          </Grid>
          <Grid size={3} className="py-4 text-center font-semibold text-gray-700">
            Nama Mahasiswa
          </Grid>
          <Grid size={2} className="py-4 text-center font-semibold text-gray-700">
            Jurusan Mahasiswa
          </Grid>
          <Grid size={3} className="py-4 text-center font-semibold text-gray-700">
            Email Mahasiswa
          </Grid>
          <Grid size={2} className="py-4 text-center font-semibold text-gray-700">
            Action
          </Grid>
        </Grid>

        {studentsData.length === 0 ? (
          <div className="text-center py-6 text-gray-600">Tidak Ada data disini</div>
        ) : (
          currentItems.map((student) => (
            <Grid key={student.id} container className="border-b border-gray-100 hover:bg-gray-50">
              <Grid size={2} className="py-4 text-center text-gray-800">
                {student.nim}
              </Grid>
              <Grid size={3} className="py-4 text-center text-gray-800">
                {student.fullname}
              </Grid>
              <Grid size={2} className="py-4 text-center text-gray-800">
                {student.jurusan}
              </Grid>
              <Grid size={3} className="py-4 text-center text-gray-800">
                {student.email}
              </Grid>
              <Grid size={2} className="py-4 text-center">
                <IconButton className="text-red-600 hover:text-red-800" aria-label="delete" onClick={() => handleClickOpenDeleteDialog(student)}>
                  <DeleteIcon color="error" />
                </IconButton>
                <IconButton
                  className="text-blue-600 hover:text-blue-800"
                  aria-label="view"
                  onClick={() => handleClickOpenViewDialog(student)} // Call the visibility handler
                >
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton
                  className="text-blue-600 hover:text-blue-800"
                  aria-label="view"
                  onClick={() => handleClickOpenViewDialogData(student)} // Call the visibility handler
                >
                  <VisibilityIcon color="primary" />
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

export default studentList;
