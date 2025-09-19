import jwt from 'jsonwebtoken';

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { userId: token_decoded.id }; // Attach user info here

        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;