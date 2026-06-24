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
    <aside className="w-[220px] min-w-[220px] h-screen bg-bg-secondary border-r border-border flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-3 py-3 flex items-center gap-2 border-b border-border">
        <div className="w-5 h-5 bg-accent rounded flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold">W</span>
        </div>
        <span className="text-sm font-semibold text-text-primary truncate">Workboard</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {/* Main nav */}
        <div className="px-2 mb-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSidebarView(key)}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                sidebarView === key
                  ? 'bg-bg-active text-text-primary'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              <Icon size={14} className="flex-shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        <div className="mx-3 my-2 border-t border-border" />

        {/* Dashboard & Notes */}
        <div className="px-2 mb-1">
          <button
            onClick={() => setSidebarView('dashboard')}
            className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
              sidebarView === 'dashboard' ? 'bg-bg-active text-text-primary' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
            }`}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setSidebarView('notes')}
            className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
              sidebarView === 'notes' ? 'bg-bg-active text-text-primary' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
            }`}
          >
            <BookOpen size={14} />
            <span>Daily Notes</span>
          </button>
        </div>

        <div className="mx-3 my-2 border-t border-border" />

        {/* Projects */}
        <div className="px-2 mb-1">
          <div className="flex items-center justify-between px-2 py-1">
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className="flex items-center gap-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary"
            >
              {projectsExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              Projects
            </button>
            <button
              onClick={() => { setAddingProject(true); setNewName(''); }}
              className="text-text-muted hover:text-text-primary p-0.5 rounded hover:bg-bg-hover transition-colors cursor-pointer"
            >
              <Plus size={12} />
            </button>
          </div>
          {projectsExpanded && (
            <>
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    sidebarView === `project-${project.id}`
                      ? 'bg-bg-active text-text-primary'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }`}
                >
                  <FolderKanban size={13} style={{ color: project.color }} className="flex-shrink-0" />
                  <span className="truncate">{project.name}</span>
                </button>
              ))}
              {addingProject && (
                <form onSubmit={(e) => { e.preventDefault(); handleAddProject(); }} className="px-2 py-1">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleAddProject}
                    placeholder="Project name..."
                    className="w-full bg-bg-tertiary border border-border rounded px-2 py-0.5 text-xs text-text-primary placeholder:text-text-muted"
                  />
                </form>
              )}
            </>
          )}
        </div>

        {/* Contexts */}
        <div className="px-2 mb-1">
          <div className="flex items-center justify-between px-2 py-1">
            <button
              onClick={() => setContextsExpanded(!contextsExpanded)}
              className="flex items-center gap-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary"
            >
              {contextsExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              Contexts
            </button>
            <button
              onClick={() => { setAddingContext(true); setNewName(''); }}
              className="text-text-muted hover:text-text-primary p-0.5 rounded hover:bg-bg-hover transition-colors cursor-pointer"
            >
              <Plus size={12} />
            </button>
          </div>
          {contextsExpanded && (
            <>
              {contexts.map((context) => (
                <button
                  key={context.id}
                  onClick={() => setSelectedContextId(context.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    sidebarView === `context-${context.id}`
                      ? 'bg-bg-active text-text-primary'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }`}
                >
                  <Hash size={13} style={{ color: context.color }} className="flex-shrink-0" />
                  <span className="truncate">{context.name}</span>
                </button>
              ))}
              {addingContext && (
                <form onSubmit={(e) => { e.preventDefault(); handleAddContext(); }} className="px-2 py-1">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleAddContext}
                    placeholder="Context name..."
                    className="w-full bg-bg-tertiary border border-border rounded px-2 py-0.5 text-xs text-text-primary placeholder:text-text-muted"
                  />
                </form>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Keyboard hint */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center gap-2 text-[10px] text-text-muted">
          <kbd className="px-1 py-0.5 bg-bg-tertiary border border-border rounded text-[9px]">N</kbd>
          <span>New task</span>
          <kbd className="px-1 py-0.5 bg-bg-tertiary border border-border rounded text-[9px] ml-auto">/</kbd>
          <span>Search</span>
        </div>
      </div>
    </aside>
  );
}
