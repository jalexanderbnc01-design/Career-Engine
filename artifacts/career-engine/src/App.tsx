import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, Check,
  CircleHelp, Download, FileText, FolderKanban, GraduationCap, LayoutDashboard,
  Menu, Moon, Plus, Search, Settings, ShieldCheck, Sparkles, Sun, Target,
  TrendingUp, UserRound, X, Wrench, Heart, Trash2, Pencil, ExternalLink, Layers3, Lightbulb,
} from 'lucide-react';

type AnyRecord = Record<string, any>;
type Data = {
  profile: AnyRecord; skills: AnyRecord[]; opportunities: AnyRecord[]; applications: AnyRecord[];
  resumes: AnyRecord[]; projects: AnyRecord[]; learning: AnyRecord[]; services: AnyRecord[];
  theme: 'light' | 'dark'; sample: boolean;
};

const STORE = 'xelime-career-workspace-v2';
const LEGACY_STORE = 'xelime-career-workspace-v1';
const starter: Data = {
  profile: {
    displayName: '', headline: 'Technical drafting, 3D & digital design', location: '',
    summary: 'Editable starter copy based on the example skill areas in your brief. Replace it with your own verified story.',
    experience: [],
    education: [],
  },
  skills: [
    { id: 's1', name: 'AutoCAD', proficiency: 'Professional experience', years: '', lastUsed: '', evidence: 'Team Fishel — example evidence from your brief', category: 'CAD & drafting' },
    { id: 's2', name: 'Civil 3D', proficiency: 'Professional experience', years: '', lastUsed: '', evidence: 'Team Fishel — example evidence from your brief', category: 'CAD & drafting' },
    { id: 's3', name: 'Technical drafting', proficiency: 'Professional experience', years: '', lastUsed: '', evidence: 'EMH&T / Team Fishel — example evidence from your brief', category: 'CAD & drafting' },
    { id: 's4', name: 'Revit', proficiency: 'Developing', years: '', lastUsed: '', evidence: 'Education and projects — example from your brief', category: 'Building design' },
    { id: 's5', name: 'SketchUp', proficiency: 'Developing', years: '', lastUsed: '', evidence: 'Project experience — example from your brief', category: '3D & visualization' },
    { id: 's6', name: 'Blender', proficiency: 'Developing', years: '', lastUsed: '', evidence: 'Personal projects — example from your brief', category: '3D & visualization' },
    { id: 's7', name: 'Unreal Engine', proficiency: 'Learning', years: '', lastUsed: '', evidence: 'Portfolio development — example from your brief', category: '3D & visualization' },
    { id: 's8', name: 'HTML / CSS / JavaScript', proficiency: 'Developing', years: '', lastUsed: '', evidence: 'Career Engine projects — example from your brief', category: 'Digital development' },
  ],
  opportunities: [
    { id: 'o1', title: 'Civil CAD Designer', company: 'Illustrative employer', industry: 'Civil engineering', salary: 'Not provided', employmentType: 'Full-time', workplace: 'Location not provided', compatibility: 86, missingSkills: [], category: 'Employment', saved: true },
    { id: 'o2', title: 'Technical drafting project', company: 'Illustrative client', industry: 'CAD & documentation', salary: 'Scope varies', employmentType: 'Freelance', workplace: 'Details not provided', compatibility: 78, missingSkills: [], category: 'Freelance', saved: false },
    { id: 'o3', title: 'Architectural visualization', company: 'Illustrative client', industry: '3D & visualization', salary: 'Scope varies', employmentType: 'Independent service', workplace: 'Details not provided', compatibility: 72, missingSkills: [], category: 'Business', saved: false },
    { id: 'o4', title: '3D design apprenticeship', company: 'Illustrative program', industry: '3D & digital design', salary: 'Not provided', employmentType: 'Apprenticeship', workplace: 'Details not provided', compatibility: 68, missingSkills: [], category: 'Development', saved: false },
  ],
  applications: [],
  resumes: [],
  projects: [
    { id: 'p1', title: 'Architectural visualization', industry: 'Architecture', software: 'Blender', skills: ['Blender', '3D modeling'], description: 'Project example from your brief; add details only if accurate.', outcomes: '', completedAt: '' },
    { id: 'p2', title: 'Civil site plan', industry: 'Civil engineering', software: 'AutoCAD, Civil 3D', skills: ['AutoCAD', 'Civil 3D', 'Technical drafting'], description: 'Project example from your brief; add details only if accurate.', outcomes: '', completedAt: '' },
    { id: 'p3', title: 'Interactive 3D viewer', industry: 'Digital development', software: 'Three.js, JavaScript', skills: ['JavaScript', '3D modeling'], description: 'Project example from your brief; add details only if accurate.', outcomes: '', completedAt: '' },
    { id: 'p4', title: 'Building design', industry: 'Architecture', software: 'Revit', skills: ['Revit', 'Architecture'], description: 'Project example from your brief; add details only if accurate.', outcomes: '', completedAt: '' },
  ],
  learning: [{ id: 'l1', title: 'Unreal Engine portfolio development', provider: 'Self-directed', skill: 'Unreal Engine', progress: 0, targetDate: '', status: 'Planned' }],
  services: [],
  theme: 'light', sample: true,
};

