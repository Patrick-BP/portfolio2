
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Added CardDescription
import { Loader2, Plus, Trash2, Edit, Save, X, UploadCloud } from 'lucide-react'; // Added UploadCloud
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" // Add Select imports
import { toast } from 'sonner';
import { fetchProjects, deleteProject } from '@/lib/apis';
import { Project } from '@/lib/data';
import {updateProject, createProject} from '@/lib/apis'; // Removed uploadImage import


export const ProjectForm = () => {
  const [projects, setProjects] = useState<Project[]>([]); // Add type
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview URL
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    live_url: '',
    tech_stack: '',
    category: '', // Add category state
  });
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    fetchProjects().then((data) => {
      setLoading(true);
      setProjects(data || []);
  
  }).catch((error) => {
    console.error('Error fetching projects:', error);
    toast.error('Failed to load projects');
  }).finally(() => {
    setLoading(false);
  });
  }, [refreshData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
      const currentProject = projects.find(p => p._id === editingId);
      setImagePreview(currentProject?.thumbnail || null);
      setImageFile(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      github_url: '',
      live_url: '',
      tech_stack: '',
      category: '', // Reset category
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
      // No separate image upload step needed here anymore

      const tech_stack = formData.tech_stack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech);

      if (editingId) {
        // Update existing project
        const updateData: any = {
          title: formData.title,
          description: formData.description,
          githubUrl: formData.github_url,
          liveUrl: formData.live_url,
          techStack: tech_stack,
          category: formData.category, // Add category to update data
          // Remove thumbnail, backend will handle URL generation
        };
        // Add the image file directly if it exists
        if (imageFile) {
          updateData.thumbnail = imageFile;
        }

        updateProject(editingId, updateData).then(async () => {
          
          setRefreshData(!refreshData); // Toggle refresh state
          toast.success('Project updated successfully');
        }).catch((error) => {
          console.error('Error updating project:', error);
          toast.error('Failed to update project');
        });

      } else {
        // Create new project
        const newProjectData: any = { // Use a more descriptive name and type
          title: formData.title,
          description: formData.description,
          // Remove thumbnail, backend handles URL
          githubUrl: formData.github_url,
          liveUrl: formData.live_url,
          techStack: tech_stack,
          category: formData.category, // Add category to new project data
        };
        // Add the image file directly if it exists
        if (imageFile) {
          newProjectData.thumbnail = imageFile;
        }

      createProject(newProjectData).then(() => { // Pass the modified data object
        setRefreshData(!refreshData); // Toggle refresh state
        toast.success('Project added successfully');
      }).catch((error) => {
        console.error('Error adding project:', error);
        toast.error('Failed to add project');
      }).finally(() => {
        setSaving(false);
      });
      }

      resetForm();
      
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(editingId ? 'Failed to update project' : 'Failed to add project');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project._id);
    setImagePreview(project.thumbnail || null); // Set preview to existing thumbnail
    setImageFile(null); // Clear any previously selected file
    // Reset file input visually
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData({
      title: project.title,
      description: project.description,
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      tech_stack: project.techStack.join(', '),
      category: project.category || '', // Set category in edit mode
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Function to handle project deletion
  // Added confirmation dialog before deletion

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject(id);
      toast.success('Project deleted successfully');
      // No need to manually filter, useEffect handles refresh
      setRefreshData(!refreshData); // Trigger refresh
      if (editingId === id) { // If deleting the project being edited, reset form
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Project' : 'Add New Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef}  onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Project Title
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
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            {/* Image Upload and Preview */}
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Project Image
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


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="github_url" className="text-sm font-medium">
                  GitHub URL
                </label>
                <Input
                  id="github_url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="live_url" className="text-sm font-medium">
                  Live Demo URL
                </label>
                <Input
                  id="live_url"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleChange}
                  placeholder="https://your-demo-url.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="tech_stack" className="text-sm font-medium">
                Tech Stack
              </label>
              <Input
                id="tech_stack"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="React, Tailwind, Node.js (comma separated)"
                required
              />
            </div>

            {/* Category Select Input */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="fullstack">Fullstack</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* End Category Select Input */}


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
                    Update Project
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
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
        <h2 className="text-xl font-bold">Existing Projects</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No projects found. Add your first project above!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <Card key={project._id} className="overflow-hidden">
                {project.thumbnail && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
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
