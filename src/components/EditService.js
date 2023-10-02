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
import CloseIcon from "@mui/icons-material/Close";

import api from "../libs/api";

const currencyOptions = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "IDR", label: "Indonesian Rupiah (IDR)" },
];

const EditService = ({ open, onClose, serviceData, onUpdateService }) => {
  const { id, name, description, currency, price } = serviceData;
  const [editedService, setEditedService] = useState({
    id,
    name,
    description,
    currency,
    price,
  });

  // State untuk pesan kesalahan
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    currency: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Set ulang pesan kesalahan hanya jika input sekarang valid
    if (name === "name" && value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Name is required",
      }));
    } else if (name === "description" && value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Description is required",
      }));
    } else if (name === "price") {
      if (value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Price is required",
        }));
      } else if (isNaN(value) || parseFloat(value) <= 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Price must be a positive number",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    } else if (name === "currency" && value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Please select your currency",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek apakah ada pesan kesalahan yang tersisa
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    try {
      const changes = {
        name: editedService.name,
        description: editedService.description,
        currency: editedService.currency,
        price: editedService.price,
      };
      await api.put(`/services/${id}`, changes);
      await onUpdateService({ ...serviceData, ...changes });
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ m: 0, p: 2 }}>Edit Service</DialogTitle>
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
              value={editedService.name}
              onChange={handleChange}
              fullWidth
              error={errors.name !== ""}
              helperText={errors.name}
            />

            <TextField
              name="description"
              label="Description"
              value={editedService.description}
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
              value={editedService.currency}
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
              value={editedService.price}
              onChange={handleChange}
              type="number"
              fullWidth
              error={errors.price !== ""}
              helperText={errors.price}
            />

            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditService;
