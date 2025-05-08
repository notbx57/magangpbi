import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelas Gym',
        href: route('gym-classes.index'),
    },
];

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
    classes: {
        data: GymClass[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    auth: {
        user: {
            role: string;
        };
    };
    userRole: string;
    bookedClassIds: number[];
}

type FormData = {
    name: string;
    description: string;
    instructor_name: string;
    start_time: string;
    end_time: string;
    day_of_week: string;
    capacity: number;
    is_active: boolean;
}

export default function GymClassesIndex() {
    const { classes, userRole, bookedClassIds } = usePage<PageProps>().props;
    const [showAddClassForm, setShowAddClassForm] = useState(false);
    const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        description: '',
        instructor_name: '',
        start_time: '',
        end_time: '',
        day_of_week: '',
        capacity: 20,
        is_active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('gym-classes.store'), {
            onSuccess: () => {
                reset();
                setShowAddClassForm(false);
            }
        });
    };

    const handleBookClass = (classId: number) => {
        if (confirm('Pesan kelas ini?')) {
            router.post(route('gym-classes.book', classId));
        }
    };

    const handleCancelBooking = (classId: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan pemesanan untuk kelas ini?')) {
            router.delete(route('gym-classes.cancel', classId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelas Gym" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Kelas Gym</h3>
                        {isStaffOrAdmin && (
                            <button
                                className="rounded-md bg-red-800 px-4 py-2 text-sm font-medium text-white"
                                onClick={() => setShowAddClassForm(!showAddClassForm)}
                            >
                                {showAddClassForm ? 'Batal' : 'Tambah Kelas Baru'}
                            </button>
                        )}
                    </div>

                    {/* Add Class Form - Only shown for staff/admin */}
                    {isStaffOrAdmin && showAddClassForm && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                            <h4 className="text-lg font-medium mb-4">Tambah Kelas Baru</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Nama</label>
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
                                        <label className="block text-sm font-medium mb-1">Instruktur</label>
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
                                        <label className="block text-sm font-medium mb-1">Hari</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-md"
                                            value={data.day_of_week}
                                            onChange={e => setData('day_of_week', e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Hari</option>
                                            <option value="Monday">Senin</option>
                                            <option value="Tuesday">Selasa</option>
                                            <option value="Wednesday">Rabu</option>
                                            <option value="Thursday">Kamis</option>
                                            <option value="Friday">Jumat</option>
                                            <option value="Saturday">Sabtu</option>
                                            <option value="Sunday">Minggu</option>
                                        </select>
                                        {errors.day_of_week && <p className="text-red-500 text-xs mt-1">{errors.day_of_week}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Kapasitas</label>
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
                                        <label className="block text-sm font-medium mb-1">Waktu Mulai</label>
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
                                        <label className="block text-sm font-medium mb-1">Waktu Selesai</label>
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
                                        <label className="block text-sm font-medium mb-1">Deskripsi</label>
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
                                            onChange={() => {
                                                const newValue = !data.is_active;
                                                setData('is_active', newValue);
                                            }}
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm">
                                            Kelas Aktif {data.is_active ? '(Aktif)' : '(Tidak Aktif)'}
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-red-800 px-4 py-2 text-sm font-medium text-white"
                                        disabled={processing}
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Kelas'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Classes Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instruktur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hari</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kapasitas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                {classes.data && classes.data.length > 0 ? (
                                    classes.data.map((gymClass) => (
                                        <tr key={gymClass.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium">
                                                    <a href={route('gym-classes.show', gymClass.id)} className="text-red-800 hover:text-red-600">
                                                        {gymClass.name}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">{gymClass.instructor_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">{gymClass.day_of_week}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">{gymClass.start_time} - {gymClass.end_time}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">{gymClass.capacity}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gymClass.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {gymClass.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                {isStaffOrAdmin ? (
                                                    <>
                                                        <a href={route('gym-classes.edit', gymClass.id)} className="text-red-800 hover:text-red-600">Ubah</a>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
                                                                    router.delete(route('gym-classes.destroy', gymClass.id));
                                                                }
                                                            }}
                                                            className="text-red-800 hover:text-red-600"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </>
                                                ) : (
                                                    bookedClassIds.includes(gymClass.id) ? (
                                                        <button
                                                            onClick={() => handleCancelBooking(gymClass.id)}
                                                            className="rounded-md bg-red-100 text-red-800 px-3 py-1 text-sm font-medium"
                                                        >
                                                            Batalkan Pemesanan
                                                        </button>
                                                    ) : gymClass.is_active ? (
                                                        <button
                                                            onClick={() => handleBookClass(gymClass.id)}
                                                            className="rounded-md bg-red-800 px-3 py-1 text-sm font-medium text-white"
                                                        >
                                                            Pesan Kelas
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm italic">
                                                            Kelas tidak aktif
                                                        </span>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Tidak ada kelas ditemukan.
                                            {isStaffOrAdmin && 'Tambahkan kelas pertama Anda!'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {classes.links && (
                        <div className="mt-4 flex justify-center">
                            {/* Add pagination component here if needed */}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
