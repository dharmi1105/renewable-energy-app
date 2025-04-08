import { format, parseISO as dateFnsParseISO } from 'date-fns';
import { TimeFrame } from '../types/energy';

export const parseISO = (dateString: string): Date => {
  try {
    return dateFnsParseISO(dateString);
  } catch (e) {
    console.error('Error parsing date:', dateString, e);
    return new Date(); 
  }
};


export const formatDateByTimeframe = (timestamp: string, timeframe: TimeFrame): string => {
  try {
    const date = parseISO(timestamp);
    if (timeframe === 'today') {
      return format(date, 'HH:mm');
    } else if (timeframe === 'month') {
      return format(date, 'dd');
    } else {
      return format(date, 'MMM');
    }
  } catch (e) {
    console.error('Error formatting date:', timestamp, e);
    return timestamp;
  }
};

export const formatDateForTooltip = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (e) {
    console.error('Error formatting tooltip date:', timestamp, e);
    return timestamp;
  }
};

export const formatNumber = (num: number, decimals = 2): string => {
  try {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } catch (e) {
    console.error('Error formatting number:', num, e);
    return num.toString();
  }
};

export const formatCurrency = (amount: number, currency = 'USD', decimals = 2): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  } catch (e) {
    console.error('Error formatting currency:', amount, e);
    return `$${amount.toFixed(decimals)}`;
  }
};


export const formatPercentage = (value: number, decimals = 1): string => {
  try {
    return `${value.toFixed(decimals)}%`;
  } catch (e) {
    console.error('Error formatting percentage:', value, e);
    return `${value}%`;
  }
};

export default {
  parseISO,
  formatDateByTimeframe,
  formatDateForTooltip,
  formatNumber,
  formatCurrency,
  formatPercentage
};