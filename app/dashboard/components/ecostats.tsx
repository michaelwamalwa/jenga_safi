'use client';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Droplets } from 'lucide-react';

export default function EcoStats({ 
  ecoPoints, 
  carbonSaved, 
  waterSaved 
}: {
  ecoPoints: number;
  carbonSaved: number;
  waterSaved: number;
}) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StatCard 
        title="Eco Points" 
        value={ecoPoints} 
        icon={<Leaf className="text-green-600" size={20} />}
        color="green"
        description="+150 this week"
      />
      
      <StatCard 
        title="Carbon Saved" 
        value={carbonSaved} 
        suffix="kg"
        icon={<Recycle className="text-cyan-600" size={20} />}
        color="cyan"
        description="Equivalent to 3 trees planted"
      />
      
      <StatCard 
        title="Water Saved" 
        value={waterSaved} 
        suffix="L"
        icon={<Droplets className="text-blue-600" size={20} />}
        color="blue"
        description="+320L this week"
      />
    </motion.div>
  );
}

function StatCard({ 
  title, 
  value, 
  suffix = "",
  icon,
  color,
  description 
}: {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color: "green" | "cyan" | "blue";
  description: string;
}) {
  const colors = {
    green: {
      bg: "bg-green-100",
      text: "text-green-600"
    },
    cyan: {
      bg: "bg-cyan-100",
      text: "text-cyan-600"
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600"
    }
  };
  
  return (
    <motion.div 
      className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm`}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-emerald-800">{title}</h3>
        <div className={`w-10 h-10 rounded-full ${colors[color].bg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="relative">
        <motion.p 
          className={`text-4xl font-bold ${colors[color].text} mt-3`}
          key={value}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value}{suffix}
        </motion.p>
      </div>
      <p className="text-sm text-emerald-600 mt-2">{description}</p>
    </motion.div>
  );
}