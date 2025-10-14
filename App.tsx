import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ExpenseList from './components/ExpenseList';
import AnalyticsChart from './components/Chart';
import Summary from './components/Summary';
import BudgetManager from './components/BudgetManager';
import BudgetOverview from './components/BudgetOverview';
import NotificationManager from './components/NotificationManager';
import MonthlyReportGenerator from './components/MonthlyReportGenerator';
import ViewPeriodToggle from './components/ViewPeriodToggle';
import UpcomingBills from './components/UpcomingBills';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import GlobalSearch from './components/GlobalSearch';
import GlobalSearchModal from './components/GlobalSearchModal';
import PlasmaBackground from './components/PlasmaBackground';

import { getSpendingAnalysis } from './services/geminiService';
import * as authService from './services/authService';
import * as storage from './services/storageService';
import { getPeriodDates } from './utils/dateUtils';
import type { User, Expense, Income, SpendingAnalysis, Filters, Budget, CategoryInfo, SortConfig, Bill, NotificationSettings, RecurringExpense, IncomeCategoryInfo } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from './constants';

// A simple ID generator to avoid external dependencies.
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const initialFilters: Filters = {
  category: 'All',
  date: { start: '', end: '' },
  amount: { min: '', max: '' },
  priority: 'All',
};

type ViewPeriod = 'monthly' | 'weekly' | 'custom';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const [expenses, setExpenses] = useState<Expense[]>(() => storage.getItems<Expense[]>('expenses', []));
  const [incomes, setIncomes] = useState<Income[]>(() => storage.getItems<Income[]>('incomes', []));
  const [analysis, setAnalysis] = useState<SpendingAnalysis | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [budgets, setBudgets] = useState<Budget[]>(() => storage.getItems<Budget[]>('budgets', []));
  const [bills, setBills] = useState<Bill[]>(() => storage.getItems<Bill[]>('bills', []));
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => storage.getItems<NotificationSettings>('notificationSettings', {
    dailyReminder: { enabled: false, time: '20:00' },
    billReminders: { enabled: false, daysBefore: 2 },
  }));
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(() => storage.getItems<RecurringExpense[]>('recurringExpenses', []));
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'descending' });
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('monthly');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => storage.getItems<string[]>('searchHistory', []));
  const [categories, setCategories] = useState<CategoryInfo[]>(() => storage.getItems<CategoryInfo[]>('categories', DEFAULT_CATEGORIES));
  const [incomeCategories, setIncomeCategories] = useState<IncomeCategoryInfo[]>(() => storage.getItems<IncomeCategoryInfo[]>('incomeCategories', DEFAULT_INCOME_CATEGORIES));
  
  // State for Global Search
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  
  // Effects to save state to localStorage via the storage service
  useEffect(() => { storage.saveItems('expenses', expenses); }, [expenses]);
  useEffect(() => { storage.saveItems('incomes', incomes); }, [incomes]);
  useEffect(() => { storage.saveItems('budgets', budgets); }, [budgets]);
  useEffect(() => { storage.saveItems('bills', bills); }, [bills]);
  useEffect(() => { storage.saveItems('notificationSettings', notificationSettings); }, [notificationSettings]);
  useEffect(() => { storage.saveItems('recurringExpenses', recurringExpenses); }, [recurringExpenses]);
  useEffect(() => { storage.saveItems('searchHistory', searchHistory); }, [searchHistory]);
  useEffect(() => { storage.saveItems('categories', categories); }, [categories]);
  useEffect(() => { storage.saveItems('incomeCategories', incomeCategories); }, [incomeCategories]);


  const handleCloseGlobalSearch = () => {
    setIsGlobalSearchOpen(false);
    setGlobalSearchQuery('');
  };


  useEffect(() => {
    const initializeAuth = async () => {
      await authService.initializeMsal();
      const user = authService.getAccount();
      if (user) {
        setCurrentUser(user);
        setView('dashboard');
      }
      setAuthInitialized(true);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (viewPeriod === 'custom') return;

    const { start, end } = getPeriodDates(viewPeriod);
    setFilters(prevFilters => ({
      ...prevFilters,
      date: { start, end },
    }));
  }, [viewPeriod]);
  
  // Effect to automatically add recurring expenses that are due
  useEffect(() => {
    const processRecurringExpenses = () => {
      if (recurringExpenses.length === 0) return;

      let expensesToAdd: Omit<Expense, 'id'>[] = [];
      const updatedRecurringExpenses: RecurringExpense[] = JSON.parse(JSON.stringify(recurringExpenses));
      let hasChanges = false;

      updatedRecurringExpenses.forEach((rec) => {
        const startDate = new Date(`${rec.startDate}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate > today) return;
        
        const lastAdded = rec.lastAddedDate ? new Date(`${rec.lastAddedDate}T00:00:00`) : null;
        let nextDueDate: Date;

        if (lastAdded) {
            nextDueDate = new Date(lastAdded);
            switch (rec.frequency) {
                case 'daily': nextDueDate.setDate(nextDueDate.getDate() + 1); break;
                case 'weekly': nextDueDate.setDate(nextDueDate.getDate() + 7); break;
                case 'monthly': nextDueDate.setMonth(nextDueDate.getMonth() + 1); break;
                case 'yearly': nextDueDate.setFullYear(nextDueDate.getFullYear() + 1); break;
            }
        } else {
            nextDueDate = startDate;
        }

        while (nextDueDate <= today) {
          hasChanges = true;
          expensesToAdd.push({
            title: rec.title,
            amount: rec.amount,
            category: rec.category,
            date: nextDueDate.toISOString().split('T')[0],
          });
          rec.lastAddedDate = nextDueDate.toISOString().split('T')[0];
          
          switch (rec.frequency) {
            case 'daily': nextDueDate.setDate(nextDueDate.getDate() + 1); break;
            case 'weekly': nextDueDate.setDate(nextDueDate.getDate() + 7); break;
            case 'monthly': nextDueDate.setMonth(nextDueDate.getMonth() + 1); break;
            case 'yearly': nextDueDate.setFullYear(nextDueDate.getFullYear() + 1); break;
          }
        }
      });
      
      if (hasChanges) {
        const newExpenses = expensesToAdd.map(e => ({ ...e, id: generateId() }));
        setExpenses(prev => [...newExpenses, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setRecurringExpenses(updatedRecurringExpenses);
      }
    };

    processRecurringExpenses();
  }, []); // Note: dependencies are removed to avoid infinite loops with localStorage updates, but logic is safe.


  const handleGetAnalysis = useCallback(async () => {
    if (expenses.length < 1) {
      setAnalysis(null);
      return;
    }
    setIsLoadingAnalysis(true);
    setAnalysisError(null);
    try {
      const result = await getSpendingAnalysis(expenses);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysisError('Failed to load spending analysis. Please try again later.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, [expenses]);

  useEffect(() => {
    if (typeof window.Notification === 'undefined' || Notification.permission !== 'granted') {
      return;
    }
  
    const checkNotifications = () => {
      const now = new Date();
  
      // Daily Reminder Check
      if (notificationSettings.dailyReminder.enabled) {
        const [hours, minutes] = notificationSettings.dailyReminder.time.split(':');
        const lastNotified = localStorage.getItem('lastDailyNotification');
        const today = now.toISOString().split('T')[0];
        
        if (now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes) && lastNotified !== today) {
          new Notification('Expense Tracker Reminder', {
            body: "Don't forget to log your expenses for today!",
          });
          localStorage.setItem('lastDailyNotification', today);
        }
      }
  
      // Bill Reminder Check
      if (notificationSettings.billReminders.enabled && bills.length > 0) {
        bills.forEach(bill => {
          const dueDate = new Date(`${bill.dueDate}T00:00:00`);
          const reminderDate = new Date(dueDate);
          reminderDate.setDate(dueDate.getDate() - notificationSettings.billReminders.daysBefore);
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (reminderDate.getTime() === today.getTime()) {
             const lastNotified = localStorage.getItem(`lastBillNotification_${bill.id}`);
             const todayStr = today.toISOString().split('T')[0];
             if (lastNotified !== todayStr) {
               const days = notificationSettings.billReminders.daysBefore;
               const daysText = days === 1 ? '1 day' : `${days} days`;
               new Notification('Upcoming Bill Reminder', {
                  body: `${bill.title} for $${bill.amount} is due in ${daysText}.`,
               });
               localStorage.setItem(`lastBillNotification_${bill.id}`, todayStr);
             }
          }
        });
      }
    };
  
    const intervalId = setInterval(checkNotifications, 60000);
  
    return () => clearInterval(intervalId);
  
  }, [notificationSettings, bills]);


  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = { ...income, id: generateId() };
    setIncomes(prev => [newIncome, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  
  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  const addRecurringExpense = (expense: Omit<RecurringExpense, 'id'>) => {
    const newRecurringExpense = { ...expense, id: generateId() };
    setRecurringExpenses(prev => [...prev, newRecurringExpense].sort((a,b) => a.title.localeCompare(b.title)));
  };

  const deleteRecurringExpense = (id: string) => {
      setRecurringExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const addCategory = (categoryData: Omit<CategoryInfo, 'id'>) => {
    const newCategory: CategoryInfo = {
        ...categoryData,
        id: generateId(),
    };
    setCategories(prev => [...prev, newCategory].sort((a,b) => a.name.localeCompare(b.name)));
  };

  const updateCategory = (updatedCategory: CategoryInfo) => {
      setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat).sort((a,b) => a.name.localeCompare(b.name)));
  };

  const deleteCategory = (id: string) => {
      const categoryToDelete = categories.find(c => c.id === id);
      if (!categoryToDelete) return;
      
      const isCategoryInUse = expenses.some(e => e.category === categoryToDelete.name) || 
                              budgets.some(b => b.category === categoryToDelete.name) ||
                              recurringExpenses.some(r => r.category === categoryToDelete.name);

      if (isCategoryInUse) {
          if (!confirm(`The category "${categoryToDelete.name}" is currently in use. Deleting it will reassign associated items to "Other". Are you sure you want to continue?`)) {
              return;
          }
          const otherCategoryName = DEFAULT_CATEGORIES.find(c => c.icon === 'Other')?.name || 'Other';
          // Re-assign items
          setExpenses(prev => prev.map(e => e.category === categoryToDelete.name ? { ...e, category: otherCategoryName } : e));
          setBudgets(prev => prev.map(b => b.category === categoryToDelete.name ? { ...b, category: otherCategoryName } : b));
          setRecurringExpenses(prev => prev.map(r => r.category === categoryToDelete.name ? { ...r, category: otherCategoryName } : r));
      }
      setCategories(prev => prev.filter(cat => cat.id !== id));
  };
  
  const expensesForChart = useMemo(() => {
    return expenses.filter(expense => {
      const { date, amount } = filters;
      const expenseDate = expense.date ? new Date(`${expense.date}T00:00:00`) : new Date(0);

      const startDate = date.start ? new Date(`${date.start}T00:00:00`) : null;
      const endDate = date.end ? new Date(`${date.end}T23:59:59`) : null;
      
      const startDateMatch = !startDate || expenseDate >= startDate;
      const endDateMatch = !endDate || expenseDate <= endDate;

      const minAmountMatch = !amount.min || expense.amount >= parseFloat(amount.min);
      const maxAmountMatch = !amount.max || expense.amount <= parseFloat(amount.max);

      return startDateMatch && endDateMatch && minAmountMatch && maxAmountMatch;
    });
  }, [expenses, filters.date, filters.amount]);

  const filteredExpenses = useMemo(() => {
    let expensesToDisplay = expensesForChart.filter(expense => {
      const { category, priority } = filters;
      const categoryMatch = category === 'All' || expense.category === category;
      const priorityMatch = priority === 'All' || expense.priority === priority;
      const searchMatch = searchQuery.trim() === '' || expense.title.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priorityMatch && searchMatch;
    });

    const priorityOrder: { [key in 'high' | 'medium' | 'low']: number } = { high: 3, medium: 2, low: 1 };

    expensesToDisplay.sort((a, b) => {
        const key = sortConfig.key;
        const direction = sortConfig.direction === 'ascending' ? 1 : -1;

        if (key === 'priority') {
            const aPriority = priorityOrder[a.priority || 'medium'] || 0;
            const bPriority = priorityOrder[b.priority || 'medium'] || 0;
            return (aPriority - bPriority) * direction;
        }
        
        const aVal = a[key as keyof Expense]; 
        const bVal = b[key as keyof Expense];
        
        if (key === 'amount') {
            return ((aVal as number) - (bVal as number)) * direction;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * direction;
        }
        
        return 0;
    });

    return expensesToDisplay;
  }, [expensesForChart, filters.category, filters.priority, searchQuery, sortConfig]);

  const handleFilterChange = (newFilters: Filters) => {
    if (newFilters.date.start !== filters.date.start || newFilters.date.end !== filters.date.end) {
        setViewPeriod('custom');
    }
    setFilters(newFilters);
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
    setViewPeriod('monthly');
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: generateId() };
    setBudgets(prev => [...prev, newBudget].sort((a,b) => a.category.localeCompare(b.category)));
  };

  const deleteBudget = (id: string) => {
      setBudgets(prev => prev.filter(b => b.id !== id));
  };
  
  const handleCategorySelect = (categoryName: string) => {
    setFilters(prevFilters => ({
        ...prevFilters,
        category: categoryName
    }));
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const addSearchToHistory = useCallback((query: string) => {
    if (!query || !query.trim()) return;
    setSearchHistory(prev => {
        const lowerCaseQuery = query.toLowerCase().trim();
        const newHistory = [
            lowerCaseQuery,
            ...prev.filter(item => item.toLowerCase().trim() !== lowerCaseQuery)
        ];
        return newHistory.slice(0, 5); // Keep the 5 most recent unique searches
    });
  }, [setSearchHistory]);
  
  const handleSortChange = (newSortConfig: Partial<SortConfig>) => {
    setSortConfig(prev => ({ ...prev, ...newSortConfig }));
  };

  const currentlyActiveBudgets = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return budgets.filter(budget => {
        let budgetStartDate, budgetEndDate;
        const now = new Date();

        switch (budget.period) {
            case 'monthly':
                budgetStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
                budgetEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'weekly':
                const currentDay = now.getDay();
                const daysToSubtract = (currentDay === 0) ? 6 : currentDay - 1;
                budgetStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToSubtract);
                budgetEndDate = new Date(budgetStartDate.getFullYear(), budgetStartDate.getMonth(), budgetStartDate.getDate() + 6);
                break;
            case 'yearly':
                if (!budget.year) return false;
                budgetStartDate = new Date(budget.year, 0, 1);
                budgetEndDate = new Date(budget.year, 11, 31);
                break;
            case 'custom':
                if (!budget.startDate || !budget.endDate) return false;
                try {
                    budgetStartDate = new Date(`${budget.startDate}T00:00:00`);
                    budgetEndDate = new Date(`${budget.endDate}T23:59:59`);
                } catch (e) {
                    return false;
                }
                break;
            default:
                return false;
        }

        return today >= budgetStartDate && today <= budgetEndDate;
    });
  }, [budgets]);

  const handleMicrosoftLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    localStorage.clear();
    setView('landing');
  };

  const renderContent = () => {
    if (!authInitialized) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      );
    }
  
    if (view === 'landing') {
        return <LandingPage onLogin={() => setView('login')} />;
    }
    
    if (view === 'login') {
        return <LoginPage onMicrosoftLogin={handleMicrosoftLogin} onBack={() => setView('landing')} />;
    }
  
    return (
      <div className="flex h-screen text-slate-300 font-sans">
        <Sidebar 
            onAddExpense={addExpense}
            onAddIncome={addIncome}
            incomes={incomes}
            onDeleteIncome={deleteIncome}
            recurringExpenses={recurringExpenses}
            onAddRecurringExpense={addRecurringExpense}
            onDeleteRecurringExpense={deleteRecurringExpense}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            categories={categories}
            incomeCategories={incomeCategories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
              <div className="flex justify-center mb-8 relative">
                <ViewPeriodToggle period={viewPeriod} onPeriodChange={setViewPeriod} />
                <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2">
                   <GlobalSearch onOpen={() => setIsGlobalSearchOpen(true)} />
                  {currentUser && <UserProfile user={currentUser} onLogout={handleLogout} />}
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                  <div className="xl:col-span-2">
                      <Summary 
                          analysis={analysis} 
                          isLoading={isLoadingAnalysis} 
                          error={analysisError}
                          onGenerate={handleGetAnalysis}
                          hasExpenses={expenses.length > 0}
                      />
                  </div>
                  <div className="flex flex-col gap-8">
                       <UpcomingBills bills={bills} />
                  </div>
              </div>
  
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-8">
                  <div className="xl:col-span-3">
                      <AnalyticsChart 
                          expenses={expensesForChart}
                          incomes={incomes}
                          onCategorySelect={handleCategorySelect}
                          selectedCategory={filters.category}
                          categories={categories}
                      />
                  </div>
                  <div className="xl:col-span-2">
                      <BudgetOverview
                          budgets={currentlyActiveBudgets}
                          expenses={expenses}
                          onCategorySelect={handleCategorySelect}
                          selectedCategory={filters.category}
                          categories={categories}
                      />
                  </div>
              </div>
  
              <div className="mb-8">
                  <ExpenseList 
                      filteredExpenses={filteredExpenses} 
                      allExpenses={expenses}
                      onDeleteExpense={deleteExpense} 
                      searchQuery={searchQuery}
                      onSearchChange={handleSearchChange}
                      sortConfig={sortConfig}
                      onSortChange={handleSortChange}
                      searchHistory={searchHistory}
                      onAddToHistory={addSearchToHistory}
                      categories={categories}
                  />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <MonthlyReportGenerator expenses={expenses} />
                  <BudgetManager 
                    budgets={budgets} 
                    onAddBudget={addBudget} 
                    onDeleteBudget={deleteBudget}
                    categories={categories}
                  />
                  <NotificationManager
                      settings={notificationSettings}
                      onSettingsChange={setNotificationSettings}
                      bills={bills}
                      onBillsChange={setBills}
                  />
              </div>
  
          </div>
        </main>
        <GlobalSearchModal
          isOpen={isGlobalSearchOpen}
          onClose={handleCloseGlobalSearch}
          query={globalSearchQuery}
          onQueryChange={setGlobalSearchQuery}
          expenses={expenses}
          incomes={incomes}
          categories={categories}
          incomeCategories={incomeCategories}
        />
      </div>
    );
  };

  return (
    <>
      <PlasmaBackground />
      {renderContent()}
    </>
  );
}

export default App;