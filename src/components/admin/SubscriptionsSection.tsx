import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Check, X, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SubscriptionsSection = () => {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    try {
      // Fetch pricing plans from the database
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the expected format
      const formattedPlans = data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        features: typeof plan.features === 'string' ?
          JSON.parse(plan.features) :
          Array.isArray(plan.features) ?
            plan.features :
            [],
        isPopular: plan.is_popular,
        lastUpdated: new Date(plan.updated_at).toISOString().split('T')[0]
      }));

      setPlans(formattedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: 'Error fetching plans',
        description: 'Could not load pricing plans. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  // New plan form state
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    duration: '30',
    features: '',
    isPopular: false
  });

  // Edit plan form state
  const [editPlan, setEditPlan] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    duration: '',
    features: '',
    isPopular: false
  });

  const handleAddPlan = async () => {
    if (!newPlan.name || !newPlan.description || !newPlan.price || !newPlan.duration || !newPlan.features) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Add the plan to the database

      const featuresArray = newPlan.features.split('\\n').map(feature => feature.trim()).filter(Boolean);

      const { data, error } = await supabase
        .from('pricing_plans')
        .insert({
          name: newPlan.name,
          description: newPlan.description,
          price: parseFloat(newPlan.price),
          duration: parseInt(newPlan.duration),
          features: featuresArray,
          is_popular: newPlan.isPopular,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      // Refresh plans list
      await fetchPlans();

      // Reset form
      setNewPlan({
        name: '',
        description: '',
        price: '',
        duration: '30',
        features: '',
        isPopular: false
      });

      setIsAddingPlan(false);

      toast({
        title: 'Plan added',
        description: 'The pricing plan has been added successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error adding plan',
        description: error.message || 'An error occurred while adding the plan.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setEditPlan({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      features: plan.features.join('\\n'),
      isPopular: plan.isPopular
    });
    setIsEditingPlan(true);
  };

  const handleUpdatePlan = async () => {
    if (!editPlan.name || !editPlan.description || !editPlan.price || !editPlan.duration || !editPlan.features) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update the plan in the database

      const featuresArray = editPlan.features.split('\\n').map(feature => feature.trim()).filter(Boolean);

      const { error } = await supabase
        .from('pricing_plans')
        .update({
          name: editPlan.name,
          description: editPlan.description,
          price: parseFloat(editPlan.price),
          duration: parseInt(editPlan.duration),
          features: featuresArray,
          is_popular: editPlan.isPopular,
          updated_at: new Date().toISOString()
        })
        .eq('id', editPlan.id);

      if (error) throw error;

      // Refresh plans list
      await fetchPlans();

      setIsEditingPlan(false);

      toast({
        title: 'Plan updated',
        description: 'The pricing plan has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating plan',
        description: error.message || 'An error occurred while updating the plan.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      // Check if the plan is being used by any subscriptions
      const { data: subscriptions, error: checkError } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('plan_id', planId);

      if (checkError) throw checkError;

      if (subscriptions && subscriptions.length > 0) {
        toast({
          title: 'Cannot delete plan',
          description: 'This plan is currently being used by one or more users. Please update their subscriptions first.',
          variant: 'destructive',
        });
        return;
      }

      // Delete the plan from the database
      const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      // Refresh plans list
      await fetchPlans();

      toast({
        title: 'Plan deleted',
        description: 'The pricing plan has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting plan',
        description: error.message || 'An error occurred while deleting the plan.',
        variant: 'destructive',
      });
    }
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
              <CardTitle>Pricing Plan Management</CardTitle>
              <CardDescription>
                Create and manage pricing plans for your clients
              </CardDescription>
            </div>
            <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Pricing Plan</DialogTitle>
                  <DialogDescription>
                    Create a new pricing plan for your clients. This will be visible on the public pricing page.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                      placeholder="e.g., Basic, Pro, Enterprise"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      placeholder="e.g., For individuals just getting started"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                        placeholder="e.g., 9.99"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={newPlan.duration}
                        onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                        placeholder="e.g., 30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="features">Features (one per line)</Label>
                    <Textarea
                      id="features"
                      value={newPlan.features}
                      onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                      placeholder="e.g., Basic Analytics&#10;Email Support&#10;Up to 5 Projects"
                      rows={5}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={newPlan.isPopular}
                      onChange={(e) => setNewPlan({ ...newPlan, isPopular: e.target.checked })}
                      className="rounded border-gray-300"
                      title="Mark as popular plan"
                      aria-label="Mark as popular plan"
                    />
                    <Label htmlFor="isPopular">Mark as Popular</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingPlan(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPlan} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Plan'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Popular</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPlans ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-marketing-blue" />
                    </TableCell>
                  </TableRow>
                ) : plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No pricing plans found
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">{plan.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>${plan.price.toFixed(2)}</TableCell>
                      <TableCell>{plan.duration} days</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside text-sm">
                          {plan.features.slice(0, 2).map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                          {plan.features.length > 2 && (
                            <li className="text-muted-foreground">+{plan.features.length - 2} more</li>
                          )}
                        </ul>
                      </TableCell>
                      <TableCell>
                        {plan.isPopular ? (
                          <Badge className="bg-green-500">
                            <Star className="h-3 w-3 mr-1" /> Popular
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell>{plan.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeletePlan(plan.id)}>
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
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Changes to pricing plans will be reflected on the public pricing page.
          </p>
        </CardFooter>
      </Card>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditingPlan} onOpenChange={setIsEditingPlan}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pricing Plan</DialogTitle>
            <DialogDescription>
              Update the details of this pricing plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Plan Name</Label>
              <Input
                id="edit-name"
                value={editPlan.name}
                onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editPlan.description}
                onChange={(e) => setEditPlan({ ...editPlan, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editPlan.price}
                  onChange={(e) => setEditPlan({ ...editPlan, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (days)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min="1"
                  value={editPlan.duration}
                  onChange={(e) => setEditPlan({ ...editPlan, duration: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-features">Features (one per line)</Label>
              <Textarea
                id="edit-features"
                value={editPlan.features}
                onChange={(e) => setEditPlan({ ...editPlan, features: e.target.value })}
                rows={5}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isPopular"
                checked={editPlan.isPopular}
                onChange={(e) => setEditPlan({ ...editPlan, isPopular: e.target.checked })}
                className="rounded border-gray-300"
                title="Mark as popular plan"
                aria-label="Mark as popular plan"
              />
              <Label htmlFor="edit-isPopular">Mark as Popular</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPlan(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePlan} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Plan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SubscriptionsSection;
