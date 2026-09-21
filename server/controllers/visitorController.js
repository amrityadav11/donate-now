import Visitor from '../models/Visitor.js';

// Get total visitors count
export const getTotalVisitors = async (req, res) => {
    try {
        const total = await Visitor.getTotalVisitors();
        const today = await Visitor.getTodayVisitors();
        const online = await Visitor.getOnlineVisitors();

        res.status(200).json({
            success: true,
            data: {
                totalVisitors: total,
                todayVisitors: today,
                onlineVisitors: online,
            },
        });
    } catch (error) {
        console.error('Error getting visitor stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get visitor statistics',
            error: error.message,
        });
    }
};

// Get online visitors count
export const getOnlineVisitors = async (req, res) => {
    try {
        const online = await Visitor.getOnlineVisitors();
        res.status(200).json({
            success: true,
            data: {
                onlineVisitors: online,
            },
        });
    } catch (error) {
        console.error('Error getting online visitors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get online visitors',
            error: error.message,
        });
    }
};

// Record new visitor or update existing session
export const recordVisitor = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required',
            });
        }

        // Get client IP address
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
            req.socket.remoteAddress ||
            'Unknown';

        // Get user agent
        const userAgent = req.headers['user-agent'] || 'Unknown';

        let visitor = await Visitor.findOne({ sessionId });

        if (visitor) {
            // Update existing visitor
            visitor.lastActiveAt = new Date();
            visitor.isOnline = true;
            visitor.pageViews += 1;
            await visitor.save();
        } else {
            // Create new visitor
            visitor = new Visitor({
                sessionId,
                ipAddress,
                userAgent,
                visitedAt: new Date(),
                lastActiveAt: new Date(),
            });
            await visitor.save();
        }

        res.status(200).json({
            success: true,
            data: {
                visitor,
                message: 'Visitor recorded successfully',
            },
        });
    } catch (error) {
        console.error('Error recording visitor:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record visitor',
            error: error.message,
        });
    }
};

// Update visitor activity (heartbeat)
export const updateVisitorActivity = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required',
            });
        }

        const visitor = await Visitor.findOne({ sessionId });

        if (visitor) {
            visitor.lastActiveAt = new Date();
            visitor.isOnline = true;
            await visitor.save();

            res.status(200).json({
                success: true,
                data: { visitor },
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Visitor session not found',
            });
        }
    } catch (error) {
        console.error('Error updating visitor activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update visitor activity',
            error: error.message,
        });
    }
};

// Get visitor statistics
export const getVisitorStats = async (req, res) => {
    try {
        const total = await Visitor.getTotalVisitors();
        const today = await Visitor.getTodayVisitors();
        const online = await Visitor.getOnlineVisitors();

        // Get last 7 days stats
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const sevenDaysVisitors = await Visitor.countDocuments({
            visitedAt: { $gte: sevenDaysAgo },
        });

        res.status(200).json({
            success: true,
            data: {
                totalVisitors: total,
                todayVisitors: today,
                sevenDaysVisitors: sevenDaysVisitors,
                onlineVisitors: online,
            },
        });
    } catch (error) {
        console.error('Error getting visitor stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get visitor statistics',
            error: error.message,
        });
    }
};

export default { getTotalVisitors, getOnlineVisitors, recordVisitor, updateVisitorActivity, getVisitorStats };
