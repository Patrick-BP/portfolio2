
import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TimelineItem } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const Timeline = ({ items, className }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const timelineItems = timelineRef.current?.querySelectorAll('.timeline-item');
    timelineItems?.forEach(item => {
      observer.observe(item);
    });

    return () => {
      timelineItems?.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, [items]);

  return (
    <div 
      ref={timelineRef}
      className={cn("relative pl-8 md:pl-0", className)}
    >
      {/* Vertical Line */}
      <div className="absolute left-0 md:left-1/2 top-0 h-full w-[1px] bg-gray-200 transform md:-translate-x-[0.5px]" />
      
      {items.sort((a, b) => a.order - b.order).map((item, index) => (
        <div 
          key={item._id}
          className={cn(
            "timeline-item relative mb-12 md:mb-24 animate-on-scroll opacity-0 transition-all duration-500",
            index % 2 === 0 ? "md:pr-12 md:text-right md:ml-0 md:mr-auto md:pl-0" : "md:pl-12 md:ml-auto md:mr-0 md:pr-0",
            "md:w-[calc(50%-1.5rem)]"
          )}
        >
          {/* Circle on timeline */}
          <div className="absolute left-[-13px] md:left-auto md:right-[-13px] top-0 h-6 w-6 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <span className="inline-block text-sm font-medium text-primary mb-2">
              {item.dateRange}
            </span>
            <h3 className="heading-sm mb-1">{item.title}</h3>
            <p className="text-muted-foreground mb-4">{item.company}</p>
            <p className="text-gray-700 mb-4">{item.description}</p>
            
            {item.skills && (
              <div className="flex flex-wrap gap-2">
                {item.skills.map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