const nav = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Identity', href: '/profile', icon: UserRound },
  { label: 'Skills', href: '/skills', icon: Layers3 },
  { label: 'Opportunities', href: '/opportunities', icon: Target },
  { label: 'Applications', href: '/applications', icon: BriefcaseBusiness },
  { label: 'Resume', href: '/resume', icon: FileText },
  { label: 'Portfolio', href: '/portfolio', icon: FolderKanban },
  { label: 'Development', href: '/development', icon: GraduationCap },
  { label: 'Services', href: '/services', icon: Wrench },
  { label: 'Assistant preview', href: '/assistant', icon: Sparkles },
  { label: 'Analytics', href: '/analytics', icon: Activity },
];
const configs: Record<string, { key: keyof Data; title: string; singular: string; fields: string[]; helper?: string }> = {
  skills: { key: 'skills', title: 'Skills & evidence', singular: 'skill', fields: ['name', 'category', 'proficiency', 'years', 'lastUsed', 'evidence'] },
  opportunities: { key: 'opportunities', title: 'Opportunities', singular: 'opportunity', fields: ['title', 'company', 'industry', 'salary', 'employmentType', 'workplace', 'compatibility', 'missingSkills', 'category'] },
  applications: { key: 'applications', title: 'Applications', singular: 'application', fields: ['role', 'company', 'status', 'appliedDate', 'nextStep', 'notes'] },
  resumes: { key: 'resumes', title: 'Resume versions', singular: 'resume version', fields: ['name', 'targetRole', 'updatedAt', 'sourceSkills'] },
  projects: { key: 'projects', title: 'Portfolio evidence', singular: 'project', fields: ['title', 'industry', 'software', 'skills', 'description', 'outcomes', 'completedAt'] },
  learning: { key: 'learning', title: 'Learning plans', singular: 'learning item', fields: ['title', 'provider', 'skill', 'progress', 'targetDate', 'status'] },
  services: { key: 'services', title: 'Services', singular: 'service', fields: ['title', 'description', 'skills', 'pricing', 'deliveryTime', 'availability'] },
};
const keyForPath: Record<string, keyof Data> = {
  '/skills': 'skills', '/applications': 'applications', '/resume': 'resumes', '/portfolio': 'projects',
  '/development': 'learning', '/services': 'services',
};
const labelize = (s: string) => s.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
const id = () => Math.random().toString(36).slice(2, 10);
const readData = (): Data => {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return { ...starter, ...JSON.parse(raw) };
    const legacyRaw = localStorage.getItem(LEGACY_STORE);
    if (!legacyRaw) return starter;
    const legacy = JSON.parse(legacyRaw);
    if (legacy.sample === true && legacy.profile?.displayName === 'Alex Morgan') {
      return { ...starter, theme: legacy.theme === 'dark' ? 'dark' : 'light' };
    }
    return { ...starter, ...legacy, sample: false };
  } catch { return starter; }
};

