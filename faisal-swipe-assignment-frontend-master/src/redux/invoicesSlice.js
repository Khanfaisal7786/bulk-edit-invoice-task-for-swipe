import { createSlice } from "@reduxjs/toolkit";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = { ...action.payload.updatedInvoice};
      }
    },
    bulkEditInvoices: (state, action) => {
      // action.payload should contain information about the bulk edit
      const { selectedInvoices } = action.payload;
      console.log("action Payload:", action.payload);
      // Iterate through the selected invoices and update them in the state
      selectedInvoices.forEach((editedInvoice) => {
        const index = state.findIndex((invoice) => invoice.id === editedInvoice.id);
        // If the invoice is found, update its properties
        if (index !== -1) {
          state[index] = { ...state[index], ...editedInvoice };
        }
      });
    },
  },
});

export const {
  addInvoice,
  deleteInvoice,
  updateInvoice,
  bulkEditInvoices
} = invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;
export default invoicesSlice.reducer;



