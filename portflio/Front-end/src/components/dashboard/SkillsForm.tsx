import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skill } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSkill, deleteSkill, updateSkill, fetchSkills } from '@/lib/apis';

export const SkillsForm = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialSkills, setInitialSkills] = useState<Skill[]>([]);
  const { toast } = useToast();
 
  
  // Available icons for selection
  const availableIcons = ['PenTool', 'Server', 'Layers', 'Cpu', 'Database', 'Globe', 'Code', 'Briefcase'];
  
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchSkills();
        setSkills(data);
        setInitialSkills(data);
      } catch (error) {
        
        toast({
          title: "Error loading skills",
          description: error.response.data.message,
          variant: "destructive"
        });
      }
    };
    loadSkills();
  }, [toast]);
  
  const handleAddSkill = () => {
    const newSkill: Skill = {
      name: '',
      level: 50, // Default to 50% instead of 0
      icon: 'Code' // Set default icon
    };
    setSkills([...skills, newSkill]);
  };
  
  const handleRemoveSkill = (index: number) => {
    const skillToRemove = skills[index];
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
    
    // If the skill has an ID, add it to removedSkills for backend deletion
    if (skillToRemove._id) {
      // This would be used in handleSaveSkills
      setSkills(prev => [...prev]);
    }
  };
  
  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setSkills(updatedSkills);
  };
  
  const handleSaveSkills = async () => {
    setIsLoading(true);
    try {
      // Get added/updated/removed skills
      const addedSkills: Skill[] = [];
      const updatedSkills: Skill[] = [];
      const removedSkills: string[] = [];
      
      // Find removed skills by comparing with initial state
      initialSkills.forEach(initialSkill => {
        if (!skills.some(skill => skill._id === initialSkill._id)) {
          if (initialSkill._id) {
            removedSkills.push(initialSkill._id);
          }
        }
      });
      
      // Classify current skills
      skills.forEach(skill => {
        if (!skill._id) {
          addedSkills.push(skill);
        } else {
          const initialSkill = initialSkills.find(s => s._id === skill._id);
          if (initialSkill && JSON.stringify(initialSkill) !== JSON.stringify(skill)) {
            updatedSkills.push(skill);
          }
        }
      });
      
      // Save all changes
      for (const skill of addedSkills) {
        await createSkill(skill);
        toast({
          title: "Skill added",
          description: `Skill ${skill.name} has been added successfully.`
        });
      }
      
      for (const skill of updatedSkills) {
        await updateSkill(skill._id!, skill);
        toast({
          title: "Skill updated",
          description: `Skill ${skill.name} has been updated successfully.`
        });
      }
      
      for (const id of removedSkills) {
        await deleteSkill(id).then((data) => {
          
          toast({
            title: "Skill deleted",
            description: data.message
          });
        }).catch((error) => {
          
          toast({
            title: "Error deleting skill",
            description: error.response.data.message,
            variant: "destructive"
          });
        });
     
      }
      
      // Refresh the skills list after saving
      const data = await fetchSkills();
      setSkills(data);
      setInitialSkills(data);
      
    } catch (error) {
  
      toast({
        title: "Error saving skills",
        description: error.response.data.message,
        variant: "destructive"
      });
      console.error('Error saving skills:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={skill._id || `new-${index}`} className="space-y-2 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  className="w-full max-w-sm"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveSkill(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm min-w-24">Skill Level:</span>
                <Slider
                  value={[skill.level || 50]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleSkillChange(index, 'level', value[0])}
                  className="flex-1"
                />
                <span className="text-sm">{skill.level}%</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm min-w-24">Icon:</span>
                <Select 
                  value={skill.icon || 'Code'}
                  onValueChange={(value) => handleSkillChange(index, 'icon', value)}
                >
                  <SelectTrigger className="w-full max-w-sm">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button onClick={handleAddSkill} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
            
            <Button 
              onClick={handleSaveSkills} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Skills
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};