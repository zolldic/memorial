import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Users, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';
import { getErrorMessage } from '@/shared/utils/supabaseError';

export function DashboardPage() {
  const { data: stats, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [martyrsCount, memoriesCount, pendingCount, approvedCount] = await Promise.all([
        supabase.from('martyrs').select('id', { count: 'exact', head: true }),
        supabase.from('memories').select('id', { count: 'exact', head: true }),
        supabase.from('memories').select('id', { count: 'exact', head: true }).eq('approved', false),
        supabase.from('memories').select('id', { count: 'exact', head: true }).eq('approved', true),
      ]);

      const queryError = martyrsCount.error || memoriesCount.error || pendingCount.error || approvedCount.error;
      if (queryError) {
        throw queryError;
      }

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
      label: 'TOTAL MARTYRS',
      value: stats?.martyrs ?? 0,
      icon: <Users className="text-neutral-900" size={28} />,
      borderColor: 'border-neutral-900',
    },
    {
      label: 'TOTAL MEMORIES',
      value: stats?.totalMemories ?? 0,
      icon: <MessageSquare className="text-neutral-900" size={28} />,
      borderColor: 'border-neutral-500',
    },
    {
      label: 'PENDING REVIEW',
      value: stats?.pending ?? 0,
      icon: <Clock className="text-orange-600" size={28} />,
      borderColor: 'border-orange-500',
    },
    {
      label: 'APPROVED',
      value: stats?.approved ?? 0,
      icon: <CheckCircle className="text-green-600" size={28} />,
      borderColor: 'border-green-500',
    },
  ];

  return (
    <div className="p-6 md:p-10 min-h-screen bg-background texture-lines">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-neutral-900 mb-2">Dashboard</h1>
          <p className="text-neutral-600 tracking-wide uppercase text-sm font-medium">Overview of the memorial archive</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-background border-2 border-neutral-300 p-6 animate-pulse">
                <div className="h-14 w-14 bg-neutral-300 mb-6" />
                <div className="h-10 w-24 bg-neutral-300 mb-3" />
                <div className="h-4 w-32 bg-neutral-300" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="border-2 border-red-300 bg-red-50 p-6 md:p-8">
            <h2 className="text-lg font-bold uppercase tracking-wide text-red-700 mb-2">Failed to load dashboard stats</h2>
            <p className="text-sm text-red-700 mb-4">
              {getErrorMessage(error, 'An unexpected error occurred while loading statistics.')}
            </p>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-5 py-2 border-2 border-red-700 text-red-700 font-bold uppercase tracking-wide text-xs hover:bg-red-700 hover:text-white transition-colors disabled:opacity-60"
            >
              {isFetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="group bg-background border-2 border-neutral-300 hover:border-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all p-6 flex flex-col justify-between"
              >
                <div className={`w-14 h-14 bg-neutral-100 border-2 ${card.borderColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-4xl font-bold font-mono text-neutral-900 mb-2 tracking-tighter">{card.value}</p>
                  <p className="text-xs tracking-widest font-bold text-neutral-500 uppercase">{card.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-background border-2 border-neutral-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-900 mb-6 flex items-center gap-3">
            <span className="w-4 h-4 bg-neutral-900 block"></span> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/admin/memories"
              className="group flex items-center justify-between p-6 border-2 border-neutral-300 bg-neutral-50 hover:border-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <span className="font-bold text-neutral-900 uppercase tracking-wide group-hover:translate-x-1 transition-transform">Review Pending Memories</span>
              <span className={`text-sm font-bold px-3 py-1 font-mono ${stats?.pending && stats.pending > 0 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-neutral-200 text-neutral-600'}`}>
                {stats?.pending ?? 0}
              </span>
            </Link>
            <Link
              to="/admin/martyrs"
              className="group flex items-center justify-between p-6 border-2 border-neutral-300 bg-neutral-50 hover:border-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <span className="font-bold text-neutral-900 uppercase tracking-wide group-hover:translate-x-1 transition-transform">Manage Martyrs</span>
              <span className="bg-neutral-900 text-white text-sm font-bold px-3 py-1 font-mono">
                {stats?.martyrs ?? 0}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
