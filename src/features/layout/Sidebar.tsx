import { useState } from 'react';
import {
  Inbox, CalendarCheck, CalendarDays, Calendar, Clock, Archive, CheckCircle2,
  LayoutDashboard, BookOpen, Plus, FolderKanban, Hash, ChevronDown, ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/stores/app.store';
import { useProjects } from '@/hooks/useProjects';
import { useContexts } from '@/hooks/useContexts';
import { useCreateProject } from '@/hooks/useProjects';
import { useCreateContext } from '@/hooks/useContexts';
import { DEFAULT_PROJECT_COLORS } from '@/lib/constants';

const NAV_ITEMS = [
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'today', label: 'Today', icon: CalendarCheck },
  { key: 'upcoming', label: 'Upcoming', icon: CalendarDays },
  { key: 'this-week', label: 'This Week', icon: Calendar },
  { key: 'waiting', label: 'Waiting', icon: Clock },
  { key: 'backlog', label: 'Backlog', icon: Archive },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
] as const;

export function Sidebar() {
  const { sidebarView, setSidebarView, setSelectedProjectId, setSelectedContextId } = useAppStore();
  const { data: projects = [] } = useProjects();
  const { data: contexts = [] } = useContexts();
  const createProject = useCreateProject();
  const createContext = useCreateContext();
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [contextsExpanded, setContextsExpanded] = useState(true);
  const [addingProject, setAddingProject] = useState(false);
  const [addingContext, setAddingContext] = useState(false);
  const [newName, setNewName] = useState('');

  function handleAddProject() {
    if (!newName.trim()) { setAddingProject(false); return; }
    createProject.mutate({ name: newName.trim(), color: DEFAULT_PROJECT_COLORS[projects.length % DEFAULT_PROJECT_COLORS.length] });
    setNewName('');
    setAddingProject(false);
  }

  function handleAddContext() {
    if (!newName.trim()) { setAddingContext(false); return; }
    createContext.mutate({ name: newName.trim(), color: DEFAULT_PROJECT_COLORS[contexts.length % DEFAULT_PROJECT_COLORS.length] });
    setNewName('');
    setAddingContext(false);
  }

  return (
    <aside className="w-[230px] min-w-[230px] h-screen bg-bg-secondary border-r border-border flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-border">
        <img src="/favicon.svg" alt="" className="w-5 h-5 flex-shrink-0 opacity-70" />
        <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-secondary truncate">Phil @ Workboard</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {/* Main nav */}
        <div className="px-2 mb-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSidebarView(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[12px] transition-all duration-200 cursor-pointer ${
                sidebarView === key
                  ? 'bg-white/5 text-text-primary'
                  : 'text-text-muted hover:bg-white/[0.03] hover:text-text-secondary'
              }`}
            >
              <Icon size={14} className="flex-shrink-0 opacity-60" />
              <span className="truncate tracking-wide">{label}</span>
            </button>
          ))}
        </div>

        <div className="mx-4 my-3 border-t border-white/[0.04]" />

        {/* Dashboard & Notes */}
        <div className="px-2 mb-1">
          <button
            onClick={() => setSidebarView('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[12px] transition-all duration-200 cursor-pointer ${
              sidebarView === 'dashboard' ? 'bg-white/5 text-text-primary' : 'text-text-muted hover:bg-white/[0.03] hover:text-text-secondary'
            }`}
          >
            <LayoutDashboard size={14} className="opacity-60" />
            <span className="tracking-wide">Dashboard</span>
          </button>
          <button
            onClick={() => setSidebarView('notes')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[12px] transition-all duration-200 cursor-pointer ${
              sidebarView === 'notes' ? 'bg-white/5 text-text-primary' : 'text-text-muted hover:bg-white/[0.03] hover:text-text-secondary'
            }`}
          >
            <BookOpen size={14} className="opacity-60" />
            <span className="tracking-wide">Daily Notes</span>
          </button>
        </div>

        <div className="mx-4 my-3 border-t border-white/[0.04]" />

        {/* Projects */}
        <div className="px-2 mb-1">
          <div className="flex items-center justify-between px-3 py-1">
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className="flex items-center gap-1.5 text-[9px] font-medium text-text-muted/60 uppercase tracking-[0.2em] cursor-pointer hover:text-text-muted"
            >
              {projectsExpanded ? <ChevronDown size={9} /> : <ChevronRight size={9} />}
              Projects
            </button>
            <button
              onClick={() => { setAddingProject(true); setNewName(''); }}
              className="text-text-muted/40 hover:text-text-muted p-0.5 rounded hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
            >
              <Plus size={11} />
            </button>
          </div>
          {projectsExpanded && (
            <>
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[12px] transition-all duration-200 cursor-pointer ${
                    sidebarView === `project-${project.id}`
                      ? 'bg-white/5 text-text-primary'
                      : 'text-text-muted hover:bg-white/[0.03] hover:text-text-secondary'
                  }`}
                >
                  <FolderKanban size={13} style={{ color: project.color }} className="flex-shrink-0 opacity-70" />
                  <span className="truncate tracking-wide">{project.name}</span>
                </button>
              ))}
              {addingProject && (
                <form onSubmit={(e) => { e.preventDefault(); handleAddProject(); }} className="px-3 py-1">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleAddProject}
                    placeholder="Project name..."
                    className="w-full bg-transparent border-b border-white/10 px-0 py-1 text-[12px] text-text-primary placeholder:text-text-muted/40 outline-none"
                  />
                </form>
              )}
            </>
          )}
        </div>

        {/* Contexts */}
        <div className="px-2 mb-1">
          <div className="flex items-center justify-between px-3 py-1">
            <button
              onClick={() => setContextsExpanded(!contextsExpanded)}
              className="flex items-center gap-1.5 text-[9px] font-medium text-text-muted/60 uppercase tracking-[0.2em] cursor-pointer hover:text-text-muted"
            >
              {contextsExpanded ? <ChevronDown size={9} /> : <ChevronRight size={9} />}
              Contexts
            </button>
            <button
              onClick={() => { setAddingContext(true); setNewName(''); }}
              className="text-text-muted/40 hover:text-text-muted p-0.5 rounded hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
            >
              <Plus size={11} />
            </button>
          </div>
          {contextsExpanded && (
            <>
              {contexts.map((context) => (
                <button
                  key={context.id}
                  onClick={() => setSelectedContextId(context.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[12px] transition-all duration-200 cursor-pointer ${
                    sidebarView === `context-${context.id}`
                      ? 'bg-white/5 text-text-primary'
                      : 'text-text-muted hover:bg-white/[0.03] hover:text-text-secondary'
                  }`}
                >
                  <Hash size={13} style={{ color: context.color }} className="flex-shrink-0 opacity-70" />
                  <span className="truncate tracking-wide">{context.name}</span>
                </button>
              ))}
              {addingContext && (
                <form onSubmit={(e) => { e.preventDefault(); handleAddContext(); }} className="px-3 py-1">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleAddContext}
                    placeholder="Context name..."
                    className="w-full bg-transparent border-b border-white/10 px-0 py-1 text-[12px] text-text-primary placeholder:text-text-muted/40 outline-none"
                  />
                </form>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Keyboard hints */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-3 text-[9px] text-text-muted/40 tracking-wider uppercase">
          <kbd className="px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded text-[8px]">N</kbd>
          <span>New task</span>
          <kbd className="px-1.5 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded text-[8px] ml-auto">/</kbd>
          <span>Search</span>
        </div>
      </div>
    </aside>
  );
}
