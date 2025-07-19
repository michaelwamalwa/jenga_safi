'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, HardHat, Building, Award, CheckCircle,
  AlertTriangle, Pause, Search, Plus, ChevronRight,
  ArrowUpDown, Star, TrendingUp, BadgeCheck, Activity
} from 'lucide-react';
import { IContractor } from '@/app/models/contractor';

interface ContractorListClientProps {
  contractors: IContractor[];
}
type StatusFilter = 'all' | 'active' | 'on-hold' | 'archived';

const ContractorListClient: React.FC<ContractorListClientProps> = ({ contractors }) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'rating' | 'sustainabilityScore' | 'projectsCompleted'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedFilteredContractors = useMemo(() => {
    let filtered = contractors;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(c => c.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.specialization.toLowerCase().includes(q) ||
          c.contact.toLowerCase().includes(q)
      );
    }

    return [...filtered].sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;

      switch (sortField) {
        case 'name':
          return dir * a.name.localeCompare(b.name);
        case 'rating':
          return dir * (a.rating - b.rating);
        case 'sustainabilityScore':
          return dir * (a.sustainabilityScore - b.sustainabilityScore);
        case 'projectsCompleted':
          return dir * (a.projectsCompleted - b.projectsCompleted);
        default:
          return 0;
      }
    });
  }, [contractors, activeFilter, searchQuery, sortField, sortDirection]);

  const getStatusDetails = (status: IContractor['status']) => {
    switch (status) {
      case 'active':
        return { text: 'Active', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={16} /> };
      case 'on-hold':
        return { text: 'On Hold', color: 'bg-yellow-100 text-yellow-700', icon: <Pause size={16} /> };
      case 'archived':
        return { text: 'Archived', color: 'bg-gray-100 text-gray-700', icon: <AlertTriangle size={16} /> };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: <AlertTriangle size={16} /> };
    }
  };

  const renderRating = (rating: number) => (
    <div className="flex items-center">
      <Star className="text-yellow-500 fill-yellow-500" size={16} />
      <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
    </div>
  );

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };


  return (
    <div className="container mx-auto px-4 py-6">
      {/* Top Filters */}
      <div className="flex flex-wrap justify-between mb-6 gap-4">
      <div className="flex gap-2">
    {['all', 'active', 'on-hold', 'archived'].map((status) => (
      <button
        key={status}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
          activeFilter === status
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        onClick={() => setActiveFilter(status as StatusFilter)}
      >
        {status === 'active' && <CheckCircle className="mr-1" size={16} />}
        {status === 'on-hold' && <Pause className="mr-1" size={16} />}
        {status === 'archived' && <AlertTriangle className="mr-1" size={16} />}
        <span className="capitalize">{status.replace('-', ' ')}</span>
      </button>
    ))}
  </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search contractors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Table Head */}
      <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 text-sm font-medium text-gray-600 border-b">
        <div className="col-span-4 flex items-center">
          <button onClick={() => handleSort('name')} className="flex items-center">
            Contractor <ArrowUpDown size={14} className="ml-1" />
          </button>
        </div>
        <div className="col-span-2">Specialization</div>
        <div className="col-span-1 text-center">
          <button onClick={() => handleSort('rating')} className="flex items-center justify-center">
            Rating <ArrowUpDown size={14} className="ml-1" />
          </button>
        </div>
        <div className="col-span-1 text-center">
          <button onClick={() => handleSort('sustainabilityScore')} className="flex items-center justify-center">
            Sustainability <ArrowUpDown size={14} className="ml-1" />
          </button>
        </div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">
          <button onClick={() => handleSort('projectsCompleted')} className="flex items-center justify-center">
            Projects <ArrowUpDown size={14} className="ml-1" />
          </button>
        </div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Rows */}
      {sortedFilteredContractors.length > 0 ? (
        sortedFilteredContractors.map((contractor) => {
          const status = getStatusDetails(contractor.status);

          return (
            <div key={contractor._id as string} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50">
              <div className="col-span-4 flex items-center gap-3">
                <Building className="text-green-600" size={20} />
                <div>
                  <h3 className="font-semibold">{contractor.name}</h3>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Users size={14} />
                    <span>{contractor.contact}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm font-medium">{contractor.specialization}</div>
                <div className="text-xs text-gray-500">{contractor.projects.length} projects</div>
              </div>
              <div className="col-span-1 text-center">{renderRating(contractor.rating)}</div>
              <div className="col-span-1 text-center">
                <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                  {contractor.sustainabilityScore}%
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className={`${status.color} px-2 py-1 rounded-full text-xs flex items-center justify-center`}>
                  {status.icon}
                  <span className="ml-1">{status.text}</span>
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-medium">{contractor.projectsCompleted}</span>
              </div>
              <div className="col-span-2 text-right">
                <button className="text-green-600 hover:underline flex items-center justify-end">
                  View Details <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-10 text-gray-500 text-sm">
          No contractors match your filter or search.
        </div>
      )}
    </div>
  );
};

export default ContractorListClient;
