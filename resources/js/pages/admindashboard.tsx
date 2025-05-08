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
];

type Stats = {
    userCount: number;
    activeSubscriptions: number;
    totalRevenue: number;
    todayAttendance: number;
}

type User = {
    role: string;
}

type Activity = {
    id: string;
    user_id: number;
    user_name: string;
    user_initials: string;
    description: string;
    action_type: 'payment' | 'subscription';
    created_at: string;
    time_ago: string;
}

type Subscription = {
    id: number;
    user_name: string;
    plan_name: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled';
    created_at: string;
}

type PageProps = {
    stats: Stats;
    auth: {
        user: User;
    };
    subscriptions: Subscription[];
    recentActivities: Activity[];
}

export default function AdminDashboard() {
    const props = usePage<PageProps>().props;
    const { stats, subscriptions, recentActivities } = props;
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStatusChange = async (subscriptionId: number, newStatus: 'active' | 'expired' | 'cancelled') => {
        setIsUpdating(subscriptionId);
        setError(null);

        try {
            await axios.put(`/api/subscriptions/${subscriptionId}`, {
                status: newStatus
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
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Members</h3>
                        <p className="text-3xl font-bold text-red-800">{stats.userCount}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Active Subscriptions</h3>
                        <p className="text-3xl font-bold text-red-800">{stats.activeSubscriptions}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Total Revenue</h3>
                        <p className="text-3xl font-bold text-red-800">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Today's Attendance</h3>
                        <p className="text-3xl font-bold text-red-800">{stats.todayAttendance}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Revenue Graph */}
                    <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">Revenue Overview</h3>
                        <div className="mt-4">
                            <div className="space-y-2">
                                <div className="h-40 w-full bg-gray-100 dark:bg-gray-700 rounded-md flex items-end p-2">
                                    <div className="h-[20%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[30%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[25%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[40%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[35%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[60%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[75%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[65%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[90%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                    <div className="h-[50%] w-[8%] bg-red-800 rounded-sm mx-1"></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Jan</span>
                                    <span>Feb</span>
                                    <span>Mar</span>
                                    <span>Apr</span>
                                    <span>May</span>
                                    <span>Jun</span>
                                    <span>Jul</span>
                                    <span>Aug</span>
                                    <span>Sep</span>
                                    <span>Oct</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Membership Breakdown */}
                    <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">Membership Breakdown</h3>
                        <div className="mt-4 flex flex-col gap-4">
                            <div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-sm">Basic</span>
                                    <span className="text-sm font-medium">35%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div className="h-2 w-[35%] rounded-full bg-red-800"></div>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-sm">Premium</span>
                                    <span className="text-sm font-medium">45%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div className="h-2 w-[45%] rounded-full bg-red-800"></div>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-sm">GymBro</span>
                                    <span className="text-sm font-medium">20%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div className="h-2 w-[20%] rounded-full bg-red-800"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Management */}
                <div className="rounded-xl border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Subscription Management</h3>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="overflow-x-auto">
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
                                        Created
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
                                {subscriptions && subscriptions.length > 0 ? (
                                    subscriptions.map((subscription) => (
                                        <tr key={subscription.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {subscription.user_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {subscription.plan_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(subscription.start_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(subscription.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(subscription.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                                                    {subscription.status !== 'expired' && (
                                                        <button
                                                            onClick={() => handleStatusChange(subscription.id, 'expired')}
                                                            disabled={isUpdating === subscription.id}
                                                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                                                        >
                                                            {isUpdating === subscription.id ? 'Processing...' : 'Mark Expired'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No subscriptions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Recent Activity */}
                    <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">Recent Activity</h3>
                        <div className="mt-4">
                            <div className="space-y-4">
                                {recentActivities && recentActivities.length > 0 ? (
                                    recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex gap-3">
                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                                <span className="font-medium text-red-800">{activity.user_initials}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{activity.description}</p>
                                                <p className="text-sm text-muted-foreground">{activity.time_ago}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500">
                                        No recent activities found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">Quick Actions</h3>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <Link href="/members/create" className="rounded-md border border-red-800 px-4 py-3 text-center font-medium text-red-800 hover:bg-red-800 hover:text-white transition-colors">
                                Add Member
                            </Link>
                            <Link href="/payments/create" className="rounded-md border border-red-800 px-4 py-3 text-center font-medium text-red-800 hover:bg-red-800 hover:text-white transition-colors">
                                Create Invoice
                            </Link>
                            <Link href="/users?role=staff" className="rounded-md border border-red-800 px-4 py-3 text-center font-medium text-red-800 hover:bg-red-800 hover:text-white transition-colors">
                                Manage Staff
                            </Link>
                            <Link href="/membership-plans" className="rounded-md border border-red-800 px-4 py-3 text-center font-medium text-red-800 hover:bg-red-800 hover:text-white transition-colors">
                                Edit Plans
                            </Link>
                            <Link href="/reports" className="rounded-md border border-red-800 px-4 py-3 text-center font-medium text-red-800 hover:bg-red-800 hover:text-white transition-colors col-span-2">
                                Generate Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
