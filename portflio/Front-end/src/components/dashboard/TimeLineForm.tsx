import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TimelineItem } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchTimeLine, updateTimeLine, deleteTimeLine } from '@/lib/apis';

export const TimelineForm = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [newTech, setNewTech] = useState<string>('');

  useEffect(() => {
    // fetch timeline items from database
    fetchTimeLine().then((data: TimelineItem[]) => setTimelineItems(data));
  }, []);

  const handleAddTimelineItem = () => {
    const newItem: TimelineItem = {
      _id: '',
      order: timelineItems.length + 1,
      dateRange: '',
      title: '',
      company: '',
      description: '',
      skills: [],
    };
    setTimelineItems([...timelineItems, newItem]);
  };

  const handleRemoveTimelineItem = (index: number, skillId: string) => {
    const updatedItems = [...timelineItems];
    updatedItems.splice(index, 1);
    setTimelineItems(updatedItems);
    deleteTimeLine(skillId);
  };

  const handleItemChange = (index: number, field: keyof TimelineItem, value: any) => {
    const updatedItems = [...timelineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setTimelineItems(updatedItems);
  };

  const handleAddTech = (index: number) => {
    if (!newTech.trim()) return;
    
    const updatedItems = [...timelineItems];
    const skills = updatedItems[index].skills || [];
    updatedItems[index].skills = [...skills, newTech.trim()];
    setTimelineItems(updatedItems);
    setNewTech('');
  };

  const handleRemoveTech = (itemIndex: number, techIndex: number) => {
    
    const updatedItems = [...timelineItems];
    const skills = [...(updatedItems[itemIndex].skills || [])];
    skills.splice(techIndex, 1);
    updatedItems[itemIndex].skills = skills;
    setTimelineItems(updatedItems);
    
  };

  const handleSaveTimeline = async () => {
    console.log(timelineItems);
    setIsLoading(true);
    try {
      await updateTimeLine(timelineItems).then(() => {
        toast({
          title: "Timeline saved",
          description: "Your timeline has been updated successfully.",
        });
      });
    } catch (error) {
      toast({
        title: "Error saving timeline",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
      console.error('Error saving timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineItems.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item, index) => (
            <div key={item._id} className="space-y-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Timeline Entry {index + 1}</h3>
                <button
                  data-testid={`delete-timeline-${item._id}`}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  onClick={() => handleRemoveTimelineItem(index, item._id)}
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-7">
                 <div>
                  <label className="text-sm">Order</label>
                  <Input
                    placeholder="e.g., 100"
                    value={item.order}
                    onChange={(e) => handleItemChange(index, 'order', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
             
                <div>
                  <label className="text-sm">Date Range</label>
                  <Input
                    placeholder="e.g., 2020 - Present"
                    value={item.dateRange}
                    onChange={(e) => handleItemChange(index, 'dateRange', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm">Title/Position</label>
                  <Input
                    placeholder="e.g., Senior Developer"
                    value={item.title}
                    onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm">Organization</label>
                <Input
                  placeholder="e.g., Tech Company Inc."
                  value={item.company}
                  onChange={(e) => handleItemChange(index, 'company', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm">Description</label>
                <Textarea
                  placeholder="Describe your roles, responsibilities, and achievements"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm mb-2 block">Technology Used</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.skills?.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button 
                        onClick={() => handleRemoveTech(index, skillIndex)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech(index);
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => handleAddTech(index)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button onClick={handleAddTimelineItem} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Timeline Entry
            </Button>
            
            <Button 
              onClick={handleSaveTimeline} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Timeline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
