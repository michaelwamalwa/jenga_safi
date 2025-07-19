'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { User, Plus, X, MessageCircle, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import AnimatedCard from '@/app/dashboard/components/animated';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  email: string;
  phone?: string;
  lastActive?: Date;
  expanded?: boolean;
};

export default function Teams() {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: 'Alex Morgan', role: 'Sustainability Lead', status: 'online', email: 'alex@eco.com' },
    { id: 2, name: 'Jordan Green', role: 'Recycling Coordinator', status: 'busy', email: 'jordan@eco.com', phone: '+1 (555) 123-4567' },
    { id: 3, name: 'Taylor Reed', role: 'Energy Analyst', status: 'away', email: 'taylor@eco.com' },
    { id: 4, name: 'Casey Bloom', role: 'Green Projects Manager', status: 'offline', email: 'casey@eco.com', lastActive: new Date(Date.now() - 86400000) },
  ]);
  
  const [loading, setLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '' });
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      await controls.start("visible");
      setLoading(false);
    };
    loadData();
  }, []);

  const toggleMemberExpansion = (id: number) => {
    setMembers(members.map(member => 
      member.id === id 
        ? { ...member, expanded: !member.expanded } 
        : { ...member, expanded: false }
    ));
  };

  const startAddMember = () => {
    setIsAddingMember(true);
    setNewMember({ name: '', role: '', email: '' });
    
    // Scroll to bottom when adding new member
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const cancelAddMember = () => {
    setIsAddingMember(false);
  };

  const addNewMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    
    const member: TeamMember = {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role || 'Team Member',
      status: 'online',
      email: newMember.email,
      expanded: true
    };

    setMembers([...members, member]);
    setIsAddingMember(false);
  };

  const removeMember = async (id: number) => {
    const memberToRemove = members.find(m => m.id === id);
    if (!memberToRemove) return;

    // Animate removal
    await controls.start({
      scale: [1, 0.9, 1],
      transition: { duration: 0.2 }
    });

    setMembers(members.filter(m => m.id !== id));
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-amber-500';
      case 'away': return 'bg-blue-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    switch(status) {
      case 'online': return 'Online now';
      case 'busy': return 'Busy - Do not disturb';
      case 'away': return 'Away - Checking occasionally';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  const formatLastActive = (date?: Date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
    
    if (diffHours < 1) return 'Last seen just now';
    if (diffHours < 24) return `Last seen ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Last seen ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    hover: { 
      y: -5, 
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
    },
    tap: { scale: 0.98 }
  };

  const floating = {
    float: {
      y: ["0%", "-20%", "0%"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <AnimatedCard className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <User className="text-blue-500" size={48} />
            <motion.div 
              className="absolute -inset-2 border-4 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1.2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard 
      className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-sm relative overflow-hidden"
      delay={0.2}
    >
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-400"
        variants={floating}
        animate="float"
      />
      <motion.div 
        className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-teal-400"
        variants={floating}
        animate="float"
      />
      <motion.div 
        className="absolute top-1/3 left-10 w-4 h-4 rounded-full bg-cyan-300"
        variants={floating}
        animate="float"
        style={{ y: "-50%" }}
      />

      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className="text-2xl font-bold text-blue-800 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Team Members
        </motion.h2>
        <motion.button
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-100"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={startAddMember}
        >
          <Plus size={18} strokeWidth={2.5} /> Add Member
        </motion.button>
      </div>
      
      <motion.div 
        className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
        ref={containerRef}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {isAddingMember && (
            <motion.div
              className="rounded-2xl p-5 bg-white border-2 border-dashed border-blue-300 relative"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-blue-800">Add Team Member</h3>
                  <motion.button
                    className="text-gray-500 hover:text-red-500"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={cancelAddMember}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Full name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    autoFocus
                  />
                  <input
                    type="text"
                    className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  />
                  <input
                    type="email"
                    className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Email address"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <motion.button
                    className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelAddMember}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 5px 15px -3px rgba(6, 182, 212, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addNewMember}
                    disabled={!newMember.name.trim() || !newMember.email.trim()}
                  >
                    <Plus size={16} /> Add Member
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {members.map((member) => (
            <motion.div
              key={member.id}
              className="rounded-2xl p-5 bg-white relative overflow-hidden border border-blue-100"
              variants={item}
              whileHover="hover"
              whileTap="tap"
              layout
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: { duration: 0.3 }
              }}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-cyan-100 to-blue-200 w-14 h-14 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={24} />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                        {member.name}
                        {member.status === 'busy' && (
                          <motion.span 
                            className="h-2 w-2 bg-amber-500 rounded-full inline-block"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 1.5 
                            }}
                          />
                        )}
                      </h3>
                      <p className="text-blue-600 text-sm">{member.role}</p>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(member.status)}`} />
                        {getStatusText(member.status)}
                        {member.status === 'offline' && member.lastActive && (
                          <span className="ml-2">{formatLastActive(member.lastActive)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-100 hover:text-red-500"
                      onClick={() => removeMember(member.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={18} />
                    </motion.button>
                    
                    <motion.button
                      className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl"
                      onClick={() => toggleMemberExpansion(member.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {member.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </motion.button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {member.expanded && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-blue-100"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <Mail className="text-blue-500" size={18} />
                          <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                            {member.email}
                          </a>
                        </div>
                        
                        {member.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="text-blue-500" size={18} />
                            <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                              {member.phone}
                            </a>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-3">
                          <motion.button
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 5px 15px -3px rgba(6, 182, 212, 0.3)"
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <MessageCircle size={16} /> Message
                          </motion.button>
                          
                          <motion.button
                            className="flex-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 py-2 rounded-xl flex items-center justify-center gap-2"
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 5px 15px -3px rgba(6, 182, 212, 0.2)"
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Mail size={16} /> Email
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Connection line animation */}
              {member.status === 'online' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {members.length === 0 && !isAddingMember && (
        <motion.div 
          className="flex flex-col items-center justify-center py-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <User className="text-blue-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-blue-800">No team members yet</h3>
          <p className="text-blue-600 mt-1">Start building your sustainability team</p>
          <motion.button
            className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAddMember}
          >
            <Plus size={16} /> Add First Member
          </motion.button>
        </motion.div>
      )}
    </AnimatedCard>
  );
}