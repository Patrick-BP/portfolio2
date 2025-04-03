import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Upload, FileUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchProfile, updateProfile } from '@/lib/apis';

interface ProfileData {
  _id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  linkedin: string;
  github: string;
  twitter: string;
  resumeUrl: string;
  resumeName: string;
}

export const ProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
    linkedin: '',
    github: '',
    twitter: '',
    resumeUrl: '',
    resumeName: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProfile();
        if (data) {
          setProfileData({
            name: data.name || '',
            title: data.title || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            bio: data.bio || '',
            avatar: data.avatar || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
            twitter: data.twitter || '',
            resumeUrl: data.resumeUrl || '',
            resumeName: data.resumeName || '',
            _id: data._id
          });
        }
      } catch (error) {
        toast({
          title: "Error loading profile",
          description: "Could not load profile data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [toast]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }

    setAvatarFile(file);
    const imageUrl = URL.createObjectURL(file);
    handleInputChange('avatar', imageUrl);
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setResumeFile(file);
    handleInputChange('resumeName', file.name);
  };

  const handleSaveProfile = async () => {
    if (!profileData.name || !profileData.email) {
      toast({
        title: "Validation error",
        description: "Name and email are required fields",
        variant: "destructive"
      });
      return;
    }
  
    setIsLoading(true);
    try {
      const formData = new FormData();
  
      // Append all profile fields except avatar preview URL
      Object.keys(profileData).forEach(key => {
        if (key !== '_id' && key !== 'avatar' && key !== 'resumeUrl') {
          formData.append(key, profileData[key as keyof ProfileData]);
        }
      });
  
      // Append avatar file if it exists
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
  
      // Append resume file if it exists
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
  
      if (profileData._id) {
        const updatedProfile = await updateProfile(profileData._id, formData);
        
        setProfileData(prev => ({ 
          ...prev, 
          ...updatedProfile,
          avatar: updatedProfile.avatar || prev.avatar, // Ensure updated avatar URL is used
          resumeUrl: updatedProfile.resumeUrl || prev.resumeUrl,
          resumeName: updatedProfile.resumeName || prev.resumeName
        }));
       
        // Clear file states after successful upload
        setAvatarFile(null);
        setResumeFile(null);
      }
  
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profileData.avatar} />
            <AvatarFallback>
              {profileData.name ? profileData.name.charAt(0) : 'P'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className={`flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 ${isLoading ? 'opacity-50' : ''}`}>
                <Upload className="h-4 w-4" />
                <span>Upload Avatar</span>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            {avatarFile && (
              <span className="text-sm text-muted-foreground">
                {avatarFile.name}
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">Full Name *</label>
              <Input
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="text-sm">Professional Title</label>
              <Input
                value={profileData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">Email *</label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="text-sm">Phone</label>
              <Input
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm">Location</label>
            <Input
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="text-sm">Bio</label>
            <Textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              disabled={isLoading}
            />
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-md p-4">
            <label className="text-sm font-medium mb-2 block">Resume / CV</label>
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className={`flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 ${isLoading ? 'opacity-50' : ''}`}>
                  <FileUp className="h-4 w-4" />
                  <span>Upload Resume</span>
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              
              {!profileData.resumeUrl ? (
                <span className="text-sm text-muted-foreground">
                  No resume uploaded yet.
                </span>
              ) : profileData.resumeUrl && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="font-medium">Current file:</span>
                  <a 
                    href={profileData.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {profileData.resumeUrl.slice(37)}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm">LinkedIn URL</label>
              <Input
                value={profileData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="text-sm">GitHub URL</label>
              <Input
                value={profileData.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                placeholder="https://github.com/username"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="text-sm">Twitter URL</label>
              <Input
                value={profileData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                placeholder="https://twitter.com/username"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSaveProfile} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};