import { useRef, useState, useEffect } from 'react';
import { useAnimateOnScroll } from '@/utils/animations';
import BlogCard from '@/components/ui/BlogCard';
import { Button } from '@/components/ui/button';
import { fetchPosts } from '@/lib/apis';

const Blog = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  
  useAnimateOnScroll(sectionRef);
  useAnimateOnScroll(headingRef);

  const [posts, setPosts] = useState<any[]>([]);
  const [postsToShow, setPostsToShow] = useState<number>(3); // Initial number of posts to show

  useEffect(() => {
    fetchPosts().then((data: any) => setPosts(data));
  }, []);

  const handleViewMoreArticles = () => {
    setPostsToShow((prev) => prev + 6); // Load 6 more posts each time
  };

  return (
    <section 
      id="blog" 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-secondary/20 to-white"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 ref={headingRef} className="heading-lg mb-6 animate-on-scroll">
            <span className="inline-block px-3 py-1 bg-primary/5 text-primary rounded-md text-sm font-medium mb-3">
              Blog
            </span><br />
            Technical Articles & Insights
          </h2>
          <p className="text-lg text-muted-foreground">
            I share my knowledge and experiences through articles about web development, best practices, and emerging technologies.
          </p>
        </div>
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-visible">
          {posts.length === 0 ?  <div className='text-end text-lg text-muted-foreground'>Coming Soon...</div>
          :  posts.filter(post => post.published).slice(0, postsToShow).map((post: any) => ( // Use postsToShow to limit the number of posts displayed
            <BlogCard
              key={post._id}
              post={post}
              className="stagger-item"
            />
          ))}
        </div>
        
        {/* View More Button */}
        <div className="text-center mt-12">
          {posts.length > postsToShow && ( // Conditionally render the button if there are more posts to show
            <Button size="lg" variant="outline" onClick={handleViewMoreArticles}>
              View All Articles
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;