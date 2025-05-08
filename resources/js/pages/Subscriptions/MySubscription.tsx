import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Subscription',
        href: '/my-subscription',
    },
];

type MembershipPlan = {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_days: number;
}

type Subscription = {
    id: number;
    membership_plan: MembershipPlan;
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled';
    created_at: string;
}

type PageProps = {
    currentSubscription: Subscription | null;
    subscriptionHistory: Subscription[];
    availablePlans: MembershipPlan[];
}

export default function MySubscription() {
    const { currentSubscription, subscriptionHistory, availablePlans } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Subscription" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">My Subscription</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your gym membership</p>
                </div>

                {/* Current Subscription */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm mb-6">
                    <h2 className="text-xl font-semibold mb-4">Current Membership</h2>

                    {currentSubscription ? (
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-red-800">{currentSubscription.membership_plan.name}</div>
                                    <div className="mt-2 text-gray-600 dark:text-gray-400">
                                        <p>{currentSubscription.membership_plan.description}</p>
                                        <p className="mt-1">
                                            Valid until: <span className="font-medium">{new Date(currentSubscription.end_date).toLocaleDateString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <div className="text-3xl font-bold">${currentSubscription.membership_plan.price}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">per month</div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Link
                                    href={route('payments.create')}
                                    className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    Renew Membership
                                </Link>
                                <Link
                                    href="/cancel-subscription"
                                    method="post"
                                    as="button"
                                    className="border border-red-800 text-red-800 font-bold py-2 px-4 rounded hover:bg-red-800 hover:text-white"
                                >
                                    Cancel Membership
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have an active membership</p>
                            <Link
                                href={route('payments.create')}
                                className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Sign Up for a Membership
                            </Link>
                        </div>
                    )}
                </div>

                {/* Available Plans */}
                {(!currentSubscription || currentSubscription.status !== 'active') && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm mb-6">
                        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availablePlans.map((plan) => (
                                <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="text-xl font-bold">{plan.name}</div>
                                    <div className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="text-2xl font-bold text-red-800">${plan.price}</div>
                                        <Link
                                            href={`/payments/create?plan=${plan.id}`}
                                            className="bg-red-800 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                        >
                                            Select
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subscription History */}
                {subscriptionHistory && subscriptionHistory.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Subscription History</h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
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
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {subscriptionHistory.map((subscription) => (
                                        <tr key={subscription.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
