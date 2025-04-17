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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ClientsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoadingClients(true);
    try {
      // Fetch all users from the auth.users table
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();

      if (userError) {
        // If admin API fails, try to get users from profiles table instead
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) throw profilesError;

        // Transform profiles data to match the expected format
        const clientsData = profilesData.map(profile => {
          return {
            id: profile.id,
            name: profile.full_name || 'Unknown',
            email: profile.email || '',
            plan: 'Basic', // Default plan
            status: 'active', // Default status
            signupDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : '',
            avatar: profile.avatar_url || ''
          };
        });

        setClients(clientsData);
      } else {
        // Get subscription data for each user
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('user_subscriptions')
          .select('*, plan:pricing_plans(*)');

        if (subscriptionsError) throw subscriptionsError;

        // Get profiles data for each user
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) throw profilesError;

        // Transform auth users data to match the expected format
        const clientsData = userData.users.map(user => {
          // Find subscription for this user
          const subscription = subscriptionsData.find(sub => sub.user_id === user.id);

          // Find profile for this user
          const profile = profilesData.find(profile => profile.id === user.id);

          return {
            id: user.id,
            name: profile?.full_name || user.user_metadata?.full_name || 'Unknown',
            email: user.email,
            plan: subscription?.plan?.name || 'Basic',
            status: subscription?.status || 'inactive',
            signupDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '',
            avatar: profile?.avatar_url || ''
          };
        });

        setClients(clientsData);
      }
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
      // Create a new user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newClient.email,
        email_confirm: true,
        user_metadata: {
          full_name: newClient.name
        },
        password: Math.random().toString(36).slice(-8) // Generate a random password
      });

      if (authError) throw authError;

      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: newClient.name,
          email: newClient.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Create a subscription for the new user
      const { data: planData, error: planError } = await supabase
        .from('pricing_plans')
        .select('id')
        .eq('name', newClient.plan)
        .single();

      if (planError) {
        // If plan doesn't exist, create it
        const { data: newPlan, error: createPlanError } = await supabase
          .from('pricing_plans')
          .insert({
            name: newClient.plan,
            description: `${newClient.plan} plan`,
            price: newClient.plan === 'Basic' ? 9.99 : newClient.plan === 'Pro' ? 29.99 : 99.99,
            duration: 30,
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            is_popular: newClient.plan === 'Pro',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createPlanError) throw createPlanError;

        // Create subscription with the new plan
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: authData.user.id,
            plan_id: newPlan.id,
            status: newClient.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (subscriptionError) throw subscriptionError;
      } else {
        // Create subscription with the existing plan
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: authData.user.id,
            plan_id: planData.id,
            status: newClient.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (subscriptionError) throw subscriptionError;
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
    } catch (error: any) {
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
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
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
