import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, UserPlus, Trash2, Edit, Key, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: {
    name?: string;
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
}

const UsersManagementSection = () => {
  const { adminFunctions, isAdminLoaded } = useAdminAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New user state
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit user state
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editUserName, setEditUserName] = useState('');
  
  // Reset password state
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Delete user state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    if (isAdminLoaded) {
      fetchUsers();
    }
  }, [isAdminLoaded]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminFunctions.listUsers();
      if (data && data.users) {
        setUsers(data.users);
        console.log('Users loaded:', data.users.length);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userData = {
        name: newUserName,
        role: 'client' // Default role for new users
      };
      
      const result = await adminFunctions.createUser(newUserEmail, newUserPassword, userData);
      
      if (result) {
        // Also create a profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: result.user.id,
            email: newUserEmail,
            full_name: newUserName,
            role: 'client',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast({
            title: 'Error creating profile',
            description: 'User was created but profile could not be created.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'User created',
            description: 'The user has been created successfully.',
          });
        }
        
        // Reset form and close dialog
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserName('');
        setIsAddingUser(false);
        
        // Refresh users list
        fetchUsers();
      }
    } catch (error: any) {
      toast({
        title: 'Error creating user',
        description: error.message || 'An error occurred while creating the user.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing a user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    
    try {
      // Update user metadata
      const result = await adminFunctions.updateUserById(selectedUser.id, {
        user_metadata: {
          ...selectedUser.user_metadata,
          name: editUserName
        }
      });
      
      if (result) {
        // Also update the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: editUserName,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedUser.id);
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast({
            title: 'Error updating profile',
            description: 'User metadata was updated but profile could not be updated.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'User updated',
            description: 'The user has been updated successfully.',
          });
        }
        
        // Reset form and close dialog
        setEditUserName('');
        setSelectedUser(null);
        setIsEditingUser(false);
        
        // Refresh users list
        fetchUsers();
      }
    } catch (error: any) {
      toast({
        title: 'Error updating user',
        description: error.message || 'An error occurred while updating the user.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resetting a user's password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await adminFunctions.resetPasswordForUser(selectedUser.id, newPassword);
      
      if (result) {
        toast({
          title: 'Password reset',
          description: 'The user\'s password has been reset successfully.',
        });
        
        // Reset form and close dialog
        setNewPassword('');
        setSelectedUser(null);
        setIsResettingPassword(false);
      }
    } catch (error: any) {
      toast({
        title: 'Error resetting password',
        description: error.message || 'An error occurred while resetting the password.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await adminFunctions.deleteUser(userToDelete.id);
      
      if (result) {
        // Also delete the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userToDelete.id);
          
        if (profileError) {
          console.error('Error deleting profile:', profileError);
          toast({
            title: 'Error deleting profile',
            description: 'User was deleted but profile could not be deleted.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'User deleted',
            description: 'The user has been deleted successfully.',
          });
        }
        
        // Reset state and close dialog
        setUserToDelete(null);
        setIsConfirmingDelete(false);
        
        // Refresh users list
        fetchUsers();
      }
    } catch (error: any) {
      toast({
        title: 'Error deleting user',
        description: error.message || 'An error occurred while deleting the user.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and their access to the system
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsAddingUser(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-marketing-blue" />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(user.user_metadata?.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.user_metadata?.name || 'Unnamed User'}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                      <TableCell>
                        {user.app_metadata?.provider ? (
                          <Badge variant="outline">{user.app_metadata.provider}</Badge>
                        ) : (
                          <Badge variant="outline">Email</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditUserName(user.user_metadata?.name || '');
                              setIsEditingUser(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setNewPassword('');
                              setIsResettingPassword(true);
                            }}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              setUserToDelete(user);
                              setIsConfirmingDelete(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardFooter>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. The user will receive an email to set up their password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsAddingUser(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={selectedUser?.email || ''}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-sm text-muted-foreground">Email cannot be changed.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditingUser(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResettingPassword} onOpenChange={setIsResettingPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsResettingPassword(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-md">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(userToDelete?.user_metadata?.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{userToDelete?.user_metadata?.name || 'Unnamed User'}</div>
                <div className="text-sm text-muted-foreground">{userToDelete?.email}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagementSection;