function App() {
  const [data, setData] = useState<Data>(readData);
  const [path] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialog, setDialog] = useState<{ kind: string; record?: AnyRecord } | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState('');
  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(data));
    document.documentElement.classList.toggle('dark', data.theme === 'dark');
  }, [data]);
  useEffect(() => { setMobileOpen(false); setQuery(''); setFilter('All'); }, [path]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const update = (key: keyof Data, value: any) => setData(d => ({ ...d, [key]: value }));
  const upsert = (key: keyof Data, record: AnyRecord) => {
    const rows = (data[key] as AnyRecord[]) || [];
    update(key, record.id ? rows.map(r => r.id === record.id ? record : r) : [{ ...record, id: id() }, ...rows]);
    setDialog(null); notify(record.id ? 'Changes saved' : 'Added to your workspace');
  };
  const remove = (key: keyof Data, recordId: string) => {
    if (!window.confirm('Remove this record from your local workspace?')) return;
    update(key, (data[key] as AnyRecord[]).filter(r => r.id !== recordId)); notify('Record removed');
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'xelime-career-data.json'; a.click(); URL.revokeObjectURL(url); notify('Local data exported');
  };
  const resetData = () => {
    if (!window.confirm('Reset this browser workspace to editable sample records? Your changes will be lost.')) return;
    setData({ ...starter, profile: { ...starter.profile }, skills: [...starter.skills], opportunities: [...starter.opportunities], applications: [...starter.applications], resumes: [...starter.resumes], projects: [...starter.projects], learning: [...starter.learning], services: [...starter.services] });
    notify('Workspace reset to sample records');
  };
  const title = nav.find(n => n.href === path)?.label || (path === '/settings' ? 'Settings' : 'Career workspace');
  const context: ViewContext = { data, path, query, setQuery, filter, setFilter, openDialog: setDialog, upsert, remove, update, notify, exportData, resetData };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark">X</div><div><strong>XELIME</strong><span>CAREER ENGINE</span></div><button className="icon-button mobile-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18}/></button></div>
      <div className="workspace-label">YOUR WORKSPACE</div>
      <nav className="side-nav" aria-label="Primary navigation">{nav.map(item => {
        const Icon = item.icon;
        return <Link key={item.href} href={item.href} className={`nav-link ${path === item.href ? 'active' : ''}`} data-testid={`link-${item.href.slice(1) || 'overview'}`}><Icon size={17} strokeWidth={1.8}/><span>{item.label}</span>{item.href === '/assistant' && <span className="preview-dot"/>}</Link>;
      })}</nav>
      <div className="sidebar-bottom">
        <div className="local-note"><ShieldCheck size={15}/><span>Your records stay in this browser</span></div>
        <Link href="/settings" className={`nav-link ${path === '/settings' ? 'active' : ''}`} data-testid="link-settings"><Settings size={17}/><span>Settings</span></Link>
        <div className="profile-chip"><div className="avatar">{(data.profile.displayName || 'Y').split(' ').map((p: string) => p[0]).join('').slice(0,2)}</div><div className="profile-chip-copy"><strong>{data.profile.displayName || 'Your workspace'}</strong><span>Personal account</span></div><button className="icon-button" aria-label="Toggle theme" onClick={() => setData(d => ({ ...d, theme: d.theme === 'dark' ? 'light' : 'dark' }))}>{data.theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}</button></div>
      </div>
    </aside>
    {mobileOpen && <button className="scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20}/></button><div className="crumb">Workspace <span>/</span> <b>{title}</b></div><div className="top-actions"><span className="saved-indicator"><span/> Saved locally</span><button className="top-icon" aria-label="Toggle theme" onClick={() => setData(d => ({ ...d, theme: d.theme === 'dark' ? 'light' : 'dark' }))}>{data.theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}</button><Link href="/settings" className="top-icon" aria-label="Settings"><Settings size={17}/></Link></div></header>
      <div className="page-wrap"><div className="page-content"><div className="page-eyebrow"><span className="eyebrow-line"/>{title}</div>
         {data.sample && <div className="sample-banner"><Lightbulb size={15}/><span><b>Editable examples from your brief.</b> Confirm or edit every detail before using it as your real career history.</span><button onClick={() => setData(d => ({ ...d, sample: false }))} aria-label="Dismiss sample notice"><X size={15}/></button></div>}
        <Switch>
          <Route path="/" component={() => <Overview {...context}/>}/>
          <Route path="/profile" component={() => <Profile {...context}/>}/>
          <Route path="/skills" component={() => <Collection {...context} kind="skills"/>}/>
          <Route path="/opportunities" component={() => <Opportunities {...context}/>}/>
          <Route path="/applications" component={() => <Collection {...context} kind="applications"/>}/>
          <Route path="/resume" component={() => <Collection {...context} kind="resumes"/>}/>
          <Route path="/portfolio" component={() => <Collection {...context} kind="projects"/>}/>
          <Route path="/development" component={() => <Collection {...context} kind="learning"/>}/>
          <Route path="/services" component={() => <Collection {...context} kind="services"/>}/>
          <Route path="/assistant" component={() => <Assistant/>}/>
          <Route path="/analytics" component={() => <Analytics {...context}/>}/>
          <Route path="/settings" component={() => <SettingsPage {...context}/>}/>
          <Route component={() => <NotFound/>}/>
        </Switch>
        <footer className="page-footer"><span>XELIME CAREER ENGINE</span><span>Private by design · Local browser storage</span></footer>
      </div></div>
    </main>
    {dialog && <RecordDialog dialog={dialog} onClose={() => setDialog(null)} onSave={upsert} />}
    {toast && <div className="toast-message" role="status"><Check size={15}/>{toast}</div>}
  </div>;
}

type ViewContext = {
  data: Data; path: string; query: string; setQuery: (s: string) => void; filter: string; setFilter: (s: string) => void;
  openDialog: (d: { kind: string; record?: AnyRecord } | null) => void; upsert: (k: keyof Data, r: AnyRecord) => void;
  remove: (k: keyof Data, id: string) => void; update: (k: keyof Data, v: any) => void; notify: (s: string) => void;
  exportData: () => void; resetData: () => void;
};

