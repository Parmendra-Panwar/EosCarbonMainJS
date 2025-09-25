import { useState, useEffect, createContext, useContext } from 'react';
import { 
  Shield, Award, CheckCircle, Clock, Globe, Leaf, TrendingUp, AlertTriangle, ExternalLink,
  Eye, FileText, MapPin, Calendar, User, Zap, RefreshCw, LogOut, Bell, Search,
  Camera, Cpu, Bot, ArrowRight, ChevronRight, Wallet, Network, 
} from 'lucide-react';

const AppContext = createContext();

const Web3Service = {
  CONTRACT_ADDRESS: "0x742d35Cc6aB16c3f7d72E0E5C8c4D1e4B6F7A8E9",
  NETWORK: "Polygon Mumbai Testnet",
  CHAIN_ID: "0x13881",
  
  connectWallet: async () => {
    if (!window.ethereum) {
      throw new Error('No Web3 wallet detected. Please install MetaMask.');
    }
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found.');
      }
      
      const account = accounts[0];
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3Service.CHAIN_ID }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: Web3Service.CHAIN_ID,
                chainName: 'Polygon Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/']
              }]
            });
          } catch (addError) {
            console.warn('Failed to add network');
          }
        }
      }
      
      return account;
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('Connection rejected by user.');
      }
      throw new Error(`Failed to connect: ${error.message}`);
    }
  },

  getBalance: async (account) => {
    if (!window.ethereum || !account) return '0';
    
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      
      const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
      return balanceInEther.toFixed(6);
    } catch (error) {
      return '0';
    }
  },

  mintCredits: async (projectData) => {
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const tokenId = Math.floor(Math.random() * 100000);
    const blockNumber = Math.floor(Math.random() * 1000000) + 45000000;
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      txHash,
      tokenId,
      blockNumber,
      contractAddress: Web3Service.CONTRACT_ADDRESS,
      gasUsed: Math.floor(Math.random() * 100000) + 50000,
      timestamp: Date.now(),
      credits: projectData.calculatedCredits,
      ngoWallet: projectData.ngoWallet
    };
  }
};

