import { useState, useEffect } from "react";
import { getExpenses, saveExpenses } from "../services/localStorageService";
import { v4 as uuid } from "uuid";

export const useExpenses = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        setExpenses(getExpenses());
    }, []);

    const addExpense = (expense) => {
        const updated = [...expenses, { ...expense, id: uuid() }];
        setExpenses(updated);
        saveExpenses(updated);
    };

    const deleteExpense = (id) => {
        const updated = expenses.filter(e => e.id !== id);
        setExpenses(updated);
        saveExpenses(updated);
    };

    const updateExpense = (id, updatedExpense) => {
        const updated = expenses.map(e =>
            e.id === id ? { ...updatedExpense, id } : e
        );
        setExpenses(updated);
        saveExpenses(updated);
    };

    return { expenses, addExpense, deleteExpense, updateExpense };
};
