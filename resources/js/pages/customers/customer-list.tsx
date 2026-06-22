import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/components/modal/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Customer {
    id: number;
    username: string;
    customer_id: number;
    firstname: string;
    lastname: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    customers: Customer[];
}

function Customers({ customers = [] }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // Create customer form using Inertia useForm
    const createForm = useForm({
        username: '',
        customer_id: '',
        firstname: '',
        lastname: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        createForm.setData(e.target.name, e.target.value);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();

        createForm.post('/customers', {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        createForm.reset();
    };

    // Import form using Inertia useForm
    const importForm = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        importForm.setData('file', file);
    };

    const submitImport = (e: React.FormEvent) => {
        e.preventDefault();

        if (!importForm.data.file) {
            return;
        }

        importForm.post('/customers/import', {
            forceFormData: true,
            onSuccess: () => {
                setShowImportModal(false);
                importForm.reset();
            },
            onError: (errors) => {
                console.error('Import errors:', errors);
            },
        });
    };

    const handleCloseImportModal = () => {
        setShowImportModal(false);
        importForm.reset();
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
                            <Button
                                variant="outline"
                                onClick={() => setShowImportModal(true)}
                            >
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
                                            <th className="px-3 py-2">
                                                ID
                                            </th>
                                            <th className="px-3 py-2">
                                                Customer ID
                                            </th>
                                            <th className="px-3 py-2">
                                                Username
                                            </th>
                                            <th className="px-3 py-2">
                                                First Name
                                            </th>
                                            <th className="px-3 py-2">
                                                Last Name
                                            </th>
                                            <th className="px-3 py-2">
                                                Created
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {customers.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="px-3 py-2">
                                                    {customer.id}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {customer.customer_id}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {customer.username}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {customer.firstname}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {customer.lastname}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {new Date(
                                                        customer.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No customers found.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </>

            {/* Create Customer Modal */}
            <Modal
                visible={showCreateModal}
                onClose={handleCloseCreateModal}
                size="md"
            >
                <div className="mx-auto max-w-2xl">
                    <div>
                        <h2 className="mb-4 text-xl font-semibold">
                            Create New Customer
                        </h2>
                        <form className="space-y-4" onSubmit={submitCreate}>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={createForm.data.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    required
                                />
                                {createForm.errors.username && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.username}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customer_id">Customer ID</Label>
                                <Input
                                    id="customer_id"
                                    name="customer_id"
                                    type="number"
                                    value={createForm.data.customer_id}
                                    onChange={handleChange}
                                    placeholder="Enter customer ID"
                                    required
                                />
                                {createForm.errors.customer_id && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.customer_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="firstname">First Name</Label>
                                <Input
                                    id="firstname"
                                    name="firstname"
                                    value={createForm.data.firstname}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                    maxLength={50}
                                    required
                                />
                                {createForm.errors.firstname && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.firstname}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    value={createForm.data.lastname}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                    maxLength={50}
                                    required
                                />
                                {createForm.errors.lastname && (
                                    <p className="text-sm text-red-500">
                                        {createForm.errors.lastname}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseCreateModal}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createForm.processing}>
                                    {createForm.processing
                                        ? 'Creating...'
                                        : 'Create Customer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>

            {/* Import Customers Modal */}
            <Modal
                visible={showImportModal}
                onClose={handleCloseImportModal}
                size="xl"
            >
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-4 text-xl font-semibold">
                        Import Customers
                    </h2>
                    <form onSubmit={submitImport} className="space-y-6">
                        <div>
                            <Label htmlFor="file">File Upload</Label>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                className="mt-2 block"
                            />
                            {importForm.errors.file && (
                                <p className="text-sm text-red-500 mt-1">
                                    {importForm.errors.file}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseImportModal}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!importForm.data.file || importForm.processing}
                            >
                                {importForm.processing
                                    ? 'Importing...'
                                    : 'Import Customers'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

// Customers.layout = (page) => <AppLayout children={page} />;
Customers.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: '/customers',
        },
    ],
};

export default Customers;
