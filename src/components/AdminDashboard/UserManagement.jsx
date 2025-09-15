import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Avatar, AvatarFallback, Textarea } from './ui.jsx';
import { Eye, MessageCircle, Ban, User, X, Send } from 'lucide-react';
import { useToast } from './hooks/use-toast';

// User Details Modal
function UserDetailsModal({ user, open, onClose }) {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-1 text-center">User Details</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">Detailed information about the selected user</p>
        <div className="flex justify-center items-center mb-6">
          <Avatar className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <AvatarFallback className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400 mx-auto" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="text-lg font-bold text-center">{user.name}</div>
          <div className="text-sm text-gray-500 text-center">{user.email}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <div className="font-semibold">Account Type:</div>
            <div>{user.type}</div>
          </div>
          <div>
            <div className="font-semibold">Status:</div>
            <span className={`inline-block px-3 py-0.5 text-xs font-semibold rounded-full 
              ${user.status === 'Active' ? 'bg-green-600 text-white' : user.status === 'Pending' ? 'bg-yellow-400 text-white' : 'bg-red-600 text-white'}`}>{user.status}</span>
          </div>
          <div>
            <div className="font-semibold">Join Date:</div>
            <div>{user.joinDate}</div>
          </div>
          <div>
            <div className="font-semibold">Last Login:</div>
            <div>{user.lastLogin}</div>
          </div>
          <div>
            <div className="font-semibold">Total Orders:</div>
            <div>{user.totalOrders}</div>
          </div>
          <div>
            <div className="font-semibold">Total Spent:</div>
            <div>{user.totalSpent}</div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Send Message Modal
function SendMessageModal({ user, open, onClose }) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  if (!open || !user) return null;
  const handleSend = () => {
    toast({
      title: 'Message Sent',
      description: `Your message has been sent to ${user.name}.`,
      variant: 'success',
    });
    setMessage('');
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-1">Send Message</h2>
        <p className="text-gray-500 mb-6 text-sm">Send a direct message to <span className="font-semibold text-foreground">{user.name}</span></p>
        <div className="mb-6">
          <div className="font-semibold mb-1">Message</div>
          <Textarea
            className="w-full min-h-[100px] border-2 border-green-500 focus:border-green-600 focus:ring-green-600 rounded-lg px-4 py-2"
            placeholder="Type your message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 font-semibold transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 transition"
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

// Confirm Action Modal
function ConfirmActionModal({ open, user, action, onConfirm, onCancel }) {
  if (!open || !user) return null;
  const isSuspend = action === 'suspend';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onCancel}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-2">{isSuspend ? 'Suspend User?' : 'Activate User?'}</h2>
        <p className="text-gray-500 mb-6 text-base">
          {isSuspend
            ? `Are you sure you want to suspend ${user.name}? This will prevent them from accessing their account.`
            : `Are you sure you want to activate ${user.name}? This will allow them to access their account again.`}
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 font-semibold transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition text-white ${isSuspend ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            onClick={onConfirm}
          >
            {isSuspend ? 'Suspend' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
}

const UserManagement = () => {
  const { toast } = useToast();
  const [modalUser, setModalUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageUser, setMessageUser] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [confirmUser, setConfirmUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Customer',
      email: 'john.customer@example.com',
      type: 'Customer',
      status: 'Active',
      lastLogin: '2024-01-15',
      joinDate: '2023-06-15',
      totalOrders: 12,
      totalSpent: '$456.78',
    },
    {
      id: 2,
      name: 'Jane Farmer',
      email: 'jane.farmer@greenfields.com',
      type: 'Seller',
      status: 'Active',
      lastLogin: '2024-01-14',
      joinDate: '2023-05-10',
      totalOrders: 34,
      totalSpent: '$1,234.56',
    },
    {
      id: 3,
      name: 'Bob Smith',
      email: 'bob.smith@farms.com',
      type: 'Seller',
      status: 'Pending',
      lastLogin: '2024-01-10',
      joinDate: '2023-04-20',
      totalOrders: 5,
      totalSpent: '$123.45',
    },
    {
      id: 4,
      name: 'Alice Green',
      email: 'alice.green@organic.com',
      type: 'Customer',
      status: 'Suspended',
      lastLogin: '2024-01-08',
      joinDate: '2023-03-15',
      totalOrders: 0,
      totalSpent: '$0.00',
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTypeColor = (type) => {
    return type === 'Seller' ? 'primary' : 'secondary';
  };

  const handleConfirm = () => {
    if (!confirmUser || !confirmAction) return;
    setUsers(prev => prev.map(u =>
      u.id === confirmUser.id
        ? { ...u, status: confirmAction === 'suspend' ? 'Suspended' : 'Active' }
        : u
    ));
    toast({
      title: confirmAction === 'suspend' ? 'User Suspended' : 'User Active',
      description: `${confirmUser.name} has been ${confirmAction === 'suspend' ? 'suspended' : 'active'}.`,
      variant: confirmAction === 'suspend' ? 'destructive' : 'success',
    });
    setConfirmUser(null);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          User Management
        </h2>
        <p className="text-muted-foreground">
          Monitor and manage customer and seller accounts
        </p>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-white shadow-md rounded-xl border border-gray-200 p-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-muted">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-x-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">
                        {user.name}
                      </h3>
                      {user.type === 'Customer' && (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Customer</span>
                      )}
                      {user.type === 'Seller' && (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">Seller</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{user.email}</p>
                      <p>Last login: {user.lastLogin}</p>
                    </div>
                    {/* Status badge below user details */}
                    <div>
                      {user.status === 'Active' && (
                        <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Active</span>
                      )}
                      {user.status === 'Pending' && (
                        <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      )}
                      {user.status === 'Suspended' && (
                        <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Suspended</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                  <Button 
                    size="sm"
                    className="rounded-md px-3 py-1 text-sm font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 w-full sm:w-auto whitespace-nowrap"
                    onClick={() => { setModalUser(user); setModalOpen(true); }}>
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button 
                    size="sm"
                    className="rounded-md px-3 py-1 text-sm font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 w-full sm:w-auto whitespace-nowrap"
                    onClick={() => { setMessageUser(user); setMessageModalOpen(true); }}>
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                  {user.status === 'Suspended' ? (
                    <Button
                      size="sm"
                      className="rounded-md px-3 py-1 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center gap-2 w-full sm:w-auto whitespace-nowrap"
                      onClick={() => {
                        setConfirmUser(user);
                        setConfirmAction('activate');
                      }}
                    >
                      Activate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="rounded-md px-3 py-1 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2 w-full sm:w-auto whitespace-nowrap"
                      onClick={() => {
                        setConfirmUser(user);
                        setConfirmAction('suspend');
                      }}
                    >
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <UserDetailsModal user={modalUser} open={modalOpen} onClose={() => setModalOpen(false)} />
      <SendMessageModal user={messageUser} open={messageModalOpen} onClose={() => setMessageModalOpen(false)} />
      <ConfirmActionModal
        open={!!confirmUser}
        user={confirmUser}
        action={confirmAction}
        onConfirm={handleConfirm}
        onCancel={() => { setConfirmUser(null); setConfirmAction(null); }}
      />
    </div>
  );
};

export default UserManagement;