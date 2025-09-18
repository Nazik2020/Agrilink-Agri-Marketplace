import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Avatar, AvatarFallback, Textarea } from './ui.jsx';
import { Eye, Ban, User, X } from 'lucide-react';
import { useToast } from './hooks/use-toast';

// User Details Modal
function UserDetailsModal({ user, open, onClose }) {
  if (!open || !user) return null;
  // Normalize user type for case-insensitive comparison
  const userType = user.type ? user.type.toLowerCase() : '';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full p-8 relative">
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
          <div className="text-lg font-bold text-center">{userType === 'seller' ? (user.business_name || user.name) : user.full_name || user.name}</div>
          <div className="text-sm text-gray-500 text-center">{user.email}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <div className="font-semibold">Account Type:</div>
            <div>{userType.charAt(0).toUpperCase() + userType.slice(1)}</div>
          </div>
          <div>
            <div className="font-semibold">Status:</div>
            <span className={`inline-block px-3 py-0.5 text-xs font-semibold rounded-full 
              ${user.status === 'active' ? 'bg-green-600 text-white' : user.status === 'pending' ? 'bg-yellow-400 text-white' : 'bg-red-600 text-white'}`}>{user.status}</span>
          </div>
          {userType === 'customer' && (
            <>
              <div>
                <div className="font-semibold">Address:</div>
                <div>{user.address || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Contact No:</div>
                <div>{user.contactno || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Country:</div>
                <div>{user.country || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Postal Code:</div>
                <div>{user.postal_code || '-'}</div>
              </div>
            </>
          )}
          {userType === 'seller' && (
            <>
              <div>
                <div className="font-semibold">Business Name:</div>
                <div>{user.business_name || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Business Description:</div>
                <div>{user.business_description || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Country:</div>
                <div>{user.country || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Contact No:</div>
                <div>{user.contact_number || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Address:</div>
                <div>{user.address || '-'}</div>
              </div>
            </>
          )}
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
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmUser, setConfirmUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

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

  // API Functions
  const fetchUsers = async (page = 1, search = '', filter = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: search,
        filter: filter
      });
      
      console.log('Fetching users from:', `http://localhost/Agrilink-Agri-Marketplace/backend/admin/user_management/get_all_users.php?${params}`);
      
      const response = await fetch(`http://localhost/Agrilink-Agri-Marketplace/backend/admin/user_management/get_all_users.php?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      console.log('🔍 DEBUG: Raw users data from backend:', data.users);
      
      if (data.success) {
        // Transform the data to match the expected format
        const transformedUsers = data.users.map(user => ({
          id: user.id,
          name: user.full_name || user.name,
          email: user.email,
          // Keep original type of the user 
          type: user.type,
          status: user.status,
          lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString() + ' ' + new Date(user.last_login).toLocaleTimeString() : 'Never',
          joinDate: new Date(user.created_at).toLocaleDateString(),
          totalOrders: user.total_orders || 0,
          totalSpent: user.total_spent ? `$${parseFloat(user.total_spent).toFixed(2)}` : '$0.00',
          userType: user.type, 
          originalStatus: user.status 
        }));
        
        console.log('Transformed users:', transformedUsers);
        setUsers(transformedUsers);
        setTotalPages(data.pagination.total_pages);
        setTotalUsers(data.pagination.total_records);
        setCurrentPage(page);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch users",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch users from server: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, userType, status) => {
    try {
      // Debug: Log what we're sending
      const requestBody = {
        user_id: userId,
        user_type: userType,
        status: status
      };
      console.log('🔍 DEBUG: Sending request to update user status:', requestBody);
      console.log('🔍 DEBUG: Request URL:', 'http://localhost/Agrilink-Agri-Marketplace/backend/admin/user_management/update_user_status.php');
      
      const response = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/admin/user_management/update_user_status.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('🔍 DEBUG: Response status:', response.status);
      console.log('🔍 DEBUG: Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('🔍 DEBUG: Response data:', data);
      
      if (data.success) {
        console.log('✅ DEBUG: Status update successful');
        // Refresh the users list
        fetchUsers(currentPage, searchTerm, filter);
        toast({
          title: "Success",
          description: `User status updated to ${status}`,
          variant: "success"
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update user status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update user status: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const banUser = async (userId, userType, reason = '') => {
    try {
      const response = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/admin/user_management/ban_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_type: userType,
          reason: reason
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the users list
        fetchUsers(currentPage, searchTerm, filter);
        toast({
          title: "User Banned",
          description: "User has been banned successfully",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to ban user",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive"
      });
    }
  };

  const unbanUser = async (userId, userType) => {
    try {
      const response = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/admin/user_management/unban_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_type: userType
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the users list
        fetchUsers(currentPage, searchTerm, filter);
        toast({
          title: "User Unbanned",
          description: "User has been unbanned successfully",
          variant: "success"
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to unban user",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unban user",
        variant: "destructive"
      });
    }
  };



  // Test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/admin/test_connection.php');
      const data = await response.json();
      console.log('Backend test result:', data);
      
      if (data.success) {
        console.log('✅ Backend is accessible');
        console.log('Customers:', data.data.customers_count);
        console.log('Sellers:', data.data.sellers_count);
      } else {
      }
    } catch (error) {
    }
  };

  // Load users on component mount
  useEffect(() => {
    testBackendConnection(); // Test connection first
    fetchUsers();
  }, []);

  // Handle search and filter changes
  // Search as you type
  useEffect(() => {
    if (!loading) {
      fetchUsers(1, searchTerm, filter);
    }
  }, [searchTerm, filter]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
    fetchUsers(1, searchTerm, value);
  };

  const handlePageChange = (page) => {
    fetchUsers(page, searchTerm, filter);
  };

  const handleConfirm = () => {
    if (!confirmUser || !confirmAction) return;
    
    const user = users.find(u => u.id === confirmUser.id);
    if (!user) return;

    console.log('🔍 DEBUG: handleConfirm called');
    console.log('🔍 DEBUG: confirmAction:', confirmAction);
    console.log('🔍 DEBUG: user object:', user);
    console.log('🔍 DEBUG: user.id:', user.id);
    console.log('🔍 DEBUG: user.userType:', user.userType);
    console.log('🔍 DEBUG: user.status:', user.status);

    if (confirmAction === 'suspend') {
      console.log('🔍 DEBUG: Calling updateUserStatus with banned');
      // Set status to 'banned' (since ENUM doesn't support 'suspended')
      updateUserStatus(user.id, user.userType, 'banned');
    } else if (confirmAction === 'activate') {
      console.log('🔍 DEBUG: Calling updateUserStatus with active');
      // Set status to 'active'
      updateUserStatus(user.id, user.userType, 'active');
    } else if (confirmAction === 'unban') {
      console.log('🔍 DEBUG: Calling unbanUser');
      unbanUser(user.id, user.userType);
    }
    
    setConfirmUser(null);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <div>
        <h2 className="text-2xl font-bold  text-green-700 mb-2">
          User Management
        </h2>
        <p className="text-muted-foreground">
          Monitor and manage customer and seller accounts
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSearch(searchTerm);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            onClick={() => handleSearch(searchTerm)}
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Users List */}
      {!loading && users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={`${user.type}-${user.id}`} className="bg-white shadow-md rounded-xl border border-gray-200 p-0">
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
                      {user.type === 'customer' && (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Customer</span>
                      )}
                      {user.type === 'seller' && (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">Seller</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{user.email}</p>
                    </div>
                    {/* Status badge below user details */}
                    <div>
                      {user.status === 'active' && (
                        <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Active</span>
                      )}
                      {user.status === 'pending' && (
                        <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      )}
                      {user.status === 'banned' && (
                        <span className="inline-block mt-1 px-3 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Banned</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                  <Button 
                    size="sm"
                    className="rounded-md px-3 py-1 text-sm font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 w-full sm:w-auto whitespace-nowrap"
                    onClick={async () => {
                      setModalLoading(true);
                      try {
                        const response = await fetch(`http://localhost/Agrilink-Agri-Marketplace/backend/admin/user_management/get_user_details.php?user_id=${user.id}&user_type=${user.type}`);
                        const data = await response.json();
                        if (data.success && data.user) {
                          setModalUser({ ...data.user, type: user.type });
                        } else {
                          toast({
                            title: 'Error',
                            description: data.message || 'Failed to fetch user details',
                            variant: 'destructive'
                          });
                          setModalUser(null);
                        }
                      } catch (error) {
                        toast({
                          title: 'Error',
                          description: 'Failed to fetch user details',
                          variant: 'destructive'
                        });
                        setModalUser(null);
                      }
                      setModalLoading(false);
                      setModalOpen(true);
                    }}>
                    <Eye className="h-4 w-4" />
                    View
                  </Button>

                  {user.status === 'banned' ? (
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {currentPage} of {totalPages} ({totalUsers} total users)
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

  <UserDetailsModal user={modalLoading ? null : modalUser} open={modalOpen} onClose={() => setModalOpen(false)} />

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