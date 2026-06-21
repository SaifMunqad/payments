import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Page } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { AppShell } from '@/components/app-shell';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomerTable } from '@/components/customer-table';
import { Customer } from '@/types';

interface Props {
    customers: Customer[];
}

const Customers: Page<Props> = ({ customers }) => {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState(customers);

    useEffect(() => {
        const filtered = customers.filter(customer => 
            Object.values(customer).some(
                value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredCustomers(filtered);
    }, [searchTerm, customers]);

    const handleExport = () => {
        // Implement export functionality
        console.log('Exporting customers');
        
        // In a real application, this would be an API call to export the data
        // For now, we'll just log the data
        console.log(customers);
        
        // Create a CSV string
        let csv = 'Name,Email,Phone,Address,Created At\n';
        customers.forEach(customer => {
            csv += `${customer.name},${customer.email},${customer.phone || ''},${customer.address || ''},${new Date(customer.created_at).toLocaleDateString()}\n`;
        });
        
        // Create a download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customers.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <AppShell>
            <AppHeader title="Customers" />
            <AppContent>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Customers</h1>
                        {auth.user.roles.includes('admin') && (
                            <div className="space-x-2">
                                <Button asChild>
                                    <Link href="/customers/create">Add Customer</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/customers/import">Import Customers</Link>
                                </Button>
                                <Button onClick={handleExport}>
                                    Export
                                </Button>
                            </div>
                        )}
                    </div>

                    <Card>
                        <CardContent>
                            <CustomerTable
                                data={customers}
                                onColumnVisibilityChange={columnVisibility => {
                                    // Handle column visibility changes
                                    console.log('Column visibility changed:', columnVisibility);
                                }}
                                state={{
                                    pagination: {
                                        pageIndex: 0,
                                        pageSize: 10,
                                    },
                                }}
                                getCoreRowModel={getCoreRowModel()}
                                getFilteredRowModel={getFilteredRowModel()}
                                getSortedRowModel={getSortedRowModel()}
                                getPaginationRowModel={getPaginationRowModel()}
                                debugTable={true}
                            >
                                <TableHead>
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : (
                                                        <div
                                                            className={header.column.getCanSort()
                                                                ? 'cursor-pointer select-none pl-2 inline-flex items-center'
                                                                : ''
                                                            }
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                            {{
                                                                asc: <ArrowUpDown className="h-4 w-4 rotate-180" />,
                                                                desc: <ArrowUpDown className="h-4 w-4" />,
                                                                none: <ArrowUpDown className="h-4 w-4 opacity-30" />
                                                            }[header.column.getIsSorted() as string])}
                                                        </div>
                                                    )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map(row => (
                                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={table.getVisibleColumns().length} className="h-24 text-center">
                                                No customers found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </AppContent>
        </AppShell>
    );
};

Customers.layout = page => <AppLayout children={page} />;

export default Customers;