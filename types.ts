import React from 'react';

export type Category = string;
export type IncomeCategory = string;

export interface CategoryInfo {
  id: string;
  name: Category;
  icon: string; // The name of the icon component
  customIcon?: string; // Base64 encoded custom icon
  color: string; // A tailwindcss color class like 'text-emerald-400'
  isDefault?: boolean;
}

export interface IncomeCategoryInfo {
  id: string;
  name: IncomeCategory;
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  priority?: 'high' | 'medium' | 'low';
}

export interface Income {
  id: string;
  title: string;
  amount: number;
  category: IncomeCategory;
  date: string; // YYYY-MM-DD
}

export interface RecurringExpense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string; // YYYY-MM-DD
  lastAddedDate?: string; // YYYY-MM-DD
}

export interface SpendingAnalysis {
  summary: string;
  tips: string[];
  topCategory: string;
  categorySpending: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface Filters {
  category: Category | 'All';
  date: {
    start: string;
    end: string;
  };
  amount: {
    min: string;
    max: string;
  };
  priority: 'All' | 'high' | 'medium' | 'low';
}

export interface Budget {
    id: string;
    category: Category | 'All';
    amount: number;
    period: 'monthly' | 'weekly' | 'yearly' | 'custom';
    year?: number;
    startDate?: string;
    endDate?: string;
}

export type SortKey = 'date' | 'amount' | 'category' | 'title' | 'priority';

export interface SortConfig {
  key: SortKey;
  direction: 'ascending' | 'descending';
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
}

export interface NotificationSettings {
  dailyReminder: {
    enabled: boolean;
    time: string; // HH:MM
  };
  billReminders: {
    enabled: boolean;
    daysBefore: number;
  };
}

export interface User {
  name: string;
  avatarUrl: string;
}