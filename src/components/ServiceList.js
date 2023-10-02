import React, { useState, useEffect } from "react";
import api from "../libs/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddService from "./AddService";
import EditService from "./EditService";

const ServiceList = () => {
  const [services, setServices] = useState([]);

  // Modal Add and Edit
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isAddSuccess, setIsAddSuccess] = useState(false);
  const [isEditSuccess, setIsEditSuccess] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  const columns = [
    { id: "id", name: "#" },
    { id: "name", name: "Name" },
    { id: "description", name: "Description" },
    { id: "currency", name: "Currency" },
    { id: "price", name: "Price" },
    { id: "action", name: "Action" },
  ];

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      getServices();

      setIsDeleteSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Fungsi untuk modal "Add Service"
  const handleAddServiceOpen = () => {
    setOpenAdd(true);
  };
  const handleAddServiceClose = () => {
    setOpenAdd(false);
  };

  // Fungsi untuk modal "Edit Service"
  const handleOpen = (services) => {
    const { message, ...cleanedService } = services;
    setSelectedService(cleanedService);
    setOpenEdit(true);
  };
  const handeClose = () => {
    setSelectedService(null);
    setOpenEdit(false);
  };

  // Callback untuk memperbarui data
  const updateService = (updatedService) => {
    const updatedServices = services.map((service) =>
      service.id === updatedService.id ? updatedService : service
    );
    setServices(updatedServices);

    setIsEditSuccess(true);
  };
  // Callback yang akan memicu alert ketika data berhasil ditambahkan
  const handleAddService = async () => {
    try {
      await getServices();
      setIsAddSuccess(true); // Menampilkan pesan berhasil
    } catch (error) {
      console.error(error);
    }
  };
  // Alert
  const handleDeleteSuccessClose = () => {
    setIsDeleteSuccess(false);
  };
  return (
    <div>
      <div
        style={{
          margin: "1%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 className="text-2xl font-bold mb-4">List of Services</h2>
        <Button variant="contained" onClick={handleAddServiceOpen}>
          Add New Service
        </Button>
      </div>

      <div style={{ margin: "1%" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "midnightblue" }}>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ color: "white" }}>
                    {column.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service, i) => (
                <TableRow key={service.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{service.currency}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      onClick={() => handleOpen(service)}
                    >
                      <EditIcon fontSize="inherit" color="primary" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => deleteService(service.id)}
                    >
                      <DeleteIcon fontSize="inherit" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack spacing={2} direction="column">
          {/* Tampilkan alert jika berhasil tambah data */}
          <Snackbar
            open={isAddSuccess}
            autoHideDuration={2000}
            onClose={() => setIsAddSuccess(false)}
          >
            <Alert
              elevation={6}
              variant="filled"
              onClose={() => setIsAddSuccess(false)}
              severity="success"
              style={{
                position: "fixed",
                top: "16px",
                right: "16px",
                zIndex: 9999,
              }}
            >
              Service has been successfully added!
            </Alert>
          </Snackbar>
          {/* Tampilkan alert jika berhasil edit data */}
          <Snackbar
            open={isEditSuccess}
            autoHideDuration={2000}
            onClose={() => setIsEditSuccess(false)}
          >
            <Alert
              elevation={6}
              variant="filled"
              onClose={() => setIsEditSuccess(false)}
              severity="success"
              style={{
                position: "fixed",
                top: "16px",
                right: "16px",
                zIndex: 9999,
              }}
            >
              Service has been successfully edited!
            </Alert>
          </Snackbar>
          {/* Tampilkan alert jika berhasil hapus data */}
          <Snackbar
            open={isDeleteSuccess}
            autoHideDuration={2500}
            onClose={handleDeleteSuccessClose}
          >
            <Alert
              elevation={6}
              variant="filled"
              onClose={handleDeleteSuccessClose}
              severity="success"
              style={{
                position: "fixed",
                top: "16px",
                right: "16px",
                zIndex: 9999,
              }}
            >
              service has been successfully deleted!
            </Alert>
          </Snackbar>
        </Stack>
      </div>

      {/* Modal AddService */}
      {openAdd && (
        <AddService
          open={openAdd}
          onClose={handleAddServiceClose}
          onAddService={handleAddService}
        />
      )}

      {/* Modal EditService */}
      {openEdit && (
        <EditService
          open={openEdit}
          onClose={handeClose}
          serviceData={selectedService}
          onUpdateService={updateService}
        />
      )}
    </div>
  );
};

export default ServiceList;
