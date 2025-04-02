import { useState, useRef, useEffect } from 'react';
import { useAnimateOnScroll } from '@/utils/animations';
import ProjectCard from '@/components/ui/ProjectCard';
import { Button } from '@/components/ui/button';
import { fetchProjects } from '@/lib/apis';
import { Project } from '@/lib/data';

type ProjectCategory = 'all' | 'frontend' | 'backend' | 'fullstack' | 'mobile';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsToShow, setProjectsToShow] = useState<number>(6); // Initial number of projects to show
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  
  useAnimateOnScroll(sectionRef);
  useAnimateOnScroll(headingRef);

  const filteredProjects = activeCategory === 'all' 
    ? projects.slice(0, projectsToShow) 
    : projects.filter(project => project.category === activeCategory).slice(0, projectsToShow);
  
  const categories: { value: ProjectCategory; label: string }[] = [
    { value: 'all', label: 'All Projects' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'fullstack', label: 'Full-Stack' },
    { value: 'mobile', label: 'Mobile' },
  ];

  useEffect(() => {
    fetchProjects().then((data: Project[]) => {
      setProjects(data || []);});
  }, []);

  const handleViewMoreProjects = () => {
    setProjectsToShow((prev) => prev + 6); // Load 6 more projects each time
  };

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 ref={headingRef} className="heading-lg mb-6 animate-on-scroll">
            <span className="inline-block px-3 py-1 bg-primary/5 text-primary rounded-md text-sm font-medium mb-3">
              Projects
            </span><br />
            Featured Work
          </h2>
          <p className="text-lg text-muted-foreground">
            A selection of my recent projects, showcasing my technical expertise and problem-solving abilities.
          </p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "outline"}
              onClick={() => {
                setActiveCategory(category.value);
                setProjectsToShow(6); // Reset the number of projects to show when changing category
              }}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-visible ">
          {filteredProjects.length === 0 ?  <div className='text-end text-lg text-muted-foreground'>Coming Soon...</div>
          : filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              className="stagger-item"
            />
          ))}
        </div>
        
        {/* View More Projects Button */}
        <div className="text-center mt-12">
          {activeCategory === 'all' 
            ? projects.length > projectsToShow && (
              <Button size="lg" variant="outline" onClick={handleViewMoreProjects}>
                View More Projects
              </Button>
            )
            : projects.filter(project => project.category === activeCategory).length > projectsToShow && (
              <Button size="lg" variant="outline" onClick={handleViewMoreProjects}>
                View More Projects
              </Button>
            )
          }
        </div>
      </div>
    </section>
  );
};

export default Projects;