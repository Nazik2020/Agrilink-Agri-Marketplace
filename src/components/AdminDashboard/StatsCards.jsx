import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { Users, UserCheck, AlertTriangle, DollarSign } from 'lucide-react';

const StatsCards = () => {
  const [stats, setStats] = useState([
    {
      title: 'Total Users',
      value: 'Loading...',
      change: 'Loading...',
      icon: Users,
      color: 'info',
    },
    {
      title: 'Active Sellers',
      value: 'Loading...',
      change: 'Loading...',
      icon: UserCheck,
      color: 'success',
    },
    {
      title: 'Flagged Content',
      value: '23',
      change: 'Requires attention',
      icon: AlertTriangle,
      color: 'destructive',
    },
    {
      title: 'Revenue',
      value: '$12,345',
      change: '+15% from last month',
      icon: DollarSign,
      color: 'primary',
    },
  ]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/backend/admin/dashboard/get_user_stats.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const userStats = data.stats;
        
        setStats(prevStats => prevStats.map(stat => {
          if (stat.title === 'Total Users') {
            return {
              ...stat,
              value: userStats.total_users.toLocaleString(),
              change: `${userStats.customers} customers, ${userStats.sellers} sellers`
            };
          }
          if (stat.title === 'Active Sellers') {
            return {
              ...stat,
              value: userStats.active_sellers.toLocaleString(),
              change: 'Active sellers in system'
            };
          }
          return stat;
        }));
      } else {
        console.error('Failed to fetch user stats:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Keep the loading state if there's an error
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white border border-gray-200 rounded-lg px-6 py-4">
            <div className="flex flex-row items-center justify-between pb-2 mb-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-500">{stat.title}</span>
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className={`text-xs ${
                stat.change.includes('+') ? 'text-green-600' :
                stat.change.toLowerCase().includes('requires attention') ? 'text-red-600' :
                stat.change.toLowerCase().includes('loading') ? 'text-gray-400' :
                'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards; 