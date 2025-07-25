import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarFallback } from './ui';
import { Activity, User, ShoppingCart, Plus, Edit } from 'lucide-react';

const ActivityMonitor = () => {
  const activities = [
    {
      id: 1,
      user: 'John Customer',
      action: 'Placed order #1234',
      time: '10 minutes ago',
      type: 'order',
      icon: ShoppingCart
    },
    {
      id: 2,
      user: 'Jane Farmer',
      action: 'Added new product',
      time: '25 minutes ago',
      type: 'product',
      icon: Plus
    },
    {
      id: 3,
      user: 'Bob Smith',
      action: 'Updated profile',
      time: '1 hour ago',
      type: 'profile',
      icon: Edit
    },
    {
      id: 4,
      user: 'Alice Green',
      action: 'Registered new account',
      time: '2 hours ago',
      type: 'registration',
      icon: User
    },
    {
      id: 5,
      user: 'Mike Johnson',
      action: 'Placed order #1235',
      time: '3 hours ago',
      type: 'order',
      icon: ShoppingCart
    },
    {
      id: 6,
      user: 'Sarah Wilson',
      action: 'Added new product listing',
      time: '4 hours ago',
      type: 'product',
      icon: Plus
    }
  ];

  const getActivityColor = (type) => {
    switch (type) {
      case 'order':
        return 'success';
      case 'product':
        return 'primary';
      case 'profile':
        return 'info';
      case 'registration':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getActivityBgColor = (type) => {
    switch (type) {
      case 'order':
        return 'bg-success/10';
      case 'product':
        return 'bg-primary/10';
      case 'profile':
        return 'bg-info/10';
      case 'registration':
        return 'bg-warning/10';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <Card className="border border-border rounded-xl w-full">
        <CardHeader className="border-b border-border pb-2">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Activity className="h-6 w-6" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            // Color classes for badge and icon
            let badgeClass = '';
            let iconClass = '';
            switch (activity.type) {
              case 'order':
              case 'product':
                badgeClass = 'bg-green-600 text-white';
                iconClass = 'text-green-600';
                break;
              case 'profile':
                badgeClass = 'bg-blue-500 text-white';
                iconClass = 'text-blue-500';
                break;
              case 'registration':
                badgeClass = 'bg-yellow-500 text-white';
                iconClass = 'text-yellow-500';
                break;
              default:
                badgeClass = 'bg-gray-400 text-white';
                iconClass = 'text-gray-400';
            }
            return (
              <div key={activity.id} className="flex items-center gap-4 bg-white rounded-lg px-6 py-4 mb-3 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                  <Icon className={`h-6 w-6 ${iconClass}`} />
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-base">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-lg">
                      {activity.user}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass} capitalize`}>
                      {activity.type === 'order' ? 'Order' : activity.type === 'product' ? 'Product' : activity.type === 'profile' ? 'Profile' : activity.type === 'registration' ? 'Registration' : activity.type}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {activity.action}
                  </p>
                </div>
                <div className="w-24 text-xs text-gray-400 whitespace-nowrap flex-shrink-0 text-right">{activity.time}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityMonitor;