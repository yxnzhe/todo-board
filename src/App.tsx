import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/app.store';
import { LoginPage } from '@/features/auth/LoginPage';
import { AppLayout } from '@/features/layout/AppLayout';
import { KanbanBoard } from '@/features/kanban/KanbanBoard';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { DailyNotes } from '@/features/notes/DailyNotes';
import { ExportImport } from '@/features/settings/ExportImport';
import { TaskDetail } from '@/features/task/TaskDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

function AppContent() {
  const { user, loading } = useAuth();
  const { sidebarView } = useAppStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="" className="w-5 h-5" />
          <span className="text-sm text-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  function renderMainContent() {
    switch (sidebarView) {
      case 'dashboard':
        return <Dashboard />;
      case 'notes':
        return <DailyNotes />;
      case 'export':
        return <ExportImport />;
      default:
        return <KanbanBoard />;
    }
  }

  return (
    <AppLayout detailPanel={<TaskDetail />}>
      {renderMainContent()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
