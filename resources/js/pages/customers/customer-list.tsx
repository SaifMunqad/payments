import { useState } from 'react';
import Modal from '@/components/modal/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


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

function Customers({ customers = [] }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // Create customer form state
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to create customer');
            }

            // Close modal and reload to show the new customer
            setShowCreateModal(false);
            window.location.reload();
        } catch (err) {
            // TODO: show error to user
            console.error(err);
            setIsSubmitting(false);
        }
    };

    // Import customers state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const submitImport = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            return;
        }

        setIsUploading(true);

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const fd = new FormData();
            fd.append('file', selectedFile as Blob);

            const res = await fetch('/customers/import', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                },
                body: fd,
            });

            if (!res.ok) {
                throw new Error('Import failed');
            }

            setShowImportModal(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            setIsUploading(false);
        }
    };

    return (
        <div className={'p-4'}>
            <>
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-2xl font-bold">Customers</h1>
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={() => setShowCreateModal(true)}>
                                Add Customer
                            </Button>
                            <Button variant="outline" onClick={() => setShowImportModal(true)}>
                                Import Customers
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
                                            {customers.map((customer) => (
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

            {/* Create Customer Modal */}
            <Modal visible={showCreateModal} onClose={() => setShowCreateModal(false)} size="md">
                <div className="mx-auto max-w-2xl">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Create New Customer</h2>
                        <form className="space-y-4" onSubmit={submitCreate}>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Customer name" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="customer@example.com" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(123) 456-7890" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City" />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Customer'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>

            {/* Import Customers Modal */}
            <Modal visible={showImportModal} onClose={() => setShowImportModal(false)} size="xl">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Import Customers</h2>
                    <form onSubmit={submitImport} className="space-y-6">
                        <div>
                            <Label htmlFor="file">File Upload</Label>
                            <input id="file" name="file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="block mt-2" />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setShowImportModal(false)}>Cancel</Button>
                            <Button type="submit" disabled={!selectedFile || isUploading}>{isUploading ? 'Importing...' : 'Import Customers'}</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

//Customers.layout = (page) => <AppLayout children={page} />;
Customers.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: '/customers',
        },
    ],
};
export default Customers;
