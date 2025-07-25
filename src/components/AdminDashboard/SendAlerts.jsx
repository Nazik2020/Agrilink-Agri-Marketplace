import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui';
import { Send, Clock } from 'lucide-react';
import { useToast } from './hooks/use-toast';

const SendAlerts = () => {
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { toast } = useToast();

  const recentAlerts = [
    { message: 'Privacy policy update', time: '2 hours ago' },
    { message: 'Maintenance scheduled', time: 'Yesterday' },
    { message: 'New security features', time: '3 days ago' }
  ];

  const handleSendAlert = () => {
    if (!alertType || !alertMessage.trim()) {
      toast({
        title: "Error",
        description: "Please select alert type and enter a message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Alert Sent Successfully!",
      description: "System-wide general alert has been sent to all users.",
      variant: "success",
      style: {
        background: '#fff',
        color: '#111',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
        borderRadius: '12px',
        fontWeight: '500',
      }
    });

    setAlertType('');
    setAlertMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
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
          <ul className="space-y-1">
            {recentAlerts.map((alert, index) => (
              <li key={index} className="flex justify-between">
                <span>• {alert.message}</span>
                <span className="text-gray-500 text-sm">{alert.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SendAlerts;