import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/authContext';
import { ProjectForm } from '@/components/dashboard/ProjectForm';
import { BlogForm } from '@/components/dashboard/BlogForm';
import { MessagesList } from '@/components/dashboard/MessagesList';
import { SkillsForm } from '@/components/dashboard/SkillsForm';
import { TimelineForm } from '@/components/dashboard/TimeLineForm';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { Loader2, Code, FileText, MessageSquare, Briefcase, Clock, User } from 'lucide-react';
import { fetchMessages } from '@/lib/apis';

const Dashboard = () => {
  const { isLoading, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchMessages().then((messages) => {
      const unreadCount = messages?.filter((message) => !message.read).length;
      setUnread(unreadCount);
    });
    if (!isAuthenticated && !isLoading) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" className="border-white text-black hover:bg-gray-700" onClick={handleSignOut}>Sign Out</Button>
      </div>

      <Tabs defaultValue="projects">
        <TabsList className="mb-6 flex flex-wrap bg-gray-800  rounded-lg">
          <TabsTrigger value="projects" className="text-white px-4 py-2 rounded-lg hover:bg-gray-700 ">
            <Code className="h-4 w-4" /> Projects
          </TabsTrigger>
          <TabsTrigger value="blog" className="text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <FileText className="h-4 w-4" /> Blog
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <MessageSquare className="h-4 w-4" /> Messages {unread > 0 && <span className="ml-1 bg-red-500 text-xs px-2 py-1 rounded-full">{unread}</span>}
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <Briefcase className="h-4 w-4" /> Skills
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <Clock className="h-4 w-4" /> Timeline
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <TabsContent value="projects"><ProjectForm /></TabsContent>
          <TabsContent value="blog"><BlogForm /></TabsContent>
          <TabsContent value="messages"><MessagesList /></TabsContent>
          <TabsContent value="skills"><SkillsForm /></TabsContent>
          <TabsContent value="timeline"><TimelineForm /></TabsContent>
          <TabsContent value="profile"><ProfileForm /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
