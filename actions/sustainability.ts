'use server';
import { getDashboardData } from '@/lib/auth/dbc/sustainability';

export async function getSustainabilityDashboardData(organizationId: string) {
  const result = await getDashboardData(organizationId);
  console.log('[DashbooardData]', result);
  return await getDashboardData(organizationId);
}
