import { useState } from "react";
import "./ExpenseForm.css";

function ExpenseForm({ onSaveExpenseData, expenses = [], updateExpense }) {
    const [enteredDescription, setEnteredDescription] = useState("");
    const [enteredAmount, setEnteredAmount] = useState("");
    const [enteredDate, setEnteredDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editingId, setEditingId] = useState(null);

    const categories = [
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



    const submitHandler = (event) => {
        event.preventDefault();

        if (
            enteredDescription.trim() === "" ||
            enteredAmount <= 0 ||
            !enteredDate ||
            selectedCategory.trim() === ""
        ) {
            return;
        }

        const expenseData = {
            description: enteredDescription,
            amount: +enteredAmount,
            date: new Date(enteredDate),
            category: selectedCategory,
        };

        if (editingId) {
            updateExpense(editingId, expenseData);
        } else {
            onSaveExpenseData(expenseData);
        }

        // Reset form
        setEnteredDescription("");
        setEnteredAmount("");
        setEnteredDate("");
        setSelectedCategory("");
        setEditingId(null);
        setShowForm(false);
    };

    const [showForm, setShowForm] = useState(false);

    const clicked = () => {
        setShowForm(true);
    };

    const handleEdit = (expense) => {
        setEnteredDescription(expense.description);
        setEnteredAmount(expense.amount);

        // Handle date conversion properly
        const date = expense.date instanceof Date ? expense.date : new Date(expense.date);
        setEnteredDate(date.toISOString().split('T')[0]);

        setSelectedCategory(expense.category);
        setEditingId(expense.id);
        setShowForm(true);
    };

    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalTransactions = expenses.length;
    const categoriesUsed = new Set(expenses.map(e => e.category)).size;

    // Get last 1 added expenses
    const recentExpenses = [...expenses].slice(-1).reverse();

    return (
        <div>
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-label">Total Expenses</div>
                    <div className="stat-value">INR {totalExpenses.toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Transactions</div>
                    <div className="stat-value">{totalTransactions}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Categories Used</div>
                    <div className="stat-value">{categoriesUsed}</div>
                </div>
            </div>
            <div className="add-expense-section">
                <h2>Add Expense</h2>
                <button onClick={clicked} className="btn-add-expense">
                    <span>+</span> Add Expense
                </button>
            </div>

            {/* Recent Activities */}
            {recentExpenses.length > 0 && (
                <div className="recent-activities">
                    <h3>Recent Activities</h3>
                    <div className="recent-list">
                        {recentExpenses.map((expense) => (
                            <div key={expense.id} className="recent-item">
                                <div className="recent-info">
                                    <div className="recent-category">{expense.category}</div>
                                    <div className="recent-description">{expense.description}</div>
                                    <div className="recent-date">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="recent-actions">
                                    <div className="recent-amount">₹{Number(expense.amount).toFixed(2)}</div>
                                    <button
                                        className="btn-edit-recent"
                                        onClick={() => handleEdit(expense)}
                                        title="Edit expense"
                                    >
                                        👁️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <form onSubmit={submitHandler} className="modal-form" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
                            <button type="button" className="close-btn" onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setEnteredDescription("");
                                setEnteredAmount("");
                                setEnteredDate("");
                                setSelectedCategory("");
                            }}>×</button>
                        </div>
                        <div className="modal-controls">
                            <input
                                type="text"
                                placeholder="Description"
                                value={enteredDescription}
                                onChange={(e) => setEnteredDescription(e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                min="0.01"
                                step="0.01"
                                value={enteredAmount}
                                onChange={(e) => setEnteredAmount(e.target.value)}
                                required
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={enteredDate}
                                onChange={(e) => setEnteredDate(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-save">Save</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ExpenseForm;
