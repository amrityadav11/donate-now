import jwt from 'jsonwebtoken';

const generateToken = (id, type = 'user') => {
    return jwt.sign({ id, type }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

export default generateToken;
