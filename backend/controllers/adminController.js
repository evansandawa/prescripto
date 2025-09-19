import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, degree, experience, about, fee, address, specialty } = req.body;
    const imageFile = req.file;

    // Checking for all data to add doctor
    if (!name || !email || !password || !degree || !experience || !about || !fee || !address || !specialty) {
      return res.json({ success: false, message: "Please fill all the fields" });
    }

    // Check if image file is present
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Uploading image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      degree,
      experience,
      about,
      fee,
      address: JSON.parse(address),
      specialty,
      image: imageUrl,
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    return res.json({ success: true, message: "Doctor added successfully", doctor: newDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API For admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email: process.env.ADMIN_EMAIL, admin: true }, // Correct: includes email
        process.env.JWT_SECRET,
        { expiresIn: '5h' } // Good practice
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {

    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

//API to get all appointments list
const appointmentsAdmin = async (req, res) => {

    try {

        const appointments = await  appointmentModel.find({})
        res.json({success:true, appointments})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }

}

//API for appointment cancellation
const appointmentCancel = async (req, res) => {

    try {

        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // realising doctor slot

        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

//API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {

    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await  appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true, dashData})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard };