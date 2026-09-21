import { useState, useEffect } from 'react';
import { FiUsers, FiGlobe } from 'react-icons/fi';
import visitorService from '../services/visitorService';

const VisitorCounter = ({ compact = false }) => {
    const [stats, setStats] = useState({
        totalVisitors: 0,
        todayVisitors: 0,
        onlineVisitors: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        // Record visitor on component mount
        const recordAndFetchStats = async () => {
            try {
                // Record the visit
                console.log('Recording visitor...');
                await visitorService.recordVisitor();

                // Fetch latest statistics
                console.log('Fetching visitor stats...');
                const data = await visitorService.getStats();
                console.log('Visitor stats:', data);
                setStats(data);
                setIsDemo(false);
            } catch (error) {
                console.error('Error in visitor tracking:', error);
                // Show demo data if API fails
                console.log('Showing demo data - API might be down');
                setIsDemo(true);
                setStats({
                    totalVisitors: 1,
                    todayVisitors: 1,
                    sevenDaysVisitors: 1,
                    onlineVisitors: 1,
                });
            } finally {
                setLoading(false);
            }
        };

        recordAndFetchStats();

        // Set up a heartbeat to update activity every 30 seconds
        const heartbeatInterval = setInterval(async () => {
            try {
                console.log('Updating visitor activity...');
                await visitorService.updateActivity();
            } catch (error) {
                console.error('Error updating activity:', error);
            }
        }, 30000); // Update every 30 seconds

        // Refresh stats every 10 seconds
        const statsInterval = setInterval(async () => {
            try {
                console.log('Refreshing visitor stats...');
                const data = await visitorService.getStats();
                console.log('Updated visitor stats:', data);
                setStats(data);
                if (isDemo) setIsDemo(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                if (!isDemo) {
                    console.log('API appears to be down, using demo data');
                    setIsDemo(true);
                }
            }
        }, 10000); // Refresh every 10 seconds

        return () => {
            clearInterval(heartbeatInterval);
            clearInterval(statsInterval);
        };
    }, [isDemo]);

    if (compact) {
        // Compact version for footer
        return (
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="relative w-3 h-3">
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-1 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-xs">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {loading ? '...' : stats.onlineVisitors}
                        </span>
                        <span className="text-gray-500 dark:text-gray-500"> Online</span>
                    </span>
                </div>

                <span className="text-gray-400 dark:text-gray-600">•</span>

                <div className="flex items-center gap-2">
                    <FiGlobe className="text-blue-600 dark:text-blue-400 text-xs" />
                    <span className="text-xs">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {loading ? '...' : (stats.totalVisitors || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-500"> Total</span>
                    </span>
                </div>
            </div>
        );
    }

    // Full version for homepage/banner
    return (
        <div className="flex flex-col items-center gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {/* Online visitors */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-2">
                                Online Now
                            </p>
                            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                                {loading ? '...' : stats.onlineVisitors}
                            </p>
                            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2">
                                Active visitors
                            </p>
                        </div>
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-75"></div>
                            <div className="absolute inset-1 bg-green-400 rounded-full flex items-center justify-center">
                                <FiUsers className="text-white text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's visitors */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                Today
                            </p>
                            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                {loading ? '...' : stats.todayVisitors}
                            </p>
                            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">
                                Visitors today
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                            <FiGlobe className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                    </div>
                </div>

                {/* Total visitors */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
                                All Time
                            </p>
                            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                {loading ? '...' : stats.totalVisitors.toLocaleString()}
                            </p>
                            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2">
                                Total visitors
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Real-time visitor tracking • Updates every 10 seconds
            </p>
        </div>
    );
};

export default VisitorCounter;