function Heading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="heading-row"><div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}
function Action({ children, onClick, secondary = false, icon }: { children: ReactNode; onClick: () => void; secondary?: boolean; icon?: ReactNode }) {
  return <button type="button" className={`button ${secondary ? 'button-secondary' : 'button-primary'}`} onClick={onClick}>{icon}{children}</button>;
}
function Metric({ label, value, note, icon: Icon, trend }: any) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><Icon size={17}/></div><div className="metric-value">{value}</div><div className="metric-note">{trend && <span className="trend"><ArrowUpRight size={13}/>{trend}</span>}{note}</div></div>;
}
function Overview(c: ViewContext) {
  const { data } = c;
  const evidenceCount = data.skills.filter(s => s.evidence?.trim()).length + data.projects.length;
  return <>
    <Heading title={data.profile.displayName ? `Good to have you, ${data.profile.displayName.split(' ')[0]}.` : 'Your career, in focus.'} description="Your career, organized around what you can prove." action={<Link className="button button-primary" href="/profile"><Pencil size={15}/>Refine identity</Link>}/>
    <div className="overview-hero">
      <div className="hero-copy"><div className="tiny-label">YOUR PROFESSIONAL NORTH STAR</div><h2>{data.profile.headline || 'Build a clear professional identity.'}</h2><p>{data.profile.summary || 'Add a concise summary of the work you do and the value you bring.'}</p><Link href="/profile" className="text-link">View your identity <ArrowRight size={15}/></Link></div>
      <div className="hero-orbit"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-core"><span>{String(data.skills.length).padStart(2, '0')}</span><small>skills</small></div><span className="orbit-node node-a"/><span className="orbit-node node-b"/><span className="orbit-node node-c"/></div>
    </div>
    <div className="metrics-grid">
       <Metric label="Evidence-backed records" value={evidenceCount} note="skills & project records" icon={ShieldCheck}/>
      <Metric label="Opportunity matches" value={data.opportunities.length} note="curated examples, not live listings" icon={Target}/>
      <Metric label="Active applications" value={data.applications.filter(a => !['Offer', 'Closed'].includes(a.status)).length} note="across your pipeline" icon={BriefcaseBusiness}/>
      <Metric label="Learning in motion" value={`${data.learning.filter(l => l.status === 'In progress').length}`} note="plans underway" icon={TrendingUp}/>
    </div>
    <div className="section-heading"><div><div className="tiny-label">NEXT, AT YOUR PACE</div><h2>Keep the signal strong</h2></div><Link href="/analytics" className="text-link">Career insights <ArrowRight size={15}/></Link></div>
    <div className="overview-grid">
      <div className="panel opportunity-spotlight"><div className="panel-head"><div><span className="tiny-label">OPPORTUNITY RADAR</span><h3>Worth a closer look</h3></div><Target size={18}/></div>
        {data.opportunities.slice(0, 2).map(o => <div className="radar-row" key={o.id}><div className="match-score">{o.compatibility}<small>%</small></div><div className="radar-copy"><strong>{o.title}</strong><span>{o.company} · {o.employmentType}</span></div><Link href="/opportunities" aria-label={`View ${o.title}`} className="round-arrow"><ArrowRight size={15}/></Link></div>)}
        <div className="micro-note">Illustrative examples based on the brief; no listings are live.</div>
      </div>
      <div className="panel progress-panel"><div className="panel-head"><div><span className="tiny-label">PROOF, NOT PROMISE</span><h3>Your evidence map</h3></div><ShieldCheck size={18}/></div>
        <div className="evidence-score"><div className="score-number">{Math.min(100, Math.round(evidenceCount / Math.max(data.skills.length + data.projects.length, 1) * 100))}<span>%</span></div><div><strong>Evidence attached</strong><span>of your skill & project records</span></div></div>
        <div className="progress-track"><span style={{ width: `${Math.min(100, Math.round(evidenceCount / Math.max(data.skills.length + data.projects.length, 1) * 100))}%` }}/></div>
        <Link href="/skills" className="text-link">Strengthen your evidence <ArrowRight size={15}/></Link>
      </div>
    </div>
    <div className="section-heading"><div><div className="tiny-label">QUICK ACCESS</div><h2>Shape what comes next</h2></div></div>
    <div className="quick-links">{[
      ['/skills', 'Add evidence', 'Connect a skill to real work', ShieldCheck],
      ['/development', 'Build a skill', 'Move one learning plan forward', BookOpen],
      ['/portfolio', 'Capture a project', 'Keep useful work in one place', FolderKanban],
      ['/assistant', 'Career assistant', 'Explore the preview modes', Sparkles],
    ].map(([href, title, desc, Icon]: any) => <Link href={href} key={href} className="quick-card"><Icon size={18}/><strong>{title}</strong><span>{desc}</span><ArrowRight size={15} className="quick-arrow"/></Link>)}</div>
  </>;
}

function Profile(c: ViewContext) {
  const [form, setForm] = useState(c.data.profile);
  useEffect(() => setForm(c.data.profile), [c.data.profile]);
  useEffect(() => {
    const receive = (event: Event) => {
      const { kind, record } = (event as CustomEvent).detail;
      setForm((current: AnyRecord) => ({
        ...current,
        [kind]: record._index !== undefined
          ? current[kind].map((item: AnyRecord, index: number) => index === record._index ? Object.fromEntries(Object.entries(record).filter(([key]) => key !== '_index')) : item)
          : [...(current[kind] || []), record],
      }));
    };
    window.addEventListener('xelime-nested-record', receive);
    return () => window.removeEventListener('xelime-nested-record', receive);
  }, []);
  const [section, setSection] = useState<'experience' | 'education'>('experience');
  const save = (e: FormEvent) => { e.preventDefault(); c.update('profile', form); c.notify('Identity saved locally'); };
  const editNested = (type: 'experience' | 'education', index?: number) => {
    const item = index === undefined ? {} : { ...form[type][index], _index: index };
    c.openDialog({ kind: type, record: item });
  };
  return <>
    <Heading title="Professional identity" description="The source of truth for how you describe your work. Keep claims accurate and grounded in evidence."/>
    <form className="panel identity-form" onSubmit={save}>
      <div className="panel-head"><div><span className="tiny-label">YOUR PROFILE</span><h3>A clear introduction</h3></div><span className="local-tag"><ShieldCheck size={13}/>Private</span></div>
      <div className="form-grid"><Field label="Display name" value={form.displayName} onChange={v => setForm({ ...form, displayName: v })}/><Field label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })}/><Field label="Professional headline" value={form.headline} onChange={v => setForm({ ...form, headline: v })} wide/><Field label="Summary" value={form.summary} onChange={v => setForm({ ...form, summary: v })} multiline wide/></div>
      <div className="form-actions"><span>Changes are stored in this browser only.</span><Action onClick={() => (document.getElementById('profile-save') as HTMLButtonElement)?.click()} icon={<Check size={15}/>}>Save identity</Action><button id="profile-save" type="submit" hidden/></div>
    </form>
    <div className="section-heading"><div><div className="tiny-label">CAREER RECORD</div><h2>Experience & education</h2></div><div className="segmented"><button className={section === 'experience' ? 'selected' : ''} onClick={() => setSection('experience')}>Experience</button><button className={section === 'education' ? 'selected' : ''} onClick={() => setSection('education')}>Education</button></div></div>
    <div className="record-list">
      {(form[section] || []).map((record: AnyRecord, index: number) => <div className="record-card" key={`${section}-${index}`}><div className="record-mark">{section === 'experience' ? <BriefcaseBusiness size={17}/> : <GraduationCap size={18}/>}</div><div className="record-body"><strong>{section === 'experience' ? record.role : record.credential}</strong><span>{section === 'experience' ? record.company : record.school}</span><span className="record-dates">{record.dates}</span>{record.description && <p>{record.description}</p>}</div><div className="row-actions"><button aria-label="Edit record" onClick={() => editNested(section, index)}><Pencil size={15}/></button><button aria-label="Remove record" onClick={() => { if (window.confirm('Remove this record?')) setForm({ ...form, [section]: form[section].filter((_: any, i: number) => i !== index) }); }}><Trash2 size={15}/></button></div></div>)}
      {!form[section]?.length && <Empty title={`No ${section} records yet`} body="Add records that you can verify. Suggestions are never added as facts."/>}
    </div>
    <Action onClick={() => editNested(section)} secondary icon={<Plus size={15}/>}>Add {section === 'experience' ? 'experience' : 'education'}</Action>
  </>;
}

