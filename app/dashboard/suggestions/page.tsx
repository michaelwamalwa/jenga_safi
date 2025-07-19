'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Sparkles, Lightbulb, Clock, ChevronRight, Check,
  Zap, HardHat, Factory, Recycle, Truck, Trees
} from 'lucide-react';
import { getSuggestions } from '@/actions/suggestions';

interface LocalSuggestion {
  _id: string;
  title: string;
  category: string;
  impact: string;
  time: string;
}
interface Props {
  initialSuggestions: LocalSuggestion[];
}

export default function ConstructionSuggestionsPage({ initialSuggestions }: Props) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [loading, setLoading] = useState(true);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSuggestions =
    selectedCategory === 'all'
      ? suggestions
      : suggestions.filter((s) => s.category === selectedCategory);

  const toggleSuggestion = (id: string) => {
    setAppliedSuggestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: 'all', name: 'All Recommendations' },
    { id: 'materials', name: 'Sustainable Materials' },
    { id: 'energy', name: 'Energy Efficiency' },
    { id: 'waste', name: 'Waste Management' },
    { id: 'water', name: 'Water Conservation' },
    { id: 'logistics', name: 'Eco Logistics' },
    { id: 'biodiversity', name: 'Biodiversity' },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'energy': return 'from-amber-400 to-orange-500';
      case 'materials': return 'from-stone-400 to-stone-600';
      case 'waste': return 'from-emerald-400 to-green-500';
      case 'water': return 'from-blue-400 to-cyan-500';
      case 'logistics': return 'from-indigo-400 to-violet-500';
      case 'biodiversity': return 'from-lime-400 to-green-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy': return <Zap size={16} className="text-amber-500" />;
      case 'materials': return <Factory size={16} className="text-stone-600" />;
      case 'waste': return <Recycle size={16} className="text-emerald-500" />;
      case 'water': return <span className="text-blue-500 text-lg">💧</span>;
      case 'logistics': return <Truck size={16} className="text-indigo-500" />;
      case 'biodiversity': return <Trees size={16} className="text-lime-600" />;
      default: return <Sparkles size={16} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white p-8">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-8"
        >
          <HardHat className="text-amber-600" size={64} />
          <motion.div
            className="absolute -inset-4 border-4 border-amber-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        <motion.h1
          className="text-3xl font-bold text-amber-700 mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        >
          Analyzing Construction Site...
        </motion.h1>
        <p className="text-gray-600 max-w-md text-center">
          Our AI is evaluating your project to provide sustainable construction recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-amber-800 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <HardHat className="text-amber-600" size={32} />
              <span>
                Sustainable Construction
                <span className="block text-lg font-normal text-amber-600 mt-1">
                  AI-powered recommendations for greener building practices
                </span>
              </span>
            </motion.h1>
          </div>

          <motion.div
            className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <Leaf size={20} />
            <span className="font-bold">42 Eco Points</span>
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'text-white shadow-lg'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
              style={{
                background: selectedCategory === category.id
                  ? `linear-gradient(135deg, var(--tw-gradient-stops))`
                  : '',
                backgroundImage: selectedCategory === category.id
                  ? `linear-gradient(135deg, ${getCategoryColor(category.id)})`
                  : 'none'
              }}
              onClick={() => setSelectedCategory(category.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion._id}
                className={`rounded-xl p-4 border-l-4 relative overflow-hidden ${
                  appliedSuggestions.includes(suggestion._id)
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-amber-300 bg-white'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.1 * index + 0.5 }}
                whileHover={{ y: -5 }}
              >
                {appliedSuggestions.includes(suggestion._id) && (
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,#10b98120_0%,transparent_70%)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`bg-gradient-to-r ${getCategoryColor(suggestion.category)} text-white p-1.5 rounded-lg`}>
                        {getCategoryIcon(suggestion.category)}
                      </div>
                      <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {suggestion.time}
                      </span>
                    </div>

                    <h3 className="font-semibold text-amber-800 text-lg mb-1">
                      {suggestion.title}
                    </h3>
                    <p className="text-amber-600 text-sm flex items-center gap-1">
                      <Leaf size={14} className="text-green-500" />
                      {suggestion.impact}
                    </p>
                  </div>

                  <motion.button
                    className={`p-2 rounded-full ${
                      appliedSuggestions.includes(suggestion._id)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                    onClick={() => toggleSuggestion(suggestion._id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {appliedSuggestions.includes(suggestion._id) ? <Check size={18} /> : '+'}
                  </motion.button>
                </div>

                {!appliedSuggestions.includes(suggestion._id) && (
                  <motion.div
                    className="flex justify-end mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  >
                    <span className="text-xs text-amber-500 flex items-center">
                      Implement practice <ChevronRight size={14} />
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
