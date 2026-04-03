import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import './ExpenseReport.css';

function ExpenseReport({ expenses }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const chartHeight = isMobile ? 300 : 360;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Export to CSV function
    const exportToCSV = () => {
        if (expenses.length === 0) return;

        // Create CSV with proper formatting
        const headers = ['Category', 'Description', 'Amount', 'Date'];
        const rows = expenses.map(expense => {
            const date = expense.date instanceof Date ? expense.date : new Date(expense.date);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${month}/${day}/${year}`;

            return [
                expense.category.replace(/"/g, '""'),
                expense.description.replace(/"/g, '""'),
                expense.amount,
                formattedDate
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => {
                return [
                    `"${row[0]}"`,
                    `"${row[1]}"`,
                    row[2],
                    row[3]
                ].join(',');
            })
        ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate category-wise expenses
    const categoryData = expenses.reduce((acc, expense) => {
        const category = expense.category;
        const amount = Number(expense.amount);

        if (acc[category]) {
            acc[category] += amount;
        } else {
            acc[category] = amount;
        }
        return acc;
    }, {});

    // Convert to array for charts
    const categoryChartData = Object.keys(categoryData).map(category => ({
        name: category,
        value: categoryData[category],
        amount: categoryData[category]
    }));

    // Sort by amount for bar chart
    const sortedCategoryData = [...categoryChartData].sort((a, b) => b.value - a.value);

    // Calculate monthly expenses
    const monthlyData = expenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        const amount = Number(expense.amount);

        if (acc[monthYear]) {
            acc[monthYear] += amount;
        } else {
            acc[monthYear] = amount;
        }
        return acc;
    }, {});

    const monthlyChartData = Object.keys(monthlyData).map(month => ({
        month,
        amount: monthlyData[month]
    }));

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const highestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => Number(e.amount))) : 0;

    // Calculate insights
    const topCategory = sortedCategoryData.length > 0 ? sortedCategoryData[0] : null;
    const topCategoryPercentage = topCategory ? ((topCategory.value / totalExpenses) * 100).toFixed(1) : 0;

    // Category colors mapping
    const CATEGORY_COLORS = {
        'Food': '#10b981',
        'Transport': '#3b82f6',
        'Entertainment': '#f59e0b',
        'Health': '#ef4444',
        'Shopping': '#8b5cf6',
        'Bills': '#14b8a6',
        'Education': '#f97316',
        'Others': '#ec4899',
        'Office': '#06b6d4',
        'Movies': '#a855f7'
    };

    const getCategoryColor = (category, index) => {
        return CATEGORY_COLORS[category] || ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#ec4899'][index % 8];
    };

    const COLORS = sortedCategoryData.map((item, index) => getCategoryColor(item.name, index));
    return (
        <div className="expense-report">
            {/* Summary Cards */}
            <div className="report-summary">
                <div className="summary-card">
                    <div className="summary-icon">💰</div>
                    <div className="summary-info">
                        <div className="summary-label">Total Expenses</div>
                        <div className="summary-value">₹{totalExpenses.toFixed(2)}</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-info">
                        <div className="summary-label">Average Expense</div>
                        <div className="summary-value">₹{avgExpense.toFixed(2)}</div>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon">📈</div>
                    <div className="summary-info">
                        <div className="summary-label">Highest Expense</div>
                        <div className="summary-value">₹{highestExpense.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {expenses.length === 0 ? (
                <div className="no-data">
                    <span className="no-data-icon">📊</span>
                    <p>No expense data available</p>
                    <p className="no-data-hint">Add some expenses to see reports</p>
                </div>
            ) : (
                <>
                    {/* Insight Cards */}
                    {topCategory && (
                        <div className="insight-cards">
                            <div className="insight-card warning">
                                <span className="insight-icon">⚠️</span>
                                <div className="insight-content">
                                    <p className="insight-text">
                                        <strong>{topCategory.name}</strong> takes <strong>{topCategoryPercentage}%</strong> of your expenses
                                    </p>
                                </div>
                            </div>
                            {topCategoryPercentage > 50 && (
                                <div className="insight-card tip">
                                    <span className="insight-icon">💡</span>
                                    <div className="insight-content">
                                        <p className="insight-text">
                                            Consider setting a budget limit for {topCategory.name}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bar Chart - Category Comparison */}
                    <div className="report-section report-section-chart">
                        <h3 className="section-title">📊 Top Categories Comparison</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={chartHeight}>
                                <BarChart data={sortedCategoryData.slice(0, 7)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        interval={0}
                                        tick={{ fontSize: isMobile ? 11 : 13, fill: '#6b7280' }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 13, fill: '#6b7280' }}
                                        tickFormatter={(value) => `₹${value}`}
                                        domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
                                        allowDataOverflow={false}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                                        contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={800}>
                                        {sortedCategoryData.slice(0, 7).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name, index)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Category Table */}
                    <div className="report-section report-section-table">
                        <div className="section-header">
                            <h3 className="section-title">Category Breakdown</h3>
                            <button className="export-btn" onClick={exportToCSV}>
                                <span>📥</span> Export CSV
                            </button>
                        </div>
                        <div className="table-container">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Percentage</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedCategoryData.map((item) => {
                                        const count = expenses.filter(e => e.category === item.name).length;
                                        const percentage = ((item.value / totalExpenses) * 100).toFixed(1);
                                        return (
                                            <tr key={item.name}>
                                                <td data-label="Category">
                                                    <span className="category-name">{item.name}</span>
                                                </td>
                                                <td data-label="Amount" className="amount-cell">₹{item.value.toFixed(2)}</td>
                                                <td data-label="Percentage">
                                                    <div className="percentage-bar">
                                                        <div
                                                            className="percentage-fill"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                        <span className="percentage-text">{percentage}%</span>
                                                    </div>
                                                </td>
                                                <td data-label="Count" className="count-cell">{count}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="report-section report-section-chart">
                        <h3 className="section-title">🍩 Expense Distribution (Donut Chart)</h3>
                        <div className="chart-container pie-chart-container">
                            <ResponsiveContainer width="100%" height={chartHeight}>
                                <PieChart>
                                    <Pie
                                        data={sortedCategoryData.slice(0, 7)}
                                        cx="50%"
                                        cy={isMobile ? "45%" : "46%"}
                                        outerRadius={isMobile ? 95 : 120}
                                        innerRadius={isMobile ? 58 : 75}
                                        dataKey="value"
                                        label={!isMobile ? ({ name, percent }) => `${(percent * 100).toFixed(1)}%` : false}
                                        labelLine={!isMobile}
                                        animationDuration={800}
                                        animationBegin={0}
                                    >
                                        {sortedCategoryData.slice(0, 7).map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getCategoryColor(entry.name, index)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name, props) => [
                                            `₹${value.toFixed(2)} (${((value / totalExpenses) * 100).toFixed(1)}%)`,
                                            props.payload.name
                                        ]}
                                        contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' }}
                                    />
                                    <Legend
                                        layout="horizontal"
                                        align="center"
                                        verticalAlign="bottom"
                                        formatter={(value, entry) => (
                                            <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#1f2937', fontWeight: '500' }}>
                                                {value}
                                            </span>
                                        )}
                                        wrapperStyle={{ paddingTop: isMobile ? '10px' : '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="report-section report-section-chart report-section-last">
                        <h3 className="section-title">📈 Monthly Spending Trend</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={chartHeight}>
                                <LineChart data={monthlyChartData} margin={{ top: 20, right: 40, left: 20, bottom: isMobile ? 60 : 100 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="month"
                                        angle={-45}
                                        textAnchor="end"
                                        height={isMobile ? 60 : 100}
                                        interval={0}
                                        tick={{ fontSize: isMobile ? 10 : 13, fill: '#6b7280' }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: isMobile ? 11 : 13, fill: '#6b7280' }}
                                        domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
                                        tickFormatter={(value) => `₹${value}`}
                                        allowDataOverflow={false}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
                                        contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', r: 6 }}
                                        activeDot={{ r: 8 }}
                                        name="Monthly Expenses (₹)"
                                        animationDuration={800}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ExpenseReport;