function Field({ label, value, onChange, wide, multiline, type = 'text' }: { label: string; value: any; onChange: (s: string) => void; wide?: boolean; multiline?: boolean; type?: string }) {
  return <label className={`field ${wide ? 'field-wide' : ''}`}><span>{label}</span>{multiline ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={4}/> : <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}/>}</label>;
}
function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="empty-state"><div className="empty-mark"><Layers3 size={19}/></div><strong>{title}</strong><span>{body}</span>{action}</div>;
}
function SearchBar({ value, onChange, placeholder = 'Search records' }: any) {
  return <div className="search-box"><Search size={16}/><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}/>{value && <button onClick={() => onChange('')} aria-label="Clear search"><X size={14}/></button>}</div>;
}
function Collection(c: ViewContext & { kind: string }) {
  const cfg = configs[c.kind]; const rows = c.data[cfg.key] as AnyRecord[];
  const filtered = rows.filter(r => Object.values(r).join(' ').toLowerCase().includes(c.query.toLowerCase()));
  const add = () => c.openDialog({ kind: c.kind });
  return <>
    <Heading title={cfg.title} description={collectionDescription(c.kind)} action={<Action onClick={add} icon={<Plus size={16}/>}>Add {cfg.singular}</Action>}/>
    {c.kind === 'skills' && <div className="callout"><ShieldCheck size={16}/><span><b>Evidence makes a skill credible.</b> Add context you can stand behind; proficiency is your own assessment.</span></div>}
    {c.kind === 'resumes' && <div className="callout"><FileText size={16}/><span>Organize versions from your verified records. Resume export is a workspace outline in this first release, not a generated document.</span></div>}
    {c.kind === 'learning' && <div className="callout"><BookOpen size={16}/><span>Learning paths are your plans, not claims of completed qualifications.</span></div>}
    <div className="collection-toolbar"><SearchBar value={c.query} onChange={c.setQuery} placeholder={`Search ${cfg.title.toLowerCase()}`}/><span>{filtered.length} {filtered.length === 1 ? 'record' : 'records'}</span></div>
    {filtered.length === 0 ? <Empty title={rows.length ? 'No matching records' : `Your ${cfg.title.toLowerCase()} starts here`} body={rows.length ? 'Try a different search.' : 'Add a record to begin building your personal career workspace.'} action={!rows.length && <Action onClick={add} icon={<Plus size={15}/>}>Add {cfg.singular}</Action>}/> :
      <div className="data-list">{filtered.map(r => <RecordCard key={r.id} record={r} kind={c.kind} onEdit={() => c.openDialog({ kind: c.kind, record: r })} onDelete={() => c.remove(cfg.key, r.id)} onProgress={(v: number) => c.update(cfg.key, rows.map(x => x.id === r.id ? { ...x, progress: v } : x))}/>)}</div>}
  </>;
}
function collectionDescription(kind: string) {
  return ({ skills: 'What you know, how you use it, and what supports the claim.', applications: 'A calm, private view of opportunities you have chosen to pursue.', resumes: 'Keep role-specific versions anchored to your saved skills.', projects: 'A portfolio of real work, context, and outcomes you can discuss.', learning: 'Turn a capability gap into a deliberate next step.', services: 'Describe work you can deliver from your verified capabilities.' } as any)[kind];
}
function RecordCard({ record: r, kind, onEdit, onDelete, onProgress }: any) {
  const title = r.name || r.role || r.title || r.credential;
  const meta = [r.category, r.company || r.provider || r.industry || r.targetRole, r.dates || r.completedAt || r.updatedAt].filter(Boolean).join(' · ');
  return <article className="record-card"><div className="record-mark">{kind === 'skills' ? <Layers3 size={17}/> : kind === 'applications' ? <BriefcaseBusiness size={17}/> : kind === 'projects' ? <FolderKanban size={17}/> : kind === 'learning' ? <BookOpen size={17}/> : kind === 'services' ? <Wrench size={17}/> : <FileText size={17}/>}</div>
    <div className="record-body"><div className="record-titleline"><strong>{title}</strong>{kind === 'skills' && <span className="level">{r.proficiency || 'Not rated'}</span>}{kind === 'applications' && <span className={`status-pill ${String(r.status).toLowerCase().replace(/\s/g, '-')}`}>{r.status}</span>}</div><span>{meta || 'Personal record'}</span>
      {kind === 'skills' && <><div className="skill-meter">{[1,2,3,4,5].map(n => <i key={n} className={n <= proficiencyScore(r.proficiency) ? 'filled' : ''}/>)}</div><p>{r.evidence || 'No evidence added yet.'} {r.years ? ` · ${r.years} years` : ''}</p></>}
      {kind === 'applications' && <p>Next step: {r.nextStep || 'Add a next step'} · Applied {r.appliedDate || 'date not set'}</p>}
      {kind === 'projects' && <><p>{r.description}</p>{r.outcomes && <div className="outcome"><TrendingUp size={14}/>{r.outcomes}</div>}</>}
      {kind === 'learning' && <><div className="learning-progress"><div className="progress-track"><span style={{ width: `${Math.max(0, Math.min(100, Number(r.progress) || 0))}%` }}/></div><span>{r.progress || 0}%</span></div><div className="progress-actions"><button onClick={() => onProgress(Math.min(100, Number(r.progress) + 10))}>+10%</button><button onClick={() => onProgress(Math.max(0, Number(r.progress) - 10))}>−10%</button><span>{r.status} · target {r.targetDate || 'not set'}</span></div></>}
      {kind === 'services' && <p>{r.description} · {r.pricing} · {r.deliveryTime}</p>}
      {kind === 'resumes' && <p>Evidence skills: {(r.sourceSkills || []).toString() || 'None linked'}</p>}
    </div><div className="row-actions"><button onClick={onEdit} aria-label={`Edit ${title}`}><Pencil size={15}/></button><button onClick={onDelete} aria-label={`Delete ${title}`}><Trash2 size={15}/></button></div>
  </article>;
}
function proficiencyScore(value: string | number) {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) return Math.min(5, numeric);
  const level = String(value).toLowerCase();
  if (level.includes('professional')) return 5;
  if (level.includes('develop')) return 3;
  if (level.includes('learn')) return 1;
  return 0;
}

