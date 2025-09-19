import express from "express";
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import AuthAdmin from "../middlewares/AuthAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";
import authAdmin from "../middlewares/AuthAdmin.js";

const adminRouter = express.Router();

adminRouter.post('/add-doctor', AuthAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.get('/all-doctors', AuthAdmin, allDoctors);
adminRouter.post('/change-availability', AuthAdmin, changeAvailability);
adminRouter.get('/appointments', AuthAdmin, appointmentsAdmin);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter;