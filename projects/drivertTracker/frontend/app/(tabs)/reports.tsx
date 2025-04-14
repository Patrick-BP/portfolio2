import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextStyle } from 'react-native';
import { Download, PieChart, Car, Calendar } from 'lucide-react-native';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../contexts/ThemeContext';

// ✅ Mock summary data by period
const dataByPeriod: Record<'month' | 'quarter' | 'year' | 'custom', {
  totalExpenses: number;
  totalMiles: number;
  businessMiles: number;
  personalMiles: number;
  mileageDeduction: number;
  byCategory: { category: string; amount: number; percentage: number }[];
  monthlyMiles: { month: string; miles: number }[];
  fuelMetrics: {
    totalGallons: number;
    avgMPG: number;
    avgPricePerGallon: number;
    monthlyGallons: { month: string; gallons: number }[];
  };
}> = {
  month: {
    totalExpenses: 1245.67,
    totalMiles: 1000,
    businessMiles: 800,
    personalMiles: 200,
    mileageDeduction: 560.0,
    byCategory: [
      { category: 'Fuel', amount: 300.0, percentage: 40 },
      { category: 'Maintenance', amount: 200.0, percentage: 26 },
      { category: 'Insurance', amount: 100.0, percentage: 14 },
      { category: 'Phone', amount: 50.0, percentage: 10 },
      { category: 'Tolls', amount: 45.67, percentage: 6 },
      { category: 'Other', amount: 50.0, percentage: 4 },
    ],
    monthlyMiles: [
      { month: 'Apr', miles: 1000 },
    ],
    fuelMetrics: {
      totalGallons: 70,
      avgMPG: 25,
      avgPricePerGallon: 3.20,
      monthlyGallons: [{ month: 'Apr', gallons: 70 }],
    },
  },
  quarter: {
    totalExpenses: 3200.5,
    totalMiles: 2800,
    businessMiles: 2100,
    personalMiles: 700,
    mileageDeduction: 1450.3,
    byCategory: [
      { category: 'Fuel', amount: 800.0, percentage: 35 },
      { category: 'Maintenance', amount: 600.0, percentage: 20 },
      { category: 'Insurance', amount: 300.0, percentage: 10 },
      { category: 'Tolls', amount: 150.5, percentage: 5 },
      { category: 'Phone', amount: 100.0, percentage: 5 },
      { category: 'Other', amount: 1250.0, percentage: 25 },
    ],
    monthlyMiles: [
      { month: 'Jan', miles: 900 },
      { month: 'Feb', miles: 950 },
      { month: 'Mar', miles: 950 },
    ],
    fuelMetrics: {
      totalGallons: 200,
      avgMPG: 28,
      avgPricePerGallon: 3.25,
      monthlyGallons: [
        { month: 'Jan', gallons: 65 },
        { month: 'Feb', gallons: 70 },
        { month: 'Mar', gallons: 65 },
      ],
    },
  },
  year: {
    totalExpenses: 12400.67,
    totalMiles: 12000,
    businessMiles: 9500,
    personalMiles: 2500,
    mileageDeduction: 6840.55,
    byCategory: [
      { category: 'Fuel', amount: 3500.0, percentage: 28 },
      { category: 'Maintenance', amount: 3000.0, percentage: 24 },
      { category: 'Insurance', amount: 1800.0, percentage: 14 },
      { category: 'Tolls', amount: 700.0, percentage: 6 },
      { category: 'Phone', amount: 600.0, percentage: 5 },
      { category: 'Other', amount: 2800.67, percentage: 23 },
    ],
    monthlyMiles: [
      { month: 'Jan', miles: 1000 },
      { month: 'Feb', miles: 2000 },
      { month: 'Mar', miles: 500 },
      { month: 'Apr', miles: 700 },
      { month: 'May', miles: 689 },
      { month: 'Jun', miles: 2356 },
      { month: 'Jul', miles: 1000 },
      { month: 'Aug', miles: 654 },
      { month: 'Sep', miles: 425 },
      { month: 'Oct', miles: 4556 },
      { month: 'Nov', miles: 1000 },
      { month: 'Dec', miles: 3000 },
    ],
    fuelMetrics: {
      totalGallons: 800,
      avgMPG: 26,
      avgPricePerGallon: 3.40,
      monthlyGallons: [
        { month: 'Jan', gallons: 65 },
        { month: 'Feb', gallons: 70 },
        { month: 'Mar', gallons: 65 },
        { month: 'Apr', gallons: 70 },
        { month: 'May', gallons: 65 },
        { month: 'Jun', gallons: 65 },
        { month: 'Jul', gallons: 65 },
        { month: 'Aug', gallons: 65 },
        { month: 'Sep', gallons: 65 },
        { month: 'Oct', gallons: 65 },
        { month: 'Nov', gallons: 65 },
        { month: 'Dec', gallons: 75 },
      ],
    },
  },
  custom: {
    totalExpenses: 0,
    totalMiles: 0,
    businessMiles: 0,
    personalMiles: 0,
    mileageDeduction: 0,
    byCategory: [],
    monthlyMiles: [],
    fuelMetrics: {
      totalGallons: 0,
      avgMPG: 0,
      avgPricePerGallon: 0,
      monthlyGallons: [],
    },
  }, // Placeholder for custom data
};

