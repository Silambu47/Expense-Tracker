import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ActivityPage from './components/ActivityPage';
import ExpenseReport from './components/ExpenseReport';
import { useExpenses } from './hooks/useExpenses';
import ExpenseNavbar from './components/ExpenseNavbar';
import { useState } from 'react';

function App() {
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses();
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="home-content">
            {/* Desktop Only - Two column layout */}
            <div className="desktop-only">
              <div className="left-column">
                <ExpenseForm
                  onSaveExpenseData={addExpense}
                  expenses={expenses}
                  updateExpense={updateExpense}
                />
                <ExpenseList
                  expenses={expenses}
                  deleteExpense={deleteExpense}
                  updateExpense={updateExpense}
                />
              </div>
              <div className="right-column">
                <ExpenseReport expenses={expenses} />
              </div>
            </div>
            {/* Mobile Only - Show only form */}
            <div className="mobile-only">
              <ExpenseForm
                onSaveExpenseData={addExpense}
                expenses={expenses}
                updateExpense={updateExpense}
              />
            </div>
          </div>
        );
      case 'activity':
        return (
          <ActivityPage
            expenses={expenses}
            deleteExpense={deleteExpense}
            updateExpense={updateExpense}
          />
        );
      case 'reports':
        return (
          <ExpenseReport expenses={expenses} />
        );
      case 'settings':
        return (
          <div className="tab-content">
            <h2>Settings</h2>
            <p>App settings and preferences will appear here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="app-header">
        <div className="app-header-icon">💰</div>
        <div className="app-header-content">
          <h1>Expense Tracker</h1>
          <p>Track your spending and visualize your financial patterns</p>
        </div>
      </div>
      <div className="app-content">
        {renderContent()}
      </div>
      <ExpenseNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
