import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, Grid, Link } from "@mui/material";
import { save_user_service } from "../../../services/authServices/authServices";

const RegisterPage = ({ onSwitchToLogin, onClose }) => {

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword") formPayload.append(key, value);
    });

    try {
      await save_user_service(formPayload);
      onClose();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            width: "100%",
            backgroundColor: "background.paper"
          }}
        >
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleRegister} style={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Username"
                  name="username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  label="Full Name"
                  name="name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>

            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2, mb: 1 }}>
              Upload Profile Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {formData.image && (
              <Typography variant="caption">Selected: {formData.image.name}</Typography>
            )}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
            <Box sx={{ mt: 1.5, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link component="button" type="button" onClick={onSwitchToLogin}>
                  Login
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
