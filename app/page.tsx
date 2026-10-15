'use client'

import { useMemo, useState } from 'react'
import {
  Archive,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardList,
  Filter,
  FolderKanban,
  Inbox,
  PanelLeftClose,
  Plus,
  Search,
  SlidersHorizontal,
  Tag,
  Trash2,
  X,
  Zap,
} from 'lucide-react'

type Status = 'backlog' | 'in progress' | 'blocked' | 'done'
type Priority = 'low' | 'medium' | 'high' | 'critical'

type Task = {
  id: string
  title: string
  status: Status
  priority: Priority
  project: string
  tags: string[]
  date: string
  description: string
  progress?: number
}

const tasks: Task[] = [
  { id: 'SHOP-32', title: 'Search suggestions send a request per typed character', status: 'backlog', priority: 'medium', project: 'shop-web', tags: ['perf', 'search'], date: '09/24/26', description: 'Search suggestions fire a network request for every character. Debounce the input and cancel stale requests before they reach the API.' },
  { id: 'SHOP-31', title: 'Cart badge shows a stale count after switching tabs', status: 'backlog', priority: 'low', project: 'shop-web', tags: ['cart'], date: '09/23/26', description: 'The cart count is not refreshed when the storefront tab regains focus.' },
  { id: 'SHOP-29', title: 'Order confirmation e-mail is sent twice on slow networks', status: 'blocked', priority: 'critical', project: 'shop-web', tags: ['checkout', 'emails'], date: '09/20/26', description: "On slow networks, the payment form can be submitted twice. Add an idempotency key and disable the action while the request is pending." },
  { id: 'SHOP-28', title: 'placeOrder retries without an idempotency key', status: 'backlog', priority: 'high', project: 'shop-web', tags: ['api', 'checkout'], date: '09/20/26', description: 'Retries need a stable request key so the order service can safely deduplicate them.' },
  { id: 'SHOP-27', title: 'ProductGrid re-renders on every filter keystroke', status: 'backlog', priority: 'medium', project: 'shop-web', tags: ['perf', 'catalog'], date: '09/18/26', description: 'Move the expensive grid calculation behind a memoized selector and keep the filter input responsive.' },
  { id: 'BILL-17', title: 'Currency conversion rounds differently from shop-web', status: 'backlog', priority: 'medium', project: 'billing-api', tags: ['money'], date: '09/16/26', description: 'Billing and storefront use different rounding modes for converted totals.' },
  { id: 'SHOP-26', title: '3-D Secure redirect clears the card holder name', status: 'in progress', priority: 'high', project: 'shop-web', tags: ['checkout', 'payments'], date: '09/15/26', description: "After the bank's 3-D Secure page redirects back, the payment form mounts again and the card holder field is empty. The card number comes back from the provider token, so people do not notice until the payment is declined.", progress: 50 },
  { id: 'KIT-6', title: 'Tooltip closes on scroll inside a modal', status: 'backlog', priority: 'medium', project: 'design-kit', tags: ['a11y'], date: '09/14/26', description: 'Keep the tooltip open while the modal scroll container is moving.' },
  { id: 'BILL-16', title: 'Invoice PDF rendering blocks the event loop', status: 'in progress', priority: 'high', project: 'billing-api', tags: ['perf', 'invoices'], date: '09/11/26', description: 'Move PDF rendering to a worker so invoice generation cannot block request handling.', progress: 30 },
  { id: 'SHOP-25', title: "Image carousel can't be operated from the keyboard", status: 'backlog', priority: 'medium', project: 'shop-web', tags: ['a11y', 'catalog'], date: '09/09/26', description: 'Add roving tabindex and keyboard controls to the image carousel.' },
  { id: 'BILL-15', title: 'Tax lookup reaches through order.customer.account.region', status: 'backlog', priority: 'medium', project: 'billing-api', tags: ['tax'], date: '09/07/26', description: 'Replace the deep property access with a typed customer region boundary.' },
  { id: 'SHOP-23', title: 'VAT rate 0.2 hard-coded in three places', status: 'backlog', priority: 'high', project: 'shop-web', tags: ['pricing'], date: '09/05/26', description: 'Centralize tax rates behind the pricing configuration.' },
  { id: 'KIT-4', title: 'Components use raw hex colors instead of tokens', status: 'backlog', priority: 'medium', project: 'design-kit', tags: ['tokens'], date: '09/03/26', description: 'Replace raw values with semantic design tokens across the component library.' },
  { id: 'SHOP-22', title: 'Address step validates fields only on submit', status: 'backlog', priority: 'medium', project: 'shop-web', tags: ['checkout'], date: '09/01/26', description: 'Validate on blur and preserve field-level errors when users navigate between checkout steps.' },
  { id: 'BILL-14', title: 'Customer and Account share one mutable address object', status: 'backlog', priority: 'medium', project: 'billing-api', tags: ['data'], date: '08/30/26', description: 'Clone address snapshots at the account boundary.' },
  { id: 'KIT-3', title: 'IconButton copies all Button variants', status: 'backlog', priority: 'low', project: 'design-kit', tags: ['components'], date: '08/29/26', description: 'Consolidate shared button variants into a single source of truth.' },
]

