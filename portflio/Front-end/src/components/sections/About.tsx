
import { useEffect, useRef, useState } from 'react';
import { useAnimateOnScroll } from '@/utils/animations';
import Timeline from '@/components/ui/Timeline';
import SkillBadge from '@/components/ui/SkillBadge';
import { fetchProfile, fetchUsers, fetchSkills, fetchTimeLine } from '@/lib/apis';
import { Code, PenTool, Briefcase, Layers, Server, Cpu, Globe, Database } from 'lucide-react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  
  useAnimateOnScroll(sectionRef);
  useAnimateOnScroll(headingRef);
  useAnimateOnScroll(textRef);
  useAnimateOnScroll(skillsRef);
const [profile, setProfile] = useState(null);
const [users, setUsers] = useState({});
const [skills, setSkills] = useState([]);
const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetchUsers().then((data: any) => setUsers(data));
   fetchProfile().then((data: any) => setProfile(data));
   fetchSkills().then((data: any) => setSkills(data));
   fetchTimeLine().then((data: any) => setTimeline(data));
  }, []);
  

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white to-secondary/20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 ref={headingRef} className="heading-lg mb-6 animate-on-scroll">
            <span className="inline-block px-3 py-1 bg-primary/5 text-primary rounded-md text-sm font-medium mb-3">
              About Me
            </span><br />
            My Journey & Expertise
          </h2>
          <p ref={textRef} className="text-lg text-muted-foreground animate-on-scroll">
            {profile?.bio}
          </p>
        </div>
        
        <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-24 animate-on-scroll">
          {skills.map((skill) => {
            if (skill.icon === "Code") skill.icon = Code;
            if (skill.icon === "PenTool") skill.icon = PenTool;
            if (skill.icon === "Briefcase") skill.icon = Briefcase;
            if (skill.icon === "Layers") skill.icon = Layers;
            if (skill.icon === "Server") skill.icon = Server;
            if (skill.icon === "Cpu") skill.icon = Cpu;
            if (skill.icon === "Globe") skill.icon = Globe;
            if (skill.icon === "Database") skill.icon = Database;
          
            return <SkillBadge
              key={skill._id}
              name={skill.name}
              level={skill.level }
              icon={skill.icon}
              className=""
            />
          })}
        </div>
        
        <div className="mb-16">
          <h3 className="heading-md text-center mb-12">Experience & Education</h3>
          <Timeline items={timeline} />
        </div>
      </div>
    </section>
  );
};

export default About;


