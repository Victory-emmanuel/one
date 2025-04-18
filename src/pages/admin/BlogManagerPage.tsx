import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogManagerForm from '@/components/admin/blog/BlogManagerForm';
import BlogManagerTable from '@/components/admin/blog/BlogManagerTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { BlogPost } from '@/types/blog';
import { ensureAdminRole } from '@/utils/adminAuth';
import { grantDirectAdminAccess } from '@/utils/directAdminAccess';
import { ShieldCheck, RefreshCw } from 'lucide-react';

const BlogManagerPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [adminAccessLoading, setAdminAccessLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  // Ensure admin role is set in JWT claims
  const ensureAdmin = async () => {
    const isAdmin = await ensureAdminRole();
    if (!isAdmin) {
      setPermissionError(true);
      toast({
        title: 'Admin access required',
        description: 'You need admin access to manage blog posts. Please use the "Grant Admin Access" button below.',
        variant: 'destructive',
      });
    } else {
      setPermissionError(false);
    }
    return isAdmin;
  };

  // Call ensureAdminRole on component mount
  useEffect(() => {
    ensureAdminRole().then(success => {
      console.log('Admin role check on mount:', success);
      setPermissionError(!success);
    });
  }, []);

  // Handle direct admin access
  const handleGrantAdminAccess = async () => {
    setAdminAccessLoading(true);
    try {
      const success = await grantDirectAdminAccess();
      if (success) {
        setPermissionError(false);
        // Refresh the posts after a short delay to allow the JWT to propagate
        setTimeout(() => {
          fetchPosts();
        }, 1000);
      }
    } finally {
      setAdminAccessLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPosts();
  };

  // Fetch blog posts
  const fetchPosts = async () => {
    try {
      setLoading(true);

      // Ensure admin role is set in JWT claims
      const isAdmin = await ensureAdmin();
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error fetching blog posts',
        description: error.message || 'An error occurred while fetching blog posts.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle post creation
  const handleCreatePost = async (post: Omit<BlogPost, 'id' | 'created_at'>) => {
    try {
      setLoading(true);

      // Ensure admin role is set in JWT claims
      const isAdmin = await ensureAdmin();
      if (!isAdmin) {
        setLoading(false);
        return false;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select();

      if (error) throw error;

      toast({
        title: 'Blog post created',
        description: 'Your blog post has been created successfully.',
      });

      // Refresh the posts list
      fetchPosts();

      return true;
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      toast({
        title: 'Error creating blog post',
        description: error.message || 'An error occurred while creating the blog post.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle post update
  const handleUpdatePost = async (post: BlogPost) => {
    try {
      setLoading(true);

      // Ensure admin role is set in JWT claims
      const isAdmin = await ensureAdmin();
      if (!isAdmin) {
        setLoading(false);
        return false;
      }

      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: post.title,
          excerpt: post.excerpt,
          image_url: post.image_url,
          medium_link: post.medium_link,
          tag: post.tag,
          status: post.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: 'Blog post updated',
        description: 'Your blog post has been updated successfully.',
      });

      // Refresh the posts list
      fetchPosts();
      setEditingPost(null);

      return true;
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      toast({
        title: 'Error updating blog post',
        description: error.message || 'An error occurred while updating the blog post.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle post deletion
  const handleDeletePost = async (id: string) => {
    try {
      setLoading(true);

      // Ensure admin role is set in JWT claims
      const isAdmin = await ensureAdmin();
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Blog post deleted',
        description: 'Your blog post has been deleted successfully.',
      });

      // Refresh the posts list
      fetchPosts();
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Error deleting blog post',
        description: error.message || 'An error occurred while deleting the blog post.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blog Manager</h2>
            <p className="text-muted-foreground">
              Create and manage blog posts for your website.
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            {permissionError && (
              <Button
                variant="default"
                onClick={handleGrantAdminAccess}
                disabled={adminAccessLoading}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                {adminAccessLoading ? 'Granting Access...' : 'Grant Admin Access'}
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="create">Create New Post</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <BlogManagerTable
              posts={posts}
              loading={loading}
              onEdit={setEditingPost}
              onDelete={handleDeletePost}
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BlogManagerForm
                onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
                initialData={editingPost}
                onCancel={() => setEditingPost(null)}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default BlogManagerPage;