function Opportunities(c: ViewContext) {
  const types = ['All', 'Employment', 'Freelance', 'Business', 'Development'];
  const records = c.data.opportunities.filter(o => (c.filter === 'All' || o.category === c.filter) && `${o.title} ${o.company} ${o.industry} ${o.employmentType}`.toLowerCase().includes(c.query.toLowerCase()));
  const toggleSaved = (o: AnyRecord) => c.update('opportunities', c.data.opportunities.map(x => x.id === o.id ? { ...x, saved: !x.saved } : x));
  return <>
    <Heading title="Opportunity landscape" description="Explore possibilities through the lens of your saved skills. These are illustrative examples, not live listings." action={<Action onClick={() => c.openDialog({ kind: 'opportunities' })} icon={<Plus size={16}/>}>Add opportunity</Action>}/>
    <div className="opportunity-intro"><div><span className="tiny-label">YOUR CURRENT SIGNAL</span><strong>{c.data.skills.length} saved skills <span>·</span> {c.data.projects.length} project records</strong></div><Link href="/skills" className="text-link">Review skills <ArrowRight size={14}/></Link></div>
    <div className="opportunity-tools"><SearchBar value={c.query} onChange={c.setQuery} placeholder="Search role, field, or format"/><div className="filter-pills">{types.map(t => <button key={t} className={c.filter === t ? 'selected' : ''} onClick={() => c.setFilter(t)}>{t}</button>)}</div></div>
    <div className="opportunity-list">{records.map(o => <article className="opportunity-card" key={o.id}>
      <div className="opportunity-card-top"><div className="company-monogram">{o.company?.slice(0,1) || 'O'}</div><div className="opportunity-title"><div className="tiny-label">{o.category.toUpperCase()} · {o.industry}</div><h3>{o.title}</h3><span>{o.company} <i/> {o.workplace}</span></div><div className="compatibility"><strong>{o.compatibility}%</strong><span>example score</span></div></div>
      <div className="opportunity-details"><div><span className="detail-label">Compensation / scope</span><strong>{o.salary}</strong></div><div><span className="detail-label">Format</span><strong>{o.employmentType}</strong></div></div>
      <div className="fit-explanation"><div><Check size={14}/><span>Related saved skills: {c.data.skills.slice(0, 2).map(s => s.name).join(' and ') || 'none added yet'}.</span></div>{o.missingSkills?.length > 0 && <div className="gap"><ArrowDownRight size={14}/><span>Potential growth area: {o.missingSkills.join(', ')}. This is a suggestion, not a qualification you lack.</span></div>}</div>
      <div className="opportunity-actions"><button className={`button ${o.saved ? 'button-secondary saved' : 'button-secondary'}`} onClick={() => toggleSaved(o)}>{o.saved ? <Heart size={15} fill="currentColor"/> : <Heart size={15}/>} {o.saved ? 'Saved' : 'Save for later'}</button><button className="text-link" onClick={() => c.openDialog({ kind: 'application', record: { role: o.title, company: o.company, status: 'Considering', appliedDate: new Date().toISOString().slice(0,10), nextStep: '', notes: `Saved from illustrative ${o.category.toLowerCase()} match.` } })}>Track an application <ArrowRight size={14}/></button><span className="opportunity-manage"><button onClick={() => c.openDialog({ kind: 'opportunities', record: o })} aria-label={`Edit ${o.title}`}><Pencil size={14}/></button><button onClick={() => c.remove('opportunities', o.id)} aria-label={`Delete ${o.title}`}><Trash2 size={14}/></button></span></div>
    </article>)}</div>
    {!records.length && <Empty title="No matches in this view" body="Try another search or category. Add skills to make the reasoning more useful."/>}
    <div className="callout soft"><CircleHelp size={16}/><span>Example scores are placeholders, not live matching. Real fit needs current listing requirements and a profile you have confirmed.</span></div>
  </>;
}

