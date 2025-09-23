// @/lib/swr/contractors.ts
import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { Contractor, ContractorAnalytics } from '@/@types/contractors';

const API_BASE = '/api/contractors';

// Type definitions for API responses
type ContractorsResponse = {
  data: Contractor[];
  error?: string;
  total: number;
  page: number;
  limit: number;
};

type AnalyticsResponse = {
  data: ContractorAnalytics;
  error?: string;
};

// Main contractors hook with real-time refresh
export function useContractors() {
  const { data, error, isLoading, mutate } = useSWR<ContractorsResponse>(
    `${API_BASE}`,
    fetcher,
    {
      refreshInterval: 30000, // 30 seconds refresh
      revalidateOnFocus: true,
      dedupingInterval: 10000, // 10 seconds dedupe
    }
  );

  return {
    contractors: data?.data || [],
    isLoading,
    error: error || data?.error,
    mutate,
  };
}

// Contractor analytics with performance metrics
export function useContractorAnalytics() {
  const { data, error, isLoading } = useSWR<AnalyticsResponse>(
    `${API_BASE}/analytics`,
    fetcher,
    {
      refreshInterval: 60000, // 1 minute refresh
    }
  );

  return {
    analytics: data?.data,
    isLoading,
    error: error || data?.error,
  };
}

// Detailed contractor view with preloading
export function useContractor(id: string) {
  const { data, error, isLoading } = useSWR<{ data: Contractor; error?: string }>(
    `${API_BASE}/${id}`,
    fetcher,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
    }
  );

  return {
    contractor: data?.data,
    isLoading,
    error: error || data?.error,
  };
}

// Contractor sustainability metrics
export function useSustainabilityStats() {
  const { data, error, isLoading } = useSWR<{ data: any; error?: string }>(
    `${API_BASE}/sustainability`,
    fetcher,
    {
      refreshInterval: 120000, // 2 minutes refresh
    }
  );

  return {
    stats: data?.data,
    isLoading,
    error: error || data?.error,
  };
}

// Mutations for contractor actions
export const contractorMutations = {
  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  addNote: async (id: string, note: string) => {
    const response = await fetch(`${API_BASE}/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    return response.json();
  },

  refreshData: async () => {
    const response = await fetch(`${API_BASE}/refresh`, { method: 'POST' });
    return response.json();
  },
};

// Optimistic updates for contractor ratings
// Optimistic updates for contractor ratings
export const useRateContractor = () => {
  const { mutate } = useContractors();

  const rateContractor = async (id: string, rating: number) => {
    const optimisticData = (
      currentData: ContractorsResponse | undefined,
      displayedData: ContractorsResponse | undefined
    ): ContractorsResponse => {
      const base = currentData || displayedData || {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      return {
        ...base,
        data: base.data.map(contractor =>
          contractor.id === id ? { ...contractor, rating } : contractor
        ),
      };
    };

    await mutate(
      async () => {
        const response = await fetch(`${API_BASE}/${id}/rate`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating }),
        });
        return response.json();
      },
      {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );
  };

  return { rateContractor };
};


// Prefetching function for SSR/SSG
export const prefetchContractors = async () => {
  const response = await fetch(`${API_BASE}`);
  const data = await response.json();
  return data;
};

// Type guard for error handling
function isErrorResponse(res: any): res is { error: string } {
  return res && typeof res.error === 'string';
}
