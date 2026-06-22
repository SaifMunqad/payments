import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/components/modal/modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { packages } from '@/routes';

interface CustomerItem {
    id: number;
    name?: string | null;
    email?: string | null;
}

interface PackageItem {
    id: number;
    name?: string | null;
    price?: number | null;
}

interface CustomerPackageItem {
    id: number;
    package_price?: number | null;
    currency?: string | null;
    status?: string | null;
    deleted_at?: string | null;
    customer?: CustomerItem | null;
    package?: PackageItem | null;
}

interface Props {
    customerPackages?: CustomerPackageItem[];
}

function Packages({ customerPackages = [] }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        price: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name, e.target.value);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();

        post('/packages', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        reset();
    };

    // Render page
    return (
        <div className="p-4">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Packages</h1>
                    <div>
                        <Button onClick={() => setShowCreateModal(true)}>
                            Add Package
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Packages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {customerPackages.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-3 py-2">
                                                Customer
                                            </th>
                                            <th className="px-3 py-2">
                                                Package
                                            </th>
                                            <th className="px-3 py-2">Price</th>
                                            <th className="px-3 py-2">
                                                Currency
                                            </th>
                                            <th className="px-3 py-2">
                                                Status
                                            </th>
                                            <th className="px-3 py-2">
                                                Deleted
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerPackages.map((item) => {
                                            const isDeleted = !!item.deleted_at;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className={`border-b last:border-b-0 ${isDeleted ? 'text-red-600' : ''}`}
                                                >
                                                    <td className="px-3 py-2">
                                                        {item.customer?.name ??
                                                            '—'}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.package?.name ??
                                                            '—'}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.package_price ??
                                                            item.package
                                                                ?.price ??
                                                            '—'}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.currency ?? '—'}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.status ?? '—'}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {isDeleted
                                                            ? new Date(
                                                                  item.deleted_at as string,
                                                              ).toLocaleString()
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No package assignments found.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Modal
                visible={showCreateModal}
                onClose={handleCloseModal}
                size="md"
            >
                <div className="mx-auto max-w-2xl">
                    <div>
                        <h2 className="mb-4 text-xl font-semibold">
                            Create New Package
                        </h2>
                        <form className="space-y-4" onSubmit={submitCreate}>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder="Package name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={data.price}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Package'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

Packages.layout = (page: any) => <AppLayout children={page} />;

(Packages as any).layout = {
    breadcrumbs: [
        {
            title: 'Packages',
            href: packages(),
        },
    ],
};

export default Packages;
