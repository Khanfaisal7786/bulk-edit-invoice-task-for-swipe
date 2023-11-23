// BulkEditTable.jsx
import React from "react";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import InvoiceList from "../pages/InvoiceList";

const BulkEditTable = ({ selectedInvoices, onBulkEdit, onCancel }) => {
  const [editedData, setEditedData] = useState({
    dueDate: "",
    totalAmt: "",
    // Add more fields you want to edit in bulk
  });

  const [validationError, setValidationError] = useState("");

  const handleFieldChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setValidationError(""); // Clear validation error on field change
  };

  const handleSaveClick = () => {
    // Basic validation example: Check if dueDate is not empty
    if (!editedData.dueDate) {
      setValidationError("Due Date is required.");
      return;
    }

    onBulkEdit(editedData);
    setEditedData({}); // Reset edited data after saving changes
  };

  const handleCancelClick = () => {
    onCancel();
    setEditedData({}); // Reset edited data on cancel
  };

  return (
    <div className="conatiner bg-dark">
      <Table striped bordered hover>
        <tbody>
          {selectedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.invoiceNumber}</td>
              <td>
                <Form.Control
                  type="date"
                  value={editedData.dueDate || invoice.dateOfIssue}
                  onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={editedData.totalAmt || invoice.total}
                  onChange={(e) =>
                    handleFieldChange("totalAmt", e.target.value)
                  }
                />
              </td>
              {/* Add more cells based on your requirements */}
            </tr>
          ))}
        </tbody>
      </Table>

      {validationError && <Alert variant="danger">{validationError}</Alert>}

      <div className="mb-2 mb-md-4 text-center">
        <Button variant="success" onClick={handleSaveClick}>
          Save Changes
        </Button>{" "}
        <Button variant="danger" onClick={handleCancelClick}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BulkEditTable;