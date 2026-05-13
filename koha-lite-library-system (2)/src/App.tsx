/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Library, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  User as UserIcon, 
  BookOpen, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Filter,
  Save,
  X,
  Users,
  Database,
  Activity,
  Settings,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Home,
  MessageSquare,
  Info,
  Mail,
  Eye,
  Phone,
  MapPin,
  LayoutDashboard,
  Cpu,
  Archive,
  Zap,
  Globe,
  Lock,
  Binary
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Role, Book, StudentProfile, EmployeeProfile, AdminProfile, ResearchNode } from "./types";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [role, setRole] = useState<Role>("Student");
  
  // Role-specific profile states
  const [student, setStudent] = useState<StudentProfile>({
    name: "Deepa O",
    rollNumber: "CS20230045",
    branch: "Computer Science & Engineering"
  });
  
  const [employee, setEmployee] = useState<EmployeeProfile>({
    name: "Deepa O",
    employeeId: "LIB-9921",
    department: "Library Sciences",
    position: "Senior Cataloger"
  });
  
  const [admin, setAdmin] = useState<AdminProfile>({
    name: "Deepa O",
    adminLevel: "L3 Principal",
    permissions: ["Full Catalog Access", "User Management", "System Config"]
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [deletedBooks, setDeletedBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedViewBook, setSelectedViewBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog" | "admin" | "profile" | "python-catalog">("dashboard");
  const [showLoginError, setShowLoginError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showBlogLinks, setShowBlogLinks] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [visibleBooksCount, setVisibleBooksCount] = useState(7);
  const [visibleBlogsCount, setVisibleBlogsCount] = useState(4);

  const researchNodes: ResearchNode[] = [
    {
      id: "node-1",
      title: "Neural Core Alpha",
      subtitle: "NLP & COGNITIVE MAPPING",
      description: "Large Language Synthesis",
      stat1: { label: "CORE LOAD", value: "84%" },
      stat2: { label: "AVAILABILITY", value: "99.99%" },
      progress: 84,
      members: 42,
      status: "OPTIMAL",
      statusLabel: "NODE-1"
    },
    {
      id: "node-2",
      title: "Distributed Ledger Wing",
      subtitle: "BLOCKCHAIN & CONSENSUS",
      description: "High-Integrity Persistence",
      stat1: { label: "LOAD INDEX", value: "62%" },
      stat2: { label: "AVAILABILITY", value: "100%" },
      progress: 62,
      members: 36,
      status: "ACTIVE",
      statusLabel: "NODE-2"
    },
    {
      id: "node-3",
      title: "Quantum Logic Lab",
      subtitle: "QUANTUM CRYPTOGRAPHY",
      description: "Sub-Atomic Computation",
      stat1: { label: "QUANTUM FLUX", value: "90%" },
      stat2: { label: "AVAILABILITY", value: "98.4%" },
      progress: 90,
      members: 15,
      status: "HEAVY_LOAD",
      statusLabel: "NODE-3"
    },
    {
      id: "node-4",
      title: "Institutional Bio-Link",
      subtitle: "BIO-INFORMATICS & GENETICS",
      description: "Genetic Sequence Analysis",
      stat1: { label: "BIO-LOAD", value: "28%" },
      stat2: { label: "INTEGRITY", value: "100%" },
      progress: 28,
      members: 58,
      status: "STANDBY",
      statusLabel: "NODE-4"
    },
    {
      id: "node-5",
      title: "Macro-Economic Forge",
      subtitle: "PREDICTIVE ANALYTICS",
      description: "Market Fluidity Simulation",
      stat1: { label: "FORGE INDEX", value: "74%" },
      stat2: { label: "STABILITY", value: "95%" },
      progress: 74,
      members: 22,
      status: "ACTIVE",
      statusLabel: "NODE-5"
    },
    {
      id: "node-6",
      title: "Ethics Guard Node",
      subtitle: "AI SAFETY & COMPLIANCE",
      description: "Alignment Protocol Monitoring",
      stat1: { label: "SAFETY BIAS", value: "100%" },
      stat2: { label: "COMPLIANCE", value: "VERIFIED" },
      progress: 100,
      members: 19,
      status: "VERIFIED",
      statusLabel: "NODE-6"
    }
  ];

  const derivedBlogs = books.map(book => ({
    title: `${book.title}: Analytical Review`,
    url: `https://medium.com/search?q=${encodeURIComponent(book.title)}`,
    id: `blog-${book.id}`
  }));

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogin = () => {
    const isUserEmpty = !loginUsername.trim();
    const isPassEmpty = !loginPassword.trim();
    
    if (isUserEmpty) setShowLoginError(true);
    if (isPassEmpty) setShowPasswordError(true);
    
    if (!isUserEmpty && !isPassEmpty) {
      setIsLoggedIn(true);
      setShowLoginError(false);
      setShowPasswordError(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookData = {
      title: formData.get("title"),
      author: formData.get("author"),
      isbn: formData.get("isbn"),
      year: Number(formData.get("year")),
      category: formData.get("category"),
      status: formData.get("status"),
      imageUrl: formData.get("imageUrl"),
    };

    try {
      if (editingBook) {
        await fetch(`/api/books/${editingBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookData),
        });
      } else {
        await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookData),
        });
      }
      fetchBooks();
      setIsModalOpen(false);
      setEditingBook(null);
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const bookToDelete = books.find(b => b.id === id);
    if (bookToDelete) {
      setDeletedBooks(prev => [bookToDelete, ...prev].slice(0, 5));
    }
    // Optimistic update
    setBooks(prev => prev.filter(b => b.id !== id));
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error deleting book:", error);
      // Revert if failed
      fetchBooks();
    }
  };

  const handleRecover = async (book: Book) => {
    try {
      const { id, ...bookData } = book;
      await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      setDeletedBooks(prev => prev.filter(b => b.id !== id));
      fetchBooks();
    } catch (error) {
      console.error("Error recovering book:", error);
    }
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  const openViewModal = (book: Book) => {
    setSelectedViewBook(book);
    setIsViewModalOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Bookshelf Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
            alt="Bookshelf Background" 
            className="w-full h-full object-cover grayscale brightness-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-red-600/10" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/30 border border-slate-200 overflow-hidden relative z-10"
        >
          <div className="bg-slate-900 p-10 text-white relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="relative z-10 flex flex-col h-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Library className="w-6 h-6 text-blue-400" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Koha-Lite ILS</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-red-600">BOOKS ARE HERE</h2>
                <p className="text-red-500/80 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">2026</p>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="p-10 space-y-6">
            <AnimatePresence mode="wait">
              {authView === "login" ? (
                <motion.div 
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Security Portal v4.2</p>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Identity Access</h3>
                    </div>
                    
                    {/* Role Selection */}
                    <div className="grid grid-cols-3 gap-2">
                      {(["Student", "Employee", "Admin"] as Role[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className={`py-3 rounded-2xl border font-black transition-all flex flex-col items-center gap-1.5 ${
                            role === r 
                              ? r === "Student" ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20" :
                                r === "Employee" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" :
                                "bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/20"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          {r === "Student" ? <GraduationCap className="w-4 h-4" /> : 
                           r === "Employee" ? <Briefcase className="w-4 h-4" /> : 
                           <ShieldCheck className="w-4 h-4" />}
                          <span className="text-[8px] uppercase tracking-widest">{r}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">
                          {role} Identification
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="text" 
                            value={loginUsername}
                            onChange={(e) => {
                              setLoginUsername(e.target.value);
                              if (e.target.value.trim()) setShowLoginError(false);
                            }}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                              showLoginError ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                            }`}
                            placeholder="Enter username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">
                          Security Access Key
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="password" 
                            value={loginPassword}
                            onChange={(e) => {
                              setLoginPassword(e.target.value);
                              if (e.target.value.trim()) setShowPasswordError(false);
                            }}
                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                              showPasswordError ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                            }`}
                            placeholder="Enter password"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleLogin}
                        className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-[0.98] mt-2 ${
                          role === "Student" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/30" :
                          role === "Employee" ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30" :
                          "bg-red-600 hover:bg-red-500 shadow-red-500/30"
                        }`}
                      >
                        INITIALIZE {role.toUpperCase()} SESSION
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center px-2">
                      <button 
                        onClick={() => setShowForgotPasswordModal(true)}
                        className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        Recovery Protocol
                      </button>
                      <button 
                        onClick={() => setAuthView("signup")}
                        className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Registration Identity Pool</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Student", "Employee", "Admin"] as Role[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className={`py-3 rounded-xl border font-black transition-all flex flex-col items-center gap-1.5 ${
                            role === r 
                              ? r === "Student" ? "bg-blue-600 border-blue-600 text-white" :
                                r === "Employee" ? "bg-indigo-600 border-indigo-600 text-white" :
                                "bg-red-600 border-red-600 text-white"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          {r === "Student" ? <GraduationCap className="w-3.5 h-3.5" /> : 
                           r === "Employee" ? <Briefcase className="w-3.5 h-3.5" /> : 
                           <ShieldCheck className="w-3.5 h-3.5" />}
                          <span className="text-[8px] uppercase tracking-widest">{r}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Enter legal name"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Email ID</label>
                    <input 
                      type="email" 
                      className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="name@institution.com"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Password</label>
                    <input 
                      type="password" 
                      className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Minimum 8 characters"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        alert(`System: ${role} account created successfully! Synchronizing system data...`);
                        setAuthView("login");
                      }}
                      className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-[0.98] ${
                        role === "Student" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/30" :
                        role === "Employee" ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30" :
                        "bg-red-600 hover:bg-red-500 shadow-red-500/30"
                      }`}
                    >
                      Initialize {role} Account
                    </button>

                    <div className="flex justify-center items-center px-2 pt-4">
                      <button 
                        onClick={() => setAuthView("login")}
                        className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                      >
                        Already have an account? <span className="text-blue-500">Sign In</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6 italic">
              Authorized Personnel Only &bull; Secured Connection
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      {/* Immersive Background Bookshelf Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none scale-105">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
        >
          <img 
            src="https://images.unsplash.com/photo-1548048026-5a1a941d93d3?auto=format&fit=crop&q=80&w=2000" 
            alt="Library Atmosphere" 
            className="w-full h-full object-cover grayscale opacity-30 brightness-[0.2] contrast-125"
          />
        </motion.div>
        
        {/* Layered Lighting & Depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-blue-950/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
        
        {/* Particle/Dust Overlay for atmosphere */}
        <div className="absolute inset-0 mix-blend-screen opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {/* Top Status Header */}
      <div className="relative z-20 flex justify-between items-center px-12 py-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Live Feed</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Remix: KLE's Library System</p>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
             <Globe className="w-4 h-4 text-slate-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">KLE Global Node</span>
          </div>
          <div className="flex items-center gap-3">
             <Lock className="w-4 h-4 text-slate-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6 md:p-10 flex gap-10 h-[calc(100vh-120px)] relative z-10">
        {/* Container Specific Bookshelf Background - Integrated Appearance */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=2000" 
            alt="Library Shelf" 
            className="w-full h-full object-cover grayscale brightness-[0.15] contrast-150 mix-blend-overlay scale-110"
          />
          <div className="absolute inset-0 bg-slate-900/80" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-purple-900/10" />
        </div>
        
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 bg-black/40 backdrop-blur-2xl text-slate-300 rounded-[2.5rem] flex-col shadow-2xl overflow-hidden p-6 relative z-10 border border-white/5">
          {/* User Profile Hook */}
          <div className="flex items-center gap-4 mb-10 px-2 mt-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center p-1 border-2 ${role === "Admin" ? "border-red-600/50" : "border-blue-600/50"} shadow-lg shadow-blue-500/10 transition-transform hover:scale-105 cursor-pointer`}>
              <div className={`w-full h-full rounded-full flex items-center justify-center text-xl font-black text-white ${role === "Student" ? "bg-blue-600" : role === "Employee" ? "bg-indigo-600" : "bg-red-600"} shadow-inner`}>
                {loginUsername.charAt(0)}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white leading-none mb-1">{loginUsername}</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Level: {role === "Admin" ? "Root Oracle" : "Authorized User"}</p>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <div className="space-y-1">
              {[
                { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" },
                { icon: Library, label: "The Library", tab: "catalog" },
                { icon: Cpu, label: "Research Nodes", tab: "python-catalog" },
                { icon: UserIcon, label: "Profile", tab: "profile" },
                { icon: Archive, label: "Impact Archives", tab: "admin" },
              ].map((item, i) => {
                // Only show Impact Archives if Admin
                if (item.tab === "admin" && role !== "Admin") return null;
                
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={i}
                    onClick={() => setActiveTab(item.tab as any)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all relative group ${
                      isActive 
                        ? "bg-red-600 text-white shadow-xl shadow-red-600/30 font-black italic translate-x-2" 
                        : "text-slate-500 hover:text-white hover:bg-white/5 font-bold"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeSide"
                        className="absolute left-[-12px] w-2 h-8 bg-red-600 rounded-r-full shadow-[4px_0_12px_rgba(220,38,38,0.5)]"
                      />
                    )}
                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-red-500 transition-colors"}`} />
                    <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Bottom */}
          <div className="mt-auto space-y-6">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-3 px-6 py-4 text-slate-600 hover:text-red-500 transition-colors group font-black text-xs uppercase tracking-widest"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 relative z-10">
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-5xl font-black text-white italic tracking-tighter leading-none uppercase mb-2">
                    Research <span className="text-red-600">Nodes</span>
                  </h2>
                  <p className="text-slate-500 text-xs font-extrabold uppercase tracking-[0.4em] ml-1">Live Architectural Status Monitoring</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-5 py-2 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Nominal</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {researchNodes.map((node, i) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative bg-[#0A0A0A]/80 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 shadow-2xl overflow-hidden cursor-pointer"
                  >
                    {/* Decorative glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-10 -mt-10 transition-opacity group-hover:opacity-40 ${
                      node.status === "OPTIMAL" ? "bg-emerald-500" : 
                      node.status === "ACTIVE" ? "bg-blue-500" :
                      node.status === "HEAVY_LOAD" ? "bg-red-500" : "bg-indigo-500"
                    }`} />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className={`p-4 rounded-2xl shadow-inner ${
                          node.status === "HEAVY_LOAD" ? "bg-red-600/10 text-red-500 border border-red-600/20" : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}>
                          {node.id === "node-1" ? <Binary className="w-6 h-6" /> : 
                           node.id === "node-2" ? <Globe className="w-6 h-6" /> :
                           node.id === "node-3" ? <Zap className="w-6 h-6" /> :
                           node.id === "node-4" ? <Database className="w-6 h-6" /> :
                           node.id === "node-5" ? <Activity className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                          node.status === "OPTIMAL" ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20" :
                          node.status === "HEAVY_LOAD" ? "text-red-500 bg-red-500/10 border border-red-500/20" :
                          "text-blue-500 bg-blue-500/10 border border-blue-500/20"
                        }`}>
                          {node.status.replace("_", " ")}
                        </span>
                      </div>

                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1 leading-none">{node.title}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{node.subtitle}</p>
                      <p className="text-xs font-medium text-slate-600 italic mb-8">{node.description}</p>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">{node.stat1.label}</p>
                            <p className="text-lg font-black text-white tracking-tighter">{node.stat1.value}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">{node.stat2.label}</p>
                            <p className={`text-lg font-black tracking-tighter ${node.stat2.value === "100%" ? "text-emerald-500" : "text-white"}`}>{node.stat2.value}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${node.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)] ${
                              node.status === "HEAVY_LOAD" ? "bg-gradient-to-r from-red-600 to-rose-400" :
                              node.status === "OPTIMAL" ? "bg-gradient-to-r from-emerald-600 to-teal-400" :
                              "bg-gradient-to-r from-blue-600 to-indigo-400"
                            }`}
                          />
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-4">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span className="text-white mr-2">{node.members}</span> CORE MEMBERS
                          </p>
                          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">{node.statusLabel}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom "Taskbar" mock */}
              <div className="mt-12 flex items-center justify-between p-4 bg-black/60 backdrop-blur-3xl rounded-[2rem] border border-white/5">
                 <div className="flex items-center gap-4">
                   <button className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-red-600 transition-colors group">
                     <Search className="w-5 h-5 text-slate-400 group-hover:text-white" />
                   </button>
                   <div className="flex gap-2">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500 hover:text-white hover:bg-slate-800 cursor-pointer transition-all">
                         {i}
                       </div>
                     ))}
                   </div>
                 </div>
                 <div className="flex items-center gap-6 pr-4">
                    <div className="text-right">
                       <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">System Pulse</p>
                       <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">0.45ms Latency</p>
                    </div>
                    <Activity className="w-5 h-5 text-red-600 animate-pulse" />
                 </div>
              </div>
            </div>
          )}

          {activeTab === "catalog" && (
            <>
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 id="catalog-heading" className="text-3xl font-black text-red-600 tracking-tighter mb-1 uppercase transition-colors">
                    BOOKS ARE HERE
                    <span className="block text-xl mt-1 text-red-500/80">2026</span>
                  </h2>
                  <div className="flex items-center gap-4">
                    <p className="text-slate-500 text-sm italic">
                      {role === "Student" ? "Search and discover resources available in the library." : 
                       role === "Employee" ? "Manage books, update metadata, and track inventory." : 
                       "Full administrative access to library resources."}
                    </p>
                    {deletedBooks.length > 0 && (
                      <button 
                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                        className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all animate-pulse"
                      >
                         <Trash2 className="w-3 h-3" />
                         Recover ({deletedBooks.length})
                      </button>
                    )}
                  </div>
                </div>
                
                {(role === "Employee" || role === "Admin") && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setEditingBook(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-red-600 hover:from-blue-800 hover:to-red-700 text-white px-8 py-3 rounded-lg shadow-xl shadow-blue-500/20 font-black text-xs uppercase tracking-widest transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3px]" />
                    Add New Book
                  </motion.button>
                )}
              </div>

              {/* Book List */}
              <div className="grid grid-cols-1 gap-4">
                {loading ? (
                  <div className="py-20 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-medium italic">Loading catalog data...</p>
                  </div>
                ) : filteredBooks.length > 0 ? (
                  <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-800 border-b border-slate-700">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Book Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Year</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          <AnimatePresence mode="popLayout">
                            {filteredBooks.slice(0, visibleBooksCount).map((book) => (
                              <motion.tr 
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                                transition={{ duration: 0.2 }}
                                key={book.id} 
                                className="hover:bg-slate-800/50 transition-colors group cursor-default"
                              >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div 
                                    onClick={() => book.title.toUpperCase().includes("PYTHON") && setActiveTab("python-catalog")}
                                    className={`w-10 h-14 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden relative group-hover:scale-110 transition-all cursor-pointer shadow-sm ${
                                      book.title.toUpperCase().includes("PYTHON") 
                                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white bg-[#0F172A] border border-blue-400/30" 
                                        : "bg-slate-800 text-slate-600"
                                    }`}
                                  >
                                    {book.imageUrl ? (
                                      <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <BookOpen className={`w-5 h-5 ${book.title.toUpperCase().includes("PYTHON") ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "opacity-50"}`} />
                                    )}
                                    {book.title.toUpperCase().includes("PYTHON") && (
                                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent pointer-events-none" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-white text-sm leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">{book.title}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
                                    <p className="text-[10px] font-mono text-slate-500 mt-1">ISBN: {book.isbn}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-bold uppercase border border-slate-700">
                                  {book.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="font-mono text-xs font-medium text-slate-400">{book.year}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${
                                    book.status === "Available" ? "bg-emerald-500" : 
                                    book.status === "Borrowed" ? "bg-amber-500" : "bg-red-500"
                                  }`}></span>
                                  <span className={`text-xs font-semibold ${
                                    book.status === "Available" ? "text-emerald-600" : 
                                    book.status === "Borrowed" ? "text-amber-600" : "text-red-600"
                                  }`}>
                                    {book.status}
                                  </span>
                                </div>
                              </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => openViewModal(book)}
                                      className="text-xs font-bold px-3 py-1.5 rounded bg-slate-800 text-blue-400 hover:bg-slate-700 transition-colors flex items-center gap-1.5 border border-slate-700"
                                      title="View Details"
                                    >
                                      <Eye className="w-3 h-3" />
                                      View
                                    </button>
                                    {(role === "Employee" || role === "Admin") && (
                                      <>
                                        <button 
                                          onClick={() => openEditModal(book)}
                                          className="text-xs font-bold px-3 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                                          title="Update Book"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                          Update
                                        </button>
                                        <motion.button 
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => handleDelete(book.id)}
                                          className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm uppercase tracking-widest border border-red-500"
                                          title="Delete Book"
                                        >
                                          Delete
                                        </motion.button>
                                      </>
                                    )}
                                  </div>
                                </td>
                            </motion.tr>
                          ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                    {filteredBooks.length > visibleBooksCount && (
                      <div className="p-6 bg-slate-900 border-t border-slate-800 flex justify-center">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setVisibleBooksCount(prev => prev + 7)}
                          className="px-10 py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 font-black text-xs uppercase tracking-[0.3em] rounded-xl border border-slate-700 transition-all flex items-center gap-3"
                        >
                          Discover More Resources
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-black rounded-2xl border border-dashed border-slate-800">
                    <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 italic">No matches found</h3>
                    <p className="text-slate-500 text-sm">Try using different keywords or clearing your filters</p>
                    <button onClick={() => setSearchQuery("")} className="mt-4 text-blue-400 font-bold hover:underline">Clear Search</button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "python-catalog" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-end p-10 bg-[#0F172A] rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent)] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(250,204,21,0.05),transparent)] pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl border border-blue-500/30 flex items-center justify-center backdrop-blur-xl">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full blur-[8px] absolute opacity-30"></div>
                      <BookOpen className="w-6 h-6 text-blue-400 relative z-10" />
                    </div>
                    <span className="text-blue-400 font-mono text-xs tracking-[0.3em] uppercase">Development Environment</span>
                  </div>
                  <h2 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase italic leading-none drop-shadow-lg">
                    PYTHON <span className="text-yellow-400">HUB</span>
                  </h2>
                  <div className="flex items-center gap-4">
                    <p className="text-slate-400 text-sm italic font-medium max-w-md">Quantum-level resources for modern software engineering and neural network architectures.</p>
                    {deletedBooks.length > 0 && (
                      <button 
                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 text-yellow-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-yellow-400 hover:text-[#0F172A] transition-all animate-pulse"
                      >
                         <Trash2 className="w-3 h-3" />
                         Recover ({deletedBooks.length})
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab("catalog")}
                  className="relative z-10 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black hover:bg-white/10 transition-all uppercase tracking-widest backdrop-blur-xl group-hover:border-blue-500/50"
                >
                  Terminate Session
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {books.filter(b => b.title.toUpperCase().includes("PYTHON")).map((book) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                      key={book.id} 
                      className="bg-[#0F172A] p-8 rounded-3xl shadow-2xl border border-slate-800 hover:border-blue-500/50 transition-all relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <div className="text-4xl font-black text-blue-400 select-none">PY</div>
                      </div>
                      
                      <div className="flex flex-col h-full relative z-10">
                        <div className="flex gap-4 mb-6">
                          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-400/40 transition-colors overflow-hidden">
                            {book.imageUrl ? (
                              <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen className="w-8 h-8 text-blue-400 group-hover:text-yellow-400 transition-colors" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-white uppercase tracking-tight text-xl truncate mb-1 group-hover:text-blue-400 transition-colors">{book.title}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{book.author}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                              <p className="text-[9px] font-mono text-slate-500 tracking-tighter">{book.isbn}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-6 border-t border-slate-800/50 flex justify-between items-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            book.status === "Available" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>{book.status}</span>
                          <div className="flex gap-4">
                            {(role === "Employee" || role === "Admin") && (
                              <>
                                <motion.button 
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => openEditModal(book)}
                                  className="text-slate-500 hover:text-blue-400 transition-colors"
                                  title="Edit Book"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </motion.button>
                                <motion.button 
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(book.id)}
                                  className="text-slate-500 hover:text-red-400 transition-colors"
                                  title="Delete Book"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </>
                            )}
                            <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors underline decoration-blue-500/30 underline-offset-4">Checkout</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Mock suggestions */}
                <div className="bg-[#0F172A]/50 p-8 rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center group cursor-help hover:bg-[#0F172A] transition-all">
                   <div className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Plus className="w-6 h-6 text-slate-600 group-hover:text-blue-500" />
                   </div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">Importing Libraries...</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 bg-white rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.6)]">
                <div className="bg-[#0F172A] p-10 rounded-[2.3rem] text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-400/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                  
                  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl text-center lg:text-left">
                      <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Premium Curriculum</div>
                      <h3 className="text-4xl font-black tracking-tighter mb-4 italic leading-tight uppercase">
                        Master the Quantum <span className="text-blue-500">Python</span> Stack
                      </h3>
                      <p className="text-slate-400 text-base leading-relaxed font-medium">
                        Elevate your technical proficiency with our proprietary tutorials for distributed systems, advanced AI modeling, and hyper-efficient automation protocols.
                      </p>
                      
                      <div className="grid grid-cols-3 gap-8 mt-10">
                        {[
                          { label: "Tutorials", val: "150+" },
                          { label: "Labs", val: "42" },
                          { label: "Students", val: "12k" }
                        ].map((stat, i) => (
                          <div key={i}>
                            <p className="text-2xl font-black text-white">{stat.val}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all italic flex items-center gap-3">
                        Launch Production Lab <ArrowRight className="w-4 h-4" />
                      </button>
                      <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest">v4.2.0 stable release</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">User Profile Details</h2>
              <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                <div className={`h-32 bg-gradient-to-r ${role === "Student" ? "from-blue-600 to-blue-400" : role === "Employee" ? "from-indigo-600 to-indigo-400" : "from-red-600 to-red-400"}`}></div>
                <div className="px-8 pb-8">
                  <div className="relative flex justify-between items-end -mt-12 mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 p-1 border-4 border-slate-900 shadow-xl">
                      <div className={`w-full h-full rounded-xl flex items-center justify-center text-white text-4xl font-black ${role === "Student" ? "bg-blue-500 shadow-lg shadow-blue-500/20" : role === "Employee" ? "bg-indigo-500 shadow-lg shadow-indigo-500/20" : "bg-red-500 shadow-lg shadow-red-500/20"}`}>
                        {loginUsername.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="pb-2">
                       <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${role === "Student" ? "bg-blue-900/40 text-blue-400" : role === "Employee" ? "bg-indigo-900/40 text-indigo-400" : "bg-red-900/40 text-red-400"}`}>
                         {role} ID Verified
                       </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Full Legal Name</p>
                         <p className="text-lg font-bold text-white leading-none">{loginUsername}</p>
                       </div>
                       
                       {role === "Student" && (
                         <>
                           <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Roll Identification</p>
                             <p className="text-base font-mono font-bold text-blue-600">{student.rollNumber}</p>
                           </div>
                           <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Academic Branch</p>
                             <p className="text-base font-medium text-slate-700">{student.branch}</p>
                           </div>
                         </>
                       )}
                       
                       {role === "Employee" && (
                         <>
                           <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Employee Serial</p>
                             <p className="text-base font-mono font-bold text-indigo-600">{employee.employeeId}</p>
                           </div>
                           <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Department</p>
                             <p className="text-base font-medium text-slate-700">{employee.department}</p>
                           </div>
                         </>
                       )}
                       
                       {role === "Admin" && (
                         <>
                           <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Clearance</p>
                             <p className="text-base font-mono font-bold text-red-600">{admin.adminLevel}</p>
                           </div>
                           <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Permissions</p>
                             <div className="flex flex-wrap gap-2 mt-1">
                               {admin.permissions.map((p, i) => (
                                 <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100 italic">{p}</span>
                               ))}
                             </div>
                           </div>
                         </>
                       )}
                    </div>
                    
                    <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        Usage Summary
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Books Borrowed</span>
                          <span className="text-sm font-bold text-white">4</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Pending Returns</span>
                          <span className="text-sm font-bold text-red-400">1</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Account Status</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase border border-emerald-500/20">Active</span>
                        </div>
                      </div>
                      <button className="w-full mt-6 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                        Edit Profile Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "admin" && role === "Admin" && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">System Administration</h2>
                  <p className="text-slate-500 text-sm">Monitor library performance, manage users, and configure system protocols.</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-all">
                    <Database className="w-4 h-4" />
                    Export DB
                  </button>
                  <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-200 font-semibold text-xs transition-all">
                    <Settings className="w-4 h-4" />
                    Config
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Users", val: "1,284", icon: Users, color: "blue", trend: "+12% this month" },
                  { label: "Storage Used", val: "84.2 GB", icon: Database, color: "indigo", trend: "Normal load" },
                  { label: "Active Sessions", val: "42", icon: Activity, color: "emerald", trend: "High traffic" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-${stat.color}-50 rounded-full group-hover:scale-110 transition-transform`}></div>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-500 mb-4`} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 leading-none mb-2 tracking-tight">{stat.val}</p>
                    <p className="text-[10px] font-medium text-slate-500 italic">{stat.trend}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-red-500" />
                   Recent Administrative Actions
                </h3>
                <div className="space-y-4">
                  {[
                    { action: "Catalog Purge", user: "Admin L3", time: "2 hours ago", status: "Completed" },
                    { action: "User Permission Escalation", user: "Employee #88", time: "5 hours ago", status: "Pending" },
                    { action: "System Backup Initiated", user: "Auto-System", time: "1 day ago", status: "Verified" }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div className="flex gap-4 items-center">
                        <div className="w-8 h-8 flex-shrink-0 bg-slate-100 rounded flex items-center justify-center">
                          <Activity className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{log.action}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{log.user} &bull; {log.time}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        log.status === "Completed" ? "bg-blue-100 text-blue-600" :
                        log.status === "Verified" ? "bg-emerald-100 text-emerald-600" :
                        "bg-amber-100 text-amber-600"
                      }`}>{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-16 bg-black border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
            alt="Footer Bookshelf" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-slate-500 font-medium relative z-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Library className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-black uppercase tracking-widest text-white">Koha-Lite ILS</span>
            </div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Next-Gen Intelligence &bull; 2026 Edition</p>
          </div>
          <div className="flex gap-10 font-semibold uppercase tracking-widest text-[9px]">
            <a href="#" className="hover:text-blue-500 transition-all hover:translate-y-[-1px]">Infrastructure</a>
            <a href="#" className="hover:text-blue-500 transition-all hover:translate-y-[-1px]">Security Protocol</a>
            <a href="#" className="hover:text-blue-500 transition-all hover:translate-y-[-1px]">Data Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-all hover:translate-y-[-1px]">System Status</a>
          </div>
          <div className="pt-4 md:pt-0 border-t md:border-t-0 border-slate-800 w-full md:w-auto text-center md:text-right">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-700">&copy; 2026 Koha-Lite Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal - Add/Edit Book */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsModalOpen(false); setEditingBook(null); }}
              className="absolute inset-0 bg-[#0D1B2A]/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-950 w-full max-w-lg rounded-xl shadow-2xl relative overflow-hidden border border-slate-800"
            >
              <div className="bg-slate-900 border-b border-slate-800 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{editingBook ? "Update Resource" : "Add New Resource"}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-widest italic opacity-60">Physical and Digital Inventory Protocol</p>
                </div>
                <button 
                  onClick={() => { setIsModalOpen(false); setEditingBook(null); }}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddOrUpdate} className="p-6 space-y-5 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block ml-1">Title & Main Entry</label>
                    <input 
                      name="title" 
                      defaultValue={editingBook?.title} 
                      required 
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all font-semibold text-white"
                      placeholder="e.g. The Great Gatsby"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block ml-1">Author</label>
                    <input 
                      name="author" 
                      defaultValue={editingBook?.author} 
                      required 
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-sm text-white"
                      placeholder="e.g. F. Scott Fitzgerald"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block ml-1">ISBN-13</label>
                    <input 
                      name="isbn" 
                      defaultValue={editingBook?.isbn} 
                      required 
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all font-mono text-xs text-white"
                      placeholder="978-0000000000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block ml-1">Year</label>
                    <input 
                      name="year" 
                      type="number" 
                      defaultValue={editingBook?.year} 
                      required 
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-sm text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block ml-1">Category</label>
                    <select 
                      name="category" 
                      defaultValue={editingBook?.category} 
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all text-sm text-white"
                    >
                      <option className="bg-slate-900">Classic</option>
                      <option className="bg-slate-900">Dystopian</option>
                      <option className="bg-slate-900">Romance</option>
                      <option className="bg-slate-900">Science Fiction</option>
                      <option className="bg-slate-900">Fantasy</option>
                      <option className="bg-slate-900">Non-Fiction</option>
                      <option className="bg-slate-900">Technical</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block ml-1">Book Cover Image</label>
                    <div className="flex gap-4 items-center p-4 bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-800 group hover:border-blue-500/30 transition-all">
                      <div className="w-12 h-16 bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-700">
                        <Plus className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <input 
                          name="imageUrl" 
                          defaultValue={editingBook?.imageUrl} 
                          className="w-full px-0 py-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-[11px] font-mono text-white placeholder:text-slate-600"
                          placeholder="Paste image URL (e.g. https://.../cover.jpg)"
                        />
                        <p className="text-[9px] text-slate-500 mt-1 italic leading-none">External JPG, PNG, or SVG URLs are supported.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block ml-1">Availability Status</label>
                    <div className="flex gap-2">
                      {["Available", "Borrowed", "Reserved"].map((s) => (
                        <label key={s} className="flex-1 cursor-pointer">
                          <input 
                            type="radio" 
                            name="status" 
                            value={s} 
                            defaultChecked={editingBook?.status === s || (!editingBook && s === "Available")}
                            className="hidden peer"
                          />
                          <div className={`text-center py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                            s === "Available" ? "peer-checked:bg-emerald-500 peer-checked:text-white border-emerald-200 text-emerald-600 bg-emerald-50" :
                            s === "Borrowed" ? "peer-checked:bg-amber-500 peer-checked:text-white border-amber-200 text-amber-600 bg-amber-50" :
                            "peer-checked:bg-red-500 peer-checked:text-white border-red-200 text-red-600 bg-red-50"
                          } peer-checked:shadow-sm opacity-60 peer-checked:opacity-100 peer-checked:border-transparent hover:opacity-100`}>
                            {s}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setIsModalOpen(false); setEditingBook(null); }}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-800 text-slate-400 font-semibold text-sm hover:bg-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-lg shadow-blue-900/20 transition-all font-semibold text-sm"
                  >
                    {editingBook ? "Update Book" : "Create Book Entry"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - View Book Details */}
      <AnimatePresence>
        {isViewModalOpen && selectedViewBook && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 w-full max-w-2xl rounded-3xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] relative overflow-hidden border border-slate-800"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Book Cover Side */}
                <div className="w-full md:w-56 bg-black p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-800">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-40 h-56 rounded-xl shadow-2xl overflow-hidden bg-slate-800 flex items-center justify-center ring-1 ring-white/10">
                      {selectedViewBook.imageUrl ? (
                        <img src={selectedViewBook.imageUrl} alt={selectedViewBook.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-16 h-16 text-slate-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 p-8 text-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="px-2 py-0.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded mb-2 inline-block">
                        {selectedViewBook.category}
                      </span>
                      <h3 className="text-3xl font-black tracking-tight leading-none uppercase italic text-white mb-2">
                        {selectedViewBook.title}
                      </h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">BY {selectedViewBook.author}</p>
                    </div>
                    <button 
                      onClick={() => setIsViewModalOpen(false)}
                      className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Standard Number</p>
                      <p className="text-sm font-mono font-bold text-white tracking-tight">{selectedViewBook.isbn}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Publication Year</p>
                      <p className="text-sm font-bold text-white">{selectedViewBook.year}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedViewBook.status === "Available" ? "bg-emerald-500" : 
                          selectedViewBook.status === "Borrowed" ? "bg-amber-500" : "bg-red-500"
                        }`}></div>
                        <p className={`text-sm font-black uppercase ${
                          selectedViewBook.status === "Available" ? "text-emerald-400" : 
                          selectedViewBook.status === "Borrowed" ? "text-amber-400" : "text-red-400"
                        }`}>{selectedViewBook.status}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">System DB Hash</p>
                      <p className="text-xs font-mono text-slate-400 truncate">{selectedViewBook.id}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                    >
                      Check Availability
                    </button>
                    <button 
                      onClick={() => {
                        setIsViewModalOpen(false);
                        const query = encodeURIComponent(selectedViewBook.title);
                        window.open(`https://medium.com/search?q=${query}`, '_blank');
                      }}
                      className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all group"
                      title="Read Articles"
                    >
                      <MessageSquare className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - Contact Us */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden border border-slate-800 p-8"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none mb-2">Internal Channels</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Contact Information Protocol</p>
                </div>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 bg-slate-800/40 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all group">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Physical Address</p>
                    <p className="text-sm font-bold text-white">Central Library, North Campus</p>
                    <p className="text-xs text-slate-400">Library Square, Block B, 2026 Innovation Way</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-800/40 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all group">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Electronic Mail</p>
                    <p className="text-sm font-bold text-white">support@kohalite-ils.com</p>
                    <p className="text-xs text-slate-400">Response time within 2 standard cycles</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-800/40 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all group">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Voice Communication</p>
                    <p className="text-sm font-bold text-white">+1 (800) 2026-KOHA</p>
                    <p className="text-xs text-slate-400">Available Mon-Fri, 08:00 - 20:00 UTC</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl border border-slate-700 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - About This Website */}
      <AnimatePresence>
        {showAboutModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAboutModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden border border-slate-800"
            >
              {/* Header Decoration */}
              <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20" />
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-xl transition-colors text-white backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 -mt-12 relative z-10">
                <div className="flex items-end gap-4 mb-8">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl border-4 border-slate-900 shadow-xl flex items-center justify-center">
                    <Library className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="pb-2">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Koha-Lite ILS</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">System Infrastructure v.2026.04</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <section>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                      <div className="w-4 h-[1px] bg-blue-500" />
                      Our Mission
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-sm font-medium">
                      Koha-Lite is an advanced Integrated Library System designed to streamline resource management and digital cataloging for high-performance academic and professional environments. We provide a seamless interface for indexing, tracking, and discovering intellectual assets.
                    </p>
                  </section>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <ShieldCheck className="w-4 h-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security</p>
                      </div>
                      <p className="text-xs text-slate-300">Biometric-ready authentication and multi-tier role-based access control protocols.</p>
                    </div>
                    <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-2 mb-2 text-emerald-400">
                        <GraduationCap className="w-4 h-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academics</p>
                      </div>
                      <p className="text-xs text-slate-300">Intelligent citation tracking and resource allocation for student success.</p>
                    </div>
                  </div>

                  <section className="bg-blue-600/5 p-6 rounded-2xl border border-blue-500/20">
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Technical Specifications</p>
                     <div className="flex flex-wrap gap-4 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> React 18+ Architecture</span>
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Motion Engine Driven</span>
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Zero-Latency Sync</span>
                     </div>
                  </section>
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => setShowAboutModal(false)}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
 
      {/* Modal - Forgot Password */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotPasswordModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden border border-slate-800 p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none mb-1">Identity Recovery</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Security Clearance Reset</p>
                </div>
                <button 
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Enter your institutional email address to receive a recovery link. Your account will be locked for 5 standard cycles after submission.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Electronic Mail Identifier</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="name@institution.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      if (forgotPasswordEmail.trim()) {
                        alert(`System: Recovery protocol initiated for ${forgotPasswordEmail}. Check your inbox for further instructions.`);
                        setShowForgotPasswordModal(false);
                        setForgotPasswordEmail("");
                      } else {
                        alert("System Error: Email identifier required.");
                      }
                    }}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Request Reset <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    Abort Protocol
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-700">End-to-End Encrypted Handshake</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recovery Panel */}
      <AnimatePresence>
        {deletedBooks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-700 w-80"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">TRASH BIN</span>
              </div>
              <button 
                onClick={() => setDeletedBooks([])}
                className="text-slate-500 hover:text-white transition-colors"
                title="Clear Trash"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {deletedBooks.map((book) => (
                <div key={book.id} className="flex items-center justify-between gap-4 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 group hover:border-blue-500/50 transition-all">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-slate-100 truncate uppercase tracking-tight">{book.title}</p>
                    <p className="text-[9px] text-slate-500 truncate italic">{book.author}</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRecover(book)}
                    className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-3 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20"
                  >
                    Restore
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

