import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost as BlogPostType } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { fetchPost } from '@/lib/apis';

const BlogPost = () => {
  
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    
    fetchPost(id).then((data) => setPost(data));
     
      setLoading(false);
   
    }, []);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }).format(date);
      };
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse space-y-4 w-full max-w-3xl">
              <div className="h-8 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
              <div className="h-64 bg-secondary rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-secondary rounded"></div>
                <div className="h-4 bg-secondary rounded"></div>
                <div className="h-4 bg-secondary rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Hero Section with Image */}
        <div 
          className="w-full h-[40vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${post.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <div className="container mx-auto px-4 py-8 text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                  <User size={16} />
                  {post.publishedBy} 
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {post.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4 border-b">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/#blog">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        {/* Content */}
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Excerpt */}
            <p className="text-lg font-medium text-muted-foreground mb-8 border-l-4 border-primary pl-4 py-2">
              {post.excerpt}
            </p>
            
            {/* Content - For demo purposes, generating some placeholder content */}
            <div className="prose prose-lg max-w-none">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. 
                Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. 
                Praesent et diam eget libero egestas mattis sit amet vitae augue.
              </p>
              
              <h2>Key Points to Consider</h2>
              <p>
                Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem.
              </p>
              
              <ul>
                <li>Consectetur adipiscing elit</li>
                <li>Integer molestie lorem at massa</li>
                <li>Facilisis in pretium nisl aliquet</li>
                <li>Nulla volutpat aliquam velit</li>
              </ul>
              
              <h2>Implementation Details</h2>
              <p>
                Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. 
                Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. 
                Donec sed odio eros.
              </p>
              
              <pre><code>{`function example() {
  console.log("Hello, world!");
  return true;
}`}</code></pre>
              
              <h2>Conclusion</h2>
              <p>
                Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, 
                nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.
              </p>
            </div>
            
            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t">
              <Button variant="outline" asChild>
                <Link to="/#blog" className="inline-flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Back to all articles
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
