const KEY = "expenses";

export const getExpenses = () => {
    return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveExpenses = (expenses) => {
    localStorage.setItem(KEY, JSON.stringify(expenses));
};

