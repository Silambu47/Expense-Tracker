import { useState } from 'react';
import './ActivityPage.css';

function ActivityPage({ expenses, deleteExpense, updateExpense }) {
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        "All",
        "Food",
        "Transport",
        "Entertainment",
        "Movies",
        "Office",
        "Health",
        "Shopping",
        "Utilities",
        "Others"
    ];

    // Filter by category
    let filteredExpenses = filterCategory === 'All' ? expenses : expenses.filter(expense => expense.category === filterCategory);

    // Filter by search query
    if (searchQuery) {
        filteredExpenses = filteredExpenses.filter(expense =>
            expense.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by date range
    if (fromDate) {
        filteredExpenses = filteredExpenses.filter(expense =>
            new Date(expense.date) >= new Date(fromDate)
        );
    }
    if (toDate) {
        filteredExpenses = filteredExpenses.filter(expense =>
            new Date(expense.date) <= new Date(toDate)
        );
    }

    // Sort expenses
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'oldest') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'highest') {
            return b.amount - a.amount;
        } else if (sortBy === 'lowest') {
            return a.amount - b.amount;
        }
        return 0;
    });

    const getCategoryColor = (category) => {
        const colors = {
            Food: '#ef4444',
            Transport: '#3b82f6',
            Entertainment: '#8b5cf6',
            Movies: '#ec4899',
            Office: '#6366f1',
            Health: '#10b981',
            Shopping: '#f59e0b',
            Utilities: '#14b8a6',
            Others: '#6b7280'
        };
        return colors[category] || '#6b7280';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            Food: '🍽️',
            Transport: '🚗',
            Entertainment: '🎮',
            Movies: '🎬',
            Office: '💼',
            Health: '⚕️',
            Shopping: '🛒',
            Utilities: '⚡',
            Others: '📦'
        };
        return icons[category] || '📦';
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (d.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    return (
        <div className="activity-page">
            {/* Search Bar with Filter Toggle */}
            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search transactions"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="filter-toggle-btn"
                    onClick={() => setShowFilters(!showFilters)}
                    title={showFilters ? "Hide Filters" : "Show Filters"}
                >
                    {showFilters ? '✕' : '⚙️'}
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="activity-filters">
                    <div className="filter-row">
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === 'All' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                            <option value="lowest">Lowest Amount</option>
                        </select>
                    </div>
                    <div className="date-row">
                        <input
                            type="date"
                            placeholder="From Date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                        <input
                            type="date"
                            placeholder="To Date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    {(fromDate || toDate || searchQuery) && (
                        <button
                            className="clear-filters-btn"
                            onClick={() => {
                                setFromDate('');
                                setToDate('');
                                setSearchQuery('');
                            }}
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}

            {/* Transaction List */}
            <div className="transaction-list">
                {sortedExpenses.length === 0 ? (
                    <div className="no-transactions">
                        <span className="empty-icon">📭</span>
                        <p>No transactions found</p>
                    </div>
                ) : (
                    sortedExpenses.map((expense) => (
                        <div key={expense.id} className="transaction-item">
                            <div className="transaction-icon" style={{ backgroundColor: getCategoryColor(expense.category) }}>
                                {getCategoryIcon(expense.category)}
                            </div>
                            <div className="transaction-details">
                                <div className="transaction-description">{expense.description}</div>
                                <div className="transaction-meta">
                                    {formatDate(expense.date)} • {expense.category}
                                </div>
                            </div>
                            <div className="transaction-amount">
                                <div className="amount-value">₹{Number(expense.amount).toFixed(2)}</div>
                                <div className="action-buttons">
                                    <button
                                        className="action-btn edit-btn"
                                        onClick={() => { }}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => deleteExpense(expense.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ActivityPage;
