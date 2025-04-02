
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SkillBadgeProps {
  name: string;
  level: number;
  icon: LucideIcon;
  className?: string;
}

const SkillBadge = ({ name, level, icon: Icon, className }: SkillBadgeProps) => {
  return (
    <div className={cn(
      "group relative flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex-shrink-0 p-2 bg-secondary rounded-lg text-primary">
        <Icon size={20} />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-sm mb-1">{name}</h3>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out-expo"
            style={{ width: `${(level )}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillBadge;