const NotificationService = {
  show: (message, type = 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  }
};

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [blockchainStats, setBlockchainStats] = useState({
    totalTokens: 1,
    totalCredits: 2100,
    activeContracts: 1,
    lastBlockNumber: 45234567
  });

  useEffect(() => {
    const mockProjects = [
      {
        id: 'PROJ-001',
        title: 'Mangrove Restoration - Sundarbans',
        ngoName: 'Green Earth Foundation',
        ngoWallet: '0x1234567890123456789012345678901234567890',
        location: 'West Bengal, India',
        area: 500,
        calculatedCredits: 1250,
        status: 'verified',
        submissionDate: '2024-01-15',
        verificationDate: '2024-01-20',
        verifierType: 'onsite',
        verifierName: 'Dr. Sarah Johnson',
        description: 'Large-scale mangrove restoration project covering 500 hectares in the Sundarbans delta region.',
        documents: [
          { name: 'Project Proposal.pdf', type: 'proposal', size: '2.4 MB' }
        ],
        verificationData: {
          methodology: 'Direct measurement and satellite imagery analysis',
          carbonSequestrationRate: 2.5,
          confidence: 95,
          biodiversityScore: 8.7,
          communityImpact: 'High'
        }
      },
      {
        id: 'PROJ-002',
        title: 'Coral Reef Conservation - Maldives',
        ngoName: 'Ocean Guardians',
        ngoWallet: '0x0987654321098765432109876543210987654321',
        location: 'North Malé Atoll, Maldives',
        area: 200,
        calculatedCredits: 800,
        status: 'pending_approval',
        submissionDate: '2024-01-18',
        verificationDate: '2024-01-25',
        verifierType: 'ai',
        verifierName: 'AI Carbon Calculator v2.1',
        description: 'Comprehensive coral reef restoration and protection initiative.',
        documents: [
          { name: 'Coral Assessment.pdf', type: 'assessment', size: '3.1 MB' }
        ],
        verificationData: {
          methodology: 'AI-powered satellite analysis',
          carbonSequestrationRate: 4.0,
          confidence: 88,
          biodiversityScore: 9.2,
          communityImpact: 'Medium'
        }
      },
      {
        id: 'PROJ-003',
        title: 'Seagrass Meadow Protection - Australia',
        ngoName: 'Marine Conservation Society',
        ngoWallet: '0xabcdef1234567890abcdef1234567890abcdef12',
        location: 'Great Barrier Reef, Australia',
        area: 750,
        calculatedCredits: 2100,
        status: 'approved',
        submissionDate: '2024-01-05',
        approvalDate: '2024-01-28',
        verifierType: 'drone',
        verifierName: 'AquaDrone Survey Team',
        description: 'Protection and restoration of seagrass meadows.',
        documents: [
          { name: 'Drone Survey Data.zip', type: 'survey', size: '45.8 MB' }
        ],
        verificationData: {
          methodology: 'Drone-based monitoring',
          carbonSequestrationRate: 2.8,
          confidence: 92,
          biodiversityScore: 8.9,
          communityImpact: 'High'
        },
        blockchainData: {
          txHash: '0x742d35cc6ab16c3f7d72e0e5c8c4d1e4b6f7a8e9c5b2a1f3d8e7b4c9a6d5e2f1',
          tokenId: 1001,
          mintDate: '2024-01-28',
          contractAddress: Web3Service.CONTRACT_ADDRESS,
          blockNumber: 45234501,
          gasUsed: 85420
        }
      }
    ];
    
    setProjects(mockProjects);
    setNotifications([
      {
        id: 1,
        type: 'verification_complete',
        message: 'PROJ-002 verification completed',
        timestamp: Date.now() - 3600000,
        read: false
      }
    ]);
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      NotificationService.show('Connecting to wallet...', 'info');
      
      const wallet = await Web3Service.connectWallet();
      setConnectedWallet(wallet);
      
      const balance = await Web3Service.getBalance(wallet);
      setWalletBalance(balance);
      
      NotificationService.show('Wallet connected successfully!', 'success');
    } catch (error) {
      console.error('Wallet connection error:', error);
      NotificationService.show(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet('');
    setWalletBalance('0');
    NotificationService.show('Wallet disconnected', 'info');
  };

  const approveCredits = async (projectId) => {
    setLoading(true);
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Project not found');

      NotificationService.show('Initiating blockchain transaction...', 'info');

      const blockchainResult = await Web3Service.mintCredits(project);

      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? {
              ...p,
              status: 'approved',
              approvalDate: new Date().toISOString().split('T')[0],
              blockchainData: blockchainResult
            }
          : p
      ));

      setBlockchainStats(prev => ({
        ...prev,
        totalTokens: prev.totalTokens + 1,
        totalCredits: prev.totalCredits + project.calculatedCredits,
        lastBlockNumber: blockchainResult.blockNumber
      }));

      NotificationService.show(`Successfully minted ${project.calculatedCredits} credits!`, 'success');

    } catch (error) {
      NotificationService.show('Failed to approve credits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const rejectCredits = (projectId, reason) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, status: 'rejected', rejectionReason: reason }
        : p
    ));
    NotificationService.show('Project rejected', 'info');
  };

  const contextValue = {
    user,
    setUser,
    currentPage,
    setCurrentPage,
    projects,
    notifications,
    loading,
    connectedWallet,
    walletBalance,
    blockchainStats,
    connectWallet,
    disconnectWallet,
    approveCredits,
    rejectCredits
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

const Homepage = () => {
  const { setCurrentPage, setUser } = useApp();

  const quickLogin = (username) => {
    const user = {
      id: 1,
      username: username,
      role: 'admin',
      name: 'Admin User',
      permissions: ['view_projects', 'approve_credits', 'mint_credits']
    };
    
    localStorage.setItem('admin_token', 'demo_token_' + Date.now());
    setUser(user);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Eos Carbon</h1>
              <p className="text-xs text-gray-500">Blockchain Carbon Credits</p>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentPage('login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Admin Login
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">
          Carbon Credits
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            Powered by Blockchain
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12">
          Transparent, secure, and verifiable carbon credits from marine and coastal ecosystems.
        </p>
        
        <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Demo Access</h3>
          <div className="space-y-3">
            <button
              onClick={() => quickLogin('admin')}
              className="w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-900 hover:bg-blue-100 flex items-center justify-between"
            >
              <span>Admin Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => quickLogin('demo')}
              className="w-full bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-900 hover:bg-green-100 flex items-center justify-between"
            >
              <span>Demo Mode</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const { setUser, setCurrentPage } = useApp();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const username = credentials.username.toLowerCase().trim();
      const password = credentials.password.trim();
      
      if ((username === 'admin' && password === 'admin123') || (username === 'demo' && password === 'demo')) {
        const user = {
          id: 1,
          username: username,
          role: 'admin',
          name: 'Admin User',
          permissions: ['view_projects', 'approve_credits', 'mint_credits']
        };
        
        localStorage.setItem('admin_token', 'demo_token_' + Date.now());
        setUser(user);
        setCurrentPage('dashboard');
        NotificationService.show('Login successful!', 'success');
      } else {
        throw new Error('Invalid credentials. Try: admin/admin123 or demo/demo');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={() => setCurrentPage('home')}
          className="text-gray-500 hover:text-gray-700 flex items-center space-x-2 mb-6"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600">Project Credit Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="admin or demo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Demo:</strong> admin/admin123 or demo/demo
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminHeader = () => {
  const { user, setUser, setCurrentPage, notifications, connectedWallet, walletBalance, connectWallet, disconnectWallet } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setCurrentPage('home');
    NotificationService.show('Logged out successfully', 'info');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Credit Management Platform</h1>
            <p className="text-sm text-gray-500">Administrator Portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {!connectedWallet ? (
            <button
              onClick={connectWallet}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-xs">
                <p className="font-mono text-purple-800">
                  {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
                </p>
                <p className="text-purple-600">{walletBalance} MATIC</p>
              </div>
              <button
                onClick={disconnectWallet}
                className="text-purple-600 hover:text-purple-800 ml-2"
                title="Disconnect"
              >
                ×
              </button>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-gray-900 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.id} className={`p-4 border-b ${!notification.read ? 'bg-blue-50' : ''}`}>
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const DashboardStats = () => {
  const { projects, blockchainStats } = useApp();

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: Globe,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Pending Approval',
      value: projects.filter(p => p.status === 'pending_approval').length,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Blockchain Tokens',
      value: blockchainStats.totalTokens,
      icon: Award,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Total Credits',
      value: blockchainStats.totalCredits.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bg} border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
          <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
        </div>
      ))}
    </div>
  );
};

const ProjectCard = ({ project, onApprove, onReject, onViewDetails }) => {
  const getStatusBadge = (status) => {
    const badges = {
      'verified': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      'pending_approval': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'approved': { bg: 'bg-green-100', text: 'text-green-800', icon: Award },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle }
    };
    
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock };
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getVerifierIcon = (type) => {
    switch (type) {
      case 'ai': return <Bot className="w-4 h-4 text-purple-500" />;
      case 'drone': return <Cpu className="w-4 h-4 text-blue-500" />;
      case 'onsite': return <Camera className="w-4 h-4 text-green-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
          <p className="text-sm text-gray-600">by {project.ngoName}</p>
        </div>
        {getStatusBadge(project.status)}
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{project.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Leaf className="w-4 h-4 text-green-500" />
          <span>{project.calculatedCredits} carbon credits ({project.area} hectares)</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Submitted {new Date(project.submissionDate).toLocaleDateString()}</span>
        </div>
        {project.verifierType && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {getVerifierIcon(project.verifierType)}
            <span>Verified by {project.verifierName}</span>
          </div>
        )}
      </div>

      {project.blockchainData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800 flex items-center space-x-2">
              <Network className="w-4 h-4" />
              <span>On Blockchain</span>
            </span>
            <ExternalLink className="w-4 h-4 text-green-600" />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-green-600">Token #{project.blockchainData.tokenId}</p>
            <p className="text-xs text-green-500 font-mono">
              {project.blockchainData.txHash.slice(0, 10)}...{project.blockchainData.txHash.slice(-8)}
            </p>
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-700 mb-4">{project.description}</p>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onViewDetails(project)}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>Details</span>
        </button>
        
        {project.status === 'pending_approval' && (
          <>
            <button
              onClick={() => onApprove(project.id)}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Mint Credits</span>
            </button>
            <button
              onClick={() => onReject(project.id)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ProjectDetailsModal = ({ project, onClose, onApprove, onReject }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!project) return null;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'verification', name: 'Verification', icon: CheckCircle },
    { id: 'blockchain', name: 'Blockchain', icon: Network }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h2>
              <p className="text-gray-600">{project.ngoName} • {project.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
          
          <div className="flex space-x-1 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-900">{project.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Area</label>
                    <p className="text-sm text-gray-900">{project.area} hectares</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Credits</label>
                    <p className="text-sm text-gray-900 font-semibold">{project.calculatedCredits} tons CO₂</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NGO Wallet</label>
                    <p className="text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded">
                      {project.ngoWallet}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700">{project.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div>
              {project.verificationData ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Verification Details</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Methodology</label>
                        <p className="text-sm text-gray-900">{project.verificationData.methodology}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sequestration Rate</label>
                        <p className="text-sm text-gray-900">{project.verificationData.carbonSequestrationRate} tons CO₂/hectare/year</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Confidence</label>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{width: `${project.verificationData.confidence}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{project.verificationData.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Verified By</label>
                        <p className="text-sm text-gray-900">{project.verifierName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Biodiversity Score</label>
                        <p className="text-sm text-gray-900">{project.verificationData.biodiversityScore}/10</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Community Impact</label>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          project.verificationData.communityImpact === 'High' ? 'bg-green-100 text-green-800' :
                          project.verificationData.communityImpact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.verificationData.communityImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Pending</h3>
                  <p className="text-gray-600">This project is under review.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'blockchain' && (
            <div>
              {project.blockchainData ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Blockchain Token</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
                        <p className="text-lg font-mono font-bold text-green-800">#{project.blockchainData.tokenId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                        <p className="text-lg font-bold text-green-800">{project.calculatedCredits} tons CO₂</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Hash</label>
                      <p className="text-xs font-mono text-gray-600 bg-white p-2 rounded border">
                        {project.blockchainData.txHash}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Not on Blockchain</h3>
                  <p className="text-gray-600">This project hasn't been minted yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
          
          {project.status === 'pending_approval' && (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const reason = prompt('Rejection reason:');
                  if (reason) { onReject(project.id, reason); onClose(); }
                }}
                className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Approve and mint credits?')) { onApprove(project.id); onClose(); }
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Approve & Mint</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { projects, approveCredits, rejectCredits, loading, blockchainStats } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (projectId) => {
    await approveCredits(projectId);
  };

  const handleReject = (projectId, reason) => {
    rejectCredits(projectId, reason);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Credit Management</h2>
          <p className="text-gray-600">Review, approve, and mint carbon credits on blockchain</p>
        </div>

        <DashboardStats />

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Blockchain Network Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-purple-200 text-sm">Network</p>
                  <p className="font-semibold">Polygon Mumbai</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Latest Block</p>
                  <p className="font-semibold">#{blockchainStats.lastBlockNumber}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Contracts</p>
                  <p className="font-semibold">{blockchainStats.activeContracts}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Gas Price</p>
                  <p className="font-semibold">1.2 Gwei</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Projects</option>
                <option value="verified">Verified</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <span className="text-sm text-gray-600">
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Blockchain Transaction</h3>
                <p className="text-gray-600 text-sm">Minting carbon credits as NFT tokens...</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onApprove={handleApprove}
              onReject={(projectId) => {
                const reason = prompt('Reason for rejection:');
                if (reason) handleReject(projectId, reason);
              }}
              onViewDetails={setSelectedProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Projects will appear here when submitted'}
            </p>
          </div>
        )}

        {selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </main>
    </div>
  );
};

const MainApp = () => {
  const { user, setUser, currentPage } = useApp();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setUser({
        id: 1,
        username: 'admin',
        role: 'admin',
        name: 'Admin User',
        permissions: ['view_projects', 'approve_credits', 'mint_credits']
      });
    }
  }, [setUser]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginForm />;
      case 'dashboard':
        return user ? <Dashboard /> : <LoginForm />;
      default:
        return <Homepage />;
    }
  };

  return renderPage();
};

const App = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;



