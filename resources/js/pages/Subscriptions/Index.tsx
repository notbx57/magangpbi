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
];

type User = {
    id: number;
    name: string;
}

type MembershipPlan = {
    id: number;
    name: string;
    price: number;
}

type Subscription = {
    id: number;
    user: User;
    membership_plan: MembershipPlan;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled';
    created_at: string;
}

type PageProps = {
    subscriptions: {
        data: Subscription[];
        current_page: number;
        last_page: number;
    };
}

export default function SubscriptionIndex() {
    const { subscriptions } = usePage<PageProps>().props;
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStatusChange = async (subscriptionId: number, newStatus: 'active' | 'expired' | 'cancelled') => {
        setIsUpdating(subscriptionId);
        setError(null);

        try {
            await axios.put(`/api/subscriptions/${subscriptionId}`, {
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
            setIsUpdating(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Subscription Management</h1>
                    <Link
                        href={route('subscriptions.create')}
                        className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700 transition-colors"
                    >
                        New Subscription
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto rounded-xl border shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {subscriptions.data.length > 0 ? (
                                subscriptions.data.map((subscription) => (
                                    <tr key={subscription.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {subscription.user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {subscription.membership_plan.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {new Date(subscription.start_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {new Date(subscription.end_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                                                subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <Link
                                                    href={route('subscriptions.show', subscription.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('subscriptions.edit', subscription.id)}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                >
                                                    Edit
                                                </Link>
                                                <div className="flex space-x-2">
                                                    {subscription.status !== 'active' && (
                                                        <button
                                                            onClick={() => handleStatusChange(subscription.id, 'active')}
                                                            disabled={isUpdating === subscription.id}
                                                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                        >
                                                            {isUpdating === subscription.id ? 'Processing...' : 'Activate'}
                                                        </button>
                                                    )}
                                                    {subscription.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => handleStatusChange(subscription.id, 'cancelled')}
                                                            disabled={isUpdating === subscription.id}
                                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                        >
                                                            {isUpdating === subscription.id ? 'Processing...' : 'Cancel'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No subscriptions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {subscriptions.last_page > 1 && (
                    <div className="flex justify-center mt-4">
                        <nav className="flex items-center space-x-2">
                            {Array.from({ length: subscriptions.last_page }, (_, i) => i + 1).map(page => (
                                <Link
                                    key={page}
                                    href={`/subscriptions?page=${page}`}
                                    className={`px-3 py-1 rounded ${
                                        page === subscriptions.current_page
                                            ? 'bg-red-800 text-white'
                                            : 'bg-white dark:bg-gray-800 border hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
