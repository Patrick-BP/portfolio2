
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent,CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Edit, Save, X , UploadCloud} from 'lucide-react';
import { toast } from 'sonner';
import { fetchPosts, updatePost, createPost, deletePost} from '@/lib/apis';
 
interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  readTime: number;
  tags: string[];
  published: boolean;
  publishedAt: string;
  publishedBy: string;
}



export const BlogForm = () => {
 
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview URL
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    readTime: 0,
    published: false,
  });
  const [refreshData, setRefreshData] = useState(false);
  

  useEffect(() => {
    setLoading(true);
    fetchPosts()
      .then((data) => {
        setPosts(data || []);
      })
      .catch((error) => {
        console.error('Error fetching blog posts:', error);
        toast.error('Failed to load blog posts');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // Handle checkbox change
  // This is for the published checkbox

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
  };


  // Handle image change and preview

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (e.g., user cancels), clear the preview
      // Keep existing image if editing, otherwise clear
      const currentPost = posts.find(p => p._id === editingId);
      setImagePreview(currentPost?.thumbnail || null);
      setImageFile(null);
    }
  };


  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      readTime: 0,
      published: false,
    });
    setImageFile(null);
    setImagePreview(null); // Reset image preview
    setEditingId(null);
    // Reset file input visually
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      if (editingId) {
        // Update existing post
        let updateData: any;
        if (imageFile) {
          updateData = new FormData();
          updateData.append('title', formData.title);
          updateData.append('content', formData.content);
          updateData.append('excerpt', formData.excerpt);
          updateData.append('tags', JSON.stringify(tags));
          updateData.append('published', String(formData.published));
          updateData.append('readTime', String(formData.readTime));
          updateData.append('thumbnail', imageFile);
          if (formData.published) {
            updateData.append('publishedAt', new Date().toISOString());
          }
        } else {
          updateData = {
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            tags,
            published: formData.published,
            readTime: formData.readTime,
          };
          if (formData.published) {
            updateData.publishedAt = new Date().toISOString();
          }
        }

        await updatePost(editingId, updateData);
        setRefreshData(r => !r);
        toast.success('Blog post updated successfully');
        setEditingId(null);
        resetForm();
      } else {
        // Create new post
        let newPost: any;
        if (imageFile) {
          newPost = new FormData();
          newPost.append('title', formData.title);
          newPost.append('content', formData.content);
          newPost.append('excerpt', formData.excerpt);
          newPost.append('tags', JSON.stringify(tags));
          newPost.append('published', String(formData.published));
          newPost.append('readTime', String(formData.readTime));
          newPost.append('thumbnail', imageFile);
          if (formData.published) {
            newPost.append('publishedAt', new Date().toISOString());
          }
        } else {
          newPost = {
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            tags,
            published: formData.published,
            readTime: formData.readTime,
          };
          if (formData.published) {
            newPost.publishedAt = new Date().toISOString();
          }
        }
        await createPost(newPost);
        setRefreshData(r => !r);
        toast.success('Post added successfully');
        resetForm();
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(error?.response?.data?.message || error.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post._id);
    setImagePreview(post.thumbnail || null); // Set preview to existing thumbnail
    setImageFile(null); // Clear any previously selected file
    // Reset file input visually
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags.join(', '),
      published: post.published,
      readTime: post.readTime,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle delete post
  // This function will be called when the delete button is clicked

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await deletePost(id);
      toast.success('Blog post deleted successfully');
      setRefreshData(!refreshData); // Toggle refresh state
      
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' &&
          error &&
          'response' in error &&
          error.response &&
          'data' in (error as any).response &&
          'message' in (error as any).response.data)
          ? (error as any).response.data.message
          : error instanceof Error
            ? error.message
            : 'Error deleting blog post';
      toast.error(message);
      console.error('Error deleting blog post:', error);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit}  className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                required
                placeholder="A brief summary of your post"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content <i className='text-xs  text-stone-800'>(use md formatting for headings, lists, code etc.)</i>
              </label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                required
                placeholder="Write your blog post content here... Supports Markdown formatting."
              />
            </div>


             {/* Image Upload and Preview */}
             <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Blog Image
              </label>
              <div className="flex items-center gap-4">
                {/* Image Preview */}
                <div className="w-24 h-24 border rounded-md flex items-center justify-center bg-muted overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Project preview" className="w-full h-full object-cover" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                {/* File Input */}
                <div className="flex-grow">
                  <Input
                    id="image"
                    ref={fileInputRef} // Add ref
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />

                  
                  <CardDescription className="text-xs mt-1">
                    {editingId && !imageFile && imagePreview
                      ? 'Current image shown. Upload a new file to replace it.'
                      : editingId && !imageFile && !imagePreview
                      ? 'No current image. Upload a file.'
                      : !editingId && !imageFile
                      ? 'Upload a screenshot or thumbnail.'
                      : 'New image selected for upload.'}
                  </CardDescription>
                </div>
              </div>
            </div>
            {/* End Image Upload */}
      

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, JavaScript, Web Development (comma separated)"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="readTime" className="text-sm font-medium">
                ReadTime
              </label>
              <Input
                id="readTime"
                type="number"
                min={1}
                max={60}
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="20"
                className='w-1/8'
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Post
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </>
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">[{posts.filter(post => !post.published).length}] Unpublished Posts</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No blog posts found. Create your first post above!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.filter(post => !post.published).map(post => (
              <Card key={post._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {post.thumbnail && (
                      <div className="md:w-1/4 h-36 md:h-auto overflow-hidden rounded-md">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="md:w-3/4">
                      <h3 className="text-xl font-bold mb-2" data-testid={`post-title-${post._id}`}>{post.title}</h3>
                      <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {post.published && new Date(post.publishedAt).toLocaleDateString()}
                          {!post.published && (
                            <span className="ml-2 text-orange-500 font-medium">
                              • Draft
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`edit-post-${post._id}`}
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            data-testid={`delete-post-${post._id}`}
                            onClick={() => handleDelete(post._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">[{posts.filter(post => post.published).length}] Published Posts</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No blog posts found. Create your first post above!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.filter(post => post.published).map(post => (
              <Card key={post._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {post.thumbnail && (
                      <div className="md:w-1/4 h-36 md:h-auto overflow-hidden rounded-md">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="md:w-3/4">
                      <h3 className="text-xl font-bold mb-2" data-testid={`post-title-${post._id}`}>{post.title}</h3>
                      <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                          {post.published && (
                            <span className="ml-2 text-green-700 font-medium">
                              • Published
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`edit-post-${post._id}`}
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            data-testid={`delete-post-${post._id}`}
                            onClick={() => handleDelete(post._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
