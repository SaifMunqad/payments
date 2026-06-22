import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customers, payments } from '@/routes';
import Customers from '@/pages/dashboard/customers';

function Payments() {
    return (
        <div className="p-4">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Payments dashboard is coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Payments.layout = page => <AppLayout children={page} />;

Payments.layout = {
    breadcrumbs: [
        {
            title: 'Payments',
            href: payments(),
        },
    ],
};
export default Payments;

