import express from 'express';
import cors from 'cors';
import connectDB from "./config/mongodb.js";
import 'dotenv/config'
import "./config/cloudinary.js"; // Just import, no function call
import adminRouter from "./routes/adminRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
//connectCloudinary();

// CORS middleware (can stay here)
app.use(express.json());
app.use(cors());


// File upload routes BEFORE express.json()
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRoute);
app.use('/api/user', userRouter);


// Test route
app.get('/', (req, res) => {
    res.send('API IS WORKING')
})

app.listen(port, () => console.log("Server Started", port))