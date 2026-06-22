import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customers, packages } from '@/routes';
import Customers from '@/pages/dashboard/customers';

function Packages() {
    return (
        <div className="p-4">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Packages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Package management is coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Packages.layout = page => <AppLayout children={page} />;

Packages.layout = {
    breadcrumbs: [
        {
            title: 'Packages',
            href: packages(),
        },
    ],
};
export default Packages;

