
import { cn } from '@/lib/utils';
import { Project } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  return (
    <div 
      className={cn(
        "group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full",
        className
      )}
    >
      {/* Project Image */}
      <div className="h-48 overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title} 
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out-expo"
        />
      </div>
      
      {/* Category Badge */}
      <Badge 
        className={cn(
          "absolute top-4 right-4 capitalize shadow-sm",
          project.category === 'frontend' ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
          project.category === 'backend' ? "bg-green-100 text-green-800 hover:bg-green-100" :
          project.category === 'fullstack' ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
          "bg-orange-100 text-orange-800 hover:bg-orange-100"
        )}
      >
        {project.category}
      </Badge>
      
      {/* Content */}
      <div className="flex-1 flex flex-col p-5">
        <h3 className="heading-sm mb-2">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{project.description}</p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs font-normal">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{project.techStack.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Links */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary flex items-center gap-1 hover:underline"
          >
            View Project
            <ExternalLink size={14} />
          </a>
          
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="GitHub repository"
            >
              <Github size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
