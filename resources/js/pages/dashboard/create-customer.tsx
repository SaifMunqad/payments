import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Page } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { AppShell } from '@/components/app-shell';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Errors } from '@/components/ui/form';

interface Props {
    // No props needed for this page
}

const CreateCustomer: Page<Props> = () => {
    const { auth } = usePage().props;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        // In a real app, this would be an API call to the backend
        // For now, we'll just simulate a successful submission
        console.log('Form submitted:', formData);
        
        // Simulate API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
            });
            // Show success message
            alert('Customer created successfully');
        }, 1500);
    };

    return (
        <AppShell>
            <AppHeader title="Create Customer" />
            <AppContent>
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form onSubmit={handleSubmit} errors={errors}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Customer name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="customer@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="123 Main St, City"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button type="button" variant="outline" asChild>
                                            <Link href="/customers">Cancel</Link>
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Creating...' : 'Create Customer'}
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </AppContent>
        </AppShell>
    );
};

CreateCustomer.layout = page => <AppLayout children={page} />;

export default CreateCustomer;