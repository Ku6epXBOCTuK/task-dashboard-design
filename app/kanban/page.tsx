'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, Check, Circle, Filter, Plus, Search, Sun, Moon, X } from 'lucide-react'

type Status = 'backlog' | 'in progress' | 'blocked' | 'done'
type Task = { id: string; title: string; status: Status; priority: string; project: string; tags: string[] }

const tasks: Task[] = [
  { id: 'SHOP-32', title: 'Search suggestions send a request per typed character', status: 'backlog', priority: 'medium', project: 'shop-web', tags: ['perf', 'search'] },
  { id: 'SHOP-31', title: 'Cart badge shows a stale count after switching tabs', status: 'backlog', priority: 'low', project: 'shop-web', tags: ['cart'] },
  { id: 'SHOP-29', title: 'Order confirmation e-mail is sent twice on slow networks', status: 'blocked', priority: 'critical', project: 'shop-web', tags: ['checkout', 'emails'] },
  { id: 'SHOP-26', title: '3-D Secure redirect clears the card holder name', status: 'in progress', priority: 'high', project: 'shop-web', tags: ['checkout', 'payments'] },
  { id: 'BILL-16', title: 'Invoice PDF rendering blocks the event loop', status: 'in progress', priority: 'high', project: 'billing-api', tags: ['perf', 'invoices'] },
  { id: 'SHOP-28', title: 'placeOrder retries without an idempotency key', status: 'backlog', priority: 'high', project: 'shop-web', tags: ['api', 'checkout'] },
  { id: 'KIT-6', title: 'Tooltip closes on scroll inside a modal', status: 'backlog', priority: 'medium', project: 'design-kit', tags: ['a11y'] },
  { id: 'SHOP-22', title: 'Address step validates fields only on submit', status: 'done', priority: 'medium', project: 'shop-web', tags: ['checkout'] },
]

const columns: { key: Status; label: string }[] = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'in progress', label: 'In progress' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'done', label: 'Done' },
]

export default function KanbanPage() {
  const [query, setQuery] = useState('')
  const [lightTheme, setLightTheme] = useState(false)
  const [activeProject, setActiveProject] = useState('all')
  const visibleTasks = useMemo(() => tasks.filter((task) => `${task.id} ${task.title} ${task.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()) && (activeProject === 'all' || task.project === activeProject)), [query, activeProject])

  return (
    <main className={`app-shell ${lightTheme ? 'theme-light' : ''}`}>
      <aside className="sidebar">
        <div className="brand"><span>backlog</span><i>.</i></div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a className="nav-item" href="/"><Circle data-icon="inline-start" /> Tasks <span className="nav-count">24</span></a>
          <a className="nav-item active" href="/kanban"><span className="kanban-mark">▦</span> Kanban <span className="nav-count">4</span></a>
        </nav>
        <div className="projects-heading"><span className="section-toggle">Projects</span><span>27 tasks</span></div>
        <div className="project-list">
          <p className="project-hint">Filter board by project</p>
          {['billing-api', 'design-kit', 'shop-web'].map((project) => <button key={project} onClick={() => setActiveProject(activeProject === project ? 'all' : project)} className={`project-item ${activeProject === project ? 'selected' : ''}`}><span className="project-check"><Check /></span><span>{project}</span></button>)}
        </div>
        <div className="sidebar-note"><div>Board view</div><code>drag-ready task lanes<br />status flow / delivery</code></div>
        <div className="language-switch"><button>RU</button><button className="active">EN</button></div>
      </aside>
      <section className="workspace kanban-workspace">
        <header className="workspace-header">
          <div className="title-row"><div><p className="eyebrow">WORKSPACE / DELIVERY</p><h1>Kanban board</h1></div><div className="header-actions"><button className="icon-button" onClick={() => setLightTheme(!lightTheme)} aria-label={lightTheme ? 'Switch to dark theme' : 'Switch to light theme'}>{lightTheme ? <Moon /> : <Sun />}</button><button className="new-task"><Plus data-icon="inline-start" /> New task</button></div></div>
          <div className="board-toolbar"><div className="search-wrap"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, IDs, or tags" aria-label="Search board" /><kbd>/</kbd></div><button className="select-filter"><Filter /> Filters <span>⌄</span></button><span className="result-count">{visibleTasks.length} cards / {tasks.length} total</span></div>
        </header>
        <div className="kanban-board">{columns.map((column) => { const columnTasks = visibleTasks.filter((task) => task.status === column.key); return <section className={`kanban-column ${column.key.replace(' ', '-')}`} key={column.key}><div className="column-header"><div><span className="column-status-dot" /><h2>{column.label}</h2></div><span className="column-count">{columnTasks.length}</span></div><div className="column-cards">{columnTasks.map((task) => <article className="kanban-card" key={task.id}><div className="card-top"><span className="task-id">{task.id}</span><button className="card-action" aria-label={`Open ${task.id}`}><ArrowUpRight /></button></div><h3>{task.title}</h3><div className="card-meta"><span className={`priority-label ${task.priority}`}>{task.priority}</span><span className="project-label">{task.project}</span></div><div className="tag-list">{task.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div></article>)}<button className="add-card"><Plus /> Add task</button></div></section> })}</div>
      </section>
    </main>
  )
}
