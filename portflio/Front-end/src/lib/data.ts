
import { Code, PenTool, Briefcase, Layers, Server, Cpu, Globe, Database } from 'lucide-react';

export interface TimelineItem {
  _id: string;
  order?: number;
  dateRange: string;
  title: string;
  company: string;
  description: string;
  skills?: string[];
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  featured: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  content: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  thumbnail: string;
  readTime: number;
  tags: string[];
  published: boolean;
  publishedBy: string,
  createdAt: string;
}

export interface Skill {
  _id?: string;
  name: string;
  level: number; // 1-5
  icon: any;
}

export const SKILLS_DATA: Skill[] = [
  { name: 'Frontend Development', level: 5, icon: PenTool },
  { name: 'Backend Development', level: 4, icon: Server },
  { name: 'UI/UX Design', level: 4, icon: Layers },
  { name: 'DevOps', level: 3, icon: Cpu },
  { name: 'Database Management', level: 4, icon: Database },
  { name: 'Web Performance', level: 5, icon: Globe },
];

// export const TIMELINE_DATA: TimelineItem[] = [
//   {
//     id: '1',
//     date: '2022 - Present',
//     title: 'Senior Full-Stack Developer',
//     organization: 'Tech Innovations Inc.',
//     description: 'Leading a team of developers to build scalable web applications. Implementing CI/CD pipelines and ensuring code quality through automated testing.',
//     technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
//   },
//   {
//     id: '2',
//     date: '2019 - 2022',
//     title: 'Full-Stack Developer',
//     organization: 'Digital Solutions Co.',
//     description: 'Developed and maintained multiple web applications using modern JavaScript frameworks. Collaborated with design team to implement responsive UI components.',
//     technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Docker', 'GraphQL'],
//   },
//   {
//     id: '3',
//     date: '2017 - 2019',
//     title: 'Frontend Developer',
//     organization: 'WebCraft Agency',
//     description: 'Built responsive websites and interactive user interfaces. Optimized frontend performance and implemented accessibility standards.',
//     technologies: ['HTML/CSS', 'JavaScript', 'React', 'SCSS', 'Webpack'],
//   },
//   {
//     id: '4',
//     date: '2014 - 2017',
//     title: 'Computer Science Degree',
//     organization: 'University of Technology',
//     description: 'Bachelor of Science in Computer Science with a focus on software engineering and web technologies.',
//     technologies: ['Java', 'Python', 'Data Structures', 'Algorithms', 'Web Development'],
//   },
// ];

// export const PROJECTS_DATA: Project[] = [
//   {
//     id: '1',
//     title: 'E-Commerce Platform',
//     description: 'A full-stack e-commerce platform with customer and admin dashboards, payment integration, and inventory management.',
//     image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
//     technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
//     link: '#',
//     github: 'https://github.com/username/ecommerce',
//     category: 'fullstack',
//   },
//   {
//     id: '2',
//     title: 'Weather Dashboard',
//     description: 'An interactive weather application with real-time data, forecasts, and location-based services.',
//     image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=2070&auto=format&fit=crop',
//     technologies: ['JavaScript', 'React', 'OpenWeather API', 'CSS3', 'Chart.js'],
//     link: '#',
//     github: 'https://github.com/username/weather-app',
//     category: 'frontend',
//   },
//   {
//     id: '3',
//     title: 'Task Management API',
//     description: 'A RESTful API for task management with authentication, task creation, updates, and team collaboration features.',
//     image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
//     technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
//     link: '#',
//     github: 'https://github.com/username/task-api',
//     category: 'backend',
//   },
//   {
//     id: '4',
//     title: 'Financial Dashboard',
//     description: 'An analytics dashboard for financial data visualization with interactive charts and data filtering.',
//     image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
//     technologies: ['React', 'D3.js', 'Material UI', 'Firebase', 'Redux'],
//     link: '#',
//     category: 'frontend',
//   },
//   {
//     id: '5',
//     title: 'Fitness Tracking App',
//     description: 'A mobile application for tracking workouts, nutrition, and fitness progress with social features.',
//     image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop',
//     technologies: ['React Native', 'Redux', 'Firebase', 'Expo', 'Node.js'],
//     link: '#',
//     category: 'mobile',
//   },
//   {
//     id: '6',
//     title: 'Content Management System',
//     description: 'A customizable CMS with user roles, content publishing workflow, and media management.',
//     image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
//     technologies: ['Express', 'MongoDB', 'React', 'AWS S3', 'Redis'],
//     link: '#',
//     category: 'fullstack',
//   },
// ];

// export const BLOG_DATA: BlogPost[] = [
//   {
//     id: '1',
//     title: 'Building Scalable React Applications: Best Practices',
//     excerpt: 'Learn how to structure your React applications for optimal performance and maintainability at scale.',
//     date: 'Apr 12, 2023',
//     readTime: '8 min read',
//     slug: 'building-scalable-react-applications',
//     image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
//     tags: ['React', 'Frontend', 'Architecture'],
//   },
//   {
//     id: '2',
//     title: 'Modern Authentication Patterns for Node.js Applications',
//     excerpt: 'A comprehensive guide to implementing secure authentication in your Node.js applications.',
//     date: 'Feb 24, 2023',
//     readTime: '11 min read',
//     slug: 'modern-authentication-patterns',
//     image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
//     tags: ['Node.js', 'Security', 'Backend'],
//   },
//   {
//     id: '3',
//     title: 'Optimizing Web Performance: A Case Study',
//     excerpt: 'How we improved loading times by 300% on a high-traffic e-commerce site.',
//     date: 'Jan 16, 2023',
//     readTime: '6 min read',
//     slug: 'optimizing-web-performance',
//     image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=2070&auto=format&fit=crop',
//     tags: ['Performance', 'Optimization', 'Case Study'],
//   },
// ];
