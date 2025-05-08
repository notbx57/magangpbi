import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';

type GymClass = {
    id: number;
    name: string;
    description: string;
    instructor_name: string;
    start_time: string;
    end_time: string;
    day_of_week: string;
    capacity: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

type PageProps = {
    class: GymClass;
    isBooked: boolean;
    bookingsCount: number;
    availableSpots: number;
    userRole: string;
}

export default function GymClassShow() {
    const { class: gymClass, isBooked, bookingsCount, availableSpots, userRole } = usePage<PageProps>().props;
    const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gym Classes',
            href: route('gym-classes.index'),
        },
        {
            title: gymClass.name,
            href: route('gym-classes.show', gymClass.id),
        },
    ];

    const handleBookClass = () => {
        if (confirm('Would you like to book this class?')) {
            router.post(route('gym-classes.book', gymClass.id));
        }
    };

    const handleCancelBooking = () => {
        if (confirm('Are you sure you want to cancel your booking for this class?')) {
            router.delete(route('gym-classes.cancel', gymClass.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={gymClass.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-2xl font-semibold">{gymClass.name}</h3>
                        <div className="flex space-x-2">
                            {isStaffOrAdmin ? (
                                <>
                                    <a
                                        href={route('gym-classes.edit', gymClass.id)}
                                        className="rounded-md bg-red-800 px-4 py-2 text-sm font-medium text-white"
                                    >
                                        Edit
                                    </a>
                                    <a
                                        href={route('gym-classes.index')}
                                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
                                    >
                                        Back to List
                                    </a>
                                </>
                            ) : (
                                <>
                                    {isBooked ? (
                                        <button
                                            onClick={handleCancelBooking}
                                            className="rounded-md bg-red-100 text-red-800 px-4 py-2 text-sm font-medium"
                                        >
                                            Cancel Booking
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleBookClass}
                                            className="rounded-md bg-red-800 px-4 py-2 text-sm font-medium text-white"
                                            disabled={availableSpots <= 0}
                                        >
                                            {availableSpots > 0 ? 'Book Class' : 'Class Full'}
                                        </button>
                                    )}
                                    <a
                                        href={route('gym-classes.index')}
                                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
                                    >
                                        Back to List
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500">Instructor</h4>
                                <p className="text-lg">{gymClass.instructor_name}</p>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500">Day of Week</h4>
                                <p className="text-lg">{gymClass.day_of_week}</p>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500">Time</h4>
                                <p className="text-lg">{gymClass.start_time} - {gymClass.end_time}</p>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500">Capacity</h4>
                                <p className="text-lg">{bookingsCount} / {gymClass.capacity} booked</p>
                                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-800"
                                        style={{ width: `${(bookingsCount / gymClass.capacity) * 100}%` }}
                                    ></div>
                                </div>
                                {isBooked && (
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                        You are booked for this class
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${gymClass.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {gymClass.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                                <p className="text-lg">{new Date(gymClass.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {gymClass.description && (
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="whitespace-pre-line">{gymClass.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 