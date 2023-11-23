import React, { useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch} from "react-redux";
import { deleteInvoice, updateInvoice} from "../redux/invoicesSlice";
import BulkEditTable from "../components/BulkEditTable";
import { bulkEditInvoices } from "../redux/invoicesSlice";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedInvoices, setSelectedInvoices] = useState([]); // State to store selected invoices
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    dueDate: "",
    totalAmt: "",
    // Add more fields you want to edit in bulk
  });

  
  const handleFieldChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };


  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };

   // Open the bulk edit interface
   const handleBulkEditClick = () => {
    setIsBulkEditOpen(true);
  };

  const handleSaveClick = (invoiceId) => {
    dispatch(updateInvoice({id: invoiceId, editedData}));
    setEditedData({});
  }

  // Handle saving changes from bulk edit
  const handleBulkEditSave = (editedData) => {
    // Iterate through selected invoices and dispatch updateInvoice action
    selectedInvoices.forEach((invoice) => {
      dispatch(
        bulkEditInvoices({
          id: invoice.id,
          editedInvoice: {
            ...invoice,
            ...editedData,
          },
        })
      );
    });
    setSelectedInvoices([]);
    setIsBulkEditOpen(false);
  };

  // Handle canceling bulk edit
  const handleBulkEditCancel = () => {
    setSelectedInvoices([]);
    setIsBulkEditOpen(false);
  };

  return (
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                </Link>

                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>

                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "50px",
                    }}
                  />
                  {/* Add the new Bulk Edit button */}
                  <Button variant="dark mb-2 mb-md-4" onClick={handleBulkEditClick}>
                    Bulk Edit
                  </Button>
                </div>
              </div>
              {isBulkEditOpen && (
                <BulkEditTable
                selectedInvoices={selectedInvoices}
                onBulkEdit={handleBulkEditSave}
                onCancel={handleBulkEditCancel}
                />

              )}
              <Table responsive>
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      navigate={navigate}
                       // Pass the setSelectedInvoices function to update selected invoices
                       onSelect={(isSelected) => {
                        setSelectedInvoices((prevSelected) => {
                          if (isSelected) {
                            return [...prevSelected, invoice];
                          } else {
                            return prevSelected.filter(
                              (selected) => selected.id !== invoice.id
                            );
                          }
                        });
                      }}
                      isBulkEditOpen={isBulkEditOpen}
                      onFieldChange={handleFieldChange}
                      editedData={editedData}
                      onSave={() => handleSaveClick(invoice.Id)}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({ invoice, navigate, onSelect, isBulkEditOpen, onFieldChange, editedData, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <tr>
      <td>
        {!isBulkEditOpen ? (
          invoice.invoiceNumber
        ) : (
          <input
            value={editedData.invoiceNumber || invoice.invoiceNumber}
            onChange={(e) => onFieldChange("invoiceNumber", e.target.value)}
          />
        )}
      </td>
      <td className="fw-normal">
        {!isBulkEditOpen ? (
          invoice.billTo
        ) : (
          <input
            value={editedData.billTo || invoice.billTo}
            onChange={(e) => onFieldChange("billTo", e.target.value)}
          />
        )}
      </td>
      <td className="fw-normal">
        {!isBulkEditOpen ? (
          invoice.dateOfIssue
        ) : (
          <input
            value={editedData.dateOfIssue || invoice.dateOfIssue}
            onChange={(e) => onFieldChange("dateOfIssue", e.target.value)}
          />
        )}
      </td>
      <td className="fw-normal">
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={() => {
          handleEditClick();
          onSelect(false); // Deselect the invoice after clicking Edit
        }}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => {
          handleDeleteClick(invoice.id);
          onSelect(false); // Deselect the invoice after clicking Delete
          }}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={() => {
          openModal();
          onSelect(false); // Deselect the invoice after clicking Delete
          }}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

export default InvoiceList;
