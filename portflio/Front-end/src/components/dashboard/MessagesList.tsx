
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { fetchMessages, updateMessage, deleteMessage } from '@/lib/apis'; // Adjust the import path as necessary

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export const MessagesList = () => {
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    try {
      setLoading(true);
     fetchMessages().then(data => {
      setMessages(data || []);
     });
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  }, []);

 

  const handleMarkAsRead = async (id: string, currentState: boolean) => {
    
    try {
      updateMessage(id, {read:!currentState}).then(() => {
        toast.success(
          currentState
           ? 'Message marked as unread'
            : 'Message marked as read'
        );
      })

      setMessages(
        messages.map(msg =>
          msg._id === id ? { ...msg, read: !currentState } : msg
        )
      );

      toast.success(
        currentState
          ? 'Message marked as unread'
          : 'Message marked as read'
      );
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      // const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      // if (error) throw error;
      await deleteMessage(id);

      toast.success('Message deleted successfully');
      setMessages(messages.filter(message => message._id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Contact Messages</h2>
        <div className="text-xm text-muted-foreground font-bold">
          {messages.filter(m => !m.read).length} unread
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : messages.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          No messages yet. When visitors send you messages, they'll appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.sort((a, b) =>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ).map(message => (
            <Card
              key={message._id}
              className={`border ${
                !message.read
                  ? 'border-l-4 border-l-blue-500 bg-slate-200'
                  : ''
              }`}
            >
              <CardContent className="p-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-ms">{message.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {message.email}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">{message.subject}</h4>
                    <p className="mt-1 whitespace-pre-line text-xs text-slate-500 ">{message.message}</p>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(message._id, message.read)}
                    >
                      <span className='text-xs'>Mark as {message.read ? 'unread' : 'read'}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReply(message.email)}
                    >
                      <Mail className="h-2 w-2  " />  <span className='text-xs'>Reply</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(message._id)}
                    >
                      <Trash2 className="h-2 w-2  " />  <span className='text-xs'>Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
