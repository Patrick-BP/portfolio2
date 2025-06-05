import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

const DataTableDemo = () => {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Generate mock data
        const mockData = Array.from({ length: 100000 }, (_, index) => ({
            id: index + 1,
            name: `User ${index + 1}`,
            email: `user${index + 1}@example.com`,
            age: Math.floor(Math.random() * 50) + 18,
            salary: Math.floor(Math.random() * 100000) + 30000,
            department: ['HR', 'IT', 'Finance', 'Marketing', 'Sales'][Math.floor(Math.random() * 5)]
        }));
        
        setData(mockData);
        setLoading(false);
    }, []);

    const header = (
        <div className="table-header">
            <h2>Employee Records</h2>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    return (
        <div>
            <DataTable
                value={data}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                dataKey="id"
                filters={{ global: { value: globalFilter, matchMode: 'contains' } }}
                loading={loading}
                globalFilterFields={['name', 'email', 'department']}
                header={header}
                emptyMessage="No records found."
                className="p-datatable-striped"
                sortMode="multiple"
                removableSort
            >
                <Column field="id" header="ID" sortable />
                <Column field="name" header="Name" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="age" header="Age" sortable />
                <Column field="salary" header="Salary" sortable body={(rowData) => `$${rowData.salary.toLocaleString()}`} />
                <Column field="department" header="Department" sortable />
            </DataTable>

            
        </div>
    );
};

export default DataTableDemo;