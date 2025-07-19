'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCard from '../components/animated';
import {
  Leaf, Trophy, ChevronRight, Truck, Check, ArrowRight,
  Factory, HardHat, Recycle, Trees,
} from 'lucide-react';

import {
  getSuggestions,
  getLeaderboard,
  getImpactMetrics,
} from '@/actions/sustainability';

export default function ConstructionSustainabilityPanel() {
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);
  const [viewAll, setViewAll] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [sugg, lead, impact] = await Promise.all([
        getSuggestions(),
        getLeaderboard(),
        getImpactMetrics(),
      ]);
      setSuggestions(sugg);
      setLeaderboard(lead);
      setImpactMetrics(impact);
    }

    fetchData();
  }, []);

  const toggleSuggestion = (index: number) => {
    if (appliedSuggestions.includes(index)) {
      setAppliedSuggestions(appliedSuggestions.filter((i) => i !== index));
    } else {
      setAppliedSuggestions([index, ...appliedSuggestions]);
    }
  };

  const displayedSuggestions = viewAll ? suggestions : suggestions.slice(0, 4);
  const displayedLeaderboard = viewAll ? leaderboard : leaderboard.slice(0, 3);

  return (
    <AnimatedCard
      className="p-6 bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg border border-emerald-100"
      delay={0.3}
    >
      {/* HEADER */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{ rotate: [0, 5, -5, 0], y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <HardHat className="text-amber-600" size={24} />
      </motion.div>

      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="p-2 bg-amber-100 rounded-lg"
          whileHover={{ rotate: 15, scale: 1.1 }}
        >
          <Factory className="text-amber-600" size={24} />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
            Construction Sustainability
          </h2>
          <p className="text-sm text-emerald-700 mt-1">Building greener futures</p>
        </div>
      </motion.div>

      {/* IMPACT METRICS */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {impactMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-xl border border-emerald-100 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-center mb-2">
              {/* @ts-ignore */}
              {React.createElement(Trees, { className: "text-emerald-600" })}
            </div>
            <div className="text-2xl font-bold text-emerald-700">{metric.value}</div>
            <div className="text-sm text-emerald-600 mt-1">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* GREEN PRACTICES */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-emerald-700 flex items-center gap-2">
            <HardHat className="text-amber-500" size={18} /> Green Practices
          </h3>
          <motion.button
            className="text-sm text-emerald-600 flex items-center"
            whileHover={{ x: 5 }}
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "View less" : "View all"} <ChevronRight size={16} />
          </motion.button>
        </div>

        <motion.ul className="space-y-3">
          <AnimatePresence>
            {displayedSuggestions.map((suggestion, index) => (
              <motion.li
                key={suggestion._id}
                className={`p-3 rounded-xl flex items-start ${
                  appliedSuggestions.includes(index)
                    ? "bg-amber-100 border border-amber-300"
                    : "bg-white border border-emerald-100"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.1 * index + 0.9 }}
                whileHover={{ y: -3 }}
              >
                <span className="text-amber-500 mr-2 mt-0.5">
                  <Recycle size={16} />
                </span>
                <div className="flex-1">
                  <p className="text-emerald-800">{suggestion.text}</p>
                  {appliedSuggestions.includes(index) && (
                    <div className="flex items-center mt-2">
                      <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs flex items-center">
                        <Truck className="mr-1" size={12} />
                        <span>+{suggestion.ecoPoints} eco points</span>
                      </div>
                      <div className="ml-2 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs flex items-center">
                        <Check className="mr-1" size={12} />
                        <span>Active since {suggestion.activeSince}</span>
                      </div>
                    </div>
                  )}
                </div>
                <motion.button
                  className={`p-2 rounded-full ${
                    appliedSuggestions.includes(index)
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-100 text-amber-600"
                  }`}
                  onClick={() => toggleSuggestion(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {appliedSuggestions.includes(index) ? <Check size={16} /> : "+"}
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* LEADERBOARD */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-emerald-700 flex items-center gap-2">
            <Trophy className="text-amber-500" size={18} /> Project Leaderboard
          </h3>
          <motion.button
            className="text-sm text-emerald-600 flex items-center"
            whileHover={{ x: 5 }}
          >
            Full rankings <ArrowRight size={16} />
          </motion.button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {displayedLeaderboard.map((project, index) => (
              <motion.div
                key={project._id}
                className="flex items-center justify-between bg-white p-4 rounded-xl border border-emerald-100 relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.1 * index + 1.1 }}
                whileHover={{ y: -3 }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 1.3 + index * 0.1 }}
                />
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                      index === 0
                        ? "bg-gradient-to-br from-amber-400 to-orange-500"
                        : index === 1
                        ? "bg-gradient-to-br from-gray-400 to-gray-600"
                        : "bg-gradient-to-br from-amber-700 to-amber-900"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-emerald-800 font-medium">{project.name}</span>
                    <div className="flex items-center mt-1">
                      <Leaf className="text-green-500 mr-1" size={14} />
                      <span className="text-xs text-emerald-600">
                        {project.points} eco points
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedCard>
  );
}