function RecordDialog({ dialog, onClose, onSave }: { dialog: { kind: string; record?: AnyRecord }; onClose: () => void; onSave: (key: keyof Data, r: AnyRecord) => void }) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
  const nested = ['experience', 'education'].includes(dialog.kind);
  const isEdit = !!dialog.record?.id;
  const fields = nested ? (dialog.kind === 'experience' ? ['company', 'role', 'dates', 'description'] : ['school', 'credential', 'dates']) : configs[dialog.kind]?.fields || ['role', 'company', 'status', 'appliedDate', 'nextStep', 'notes'];
  const [values, setValues] = useState<AnyRecord>(() => ({
    ...(dialog.record || {}),
    ...(dialog.kind === 'opportunities' && !dialog.record ? { compatibility: 50, category: 'Employment', saved: false } : {}),
  }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (nested) { window.dispatchEvent(new CustomEvent('xelime-nested-record', { detail: { kind: dialog.kind, record: values } })); onClose(); return; }
    const kind = dialog.kind === 'application' ? 'applications' : dialog.kind;
    const arrayFields = ['sourceSkills', 'skills', 'missingSkills'];
    const normalized = { ...values };
    arrayFields.forEach(k => { if (typeof normalized[k] === 'string') normalized[k] = normalized[k].split(',').map((x: string) => x.trim()).filter(Boolean); });
    if (['years', 'progress', 'compatibility'].some(k => normalized[k] !== undefined)) ['years', 'progress', 'compatibility'].forEach(k => { if (normalized[k] !== undefined) normalized[k] = Number(normalized[k]); });
    onSave(configs[kind] ? configs[kind].key : 'applications', normalized);
  };
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <div className="modal-head"><div><span className="tiny-label">{isEdit ? 'UPDATE RECORD' : 'NEW RECORD'}</span><h2 id="dialog-title">{isEdit ? 'Edit' : 'Add'} {dialog.kind === 'experience' ? 'experience' : dialog.kind === 'education' ? 'education' : configs[dialog.kind]?.singular || 'application'}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18}/></button></div>
    <div className="modal-fields">{fields.map(field => <Field key={field} label={labelize(field) + (['skills', 'sourceSkills'].includes(field) ? ' (comma separated)' : '')} value={values[field] ?? ''} type={['appliedDate', 'updatedAt', 'targetDate'].includes(field) ? 'date' : 'text'} wide={['description', 'evidence', 'notes', 'outcomes'].includes(field)} multiline={['description', 'evidence', 'notes', 'outcomes'].includes(field)} onChange={v => setValues({ ...values, [field]: v })}/>)}</div>
    <div className="modal-foot"><span>Stored only in this browser.</span><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit"><Check size={15}/>{isEdit ? 'Save changes' : 'Add record'}</button></div>
  </form></div>;
}

function Assistant() {
  const modes = [
    ['Identity editor', 'Shape a clear, evidence-based professional introduction.', UserRound],
    ['Skills mapper', 'Connect capabilities to your experience and project evidence.', Layers3],
    ['Opportunity reader', 'Understand fit, trade-offs, and areas to explore.', Target],
    ['Application coach', 'Prepare focused notes and thoughtful next steps.', BriefcaseBusiness],
    ['Resume editor', 'Organize verified evidence around a particular role.', FileText],
    ['Growth planner', 'Turn a skill goal into a manageable learning plan.', TrendingUp],
  ];
  return <>
    <Heading title="Career assistant" description="A preview of six ways a connected assistant could help you work with your career records."/>
    <div className="assistant-preview"><div className="assistant-icon"><Sparkles size={21}/></div><div><span className="preview-label">NOT CONNECTED YET</span><h2>Nothing is being generated.</h2><p>The AI Career Assistant is not connected in this version. These modes are a preview only; no prompts, suggestions, or personal data are sent anywhere.</p></div><span className="status-pill">Preview</span></div>
    <div className="mode-grid">{modes.map(([name, copy, Icon]: any, i) => <article className="mode-card" key={name}><span className="mode-index">0{i + 1}</span><Icon size={19}/><h3>{name}</h3><p>{copy}</p><span className="mode-status">Coming into focus</span></article>)}</div>
    <div className="callout"><ShieldCheck size={16}/><span>Your records stay local. Connecting an assistant would require a separate, explicit product decision and consent.</span></div>
  </>;
}

