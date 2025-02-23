import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Transaction } from '@/types/finance';
import styles from './FinanceChart.module.scss';
import type { ApexOptions } from 'apexcharts';

// Import ApexCharts dynamically to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts').then((mod) => mod.default), {
  ssr: false,
});

interface FinanceChartProps {
  transactions: Transaction[];
}

const FinanceChart: React.FC<FinanceChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'INCOME') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return {
      series: [totals.income, totals.expense],
      labels: ['Ingresos', 'Gastos']
    };
  }, [transactions]);

  const options: ApexOptions = {
    chart: {
      type: 'pie',
      background: 'transparent',
      foreColor: '#e2e8f0'
    },
    labels: chartData.labels,
    colors: ['#48bb78', '#f56565'],
    legend: {
      position: 'bottom',
      labels: {
        colors: '#f7fafc'
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: (value) => {
          return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
          }).format(value);
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return `${Math.round(Number(val))}%`;
      },
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 'bold',
        colors: ['#f7fafc']
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 2,
        left: 0,
        blur: 4,
        opacity: 0.35
      }
    },
    stroke: {
      width: 2,
      colors: ['#2d3748']
    }
  };

  return (
    <div className={styles.chartContainer}>
      <h2>Distribución de Ingresos y Gastos</h2>
      {typeof window !== 'undefined' && (
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="pie"
          height={350}
        />
      )}
    </div>
  );
};

export default FinanceChart; 