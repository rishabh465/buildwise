
import React from 'react';
import { useEstimator } from '@/contexts/EstimatorContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';

const currencies = [
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
];

export const CurrencySelector = () => {
  const { state, updateProject } = useEstimator();
  const currentCurrency = state.project.currency;
  
  const handleCurrencyChange = (symbol: string) => {
    updateProject({ currency: symbol });
  };
  
  const getCurrentCurrencyName = () => {
    const currency = currencies.find(c => c.symbol === currentCurrency);
    return currency ? currency.name : 'Currency';
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          className="justify-between w-[150px]"
        >
          <span>{currentCurrency} {getCurrentCurrencyName()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]">
        {currencies.map((currency) => (
          <DropdownMenuItem 
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.symbol)}
          >
            <span className="mr-2">{currency.symbol}</span>
            <span>{currency.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
