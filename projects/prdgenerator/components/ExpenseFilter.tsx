import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  startDate: Date | null;
  endDate: Date | null;
  category: string | null;
  vehicleId: string | null;
}

export default function ExpenseFilter({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: null,
    endDate: null,
    category: null,
    vehicleId: null,
  });

  const categories = ['Fuel', 'Maintenance', 'Tolls', 'Insurance', 'Other'];

  const handleCategorySelect = (category: string) => {
    const newFilters = {
      ...filters,
      category: filters.category === category ? null : category,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Expenses</Text>
      
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              filters.category === category && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                styles.categoryText,
                filters.category === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  categoryButtonActive: {
    backgroundColor: '#2563eb',
  },
  categoryText: {
    color: '#1f2937',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
});