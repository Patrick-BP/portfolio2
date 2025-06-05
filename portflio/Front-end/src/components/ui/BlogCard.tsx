
import { cn } from '@/lib/utils';
import { BlogPost } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

const BlogCard = ({ post, className }: BlogCardProps) => {

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Link
      to={`/blog/${post._id}`}
      className={cn(
        "group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full",
        className
      )}
    >
      {/* Blog Image */}

      {/* If no thumbnail, use a placeholder image */}
  {post.thumbnail ?  (
      <div className="h-48 overflow-hidden">
        <img 
          src={post.thumbnail} 
          alt={post.title} 
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out-expo"
        />
      </div>) : null }
      
      {/* Content */}
      <div className="flex-1 flex flex-col p-5">
        {/* Date & Read Time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{post.publishedAt && formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {post.readTime} min read
          </span>
        </div>
        
        <h3 className="heading-sm mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.excerpt}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
