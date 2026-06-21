import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AppShell } from '@/components/app-shell';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { customers, dashboard } from '@/routes';
import Dashboard from '@/pages/dashboard';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    created_at: string;
}

interface Props {
    customers: Customer[];
}

export default function Customers({ customers = [] }: Props) {
    return (
        <>
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-2xl font-bold">Customers</h1>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href={'/customers/create'}>Add Customer</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={'/customers/import'}>Import Customers</Link>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customer List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {customers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">Email</th>
                                                <th className="px-3 py-2">Phone</th>
                                                <th className="px-3 py-2">Address</th>
                                                <th className="px-3 py-2">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.map(customer => (
                                                <tr key={customer.id} className="border-b last:border-b-0">
                                                    <td className="px-3 py-2">{customer.name}</td>
                                                    <td className="px-3 py-2">{customer.email}</td>
                                                    <td className="px-3 py-2">{customer.phone ?? '—'}</td>
                                                    <td className="px-3 py-2">{customer.address ?? '—'}</td>
                                                    <td className="px-3 py-2">{new Date(customer.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No customers found.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

        </>
    );
}

Customers.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: customers(),
        },
    ],
};
//Customers.layout = page => <AppLayout children={page} />;
