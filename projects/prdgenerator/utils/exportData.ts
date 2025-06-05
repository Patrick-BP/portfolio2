import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { storage } from './storage';

export const exportData = {
  async exportToCSV() {
    try {
      const expenses = await storage.getExpenses();
      const vehicles = await storage.getVehicles();

      // Create CSV content
      let csvContent = 'Date,Category,Amount,Vehicle,Description,Odometer\n';
      
      expenses.forEach(expense => {
        const vehicle = vehicles.find(v => v.id === expense.vehicleId);
        const row = [
          new Date(expense.date).toLocaleDateString(),
          expense.category,
          expense.amount,
          vehicle?.name || 'Unknown Vehicle',
          expense.description,
          expense.odometer || ''
        ].join(',');
        csvContent += row + '\n';
      });

      // Generate file path
      const fileName = `expense_report_${new Date().toISOString().split('T')[0]}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Write file
      await FileSystem.writeAsStringAsync(filePath, csvContent);

      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      }

      return true;
    } catch (error) {
      console.error('Export error:', error);
      return false;
    }
  },

  async exportToPDF() {
    try {
      const expenses = await storage.getExpenses();
      const vehicles = await storage.getVehicles();
      
      // We'll need to install react-native-html-to-pdf
      const html = `
        <html>
          <body>
            <h1>Expense Report</h1>
            <table>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Odometer</th>
              </tr>
              ${expenses.map(expense => {
                const vehicle = vehicles.find(v => v.id === expense.vehicleId);
                return `
                  <tr>
                    <td>${new Date(expense.date).toLocaleDateString()}</td>
                    <td>${expense.category}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>${vehicle?.name || 'Unknown Vehicle'}</td>
                    <td>${expense.description}</td>
                    <td>${expense.odometer || ''}</td>
                  </tr>
                `;
              }).join('')}
            </table>
          </body>
        </html>
      `;
  
      const fileName = `expense_report_${new Date().toISOString().split('T')[0]}.pdf`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      // Create PDF from HTML
      const options = {
        html,
        fileName,
        directory: 'Documents',
      };
      
      const file = await RNHTMLtoPDF.convert(options);
      
      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.filePath);
      }
  
      return true;
    } catch (error) {
      console.error('PDF export error:', error);
      return false;
    }
  }
};