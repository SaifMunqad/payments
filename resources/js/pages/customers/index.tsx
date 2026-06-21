import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Props {
    // Add any props that need to be passed from the server here
}

export default function Customers({ }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Customers</h1>
                <Button asChild>
                    <Link href={route('customers.create')}>Add New Customer</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer List</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Customer list will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}