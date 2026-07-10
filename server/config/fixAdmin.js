import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db.js';
import Admin from '../models/Admin.js';

await connectDB();

try {
    // Try to update existing
    const existing = await Admin.findOne({ email: 'admin@donation.com' });

    if (existing) {
        existing.isActive = true;
        existing.role = 'superadmin';
        // Reset password
        existing.password = 'admin123';
        await existing.save();
        console.log('✅ Admin fixed: admin@donation.com | password: admin123 | active: true');
    } else {
        await Admin.create({
            name: 'Admin',
            email: 'admin@donation.com',
            password: 'admin123',
            role: 'superadmin',
            isActive: true,
        });
        console.log('✅ Admin created: admin@donation.com | password: admin123');
    }
} catch (e) {
    console.error('Error:', e.message);
}

process.exit(0);
