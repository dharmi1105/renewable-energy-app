import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

// Import types with stricter definitions
import { 
  EnergyData, 
  TimeFrame 
} from '../../types/energy';

// Import utility functions with improved type safety
import { 
  formatDateByTimeframe, 
  formatDateForTooltip 
} from '../../utils/formatters';

// Enhanced type definition for chart data
interface ChartDataPoint extends EnergyData {
  formattedDate: string;
}

// Props interface with improved type safety
interface ConsumptionChartProps {
  data: EnergyData[];
  timeframe: TimeFrame;
}

// Inside the sampleChartData function
const sampleChartData = (data: EnergyData[], timeframe: TimeFrame): ChartDataPoint[] => {
  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return [];
  }

  try {
    // Year view: Aggregate by month
    if (timeframe === 'year' && data.length > 12) {
      const monthlyAggregation: Record<string, ChartDataPoint> = {};

      data.forEach(item => {
        try {
          const date = parseISO(item.timestamp);
          const monthKey = format(date, 'yyyy-MM');

          if (!monthlyAggregation[monthKey]) {
            monthlyAggregation[monthKey] = {
              ...item,
              timestamp: monthKey,
              formattedDate: format(date, 'MMM yyyy'),
              consumption: 0,
              generation: {
                solar: 0,
                wind: 0,
                hydro: 0,
                total: 0
              },
              carbonFootprint: 0,
              costs: {
                electricity: 0,
                gas: 0,
                total: 0
              }
            };
          }

          // Aggregate values
          const aggregatePoint = monthlyAggregation[monthKey];
          aggregatePoint.consumption += item.consumption;
          aggregatePoint.generation.solar += item.generation.solar;
          aggregatePoint.generation.wind += item.generation.wind;
          aggregatePoint.generation.hydro += item.generation.hydro;
          aggregatePoint.generation.total += item.generation.total;
          aggregatePoint.carbonFootprint += item.carbonFootprint;
          aggregatePoint.costs.electricity += item.costs.electricity;
          aggregatePoint.costs.gas += item.costs.gas;
          aggregatePoint.costs.total += item.costs.total;
        } catch (aggregationError) {
          console.warn('Error aggregating monthly data:', aggregationError);
        }
      });

      return Object.values(monthlyAggregation);
    }

    // Format all data
    return data.map(item => ({
      ...item,
      formattedDate: formatDateByTimeframe(item.timestamp, timeframe)
    }));
  } catch (error) {
    console.error('Error sampling chart data:', error);
    return [];
  }
};

// Corrected Component Definition
const ConsumptionChart: React.FC<ConsumptionChartProps> = (props): React.ReactElement => {
  const { data, timeframe } = props;

  // Memoize data sampling to improve performance
  const chartData = useMemo(() => 
    sampleChartData(data, timeframe), 
    [data, timeframe]
  );

  // Handle empty data with informative message
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
        No data available for the selected time period
      </div>
    );
  }

  // Calculate max values for better chart scaling
  const maxConsumption = Math.max(
    ...chartData.map(item => item.consumption || 0)
  );
  const maxGeneration = Math.max(
    ...chartData.map(item => item.generation?.total || 0)
  );
  const yAxisMax = Math.ceil(Math.max(maxConsumption, maxGeneration) * 1.2);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart 
        data={chartData} 
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {/* Gradient definitions for visual appeal */}
        <defs>
          <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#eab308" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorHydro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {/* Grid and Axes */}
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#374151" 
        />
        <XAxis 
          dataKey="formattedDate" 
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          tickMargin={10}
        />
        <YAxis 
          stroke="#9ca3af"
          domain={[0, yAxisMax]}
          label={{ 
            value: 'kWh', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#9ca3af' }
          }}
          tick={{ fontSize: 12 }}
        />

        {/* Tooltip for detailed information */}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            borderColor: '#374151',
            color: 'white' 
          }}
          formatter={(value: any, name: string) => {
            if (typeof value === 'number') {
              return [
                `${value.toFixed(1)} kWh`, 
                name === 'consumption' ? 'Consumption' : 
                name === 'generation.solar' ? 'Solar' :
                name === 'generation.wind' ? 'Wind' :
                name === 'generation.hydro' ? 'Hydro' : name
              ];
            }
            return [String(value), name];
          }}
          labelFormatter={(label) => {
            if (typeof label === 'string') {
              return formatDateForTooltip(label);
            }
            return String(label);
          }}
        />

        {/* Legend for chart */}
        <Legend 
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={10}
          formatter={(value) => {
            return value === 'consumption' ? 'Consumption' :
                   value === 'generation.solar' ? 'Solar' :
                   value === 'generation.wind' ? 'Wind' :
                   value === 'generation.hydro' ? 'Hydro' : value;
          }}
        />

        {/* Area charts for different energy sources */}
        <Area 
          type="monotone" 
          dataKey="consumption" 
          stroke="#3b82f6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorConsumption)" 
          name="consumption"
          activeDot={{ r: 6 }}
        />
        <Area 
          type="monotone" 
          dataKey="generation.solar" 
          stroke="#eab308" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorSolar)" 
          name="generation.solar"
          activeDot={{ r: 6 }}
        />
        <Area 
          type="monotone" 
          dataKey="generation.wind" 
          stroke="#22c55e" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorWind)" 
          name="generation.wind"
          activeDot={{ r: 6 }}
        />
        <Area 
          type="monotone" 
          dataKey="generation.hydro" 
          stroke="#06b6d4" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorHydro)" 
          name="generation.hydro"
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ConsumptionChart;