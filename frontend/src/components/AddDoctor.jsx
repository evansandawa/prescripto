import React, { useState } from "react";

const AddDoctor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    fees: "",
    address: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await fetch("/api/admin/add-doctor", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit} enctype="multipart/form-data">
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" placeholder="Password" onChange={handleChange} required />
      <input name="speciality" placeholder="Speciality" onChange={handleChange} required />
      <input name="degree" placeholder="Degree" onChange={handleChange} required />
      <input name="experience" placeholder="Experience" onChange={handleChange} required />
      <input name="about" placeholder="About" onChange={handleChange} required />
      <input name="fees" placeholder="Fees" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="image" type="file" accept="image/*" onChange={handleChange} required />
      <button type="submit">Add Doctor</button>
    </form>
  );
};

export default AddDoctor;