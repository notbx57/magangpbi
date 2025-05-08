import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

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
        title: 'View Subscription',
        href: '#',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
}

type MembershipPlan = {
    id: number;
    name: string;
    price: number;
    duration_days: number;
}

type Payment = {
    id: number;
    amount: number;
    payment_method: string;
    status: string;
    created_at: string;
}

type Subscription = {
    id: number;
    user: User;
    membership_plan: MembershipPlan;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled';
    created_at: string;
    payments: Payment[];
}

type PageProps = {
    subscription: Subscription;
}

export default function ShowSubscription() {
    const { subscription } = usePage<PageProps>().props;
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleStatusChange = async (newStatus: 'active' | 'expired' | 'cancelled') => {
        setIsUpdating(true);
        setError(null);

        try {
            await axios.put(`/api/subscriptions/${subscription.id}`, {
                status: newStatus
            }, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });

            // Refresh the page to show updated data
            window.location.reload();
        } catch (err) {
            setError('Failed to update subscription status. Please try again.');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Subscription" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Subscription Details</h1>
                    <div className="flex space-x-2">
                        <Link
                            href={route('subscriptions.edit', subscription.id)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route('subscriptions.index')}
                            className="border border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Subscription Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Member</p>
                                    <p className="font-semibold">{subscription.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Email</p>
                                    <p className="font-semibold">{subscription.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Plan</p>
                                    <p className="font-semibold">{subscription.membership_plan.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Price</p>
                                    <p className="font-semibold">${subscription.membership_plan.price}/month</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Start Date</p>
                                    <p className="font-semibold">{new Date(subscription.start_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">End Date</p>
                                    <p className="font-semibold">{new Date(subscription.end_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Created</p>
                                    <p className="font-semibold">{new Date(subscription.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Status</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                                        subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-0 md:ml-4 flex flex-col">
                            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                            <div className="space-y-2">
                                {subscription.status !== 'active' && (
                                    <button
                                        onClick={() => handleStatusChange('active')}
                                        disabled={isUpdating}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {isUpdating ? 'Processing...' : 'Activate Subscription'}
                                    </button>
                                )}
                                {subscription.status !== 'cancelled' && (
                                    <button
                                        onClick={() => handleStatusChange('cancelled')}
                                        disabled={isUpdating}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {isUpdating ? 'Processing...' : 'Cancel Subscription'}
                                    </button>
                                )}
                                {subscription.status !== 'expired' && (
                                    <button
                                        onClick={() => handleStatusChange('expired')}
                                        disabled={isUpdating}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {isUpdating ? 'Processing...' : 'Mark as Expired'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                {subscription.payments && subscription.payments.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Payment History</h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Payment Method
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {subscription.payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                #{payment.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                ${payment.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {payment.payment_method}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
