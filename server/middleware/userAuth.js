import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectUser = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'user') return res.status(401).json({ success: false, message: 'Invalid token type' });

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'User not found or inactive' });

        req.user = user;
        next();
    } catch {
        res.status(401).json({ success: false, message: 'Not authorized' });
    }
};
