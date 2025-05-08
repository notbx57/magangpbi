import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, User, Calendar, MapPin, Phone, Mail } from 'lucide-react';

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
        title: 'Member Details',
        href: '#',
    },
];

type Subscription = {
    id: number;
    membership_plan: {
        name: string;
        price: number;
    };
    start_date: string;
    end_date: string;
    status: 'active' | 'expired' | 'cancelled';
    created_at: string;
}

type Payment = {
    id: number;
    amount: number;
    payment_method: string;
    status: string;
    created_at: string;
}

type Attendance = {
    id: number;
    check_in: string;
    check_out: string | null;
}

type Member = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    created_at: string;
    subscriptions: Subscription[];
    payments: Payment[];
    attendances: Attendance[];
}

type PageProps = {
    member: Member;
}

export default function MemberDetails({ member }: PageProps) {
    const activeSubscription = member.subscriptions.find(sub => sub.status === 'active');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Member: ${member.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center mb-4">
                    <Link href="/members" className="mr-4">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Member Details</h1>
                    <div className="ml-auto">
                        <Link href={`/members/${member.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Member
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Member Info Card */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Member Information</CardTitle>
                            <CardDescription>Personal details and contact information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-red-800">
                                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <User className="h-5 w-5 mr-2 text-gray-500" />
                                    <span className="font-medium">{member.name}</span>
                                </div>

                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2 text-gray-500" />
                                    <span>{member.email}</span>
                                </div>

                                {member.phone && (
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 mr-2 text-gray-500" />
                                        <span>{member.phone}</span>
                                    </div>
                                )}

                                {member.address && (
                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                                        <span>{member.address}</span>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                                    <span>Joined: {new Date(member.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Membership Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Membership Status</CardTitle>
                            <CardDescription>Current subscription and membership details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {activeSubscription ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div>
                                            <h3 className="font-medium">{activeSubscription.membership_plan.name}</h3>
                                            <p className="text-sm text-gray-500">${activeSubscription.membership_plan.price}/month</p>
                                        </div>
                                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Start Date</p>
                                            <p className="font-medium">{new Date(activeSubscription.start_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">End Date</p>
                                            <p className="font-medium">{new Date(activeSubscription.end_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
                                    <p>No active membership. Consider adding a subscription for this member.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Attendance */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Attendance</CardTitle>
                            <CardDescription>Last 10 gym visits</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {member.attendances && member.attendances.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Check In
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Check Out
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Duration
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                            {member.attendances.map((attendance) => {
                                                const checkIn = new Date(attendance.check_in);
                                                const checkOut = attendance.check_out ? new Date(attendance.check_out) : null;

                                                // Calculate duration if check out exists
                                                let duration = '';
                                                if (checkOut) {
                                                    const diff = checkOut.getTime() - checkIn.getTime();
                                                    const minutes = Math.floor(diff / 60000);
                                                    const hours = Math.floor(minutes / 60);
                                                    const mins = minutes % 60;
                                                    duration = `${hours}h ${mins}m`;
                                                }

                                                return (
                                                    <tr key={attendance.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {checkIn.toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {checkIn.toLocaleTimeString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {checkOut ? checkOut.toLocaleTimeString() : 'Not checked out'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {duration || 'N/A'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No attendance records found</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
