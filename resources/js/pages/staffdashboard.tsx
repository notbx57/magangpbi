import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff Dashboard',
        href: '/dashboard',
    },
];

type Stats = {
    userCount: number;
    activeSubscriptions: number;
    todayAttendance: number;
}

type User = {
    role: string;
}

type PageProps = {
    stats: Stats;
    auth: {
        user: User;
    };
}

export default function StaffDashboard() {
    const props = usePage<PageProps>().props;
    const { stats } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Stats Overview for Staff */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Members</h3>
                        <p className="text-3xl font-bold text-red-800">{stats.userCount}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Active Subscriptions</h3>
                        <p className="text-3xl font-bold text-red-800">{stats.activeSubscriptions}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Today's Attendance</h3>
                        <p className="text-3xl font-bold text-red-800">{stats.todayAttendance}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">Recent Check-ins</h3>
                        <div className="mt-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="font-medium text-red-800">JD</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">John Doe</p>
                                            <p className="text-sm text-muted-foreground">Premium Member</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">08:30 AM</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="font-medium text-red-800">AS</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">Alice Smith</p>
                                            <p className="text-sm text-muted-foreground">Basic Member</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">09:15 AM</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="font-medium text-red-800">RB</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">Robert Brown</p>
                                            <p className="text-sm text-muted-foreground">GymBro Member</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">10:05 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 