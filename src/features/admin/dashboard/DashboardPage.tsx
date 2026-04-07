import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Users, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [martyrsCount, memoriesCount, pendingCount, approvedCount] = await Promise.all([
        supabase.from('martyrs').select('id', { count: 'exact', head: true }),
        supabase.from('memories').select('id', { count: 'exact', head: true }),
        supabase.from('memories').select('id', { count: 'exact', head: true }).eq('approved', false),
        supabase.from('memories').select('id', { count: 'exact', head: true }).eq('approved', true),
      ]);

      return {
        martyrs: martyrsCount.count || 0,
        totalMemories: memoriesCount.count || 0,
        pending: pendingCount.count || 0,
        approved: approvedCount.count || 0,
      };
    },
  });

  const statCards = [
    {
      label: 'Total Martyrs',
      value: stats?.martyrs ?? 0,
      icon: <Users className="text-primary" size={24} />,
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Memories',
      value: stats?.totalMemories ?? 0,
      icon: <MessageSquare className="text-blue-600" size={24} />,
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Pending Review',
      value: stats?.pending ?? 0,
      icon: <Clock className="text-orange-600" size={24} />,
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Approved',
      value: stats?.approved ?? 0,
      icon: <CheckCircle className="text-green-600" size={24} />,
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Overview of the memorial platform</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200 animate-pulse">
              <div className="h-12 w-12 bg-neutral-200 rounded-lg mb-4" />
              <div className="h-8 w-20 bg-neutral-200 rounded mb-2" />
              <div className="h-4 w-24 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow"
            >
              <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <p className="text-3xl font-bold text-neutral-900 mb-1">{card.value}</p>
              <p className="text-sm text-neutral-600">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl p-6 border border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/memories"
            className="flex items-center justify-between p-4 border-2 border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <span className="font-medium text-neutral-900">Review Pending Memories</span>
            <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
              {stats?.pending ?? 0}
            </span>
          </a>
          <a
            href="/admin/martyrs"
            className="flex items-center justify-between p-4 border-2 border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <span className="font-medium text-neutral-900">Manage Martyrs</span>
            <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
              {stats?.martyrs ?? 0}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
