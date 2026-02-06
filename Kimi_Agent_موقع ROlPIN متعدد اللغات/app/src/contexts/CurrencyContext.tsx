import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Currency } from '@/types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (price: { DZD: number; EUR: number; USD: number }) => string;
  convertPrice: (price: { DZD: number; EUR: number; USD: number }) => number;
  currencySymbol: string;
}

const currencySymbols: Record<Currency, string> = {
  DZD: 'د.ج',
  EUR: '€',
  USD: '$',
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency') as Currency;
    return saved || 'DZD';
  });

  const setCurrency = useCallback((curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('currency', curr);
  }, []);

  const convertPrice = useCallback(
    (price: { DZD: number; EUR: number; USD: number }): number => {
      return price[currency];
    },
    [currency]
  );

  const formatPrice = useCallback(
    (price: { DZD: number; EUR: number; USD: number }): string => {
      const value = price[currency];
      const symbol = currencySymbols[currency];
      
      if (currency === 'DZD') {
        return `${value.toLocaleString('ar-DZ')} ${symbol}`;
      } else if (currency === 'EUR') {
        return `${symbol}${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    },
    [currency]
  );

  useEffect(() => {
    const saved = localStorage.getItem('currency') as Currency;
    if (saved) {
      setCurrencyState(saved);
    }
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        currencySymbol: currencySymbols[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
