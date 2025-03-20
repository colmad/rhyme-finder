import { motion } from 'framer-motion';
import { MdWarning, MdQueryStats, MdAccessTime } from 'react-icons/md';
import { UsageStats } from '../lib/aiService';

interface UsageDashboardProps {
  usageStats: UsageStats;
}

const UsageDashboard: React.FC<UsageDashboardProps> = ({ usageStats }) => {
  const dailyPercentage = (usageStats.daily.count / 500) * 100;
  const hourlyPercentage = (usageStats.hourly.count / 100) * 100;
  
  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const showWarning = dailyPercentage >= 70 || hourlyPercentage >= 70;

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-[#7C3AED]/10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <MdQueryStats className="w-5 h-5 text-[#7C3AED]" />
        <h3 className="font-medium text-gray-900">Usage Dashboard</h3>
      </div>

      {showWarning && (
        <motion.div
          className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <MdWarning className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm">
            {dailyPercentage >= 70 && hourlyPercentage >= 70
              ? 'Approaching both daily and hourly limits'
              : dailyPercentage >= 70
              ? 'Approaching daily limit'
              : 'Approaching hourly limit'}
          </p>
        </motion.div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <MdAccessTime className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Daily Usage</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {usageStats.daily.count}/500
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${getColorClass(dailyPercentage)}`}
              initial={{ width: '0%' }}
              animate={{ width: `${dailyPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <MdAccessTime className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Hourly Usage</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {usageStats.hourly.count}/100
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${getColorClass(hourlyPercentage)}`}
              initial={{ width: '0%' }}
              animate={{ width: `${hourlyPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UsageDashboard; 