function Analytics(c: ViewContext) {
  const skills = c.data.skills; const totalProjects = c.data.projects.length;
  const grouped = skills.reduce((acc: AnyRecord, s) => { acc[s.category || 'Other'] = (acc[s.category || 'Other'] || 0) + 1; return acc; }, {});
  const max = Math.max(...Object.values(grouped).map(Number), 1);
  const stages = ['Considering', 'Applied', 'Interviewing', 'Offer', 'Closed'];
  return <>
    <Heading title="Career insights" description="A compact read of the records you have saved. No external or live market data is used."/>
    <div className="metrics-grid analytics-metrics"><Metric label="Skills in your map" value={skills.length} note="across saved categories" icon={Layers3}/><Metric label="Projects captured" value={totalProjects} note="portfolio records" icon={FolderKanban}/><Metric label="Learning progress" value={`${Math.round(c.data.learning.reduce((n, l) => n + Number(l.progress || 0), 0) / Math.max(c.data.learning.length, 1))}%`} note="average of saved plans" icon={BookOpen}/><Metric label="Saved opportunities" value={c.data.opportunities.filter(o => o.saved).length} note="illustrative matches" icon={Heart}/></div>
    <div className="analytics-grid">
      <section className="panel chart-panel"><div className="panel-head"><div><span className="tiny-label">SKILL DISTRIBUTION</span><h3>Where your capabilities cluster</h3></div><Layers3 size={17}/></div>
        {Object.keys(grouped).length ? Object.entries(grouped).map(([name, count]: any) => <div className="bar-row" key={name}><span>{name}</span><div className="progress-track"><span style={{ width: `${(count / max) * 100}%` }}/></div><b>{count}</b></div>) : <Empty title="No skill signals yet" body="Add skills to see how your experience is distributed."/>}
      </section>
      <section className="panel chart-panel"><div className="panel-head"><div><span className="tiny-label">APPLICATION PIPELINE</span><h3>Movement by stage</h3></div><BriefcaseBusiness size={17}/></div>
        {stages.map(stage => { const count = c.data.applications.filter(a => a.status === stage).length; return <div className="pipeline-row" key={stage}><span>{stage}</span><div className="pipeline-meter"><i style={{ width: `${Math.min(count * 30, 100)}%` }}/></div><b>{count}</b></div> })}
      </section>
    </div>
    <div className="insight-note"><div className="insight-mark"><Lightbulb size={17}/></div><div><span className="tiny-label">A THOUGHT TO CONSIDER</span><strong>{skills.length && skills.some(s => !s.evidence) ? 'Some skills have no evidence attached.' : 'A strong record makes your story easier to stand behind.'}</strong><p>{skills.length && skills.some(s => !s.evidence) ? 'Add a project, example, or context to make those skills more useful.' : 'Keep adding specific examples and outcomes. This workspace only summarizes what you save.'}</p></div><Link href="/skills" className="text-link">Review evidence <ArrowRight size={14}/></Link></div>
  </>;
}

function SettingsPage(c: ViewContext) {
  const { data } = c;
  return <>
    <Heading title="Workspace settings" description="Your preferences and data controls. Everything in this first version lives in this browser."/>
    <section className="panel settings-panel"><div className="panel-head"><div><span className="tiny-label">APPEARANCE</span><h3>Choose your working light</h3></div>{data.theme === 'dark' ? <Moon size={18}/> : <Sun size={18}/>}</div><div className="setting-row"><div><strong>Color theme</strong><span>Switch between soft light and charcoal dark.</span></div><div className="theme-switch"><button className={data.theme === 'light' ? 'selected' : ''} onClick={() => c.update('theme', 'light')}><Sun size={15}/>Light</button><button className={data.theme === 'dark' ? 'selected' : ''} onClick={() => c.update('theme', 'dark')}><Moon size={15}/>Dark</button></div></div></section>
    <section className="panel settings-panel"><div className="panel-head"><div><span className="tiny-label">DATA CONTROL</span><h3>Your records, your call</h3></div><Download size={18}/></div>
      <div className="setting-row"><div><strong>Local storage</strong><span>Saved in this browser's localStorage. Clearing browser data will remove this workspace.</span></div><span className="local-tag"><span className="online-dot"/>Active</span></div>
      <div className="setting-row"><div><strong>Export workspace</strong><span>Download a JSON copy of your career records and preferences.</span></div><Action onClick={c.exportData} secondary icon={<Download size={15}/>}>Export data</Action></div>
      <div className="setting-row"><div><strong>Reset sample workspace</strong><span>Restore editable examples. This replaces your current browser records.</span></div><button className="button button-danger" onClick={c.resetData}><Trash2 size={15}/>Reset data</button></div>
    </section>
    <section className="panel settings-panel"><div className="panel-head"><div><span className="tiny-label">CONNECTIONS</span><h3>No integrations connected</h3></div><ExternalLink size={18}/></div><div className="integration-row"><div className="integration-icon"><Sparkles size={17}/></div><div><strong>AI Career Assistant</strong><span>Not connected · Preview only</span></div><span className="status-pill">Unavailable</span></div><div className="integration-row"><div className="integration-icon"><BriefcaseBusiness size={17}/></div><div><strong>Job boards & opportunity feeds</strong><span>No external listings or live market data</span></div><span className="status-pill">Not connected</span></div><div className="integration-row"><div className="integration-icon"><Layers3 size={17}/></div><div><strong>Cloud sync</strong><span>Not available in this local-only first version</span></div><span className="status-pill">Local only</span></div></section>
    <div className="settings-footnote"><ShieldCheck size={16}/><span>Privacy note: there is no account, server sync, analytics backend, or AI connection in this release. Your edits remain on this device.</span></div>
  </>;
}
function NotFound() {
  return <div className="not-found"><span className="tiny-label">404 · NOT IN YOUR WORKSPACE</span><h1>This path is a blank page.</h1><p>Return to your career overview and pick up where you left off.</p><Link className="button button-primary" href="/">Back to overview <ArrowRight size={15}/></Link></div>;
}

const queryClient = new QueryClient();
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function RootRouter() { return <RoutedErrorBoundary><App/></RoutedErrorBoundary>; }
function Root() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RootRouter/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}
export default Root;
