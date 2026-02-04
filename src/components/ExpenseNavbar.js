import './ExpenseNavbar.css';

function ExpenseNavbar({ activeTab, setActiveTab }) {
    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'activity', label: 'Activity', icon: '💼' },
        { id: 'reports', label: 'Reports', icon: '📊' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <nav className="mobile-navbar">
            <div className="navbar-container">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default ExpenseNavbar;