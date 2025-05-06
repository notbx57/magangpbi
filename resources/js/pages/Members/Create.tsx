import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Members',
        href: '/members',
    },
    {
        title: 'Add Member',
        href: '/members/create',
    },
];

type MembershipPlan = {
    id: number;
    name: string;
    price: number;
    duration_months: number;
    description: string;
    is_active: boolean;
}

type PageProps = {
    membershipPlans: MembershipPlan[];
}

export default function CreateMember({ membershipPlans }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        membership_plan_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('members.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Member" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center mb-4">
                    <Link href="/dashboard" className="mr-4">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Add New Member</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Member Information</CardTitle>
                        <CardDescription>Enter the details of the new member</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    />
                                    {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="membership_plan_id">Membership Plan</Label>
                                    <select
                                        id="membership_plan_id"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={data.membership_plan_id}
                                        onChange={e => setData('membership_plan_id', e.target.value)}
                                    >
                                        <option value="">Select a plan (optional)</option>
                                        {membershipPlans.map((plan) => (
                                            <option key={plan.id} value={plan.id}>
                                                {plan.name} - ${plan.price}/month ({plan.duration_months} months)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.membership_plan_id && <p className="text-sm text-red-600 mt-1">{errors.membership_plan_id}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Link href="/dashboard">
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="bg-red-800 hover:bg-red-700">
                                    {processing ? 'Creating...' : 'Create Member'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