const statusOptions: Status[] = ['backlog', 'in progress', 'blocked', 'done']
const priorityOptions: Priority[] = ['low', 'medium', 'high', 'critical']

function StatusDot({ status }: { status: Status }) {
  return <span className={`status-dot ${status.replace(' ', '-')}`} aria-hidden="true" />
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [priority, setPriority] = useState<Priority | 'all'>('all')
  const [activeProject, setActiveProject] = useState('all')
  const [selected, setSelected] = useState<Task | null>(tasks[6])
  const [projectsOpen, setProjectsOpen] = useState(true)

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesQuery = `${task.id} ${task.title} ${task.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === 'all' || task.status === status) && (priority === 'all' || task.priority === priority) && (activeProject === 'all' || task.project === activeProject)
  }), [query, status, priority, activeProject])

  const clearFilters = () => { setQuery(''); setStatus('all'); setPriority('all'); setActiveProject('all') }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span>backlog</span><i>.</i></div>
        <nav className="primary-nav" aria-label="Primary navigation">
          <button className="nav-item active"><ClipboardList data-icon="inline-start" /> Tasks <span className="nav-count">24</span></button>
          <button className="nav-item"><BarChart3 data-icon="inline-start" /> Statistics <span className="nav-alert">2</span></button>
        </nav>
        <div className="projects-heading">
          <button className="section-toggle" onClick={() => setProjectsOpen(!projectsOpen)} aria-expanded={projectsOpen}><ChevronDown className={projectsOpen ? '' : '-rotate-90'} data-icon="inline-start" /> Projects</button>
          <span>27 tasks</span>
        </div>
        {projectsOpen && <div className="project-list">
          <p className="project-hint">3 of 3 projects included — checked</p>
          {[['billing-api', '9'], ['design-kit', '3'], ['shop-web', '15']].map(([name, count]) => <button key={name} onClick={() => setActiveProject(activeProject === name ? 'all' : name)} className={`project-item ${activeProject === name ? 'selected' : ''}`}><span className="project-check"><Check /></span><span>{name}</span><span className="project-count">{count}</span><Trash2 className="delete-icon" /></button>)}
        </div>}
        <div className="sidebar-note"><div><Inbox /> No code graph: 3 projects</div><code>code-review-graph build — check<br />candidates are less precise</code></div>
        <div className="language-switch"><button>RU</button><button className="active">EN</button></div>
      </aside>

      <section className={`workspace ${selected ? 'with-detail' : ''}`}>
        <header className="workspace-header">
          <div className="title-row"><div><p className="eyebrow">WORKSPACE / TASKS</p><h1>Projects</h1></div><div className="header-actions"><button className="icon-button" aria-label="Collapse sidebar"><PanelLeftClose /></button><button className="new-task"><Plus data-icon="inline-start" /> New task</button></div></div>
          <div className="search-wrap"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, description, and ID" aria-label="Search tasks" /><kbd>/</kbd></div>
          <div className="filter-row"><div className="filter-group"><span className="filter-label">STATUS</span>{statusOptions.map((option) => <button key={option} onClick={() => setStatus(status === option ? 'all' : option)} className={`filter-chip ${status === option ? 'active' : ''}`}><StatusDot status={option} />{option}</button>)}</div><div className="filter-group priority-group"><span className="filter-label">PRIORITY</span>{priorityOptions.map((option) => <button key={option} onClick={() => setPriority(priority === option ? 'all' : option)} className={`filter-chip priority-${option} ${priority === option ? 'active' : ''}`}>{option}</button>)}</div><button className="clear-filters" onClick={clearFilters}><X /> Clear</button></div>
          <div className="meta-row"><button className="select-filter"><FolderKanban /> Epic: <strong>any</strong><ChevronDown /></button><button className="select-filter"><Tag /> Tags <strong>(25)</strong><ChevronDown /></button><span className="result-count">{filteredTasks.length} visible / 27 total</span></div>
        </header>
        <div className="table-wrap"><table><thead><tr><th className="id-col">ID</th><th>Task</th><th>Tags</th><th>Status</th><th>Priority</th><th className="date-col">Created <span>↓</span></th></tr></thead><tbody>{filteredTasks.map((task) => <tr key={task.id} onClick={() => setSelected(task)} className={selected?.id === task.id ? 'row-selected' : ''}><td className="task-id">{task.id}</td><td className="task-title"><span className="new-badge">{task.status === 'backlog' ? 'new' : 'active'}</span>{task.title}{task.id === 'SHOP-26' && <span className="epic-badge">SHOP-13</span>}</td><td><div className="tag-list">{task.tags.map((tag) => <span className="tag" key={tag}>#{tag}</span>)}</div></td><td><span className="status-label"><StatusDot status={task.status} />{task.status}</span></td><td className={`priority-label ${task.priority}`}>{task.priority}</td><td className="date-label">{task.date}</td></tr>)}</tbody></table>{filteredTasks.length === 0 && <div className="empty-state"><SlidersHorizontal /><p>No tasks match these filters.</p><button onClick={clearFilters}>Reset filters</button></div>}</div>
      </section>

      {selected && <aside className="detail-panel" aria-label="Task details"><div className="detail-top"><span className="epic-badge">{selected.id}</span><button className="close-detail" onClick={() => setSelected(null)} aria-label="Close task details"><X /></button></div><p className="detail-kicker">TASK DETAIL / {selected.project.toUpperCase()}</p><h2>{selected.title}</h2><div className="detail-grid"><label>Status<select value={selected.status}><option>in progress</option><option>backlog</option><option>blocked</option><option>done</option></select></label><label>Priority<select value={selected.priority}><option>high</option><option>medium</option><option>low</option><option>critical</option></select></label></div><div className="detail-grid"><label>Category<select><option>Bug</option><option>Feature</option><option>Chore</option></select></label><label>Type<select><option>task</option><option>epic</option></select></label></div><label className="detail-field">Epic<input value="SHOP-13" readOnly /></label><label className="detail-field">Comma-separated tags<input value={selected.tags.join(', ')} readOnly /></label><div className="progress-meta"><StatusDot status={selected.status} /><span>{selected.status}</span><div className="progress-bar"><span style={{ width: `${selected.progress ?? 0}%` }} /></div><span>{selected.progress ?? 0}%</span><span className="muted">created {selected.date}/2026</span></div><code className="source-line">src/{selected.project}/PaymentForm.tsx:112</code><div className="description"><p>{selected.description}</p><p>The implementation should preserve state across redirects and remain safe to retry.</p><label className="check-row"><input type="checkbox" defaultChecked /> <span>Reproduce with the 3-D Secure test card</span></label><label className="check-row"><input type="checkbox" defaultChecked /> <span>Find where the state is lost</span></label><label className="check-row"><input type="checkbox" /> <span>Keep the draft in session storage until payment is confirmed</span></label></div><button className="edit-button">Edit description</button><div className="related-section"><p>BLOCKED BY</p><div className="related-item"><span className="epic-badge">SHOP-24</span><span>Storage wrapper swallows quota errors</span><StatusDot status="done" /><X /></div><div className="related-add"><input placeholder="Task ID" /><button>Add</button></div></div></aside>}
    </main>
  )
}
