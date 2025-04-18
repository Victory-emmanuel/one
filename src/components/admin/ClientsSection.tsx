import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Search, UserPlus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getAllClients } from '@/services/user.service';

const ClientsSection = () => {
  const { adminFunctions, isAdminLoaded } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Define a type for client data
  type ClientData = {
    id: string;
    name: string;
    email: string;
    plan: string;
    status: string;
    signupDate: string;
    avatar: string;
    user_metadata?: Record<string, unknown>;
  };

  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  // States for editing client
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [editClientData, setEditClientData] = useState({
    name: '',
    email: '',
    plan: 'Basic',
    status: 'active'
  });

  // States for deleting client
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientData | null>(null);

  useEffect(() => {
    if (isAdminLoaded) {
      fetchClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminLoaded, adminFunctions]);

  const fetchClients = async () => {
    setIsLoadingClients(true);
    try {
      // Use the user service to fetch all clients
      const clientsData = await getAllClients();
      setClients(clientsData);
      console.log('Loaded clients:', clientsData.length);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error fetching clients',
        description: 'Could not load client data. Please try again later.',
        variant: 'destructive',
      });

      // Set empty clients array
      setClients([]);
    } finally {
      setIsLoadingClients(false);
    }
  };

  // New client form state
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    plan: 'Basic',
    status: 'trial'
  });

  // Filter clients based on search query and time filter
  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (timeFilter === 'all') return true;

    const signupDate = new Date(client.signupDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - signupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (timeFilter) {
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      case '3months':
        return diffDays <= 90;
      case '6months':
        return diffDays <= 180;
      case 'year':
        return diffDays <= 365;
      default:
        return true;
    }
  });

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a new user with AdminAuthContext
      const userData = {
        full_name: newClient.name,
        role: 'client'
      };

      // Generate a random password
      const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      const authData = await adminFunctions.createUser(newClient.email, password, userData);

      if (!authData || !authData.user) {
        throw new Error('Failed to create user');
      }

      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: newClient.name,
          email: newClient.email,
          role: 'client',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Create a subscription for the new user using adminFunctions
      const subscriptionCreated = await adminFunctions.updateUserSubscription(
        authData.user.id,
        newClient.plan,
        newClient.status
      );

      if (!subscriptionCreated) {
        throw new Error('Failed to create subscription');
      }

      // Refresh clients list
      await fetchClients();

      // Reset form
      setNewClient({
        name: '',
        email: '',
        plan: 'Basic',
        status: 'trial'
      });

      setIsAddingClient(false);

      toast({
        title: 'Client added',
        description: 'The client has been added successfully. A temporary password has been generated.',
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: 'Error adding client',
        description: error.message || 'An error occurred while adding the client.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-500">Trial</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle editing a client
  const handleEditClient = async () => {
    if (!selectedClient) return;

    setIsLoading(true);

    try {
      // Update user metadata
      const userData = await adminFunctions.updateUserById(selectedClient.id, {
        user_metadata: {
          ...selectedClient.user_metadata,
          full_name: editClientData.name
        }
      });

      if (!userData) {
        throw new Error('Failed to update user');
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editClientData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedClient.id);

      if (profileError) throw profileError;

      // Update subscription status if needed
      if (editClientData.plan !== selectedClient.plan || editClientData.status !== selectedClient.status) {
        // Use the adminFunctions to update the subscription
        const subscriptionUpdated = await adminFunctions.updateUserSubscription(
          selectedClient.id,
          editClientData.plan,
          editClientData.status
        );

        if (!subscriptionUpdated) {
          console.warn('Subscription update failed, but continuing with profile update');
        } else {
          console.log('Subscription updated successfully');
        }
      }

      // Refresh clients list
      await fetchClients();

      // Reset state
      setSelectedClient(null);
      setEditClientData({
        name: '',
        email: '',
        plan: 'Basic',
        status: 'active'
      });
      setIsEditingClient(false);

      toast({
        title: 'Client updated',
        description: 'The client has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: 'Error updating client',
        description: error.message || 'An error occurred while updating the client.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a client
  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    setIsLoading(true);

    try {
      // Delete user
      const result = await adminFunctions.deleteUser(clientToDelete.id);

      if (!result) {
        throw new Error('Failed to delete user');
      }

      // Delete profile (should be handled by cascade delete)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', clientToDelete.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      // We don't need to explicitly delete subscriptions as they should be handled by cascade delete
      // when the user is deleted. The database should have foreign key constraints set up properly.

      // Refresh clients list
      await fetchClients();

      // Reset state
      setClientToDelete(null);
      setIsDeletingClient(false);

      toast({
        title: 'Client deleted',
        description: 'The client has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Error deleting client',
        description: error.message || 'An error occurred while deleting the client.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Edit Client Dialog */}
      <Dialog open={isEditingClient} onOpenChange={setIsEditingClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editClientData.name}
                onChange={(e) => setEditClientData({ ...editClientData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={editClientData.email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan">Subscription Plan</Label>
                <Select
                  value={editClientData.plan}
                  onValueChange={(value) => setEditClientData({ ...editClientData, plan: value })}
                >
                  <SelectTrigger id="edit-plan">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editClientData.status}
                  onValueChange={(value) => setEditClientData({ ...editClientData, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Free Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingClient(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClient} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Client'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Client Dialog */}
      <Dialog open={isDeletingClient} onOpenChange={setIsDeletingClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {clientToDelete && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-md">
                <Avatar>
                  <AvatarImage src={clientToDelete.avatar} alt={clientToDelete.name} />
                  <AvatarFallback>{getInitials(clientToDelete.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{clientToDelete.name}</div>
                  <div className="text-sm text-muted-foreground">{clientToDelete.email}</div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletingClient(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Client'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                View and manage all clients
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clients..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Add a new client to the system. They will receive an email with login instructions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newClient.name}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan">Subscription Plan</Label>
                        <Select
                          value={newClient.plan}
                          onValueChange={(value) => setNewClient({ ...newClient, plan: value })}
                        >
                          <SelectTrigger id="plan">
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Pro">Pro</SelectItem>
                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newClient.status}
                          onValueChange={(value) => setNewClient({ ...newClient, status: value })}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trial">Free Trial</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingClient(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddClient} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Client'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setTimeFilter('all')}>All Time</TabsTrigger>
                <TabsTrigger value="week" onClick={() => setTimeFilter('week')}>This Week</TabsTrigger>
                <TabsTrigger value="month" onClick={() => setTimeFilter('month')}>This Month</TabsTrigger>
                <TabsTrigger value="3months" onClick={() => setTimeFilter('3months')}>3 Months</TabsTrigger>
                <TabsTrigger value="6months" onClick={() => setTimeFilter('6months')}>6 Months</TabsTrigger>
                <TabsTrigger value="year" onClick={() => setTimeFilter('year')}>This Year</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Signup Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingClients ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-marketing-blue" />
                        </TableCell>
                      </TableRow>
                    ) : filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No clients found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={client.avatar} alt={client.name} />
                                <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-muted-foreground">{client.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{client.plan}</TableCell>
                          <TableCell>{getStatusBadge(client.status)}</TableCell>
                          <TableCell>{client.signupDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                  setSelectedClient(client);
                                  setEditClientData({
                                    name: client.name,
                                    email: client.email,
                                    plan: client.plan,
                                    status: client.status
                                  });
                                  setIsEditingClient(true);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setClientToDelete(client);
                                    setIsDeletingClient(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Other tabs will show the same content but with different filters */}
            <TabsContent value="week" className="space-y-4">
              {/* Same table as above */}
            </TabsContent>
            <TabsContent value="month" className="space-y-4">
              {/* Same table as above */}
            </TabsContent>
            <TabsContent value="3months" className="space-y-4">
              {/* Same table as above */}
            </TabsContent>
            <TabsContent value="6months" className="space-y-4">
              {/* Same table as above */}
            </TabsContent>
            <TabsContent value="year" className="space-y-4">
              {/* Same table as above */}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ClientsSection;
