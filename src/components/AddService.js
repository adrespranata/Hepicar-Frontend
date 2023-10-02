import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Stack,
  MenuItem,
} from "@mui/material";
import api from "../libs/api";
import CloseIcon from "@mui/icons-material/Close";

const currencyOptions = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "IDR", label: "Indonesian Rupiah (IDR)" },
];

const AddService = ({ open, onClose, onAddService }) => {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    currency: "",
    price: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    currency: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = { ...errors };

    if (newService.name.trim() === "") {
      formIsValid = false;
      newErrors.name = "Name is required";
    }
    if (newService.description.trim() === "") {
      formIsValid = false;
      newErrors.description = "Description is required";
    }
    if (newService.price === "") {
      formIsValid = false;
      newErrors.price = "Price is required";
    } else if (isNaN(newService.price) || parseFloat(newService.price) <= 0) {
      formIsValid = false;
      newErrors.price = "Price must be a positive number";
    }
    if (newService.currency.trim() === "") {
      formIsValid = false;
      newErrors.currency = "Please select your currency";
    }
    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post("/services", newService);
      await onAddService();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ m: 0, p: 2 }}>Add Service</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="name"
              label="Name"
              value={newService.name}
              onChange={handleChange}
              fullWidth
              error={errors.name !== ""}
              helperText={errors.name}
            />

            <TextField
              name="description"
              label="Description"
              value={newService.description}
              onChange={handleChange}
              multiline
              maxRows={3}
              minRows={3}
              error={errors.description !== ""}
              helperText={errors.description}
            />

            <TextField
              select
              id="currency"
              label="Currency"
              name="currency"
              value={newService.currency}
              onChange={handleChange}
              error={errors.currency !== ""}
              helperText={errors.currency}
            >
              {currencyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="price"
              label="Price"
              type="number"
              value={newService.price}
              onChange={handleChange}
              fullWidth
              error={errors.price !== ""}
              helperText={errors.price}
            />

            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddService;
