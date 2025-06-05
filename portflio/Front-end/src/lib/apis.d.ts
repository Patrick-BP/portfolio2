import { BlogPost, Project, Skill, TimelineItem } from './data';

// Blog related functions
export function fetchPosts(): Promise<BlogPost[]>;
export function fetchPost(id: string): Promise<BlogPost>;
export function createPost(post: Partial<BlogPost>): Promise<BlogPost>;
export function updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost>;
export function deletePost(id: string): Promise<void>;

// Project related functions
export function fetchProjects(): Promise<Project[]>;
export function createProject(project: Partial<Project>): Promise<Project>;
export function updateProject(id: string, project: Partial<Project>): Promise<Project>;
export function deleteProject(id: string): Promise<void>;

// Skills related functions
export function fetchSkills(): Promise<Skill[]>;
export function createSkill(skill: Partial<Skill>): Promise<Skill>;
export function updateSkill(id: string, skill: Partial<Skill>): Promise<Skill>;
export function deleteSkill(id: string): Promise<void>;

// Timeline related functions
export function fetchTimeLine(): Promise<TimelineItem[]>;
export function updateTimeLine(timeline: TimelineItem[]): Promise<void>;
export function deleteTimeLine(id: string): Promise<{ message: string }>;

// Message related functions
export function fetchMessages(): Promise<any[]>;
export function updateMessage(id: string, data: { read: boolean }): Promise<void>;
export function deleteMessage(id: string): Promise<void>;

// Profile related functions
export function fetchProfile(): Promise<any>;
export function updateProfile(id: string, data: FormData): Promise<void>;

// Blog related functions
export function fetchPosts(): Promise<BlogPost[]>;
export function fetchPost(id: string): Promise<BlogPost>;
export function createPost(post: Partial<BlogPost>): Promise<BlogPost>;
export function updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost>;
export function deletePost(id: string): Promise<void>;