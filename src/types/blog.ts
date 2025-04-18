export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  medium_link: string;
  tag: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at?: string;
}

export type BlogStatus = 'draft' | 'published';

export type BlogTag =
  | 'Digital Marketing'
  | 'Email Marketing'
  | 'SEO Marketing'
  | 'Social Media Marketing';

export const BLOG_TAGS: BlogTag[] = [
  'Digital Marketing',
  'Email Marketing',
  'SEO Marketing',
  'Social Media Marketing'
];
