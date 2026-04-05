import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, RefreshCw, ChevronDown, ChevronUp, Trash2, CheckCircle, 
  Eye, Download, LogOut, LayoutDashboard, Users, Inbox, BarChart3, 
  Menu, X, Filter, Mail, Archive, CheckSquare, Clock, Shield, Terminal, Activity, 
  Cpu, Globe, Key, Settings, Bell, Command, FileJson
} from 'lucide-react';

// ==========================================
// CONFIGURATION & MOCKS
// ==========================================
const API_URL = 'https://script.google.com/macros/s/AKfycbwa8j5TD4_XnaxMngSSHYZILEpx1Km6OsZuyiz4_MJRloHxob5FszsRwtoTq7Tkp8-SVQ/exec';

const MOCK_LOGS = [
  { id: 'L-101', type: 'AUTH', msg: 'Superadmin initiated secure session.', time: new Date(Date.now() - 5000).toISOString() },
  { id: 'L-102', type: 'SYSTEM', msg: 'System initialized and awaiting data sync.', time: new Date(Date.now() - 15000).toISOString() }
];

const MOCK_USERS = [
  { id: 'USR-01', name: 'Admin User', email: 'admin@webrev.com', role: 'Superadmin', status: 'Active', lastLogin: 'Just now' },
  { id: 'USR-02', name: 'Sarah Chen', email: 'sarah@webrev.com', role: 'Analyst', status: 'Active', lastLogin: '2 hours ago' },
  { id: 'USR-03', name: 'Dev Team', email: 'dev@webrev.com', role: 'API Viewer', status: 'Inactive', lastLogin: '5 days ago' },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // --- Core State ---
  const [data, setData] = useState([]);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [activeModule, setActiveModule] = useState('command-center');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sysStatus, setSysStatus] = useState({ cpu: 12, memory: 45, latency: 120 });
  
  // --- UI/UX State ---
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([{ id: 1, text: 'Welcome to WEBREV.SYS Command Center', read: false }]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  // --- Grid State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- Initialization & Listeners ---
  useEffect(() => {
    if (!localStorage.getItem('webrev_admin_auth')) {
      navigate('/');
    } else {
      fetchData();
    }

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsGlobalSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSysStatus({
        cpu: Math.floor(Math.random() * 20) + 10,
        memory: Math.floor(Math.random() * 10) + 40,
        latency: Math.floor(Math.random() * 50) + 80
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- Data Operations ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      
      const formattedData = result.map((item, index) => ({
        ...item,
        id: item.id || `SUB-${8000 + index}`,
        status: item.status || 'New'
      }));
      
      setData(formattedData);
      addSystemLog('SYSTEM', `Data sync successful. Extracted ${formattedData.length} nodes.`);
      showNotification('Data synced successfully', 'success');
    } catch (error) {
      console.error('Sync Error:', error);
      addSystemLog('ERROR', 'Failed to establish secure connection to data source.');
      showNotification('Failed to sync data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addSystemLog = (type, msg) => {
    setLogs(prev => [{ id: `L-${Date.now()}`, type, msg, time: new Date().toISOString() }, ...prev].slice(0, 50));
  };

  const handleLogout = () => {
    localStorage.removeItem('webrev_admin_auth');
    navigate('/');
  };

  const showNotification = (msg, type = 'success') => {
    setToastNotification({ msg, type });
    setTimeout(() => setToastNotification(null), 3000);
  };

  // --- Grid Operations ---
  const handleSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const updateStatus = (id, newStatus) => {
    setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, status: newStatus });
    addSystemLog('ACTION', `Clearance level updated for node ${id} -> ${newStatus.toUpperCase()}`);
    showNotification(`Status updated to ${newStatus}`);
  };

  const handleBulkAction = (action) => {
    setData(data.map(item => selectedRows.includes(item.id) ? { ...item, status: action } : item));
    setSelectedRows([]);
    addSystemLog('ACTION', `Bulk updated ${selectedRows.length} items to ${action}`);
    showNotification(`Bulk action applied`);
  };

  const exportData = (format = 'csv') => {
    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status'];
      const csv = [headers.join(','), ...data.map(r => [r.id, r.timestamp, `"${r.name}"`, `"${r.email}"`, `"${r.phone}"`, `"${r.subject}"`, `"${r.message.replace(/"/g, '""')}"`, r.status].join(','))].join('\n');
      triggerDownload(csv, 'text/csv', 'csv');
    } else {
      triggerDownload(JSON.stringify(data, null, 2), 'application/json', 'json');
    }
    addSystemLog('EXPORT', `Data exported via secure pipeline format: ${format.toUpperCase()}`);
    showNotification('Export downloaded');
  };

  const triggerDownload = (content, type, ext) => {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `webrev_intel_${new Date().getTime()}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Computed Data ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, searchTerm, statusFilter, sortConfig]);

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const stats = useMemo(() => ({
    total: data.length,
    new: data.filter(i => i.status === 'New').length,
    reviewed: data.filter(i => i.status === 'Reviewed').length,
    archived: data.filter(i => i.status === 'Archived').length,
  }), [data]);

  // --- Render Helpers ---
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const FormatDate = ({ iso }) => {
    if (!iso) return null;
    const date = new Date(iso);
    return (
      <div className="font-mono text-[11px] leading-tight">
        <span className="text-gray-300">{date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span><br/>
        <span className="text-gray-600">{date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      New: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]',
      Reviewed: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
      Archived: 'text-gray-400 border-gray-600/30 bg-gray-500/10'
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors[status] || colors.Archived}`}>
        {status === 'New' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
        {status}
      </span>
    );
  };

  // ==========================================
  // MODULE RENDERS
  // ==========================================

  const renderCommandCenter = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Nodes', val: stats.total, icon: Globe, color: 'text-gray-200' },
          { label: 'Active Threats/Leads', val: stats.new, icon: Shield, color: 'text-cyan-400' },
          { label: 'Cleared', val: stats.reviewed, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'API Latency', val: `${sysStatus.latency}ms`, icon: Activity, color: sysStatus.latency > 100 ? 'text-orange-400' : 'text-emerald-400' },
        ].map((s, i) => (
          <div key={i} className="relative bg-[#0a0e17] border border-[#1f2937] rounded-xl p-5 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[#6b7280] text-[10px] font-bold uppercase tracking-widest mb-2">{s.label}</p>
                <h3 className={`text-3xl font-mono tracking-tight font-bold ${s.color}`}>{s.val}</h3>
              </div>
              <s.icon className={`w-5 h-5 ${s.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0a0e17] border border-[#1f2937] rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400"/> Inbound Traffic Topology</h3>
            <span className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> Live</span>
          </div>
          <div className="flex-1 bg-[#05070A] border border-white/5 rounded-lg flex items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1f2937 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }} />
            <svg className="absolute w-full h-full text-cyan-500/20" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" />
              <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
            </svg>
            <p className="font-mono text-cyan-500/50 text-xs z-10 bg-black/50 px-3 py-1 rounded backdrop-blur-sm border border-cyan-500/20">AWAITING GEO-DATA STREAM</p>
          </div>
        </div>

        <div className="bg-[#0a0e17] border border-[#1f2937] rounded-xl p-0 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2"><Terminal className="w-4 h-4 text-emerald-400"/> System Feed</h3>
          </div>
          <div className="p-5 flex-1 bg-[#030508] font-mono text-[10px] leading-relaxed space-y-3 overflow-y-auto max-h-[300px]">
            {logs.map(log => (
              <div key={log.id} className="flex gap-3">
                <span className="text-gray-600 shrink-0">[{new Date(log.time).toLocaleTimeString('en-US', {hour12:false})}]</span>
                <span className={log.type === 'ERROR' ? 'text-red-400' : log.type === 'AUTH' ? 'text-purple-400' : 'text-emerald-400'}>{log.type}</span>
                <span className="text-gray-400 break-words">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataGrid = () => (
    <div className="bg-[#0a0e17] border border-[#1f2937] rounded-xl shadow-2xl flex flex-col h-full min-h-[600px] animate-in fade-in duration-500">
      <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.01]">
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search IDs, Names, Subjects..." 
              className="w-full bg-[#05070a] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all font-mono placeholder:text-gray-600 placeholder:font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="appearance-none bg-[#05070a] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none cursor-pointer focus:border-cyan-500/50 transition-all font-mono"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">STATUS: ALL</option>
            <option value="New">STATUS: NEW</option>
            <option value="Reviewed">STATUS: REVIEWED</option>
            <option value="Archived">STATUS: ARCHIVED</option>
          </select>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => exportData('json')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-xs font-bold text-gray-300 transition-all uppercase tracking-wider"><FileJson className="w-4 h-4" /> JSON</button>
          <button onClick={() => exportData('csv')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg text-xs font-bold text-cyan-400 transition-all uppercase tracking-wider"><Download className="w-4 h-4" /> CSV</button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="bg-cyan-900/20 border-b border-cyan-500/20 px-5 py-2.5 flex items-center justify-between animate-in slide-in-from-top-2">
          <span className="text-xs font-mono text-cyan-400 font-bold">{selectedRows.length} NODES SELECTED</span>
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction('Reviewed')} className="px-3 py-1.5 bg-cyan-500 text-black text-[10px] uppercase tracking-widest font-bold rounded hover:bg-cyan-400 transition-colors">Mark Reviewed</button>
            <button onClick={() => handleBulkAction('Archived')} className="px-3 py-1.5 bg-[#1f2937] text-white text-[10px] uppercase tracking-widest font-bold rounded hover:bg-gray-600 transition-colors">Archive</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500"><RefreshCw className="w-6 h-6 animate-spin mb-3" /><p className="text-xs font-mono uppercase tracking-widest">Intercepting Data...</p></div>
        ) : currentData.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600"><Inbox className="w-12 h-12 mb-3 opacity-20" /><p className="text-sm font-mono uppercase tracking-widest">No matching records found</p></div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#05070a] border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500 sticky top-0 z-10">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="accent-cyan-500 rounded cursor-pointer bg-black" checked={selectedRows.length === currentData.length && currentData.length > 0} onChange={(e) => setSelectedRows(e.target.checked ? currentData.map(d => d.id) : [])} />
                </th>
                <th className="p-4 font-mono font-normal">ID Code</th>
                <th className="p-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleSort('timestamp')}>Timestamp {sortConfig.key === 'timestamp' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th className="p-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleSort('name')}>Identity {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th className="p-4">Subject Vector</th>
                <th className="p-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th className="p-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {currentData.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedItem(row)}>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="accent-cyan-500 rounded cursor-pointer" checked={selectedRows.includes(row.id)} onChange={(e) => { if(e.target.checked) setSelectedRows([...selectedRows, row.id]); else setSelectedRows(selectedRows.filter(id => id !== row.id)); }} />
                  </td>
                  <td className="p-4 font-mono text-[11px] text-gray-500">{row.id}</td>
                  <td className="p-4"><FormatDate iso={row.timestamp} /></td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-200 text-sm">{row.name}</div>
                    <div className="text-gray-500 font-mono text-[10px] mt-0.5">{row.email}</div>
                  </td>
                  <td className="p-4 text-gray-400 text-sm max-w-[200px] truncate">{row.subject}</td>
                  <td className="p-4"><StatusBadge status={row.status} /></td>
                  <td className="p-4 text-right">
                    <button className="text-gray-600 hover:text-cyan-400 transition-colors"><ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="px-5 py-3 border-t border-white/5 bg-[#05070a] flex justify-between items-center rounded-b-xl">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Showing {currentData.length} of {filteredData.length}</span>
        <div className="flex items-center gap-3">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="text-gray-500 hover:text-white disabled:opacity-30 p-1"><ChevronUp className="w-4 h-4 -rotate-90"/></button>
          <span className="font-mono text-[11px] text-gray-400">PAGE {currentPage}/{totalPages || 1}</span>
          <button disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="text-gray-500 hover:text-white disabled:opacity-30 p-1"><ChevronDown className="w-4 h-4 -rotate-90"/></button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-[#0a0e17] border border-[#1f2937] rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-500">
       <div className="p-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
         <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4 text-purple-400"/> Access Control List (RBAC)</h2>
         <button className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500/20 transition-colors">Provision User</button>
       </div>
       <div className="overflow-x-auto">
         <table className="w-full text-left whitespace-nowrap">
           <thead>
             <tr className="bg-[#05070a] border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500">
               <th className="p-4 font-mono font-normal">UID</th>
               <th className="p-4">Identity</th>
               <th className="p-4">Clearance Level</th>
               <th className="p-4">Status</th>
               <th className="p-4 text-right">Last Login</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/[0.02]">
             {MOCK_USERS.map(user => (
               <tr key={user.id} className="hover:bg-white/[0.02] text-sm">
                 <td className="p-4 font-mono text-[11px] text-gray-500">{user.id}</td>
                 <td className="p-4"><div className="font-semibold text-gray-200">{user.name}</div><div className="text-gray-500 font-mono text-[10px] mt-0.5">{user.email}</div></td>
                 <td className="p-4"><span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold tracking-widest uppercase text-gray-300">{user.role}</span></td>
                 <td className="p-4"><span className={`text-[11px] font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-400' : 'text-gray-500'}`}>{user.status}</span></td>
                 <td className="p-4 text-right text-gray-500 text-xs">{user.lastLogin}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#0a0e17] border border-[#1f2937] rounded-xl p-6">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 mb-6"><Key className="w-4 h-4 text-orange-400"/> API & Integrations</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Production Endpoint</label>
            <div className="flex flex-col sm:flex-row bg-[#05070a] border border-white/10 rounded-lg overflow-hidden">
              <input type="text" readOnly value={API_URL} className="flex-1 bg-transparent px-4 py-2 text-xs font-mono text-gray-400 outline-none" />
              <button className="px-4 py-2 sm:py-0 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 uppercase tracking-wider sm:border-l border-t sm:border-t-0 border-white/10 transition-colors" onClick={() => {navigator.clipboard.writeText(API_URL); showNotification('Endpoint copied to clipboard');}}>Copy</button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Webhook Secret (Hidden)</label>
            <div className="flex flex-col sm:flex-row bg-[#05070a] border border-white/10 rounded-lg overflow-hidden">
              <input type="password" readOnly value="whsec_1234567890abcdef" className="flex-1 bg-transparent px-4 py-2 text-xs font-mono text-gray-400 outline-none" />
              <button className="px-4 py-2 sm:py-0 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 uppercase tracking-wider sm:border-l border-t sm:border-t-0 border-white/10 transition-colors">Reveal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // MAIN RENDER (LAYOUT)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#030712] text-gray-300 font-['Inter',_sans-serif] flex overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Global Search Overlay (Cmd+K) */}
      {isGlobalSearchOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 font-sans">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsGlobalSearchOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#0a0e17] border border-[#1f2937] shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#05070a]">
              <Search className="w-5 h-5 text-cyan-500 mr-3" />
              <input 
                autoFocus 
                type="text" 
                placeholder="Search queries, commands, or node IDs..." 
                className="flex-1 bg-transparent text-gray-200 outline-none placeholder:text-gray-600 text-base sm:text-lg"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
              />
              <span className="hidden sm:inline text-[10px] font-mono text-gray-500 border border-gray-700 rounded px-1.5 py-0.5 bg-gray-800/50">ESC</span>
            </div>
            <div className="p-2 max-h-[40vh] overflow-y-auto bg-black/20">
              <p className="px-3 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest">Quick Actions</p>
              <button onClick={() => {setActiveModule('data-grid'); setIsGlobalSearchOpen(false);}} className="w-full text-left px-3 py-2.5 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg text-sm text-gray-400 flex items-center gap-3 transition-colors"><Inbox className="w-4 h-4"/> Open Data Grid</button>
              <button onClick={() => {exportData('csv'); setIsGlobalSearchOpen(false);}} className="w-full text-left px-3 py-2.5 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg text-sm text-gray-400 flex items-center gap-3 transition-colors"><Download className="w-4 h-4"/> Export System Data</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-[150] flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl animate-in slide-in-from-bottom-5 bg-[#0a0e17] border border-[#1f2937]">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-mono text-gray-200">{toastNotification.msg}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0e17] border-r border-[#1f2937] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#05070a] shrink-0">
          <span className="text-lg font-bold text-white tracking-[0.2em]">WEBREV<span className="text-cyan-500">.SYS</span></span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 px-3">Core Modules</p>
          {[
            { id: 'command-center', label: 'Command Center', icon: Terminal },
            { id: 'data-grid', label: 'Data Grid', icon: Inbox, badge: stats.new },
            { id: 'users', label: 'Access Control', icon: Shield },
            { id: 'settings', label: 'Configurations', icon: Settings },
          ].map(tab => (
            <button key={tab.id} onClick={() => {setActiveModule(tab.id); setIsSidebarOpen(false);}} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all text-sm ${activeModule === tab.id ? 'bg-cyan-500/10 text-cyan-400 shadow-[inset_2px_0_0_#22d3ee]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
              <div className="flex items-center gap-3"><tab.icon className={`w-4 h-4 ${activeModule === tab.id ? 'text-cyan-400' : 'opacity-60'}`} /> {tab.label}</div>
              {tab.badge > 0 && <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">{tab.badge}</span>}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-[#1f2937] bg-[#05070a] shrink-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded bg-[#1f2937] flex items-center justify-center text-white font-bold text-xs border border-white/10 shrink-0">A</div>
              <div className="truncate"><p className="text-xs font-bold text-white leading-none truncate">Admin</p><p className="text-[9px] text-cyan-500 font-mono mt-1 uppercase tracking-widest truncate">Root Access</p></div>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors shrink-0"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 bg-[#0a0e17]/80 backdrop-blur-md border-b border-[#1f2937]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"><Menu className="w-5 h-5" /></button>
            
            {/* Global Search Trigger */}
            <button onClick={() => setIsGlobalSearchOpen(true)} className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[#030508] border border-[#1f2937] hover:border-gray-600 rounded-lg text-sm text-gray-500 transition-colors">
              <Search className="w-4 h-4" /> <span>Search system...</span>
              <div className="flex items-center gap-1 ml-4 text-[10px] font-mono opacity-50"><Command className="w-3 h-3"/> K</div>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Auto Sync Toggle */}
            <div className="hidden md:flex items-center gap-2 mr-4">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Live Sync</span>
              <button onClick={() => setAutoSync(!autoSync)} className={`w-8 h-4 rounded-full p-0.5 transition-colors ${autoSync ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${autoSync ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <button onClick={fetchData} className="text-gray-400 hover:text-cyan-400 transition-colors" title="Force Sync">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#0a0e17]" />
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0a0e17] border border-[#1f2937] rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
                  <div className="p-3 border-b border-white/5 bg-[#05070a]"><p className="text-xs font-bold text-gray-300 uppercase tracking-widest">System Alerts</p></div>
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-white/5 rounded-lg flex gap-3 items-start cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                        <p className="text-xs text-gray-300 leading-relaxed">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto h-full">
            {activeModule === 'command-center' && renderCommandCenter()}
            {activeModule === 'data-grid' && renderDataGrid()}
            {activeModule === 'users' && renderUsers()}
            {activeModule === 'settings' && renderSettings()}
          </div>
        </div>
      </main>

      {/* Slide-out Inspector */}
      {selectedItem && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={() => setSelectedItem(null)} />
          <div className="fixed inset-y-0 right-0 z-[110] w-full sm:w-[500px] bg-[#0a0e17] border-l border-[#1f2937] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 font-sans">
            
            {/* Inspector Header */}
            <div className="px-4 sm:px-6 py-5 border-b border-white/5 bg-[#05070a] flex justify-between items-start shrink-0">
              <div>
                <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-2">Node Inspection: {selectedItem.id}</p>
                <h3 className="text-lg sm:text-xl font-bold text-white">{selectedItem.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-mono mt-1 break-all">{selectedItem.email}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 text-gray-500 hover:text-white bg-white/5 rounded transition-colors shrink-0 ml-2"><X className="w-4 h-4" /></button>
            </div>

            {/* Inspector Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
              
              {/* Meta Stats */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-[#05070a] p-4 rounded-lg border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Time Logged</p>
                  <p className="text-xs sm:text-sm text-gray-300 font-mono">{new Date(selectedItem.timestamp).toLocaleString('en-US', {hour12:false})}</p>
                </div>
                <div className="flex-1 bg-[#05070a] p-4 rounded-lg border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Clearance</p>
                  <StatusBadge status={selectedItem.status} />
                </div>
              </div>

              {/* Payload */}
              <div>
                <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Mail className="w-3 h-3"/> Transmission Payload</h4>
                <div className="space-y-4 bg-[#05070a] p-4 sm:p-5 rounded-lg border border-white/5">
                  <div>
                    <p className="text-[10px] text-gray-600 uppercase font-bold mb-1">Subject Vector</p>
                    <p className="text-sm text-gray-200 font-semibold">{selectedItem.subject}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] text-gray-600 uppercase font-bold mb-2">Raw Message</p>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-mono bg-black/30 p-3 rounded break-words whitespace-pre-wrap">{selectedItem.message}</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div>
                <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Cpu className="w-3 h-3"/> Quick Actions</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={`mailto:${selectedItem.email}?subject=RE: ${selectedItem.subject}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-wider transition-colors w-full sm:w-auto"><Mail className="w-3 h-3"/> Reply via Client</a>
                  {selectedItem.phone && <a href={`tel:${selectedItem.phone}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-wider transition-colors w-full sm:w-auto">Initiate Call</a>}
                </div>
              </div>
            </div>

            {/* Inspector Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-[#1f2937] bg-[#05070a] grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              {selectedItem.status !== 'Reviewed' ? (
                <button onClick={() => updateStatus(selectedItem.id, 'Reviewed')} className="sm:col-span-2 flex justify-center items-center gap-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded transition-colors"><CheckCircle className="w-4 h-4" /> Verify & Clear Node</button>
              ) : (
                <button onClick={() => updateStatus(selectedItem.id, 'Archived')} className="sm:col-span-2 flex justify-center items-center gap-2 py-3 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/30 text-gray-400 text-xs font-bold uppercase tracking-widest rounded transition-colors"><Archive className="w-4 h-4" /> Move to Archive</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}