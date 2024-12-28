import React from "react";
import Button from "@mui/material/Button";

// Define the props type with a more specific type for 'paginate'
const PaginationControls = ({
  currentPage,
  totalPages,
  paginate,
}: {
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void; // Specific type for 'paginate' function
}) => {
  return (
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
  );
};

export default PaginationControls;
