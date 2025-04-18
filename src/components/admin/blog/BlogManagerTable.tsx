import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { BlogPost } from '@/types/blog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

interface BlogManagerTableProps {
  posts: BlogPost[];
  loading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

const BlogManagerTable = ({ posts, loading, onEdit, onDelete }: BlogManagerTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof BlogPost>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortField === 'created_at' || sortField === 'updated_at') {
      const dateA = new Date(a[sortField] || a.created_at).getTime();
      const dateB = new Date(b[sortField] || b.created_at).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    const valueA = String(a[sortField]).toLowerCase();
    const valueB = String(b[sortField]).toLowerCase();

    return sortDirection === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Handle sort
  const handleSort = (field: keyof BlogPost) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      onDelete(postToDelete);
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            Manage your blog posts. You can edit, delete, or view the posts.
          </CardDescription>
          <div className="flex items-center mt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search posts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-marketing-blue" />
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No posts match your search' : 'No blog posts found. Create your first post!'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('title')}
                        className="flex items-center"
                      >
                        Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Excerpt</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('tag')}
                        className="flex items-center"
                      >
                        Tag
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('status')}
                        className="flex items-center"
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('created_at')}
                        className="flex items-center"
                      >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="line-clamp-2">{post.excerpt}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.tag}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={post.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}>
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(post.created_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(post)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(post.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                href={post.medium_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View on Medium
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlogManagerTable;
