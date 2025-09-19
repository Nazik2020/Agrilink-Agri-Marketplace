import React from 'react';
import dayjs from 'dayjs';
import { Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarFallback } from './ui';
import { Activity, User, ShoppingCart, Plus, Edit } from 'lucide-react';

const ActivityMonitor = () => {
  const [selectedActivity, setSelectedActivity] = React.useState(null);
  const [activityDetails, setActivityDetails] = React.useState(null);
  const [detailsLoading, setDetailsLoading] = React.useState(false);

  const handleViewDetails = async (activity) => {
    setSelectedActivity(activity);
    setDetailsLoading(true);
    try {
      const res = await fetch(`http://localhost/Agrilink-Agri-Marketplace/backend/admin/dashboard/get_activity_details.php?type=${activity.type}&id=${activity.id}`);
      const data = await res.json();
      if (data.success) {
        setActivityDetails(data.details);
      } else {
        setActivityDetails({ error: data.message });
      }
    } catch (err) {
      setActivityDetails({ error: 'Failed to fetch details.' });
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
    setActivityDetails(null);
    setDetailsLoading(false);
  };
  const [activities, setActivities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/admin/dashboard/get_activity_feed.php');
        const data = await res.json();
        if (data.success && Array.isArray(data.activities)) {
          setActivities(data.activities.map(activity => ({
            ...activity,
            icon: activity.type === 'order' ? ShoppingCart : activity.type === 'product' ? Plus : activity.type === 'profile' ? Edit : activity.type === 'registration' ? User : Activity,
            time_raw: activity.time_raw || activity.time // Store original time for grouping
          })));
        }
      } catch (err) {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);
  // Group activities by type and week
  const groupByWeekAndType = (activities) => {
    const grouped = {};
    activities.forEach(activity => {
      // Use time_raw if available, else fallback to time
  const week = dayjs(activity.time_raw || activity.time).startOf('week').format('[Week of] MMM D, YYYY');
      if (!grouped[activity.type]) grouped[activity.type] = {};
      if (!grouped[activity.type][week]) grouped[activity.type][week] = [];
      grouped[activity.type][week].push(activity);
    });
    return grouped;
  };

  const grouped = groupByWeekAndType(activities);

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
          {Object.entries(grouped).map(([type, weeks]) => (
            <div key={type} className="mb-8">
              <h3 className="text-lg font-bold mb-2 capitalize">{type}</h3>
              {Object.entries(weeks).map(([week, acts]) => (
                <div key={week} className="mb-4">
                  <div className="text-md font-semibold text-green-700 mb-2">{week}</div>
                  {acts.map(activity => {
                    const Icon = activity.icon;
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
                          {/* Offer-aware snippets for product and order types */}
                          {activity.type === 'product' && (activity.effective_price != null || activity.special_offer) && (
                            <div className="mt-1 text-sm">
                              {activity.effective_price != null && activity.price != null && parseFloat(activity.effective_price) !== parseFloat(activity.price) ? (
                                <>
                                  <span className="text-green-700 font-semibold mr-2">${parseFloat(activity.effective_price).toFixed(2)}</span>
                                  <span className="text-gray-400 line-through">${parseFloat(activity.price).toFixed(2)}</span>
                                </>
                              ) : (
                                activity.price != null && <span className="text-gray-700">${parseFloat(activity.price).toFixed(2)}</span>
                              )}
                              {activity.special_offer && activity.special_offer !== 'No Special Offer' && (
                                <span className="ml-2 inline-block bg-red-100 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full align-middle">
                                  {activity.special_offer}
                                </span>
                              )}
                            </div>
                          )}
                          {activity.type === 'order' && (activity.total_amount != null || activity.payment_status) && (
                            <div className="mt-1 text-sm text-gray-700">
                              {activity.total_amount != null && (
                                <span className="mr-2">Total: <span className="font-semibold">${parseFloat(activity.total_amount).toFixed(2)}</span></span>
                              )}
                              {activity.payment_status && (
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${activity.payment_status.match(/success|completed|paid|succeeded/i) ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {activity.payment_status}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="w-24 text-xs text-gray-400 whitespace-nowrap flex-shrink-0 text-right">{activity.time}</div>
                        <button
                          className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold shadow"
                          onClick={() => handleViewDetails(activity)}
                        >
                          View
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-50/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative border-t-8 border-green-600"
            style={{ minHeight: '200px', maxHeight: '400px', overflowY: 'auto', boxSizing: 'border-box' }}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
              <selectedActivity.icon className="h-5 w-5 text-green-600" />
              {selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1)} Details
            </h2>
            {detailsLoading ? (
              <div className="text-center text-gray-400">Loading details...</div>
            ) : activityDetails && activityDetails.error ? (
              <div className="text-red-500">{activityDetails.error}</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(activityDetails)
                  .filter(([key]) => !['reset_token', 'reset_token_expires', 'password', 'card_last_four', 'transaction_id', 'profile_image', 'product_images'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-semibold w-40 text-gray-700">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-gray-900 break-all">{String(value)}</span>
                    </div>
                  ))}
                {/* Offer-aware hints in details modal */}
                {selectedActivity?.type === 'product' && activityDetails?.effective_price != null && activityDetails?.price != null && parseFloat(activityDetails.effective_price) !== parseFloat(activityDetails.price) && (
                  <div className="flex">
                    <span className="font-semibold w-40 text-gray-700">Offer price:</span>
                    <span className="text-gray-900">
                      <span className="text-green-700 font-semibold mr-2">${parseFloat(activityDetails.effective_price).toFixed(2)}</span>
                      <span className="text-gray-400 line-through">${parseFloat(activityDetails.price).toFixed(2)}</span>
                    </span>
                  </div>
                )}
                {selectedActivity?.type === 'order' && activityDetails?.total_amount != null && (
                  <div className="flex">
                    <span className="font-semibold w-40 text-gray-700">Offer total amount:</span>
                    <span className="text-gray-900">${parseFloat(activityDetails.total_amount).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityMonitor;