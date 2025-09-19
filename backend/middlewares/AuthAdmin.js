import jwt from 'jsonwebtoken';

// admin authentication middleware
const AuthAdmin = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorized. Please login first." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Not Authorized. Please login first." });
        }

        req.admin = decoded; // store decoded token in req
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Authentication failed. Please try again." });
    }
};


export default AuthAdmin;