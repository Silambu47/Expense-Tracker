import { useState } from 'react';
import './ExpenseList.css';
// import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, deleteExpense, updateExpense }) {
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editDescription, setEditDescription] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editCategory, setEditCategory] = useState('');

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

    const handleItemClick = (expense) => {
        setSelectedExpense(expense);
        setEditDescription(expense.description);
        setEditAmount(expense.amount);
        const date = expense.date instanceof Date ? expense.date : new Date(expense.date);
        setEditDate(date.toISOString().split('T')[0]);
        setEditCategory(expense.category);
        setShowEditModal(true);
    };

    const handleUpdate = () => {
        if (!editDescription.trim() || !editAmount || !editDate || !editCategory) {
            return;
        }

        const updatedExpense = {
            description: editDescription,
            amount: +editAmount,
            date: new Date(editDate),
            category: editCategory,
        };

        updateExpense(selectedExpense.id, updatedExpense);
        setShowEditModal(false);
        setSelectedExpense(null);
    };

    const handleDelete = () => {
        if (selectedExpense && window.confirm('Are you sure you want to delete this expense?')) {
            deleteExpense(selectedExpense.id);
            setShowEditModal(false);
            setSelectedExpense(null);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedExpense(null);
    };

    return (
        <div className="expense-list">
            <div className="filter-section">
                <div className="filter-group">
                    <div className="filter-item">
                        <label>Filter by Category</label>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === 'All' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Sort by</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                            <option value="lowest">Lowest Amount</option>
                        </select>
                    </div>
                </div>
                <div className="date-filter-group">
                    <div className="date-filter-item">
                        <label>From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="date-filter-item">
                        <label>To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    {(fromDate || toDate) && (
                        <button
                            className="btn-clear-dates"
                            onClick={() => {
                                setFromDate('');
                                setToDate('');
                            }}
                        >
                            Clear Dates
                        </button>
                    )}
                </div>
            </div>

            <div className="transactions-section">
                <h2>Transactions</h2>
                {sortedExpenses.length === 0 ? (
                    <p className="no-expenses">No expenses found.</p>
                ) : (
                    <div className="table-container">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedExpenses.map((expense) => (
                                    <tr key={expense.id} onClick={() => handleItemClick(expense)} style={{ cursor: 'pointer' }}>
                                        <td data-label="Date">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td data-label="Description">{expense.description}</td>
                                        <td data-label="Category">
                                            <span
                                                className="category-badge"
                                                style={{ backgroundColor: getCategoryColor(expense.category) }}
                                            >
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td data-label="Amount" className="amount-cell">₹{Number(expense.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedExpense && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-form edit-expense-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Expense</h2>
                            <button type="button" className="close-btn" onClick={handleCloseModal}>×</button>
                        </div>
                        <div className="modal-controls">
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    min="0.01"
                                    step="0.01"
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.filter(cat => cat !== 'All').map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-update" onClick={handleUpdate}>
                                Update
                            </button>
                            <button type="button" className="btn-delete-modal" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ExpenseList;