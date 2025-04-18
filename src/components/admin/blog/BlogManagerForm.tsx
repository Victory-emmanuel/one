import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BlogPost, BLOG_TAGS, BlogStatus } from '@/types/blog';
import { Loader2 } from 'lucide-react';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  image_url: z.string().url('Please enter a valid URL'),
  medium_link: z.string().url('Please enter a valid URL'),
  tag: z.string().min(1, 'Please select a tag'),
  status: z.enum(['draft', 'published']),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogManagerFormProps {
  onSubmit: (data: any) => Promise<boolean>;
  initialData?: BlogPost | null;
  onCancel?: () => void;
}

const BlogManagerForm = ({ onSubmit, initialData, onCancel }: BlogManagerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      image_url: '',
      medium_link: '',
      tag: '',
      status: 'draft',
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        excerpt: initialData.excerpt,
        image_url: initialData.image_url,
        medium_link: initialData.medium_link,
        tag: initialData.tag,
        status: initialData.status,
      });
    } else {
      form.reset({
        title: '',
        excerpt: '',
        image_url: '',
        medium_link: '',
        tag: '',
        status: 'draft',
      });
    }
  }, [initialData, form]);

  // Handle form submission
  const handleFormSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const data = initialData
        ? { ...values, id: initialData.id, created_at: initialData.created_at }
        : values;

      const success = await onSubmit(data);

      if (success) {
        // Reset the form if it's a new post
        if (!initialData) {
          form.reset({
            title: '',
            excerpt: '',
            image_url: '',
            medium_link: '',
            tag: '',
            status: 'draft',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
        <CardDescription>
          {initialData
            ? 'Update the details of your blog post'
            : 'Fill in the details to create a new blog post'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog post title" {...field} />
                  </FormControl>
                  <FormDescription>
                    The headline of your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a short description of your blog post"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief summary or introduction to your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL of the main image for your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medium_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium Post Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://medium.com/@yourusername/your-post" {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL that links to the full Medium post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tag" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOG_TAGS.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set as draft to save without publishing, or published to make it visible on the blog.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BlogManagerForm;