// Assign custom data after the initial declaration
dataByPeriod.custom = {
  // Just use year’s data as placeholder
  ...dataByPeriod.year,
};

const Reports = () => {
  const { isDarkMode } = useTheme();
  const [period, setPeriod] = useState<keyof typeof dataByPeriod>('month');
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isStartDate, setIsStartDate] = useState(true);

  const handlePeriodChange = (p: keyof typeof dataByPeriod) => {
    setPeriod(p);
    if (p === 'custom') {
      setCustomModalVisible(true);
    }
  };

  const summary = dataByPeriod[period] || dataByPeriod['month'];
  const cardStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  };
  const headingStyle = {
    fontSize: 16,
    fontWeight: 'bold' as TextStyle['fontWeight'],
    color: isDarkMode ? '#fff' : '#111827',
    marginBottom: 8,
  };
  const textStyle = { color: isDarkMode ? '#ccc' : '#374151' };

  return (
  
        <>
      <ScrollView style={{ padding: 16, backgroundColor: isDarkMode ? '#111827' : '#f0f4ff' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: isDarkMode ? '#ccc' : '#1f2937' }}>Reports</Text>

        <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 8, marginBottom: 16, borderColor: isDarkMode ? '#374151' : '#d1d5db' }}>
          {(['month', 'quarter', 'year', 'custom'] as Array<keyof typeof dataByPeriod>).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => handlePeriodChange(p)}
              style={{ flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: period === p ? '#2563eb' : isDarkMode ? '#1f2937' : '#fff' }}
            >
              <Text style={{ color: period === p ? '#fff' : isDarkMode ? '#ccc' : '#374151' }}>{p.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mileage Summary */}
        <View style={cardStyle}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Car size={30} stroke={`${isDarkMode ? '#fff' :'#2563eb'}`} style={{ marginRight: 8 }} />
              <Text style={headingStyle}>Mileage Summary</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Download size={20} stroke={`${isDarkMode ? '#fff' :'#2563eb'}`} style={{ marginRight: 4 }} />
              <Text style={{ color: `${isDarkMode? '#fff' : '#2563eb' }` }}>Export</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View>
              <Text style={textStyle}>Total Miles</Text>
              <Text style={[textStyle, { fontSize: 20, fontWeight: 'bold' }]}>{summary.totalMiles}</Text>
            </View>
            <View>
              <Text style={textStyle}>Business Miles</Text>
              <Text style={[textStyle, { fontSize: 20, fontWeight: 'bold' }]}>{summary.businessMiles}</Text>
              <Text style={textStyle}>({((summary.businessMiles / (summary.totalMiles || 1)) * 100).toFixed(1)}%)</Text>
            </View>
          </View>
          <View>
            <Text style={textStyle}>Standard Mileage Deduction</Text>
            <Text style={[textStyle, { fontWeight: 'bold' }]}>${summary.mileageDeduction.toFixed(2)}</Text>
            <View style={{ height: 8, width: '100%', backgroundColor: '#d1d5db', borderRadius: 8, overflow: 'hidden', marginTop: 4 }}>
              <View style={{ height: 8, backgroundColor: '#2563eb', width: `${(summary.businessMiles / (summary.totalMiles || 1)) * 100}%` }} />
            </View>
          </View>
        </View>

        {/* Monthly Mileage Chart */}
        {summary.monthlyMiles.length > 0 && (
  <View style={cardStyle}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
      <Text style={headingStyle}>Monthly Mileage</Text>
      <Calendar size={20} stroke="#2563eb" />
    </View>
    <View style={{ marginBottom: 8 }}>
      {summary.monthlyMiles.map((item) => {
        const max = Math.max(...summary.monthlyMiles.map((m) => m.miles))+2000;
        return (
          <View key={item.month} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={textStyle}>{item.month}</Text>
              <Text style={textStyle}>{item.miles} mi</Text>
            </View>
            <View style={{ height: 8, width: '100%', backgroundColor: '#d1d5db', borderRadius: 8 }}>
              <View
                style={{
                  width: `${(item.miles / max) * 100}%`,
                  height: 8,
                  backgroundColor: '#2563eb',
                  borderRadius: 8,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  </View>
)}

        {/* Category Breakdown */}
        {summary.byCategory.length > 0 && (
          <View style={cardStyle}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={headingStyle}>Category Breakdown</Text>
              <PieChart size={20} stroke="#2563eb" />
            </View>
            {summary.byCategory.map((cat) => (
              <View key={cat.category} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={textStyle}>{cat.category}</Text>
                  <Text style={textStyle}>${cat.amount.toFixed(2)} ({cat.percentage}%)</Text>
                </View>
                <View style={{ height: 8, backgroundColor: '#d1d5db', borderRadius: 8, overflow: 'hidden' }}>
                  <View style={{ height: 8, backgroundColor: '#2563eb', width: `${cat.percentage}%` }} />
                </View>
              </View>
            ))}
          </View>
        )}

{/* Updated Fuel Efficiency Section */}
{summary.fuelMetrics.monthlyGallons.length > 0 && (
  <View style={cardStyle}>
    <Text style={headingStyle}>Fuel Efficiency</Text>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
      <View>
        <Text style={textStyle}>Average MPG</Text>
        <Text style={[textStyle, { fontSize: 20, fontWeight: 'bold' }]}>{summary.fuelMetrics.avgMPG}</Text>
      </View>
      <View>
        <Text style={textStyle}>Avg. Price/Gallon</Text>
        <Text style={[textStyle, { fontSize: 20, fontWeight: 'bold' }]}>${summary.fuelMetrics.avgPricePerGallon.toFixed(2)}</Text>
      </View>
    </View>
    <Text style={[textStyle, { marginBottom: 8 }]}>Monthly Fuel Consumption</Text>
    <View>
      {summary.fuelMetrics.monthlyGallons.map((item) => {
        const max = Math.max(...summary.fuelMetrics.monthlyGallons.map((m) => m.gallons)) + 500;
        return (
          <View key={item.month} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={textStyle}>{item.month}</Text>
              <Text style={textStyle}>{item.gallons.toFixed(0)} gal</Text>
            </View>
            <View style={{ height: 8, backgroundColor: '#d1d5db', borderRadius: 8 }}>
              <View
                style={{
                  width: `${(item.gallons / max) * 100}%`,
                  height: 8,
                  backgroundColor: '#2563eb',
                  borderRadius: 8,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  </View>)}
      </ScrollView>

      {/* Custom Date Picker Modal */}
      <Modal visible={customModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, width: 300 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Select Custom Date Range</Text>

            <TouchableOpacity onPress={() => { setIsStartDate(true); setDatePickerOpen(true); }}>
              <Text style={{ color: '#2563eb', marginBottom: 8 }}>Start: {startDate.toDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setIsStartDate(false); setDatePickerOpen(true); }}>
              <Text style={{ color: '#2563eb', marginBottom: 16 }}>End: {endDate.toDateString()}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => setCustomModalVisible(false)}>
                <Text style={{ color: '#ef4444' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCustomModalVisible(false)}>
                <Text style={{ color: '#10b981' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <DatePicker
        modal
        open={datePickerOpen}
        date={isStartDate ? startDate : endDate}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpen(false);
          isStartDate ? setStartDate(date) : setEndDate(date);
        }}
        onCancel={() => setDatePickerOpen(false)}
      />
    </>
  
  );
};

export default Reports;
