import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';

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
}

type PageProps = {
    class: GymClass;
    auth: {
        user: {
            role: string;
        };
    };
}

export default function GymClassEdit() {
    const { class: gymClass } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Gym Classes',
            href: route('gym-classes.index'),
        },
        {
            title: 'Edit Class',
            href: route('gym-classes.edit', gymClass.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: gymClass.name,
        description: gymClass.description || '',
        instructor_name: gymClass.instructor_name,
        start_time: gymClass.start_time,
        end_time: gymClass.end_time,
        day_of_week: gymClass.day_of_week,
        capacity: gymClass.capacity,
        is_active: gymClass.is_active
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('gym-classes.update', gymClass.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Class: ${gymClass.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Edit Class: {gymClass.name}</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Instructor</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={data.instructor_name}
                                    onChange={e => setData('instructor_name', e.target.value)}
                                    required
                                />
                                {errors.instructor_name && <p className="text-red-500 text-xs mt-1">{errors.instructor_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Day of Week</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={data.day_of_week}
                                    onChange={e => setData('day_of_week', e.target.value)}
                                    required
                                >
                                    <option value="">Select Day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                                {errors.day_of_week && <p className="text-red-500 text-xs mt-1">{errors.day_of_week}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Capacity</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={data.capacity}
                                    onChange={e => setData('capacity', parseInt(e.target.value))}
                                    required
                                    min="1"
                                />
                                {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Time</label>
                                <input
                                    type="time"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    required
                                />
                                {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Time</label>
                                <input
                                    type="time"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    required
                                />
                                {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="md:col-span-2 flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={data.is_active}
                                    onChange={() => {
                                        const newValue = !data.is_active;
                                        setData('is_active', newValue);
                                    }}
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm">
                                    Active Class {data.is_active ? '(Active)' : '(Inactive)'}
                                </label>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <a
                                href={route('gym-classes.index')}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                className="rounded-md bg-red-800 px-4 py-2 text-sm font-medium text-white"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Update Class'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
} 