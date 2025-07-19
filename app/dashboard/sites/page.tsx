'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import { IProjectSite } from '@/app/models/projectsite';
import {
  MapPin, Building, Hammer, Leaf, CalendarDays,
  ChevronRight, Search, CheckCircle, Clock, Archive, Map
} from 'lucide-react';
import { addProjectSite } from '@/actions/sites';

interface Props {
  sites?: IProjectSite[];
  loading?: boolean;
}

const Sites: React.FC<Props> = ({ sites = [], loading = false }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location || !manager) return alert('Please fill all fields');

    await addProjectSite({
      name,
      location,
      manager,
    });

    setName('');
    setLocation('');
    setManager('');
    setShowAddForm(false);

    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading sites...</p>
        </div>
      </div>
    );
  }

  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      if (activeFilter === 'archived') return site.archived;
      if (activeFilter !== 'all' && site.status !== activeFilter) return false;
      if (
        searchQuery &&
        !site.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !site.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !site.manager.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false;
      return true;
    });
  }, [sites, activeFilter, searchQuery]);

  const renderEcoRating = (rating: number) => (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Leaf
          key={i}
          size={16}
          className={`${i < rating ? 'text-green-500 fill-green-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Building className="text-green-600 mr-2" size={24} />
                Project Sites
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all active and archived construction sites
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 transform hover:scale-[1.02]">
                <span>Add New Site</span>
                <ChevronRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {['all', 'ongoing', 'completed', 'pending'].map(filter => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                    activeFilter === filter
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all' && <span>All Sites</span>}
                  {filter === 'ongoing' && (
                    <>
                      <Hammer className="mr-2" size={16} />
                      <span>Ongoing</span>
                    </>
                  )}
                  {filter === 'completed' && (
                    <>
                      <CheckCircle className="mr-2" size={16} />
                      <span>Completed</span>
                    </>
                  )}
                  {filter === 'pending' && (
                    <>
                      <Clock className="mr-2" size={16} />
                      <span>Pending</span>
                    </>
                  )}
                </button>
              ))}
              {/* Archive filter */}
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  activeFilter === 'archived'
                    ? 'bg-gray-100 text-gray-700 border border-gray-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() =>
                  setActiveFilter(activeFilter === 'archived' ? 'all' : 'archived')
                }
              >
                <Archive className="mr-2" size={16} />
                <span>Show Archived</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search sites..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">Total Sites</div>
            <div className="text-2xl font-bold mt-1">{sites.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm">Ongoing</div>
            <div className="text-2xl font-bold mt-1">
              {sites.filter((s) => s.status === 'ongoing').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="text-gray-500 text-sm">Pending</div>
            <div className="text-2xl font-bold mt-1">
              {sites.filter((s) => s.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-gray-500">
            <div className="text-gray-500 text-sm">Archived</div>
            <div className="text-2xl font-bold mt-1">
              {sites.filter((s) => s.archived).length}
            </div>
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <div
              key={site._id as string}
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                site.archived ? 'opacity-80' : ''
              }`}
            >
              <div
                className={`p-4 border-b ${
                  site.status === 'completed'
                    ? 'bg-green-50 border-green-100'
                    : site.status === 'pending'
                    ? 'bg-yellow-50 border-yellow-100'
                    : 'bg-blue-50 border-blue-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 flex items-center">
                      {site.name}
                      {site.archived && (
                        <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          Archived
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center mt-1 text-gray-600">
                      <MapPin size={14} className="mr-1" />
                      <span className="text-sm">{site.location}</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2">
                    <div className="text-xs text-gray-500">Eco Rating</div>
                    {renderEcoRating(site.ecoRating)}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Manager</div>
                    <div className="font-medium text-gray-800">{site.manager}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Phase</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <Hammer size={14} className="mr-1" />
                      {site.phase}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Start Date</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <CalendarDays size={14} className="mr-1" />
                      {site.startDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Progress</div>
                    <div className="font-medium text-gray-800">
                      {site.progress}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className={`h-2.5 rounded-full ${
                      site.progress < 30
                        ? 'bg-red-500'
                        : site.progress < 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${site.progress}%` }}
                  ></div>
                </div>

                {/* Map Placeholder */}
                <div className="relative rounded-lg overflow-hidden h-32 mb-4 bg-gray-100 border border-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-b from-green-100/20 to-green-300/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Map className="text-gray-300" size={40} />
                  </div>
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                    <MapPin className="text-green-600" size={18} />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs">
                    {site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                    Upload Blueprints
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200">
                    <span>View Details</span>
                    <ChevronRight className="ml-1" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSites.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Building className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No sites found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
          </div>
        )}
      </div>
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">New Site</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Site name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sites;
