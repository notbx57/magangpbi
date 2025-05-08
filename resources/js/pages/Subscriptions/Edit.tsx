import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Subscriptions',
        href: '/subscriptions',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

type User = {
    id: number;
    name: string;
}

type MembershipPlan = {
    id: number;
    name: string;
    price: number;
    duration_days: number;
}

type Subscription = {
    id: number;
    user_id: number;
    membership_plan_id: number;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled';
}

type PageProps = {
    subscription: Subscription;
    members: User[];
    plans: MembershipPlan[];
}

export default function EditSubscription() {
    const { subscription, members, plans } = usePage<PageProps>().props;
    const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        user_id: subscription.user_id.toString(),
        membership_plan_id: subscription.membership_plan_id.toString(),
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        status: subscription.status,
    });

    useEffect(() => {
        // Set initial selected plan
        const initialPlan = plans.find(p => p.id === subscription.membership_plan_id);
        if (initialPlan) {
            setSelectedPlan(initialPlan);
        }
    }, [plans, subscription.membership_plan_id]);

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const planId = e.target.value;
        setData('membership_plan_id', planId);

        if (planId) {
            const plan = plans.find(p => p.id.toString() === planId);
            if (plan) {
                setSelectedPlan(plan);

                // Calculate end date based on plan duration
                const startDate = new Date(data.start_date);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + plan.duration_days);

                setData('end_date', endDate.toISOString().split('T')[0]);
            }
        } else {
            setSelectedPlan(null);
        }
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setData('start_date', newStartDate);

        if (selectedPlan && newStartDate) {
            // Recalculate end date based on new start date
            const startDate = new Date(newStartDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + selectedPlan.duration_days);

            setData('end_date', endDate.toISOString().split('T')[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('subscriptions.update', subscription.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Subscription" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit Subscription</h1>
                    <p className="text-gray-600 dark:text-gray-400">Update subscription details</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Member Selection */}
                            <div>
                                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Member
                                </label>
                                <select
                                    id="user_id"
                                    name="user_id"
                                    value={data.user_id}
                                    onChange={e => setData('user_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    required
                                >
                                    <option value="">Select a member</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && <div className="text-red-500 text-sm mt-1">{errors.user_id}</div>}
                            </div>

                            {/* Membership Plan */}
                            <div>
                                <label htmlFor="membership_plan_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Membership Plan
                                </label>
                                <select
                                    id="membership_plan_id"
                                    name="membership_plan_id"
                                    value={data.membership_plan_id}
                                    onChange={handlePlanChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    required
                                >
                                    <option value="">Select a plan</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name} - ${plan.price} ({plan.duration_days} days)
                                        </option>
                                    ))}
                                </select>
                                {errors.membership_plan_id && <div className="text-red-500 text-sm mt-1">{errors.membership_plan_id}</div>}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={handleStartDateChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    required
                                />
                                {errors.start_date && <div className="text-red-500 text-sm mt-1">{errors.start_date}</div>}
                            </div>

                            {/* End Date */}
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    required
                                />
                                {errors.end_date && <div className="text-red-500 text-sm mt-1">{errors.end_date}</div>}
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value as 'active' | 'expired' | 'cancelled')}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Subscription'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
