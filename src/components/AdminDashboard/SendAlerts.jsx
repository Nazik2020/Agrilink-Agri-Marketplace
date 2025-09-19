import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui';
import { Send, Clock } from 'lucide-react';
import { useToast } from './hooks/use-toast';

const SendAlerts = () => {
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { toast } = useToast();

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  // fetchAlerts function is now hoisted for reuse
  const fetchAlerts = async () => {
    try {
      const res = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/get_global_alerts.php');
      const data = await res.json();
      setRecentAlerts(data.alerts || []);
    } catch (err) {
      setRecentAlerts([]);
    } finally {
      setLoadingAlerts(false);
    }
  };
  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSendAlert = async () => {
    if (!alertType || !alertMessage.trim()) {
      toast({
        title: "Error",
        description: "Please select alert type and enter a message",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/send_global_alert.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alertType,
          message: alertMessage,
          type: alertType
        })
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Alert Sent Successfully!",
          description: "System-wide general alert has been sent to all users.",
          variant: "success"
        });
        setAlertType('');
        setAlertMessage('');
        fetchAlerts(); // Refresh recent alerts after sending lateset one at the top
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send alert.",
          variant: "destructive"
        });
  // console.error(data.alert_error);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network or server error.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold  text-green-700 mb-2">
          Send System Alerts
        </h2>
        <p className="text-muted-foreground">
          Send notifications to users about policies, updates, or important information
        </p>
      </div>

      <div className="bg-white rounded-xl shadow border p-8 mb-8">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Alert Type</label>
          <select
            value={alertType}
            onChange={e => setAlertType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select alert type</option>
            <option value="general">General Notification</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security Update</option>
            <option value="policy">Policy Update</option>
            <option value="emergency">Emergency Alert</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1">Alert Message</label>
          <textarea
            id="alert-message"
            placeholder="Enter your alert message here..."
            value={alertMessage}
            onChange={e => setAlertMessage(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
          />
        </div>
        <button
          onClick={handleSendAlert}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Send className="h-5 w-5" />
          Send Alert to All Users
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border p-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="font-semibold">Recent Alerts Sent:</span>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="font-semibold mb-2">Recent Alerts Sent:</div>
          {loadingAlerts ? (
            <div className="text-gray-500">Loading...</div>
          ) : recentAlerts.length === 0 ? (
            <div className="text-gray-500">No recent alerts found.</div>
          ) : (
            <ul className="space-y-1">
              {recentAlerts.map((alert, index) => (
                <li key={index} className="flex justify-between">
                  <span>• {alert.message}</span>
                  <span className="text-gray-500 text-sm">{alert.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendAlerts;