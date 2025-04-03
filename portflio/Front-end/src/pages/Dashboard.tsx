import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabase } from '@/lib/supabase';
import { ProjectForm } from '@/components/dashboard/ProjectForm';
import { BlogForm } from '@/components/dashboard/BlogForm';
import { MessagesList } from '@/components/dashboard/MessagesList';
import { SkillsForm } from '@/components/dashboard/SkillsForm';
import { TimelineForm } from '@/components/dashboard/TimeLineForm';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { Loader2, Code, FileText, MessageSquare, Briefcase, Clock, User } from 'lucide-react';
import {fetchMessages} from '@/lib/apis'; // Assuming you have a function to fetch messages

const Dashboard = () => {
  const { isLoading, isAuthenticated, signOut } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [unread, setUnread] = useState(0);

  useEffect(() => {

    // Fetch unread messages count
    fetchMessages().then((messages) => {
      const unreadCount = messages?.filter((message) => !message.read).length;
      setUnread(unreadCount);
    })
    // If not authenticated and not loading, redirect to auth page
    if (!isAuthenticated && !isLoading) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // The useEffect above will handle the redirect
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
      </div>

      <Tabs defaultValue="projects">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="projects" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Blog</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>{unread > 0 && <span className="ml-1 text-xs border border-red-600 rounded-full px-1 bg-red-500 text-zinc-50" >{unread}</span>}
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>Skills</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <ProjectForm />
        </TabsContent>
        <TabsContent value="blog">
          <BlogForm />
        </TabsContent>
        <TabsContent value="messages">
          <MessagesList />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsForm />
        </TabsContent>
        <TabsContent value="timeline">
          <TimelineForm />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
