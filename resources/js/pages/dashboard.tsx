import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Calendar, Dumbbell, Clock, Award } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: '/dashboard',
    },
];

type User = {
    role: string;
    name: string;
}

type Subscription = {
    plan_name: string;
    price: number;
    next_billing_date: string;
    status: string;
}

type Payment = {
    method: string;
    last_four: string;
    exp_date: string;
}

type Class = {
    id: number;
    name: string;
    instructor: string;
    time: string;
    day: string;
    description: string;
}

type PageProps = {
    subscription: Subscription | null;
    attendance: {
        total_visits: number;
        last_visit: string | null;
        streak: number;
    };
    classes: Class[];
    payment: Payment | null;
    auth: {
        user: User;
    };
}

export default function Dashboard() {
    const props = usePage<PageProps>().props;
    const { subscription, attendance, classes } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const plans = [
        {
            name: 'Basic',
            price: 4.99,
            features: [
                'Basic access to gym facilities',
                'Standard hours only (6AM-10PM)',
                'Access to locker rooms',
                'Free water refill'
            ]
        },
        {
            name: 'Premium',
            price: 15.99,
            features: [
                'Full access to gym facilities',
                'Access to group classes',
                'Extended hours (5AM-11PM)',
                'Towel service',
                'Locker rental included'
            ]
        },
        {
            name: 'GymBro',
            price: 29.99,
            features: [
                'Full 24/7 access to all facilities',
                'Personal trainer sessions (2x/month)',
                'Unlimited group classes',
                'Premium locker with laundry service',
                'Protein shake after workout',
                'Guest passes (2/month)'
            ]
        }
    ];


    const handleUpgradeClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
        setPaymentMethod('credit_card');
        setError(null);
        setSuccess(null);
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        // Refresh the dashboard page after closing the success modal
        router.visit('/dashboard', { replace: true });
    };

    const handlePlanSelect = (planName: string) => {
        setSelectedPlan(planName);
    };

    const handleSubmit = async () => {
        if (!selectedPlan) {
            setError('Silakan pilih paket');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            // Use Inertia.js router to submit the form
            // This automatically handles CSRF tokens and redirects
            router.post('/process-payment', {
                plan_name: selectedPlan,
                payment_method: paymentMethod
            }, {
                onSuccess: () => {
                    // Show success modal instead of refreshing immediately
                    setIsSubmitting(false);
                    setIsModalOpen(false);
                    setSuccess('Pembayaran Anda telah berhasil diproses!');
                    setIsSuccessModalOpen(true);
                },
                onError: (errors) => {
                    if (errors.message && errors.message.includes('CSRF')) {
                        setError('Sesi telah kedaluwarsa. Silakan muat ulang halaman dan coba lagi.');
                    } else {
                        setError('Gagal memproses pembayaran. Silakan coba lagi.');
                    }
                    setIsSubmitting(false);
                }
            });
        } catch (err) {
            setError('Gagal memproses pembayaran. Silakan coba lagi.');
            console.error(err);
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor Anggota" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Success Notification */}
                {success && !isModalOpen && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                        <strong className="font-bold">Berhasil! </strong>
                        <span className="block sm:inline">{success}</span>
                    </div>
                )}
                {/* Welcome Banner */}
                <div className="bg-blue-800 text-white p-6 rounded-xl shadow-md">
                    <h1 className="text-2xl font-bold">Selamat datang, {props.auth.user.name || 'Member'}!</h1>
                    <p className="mt-1">Ini adalah dashboard GYM Membership Anda</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <Dumbbell className="text-red-800 h-8 w-8 mb-2" />
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Total Kunjungan</h3>
                        <p className="text-3xl font-bold text-red-800">{attendance.total_visits}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <Calendar className="text-red-800 h-8 w-8 mb-2" />
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Kunjungan Terakhir</h3>
                        <p className="text-md font-bold text-red-800">{attendance.last_visit || 'Belum Pernah'}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <Clock className="text-red-800 h-8 w-8 mb-2" />
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Rangkaian Saat Ini</h3>
                        <p className="text-3xl font-bold text-red-800">{attendance.streak} hari</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col items-center">
                        <Award className="text-red-800 h-8 w-8 mb-2" />
                        <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium">Status</h3>
                        <p className="text-xl font-bold text-red-800">{subscription?.status || 'Tidak Aktif'}</p>
                    </div>
                </div>

                <div className="rounded-xl p-6 shadow-sm mt-4">
                    {/* Membership Info */}
                    <div className="flex flex-col gap-2 rounded-xl border p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">Paket Member</h3>
                        <p className="text-muted-foreground">{subscription?.plan_name || 'Tidak ada langganan aktif'}</p>
                        {subscription && (
                            <>
                                <div className="mt-2">
                                    <span className="text-2xl font-bold">${subscription.price}</span>
                                    <span className="text-muted-foreground">/bulan</span>
                                </div>
                                <div className="mt-2 flex items-center">
                                    <span className="text-sm mr-2">Status:</span>
                                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${
                                        subscription.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                                        subscription.status === 'Tertunda' ? 'bg-yellow-100 text-yellow-800' :
                                        subscription.status === 'Gagal' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {subscription.status}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Tagihan selanjutnya: {subscription.next_billing_date}
                                </p>
                            </>
                        )}
                        <div className="mt-4">
                            <button
                                onClick={handleUpgradeClick}
                                disabled={!!subscription && new Date(subscription.next_billing_date) > new Date()}
                                className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                                    subscription && new Date(subscription.next_billing_date) > new Date()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-red-800 hover:bg-red-700'
                                }`}
                            >
                                {subscription ? 'Tingkatkan Paket' : 'Dapatkan Member'}
                            </button>
                            {subscription && new Date(subscription.next_billing_date) > new Date() && (
                                <p className="mt-2 text-xs text-red-600"></p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Kelas GYM */}
                <div className="rounded-xl border p-6 shadow-sm mt-4">
                    <h3 className="text-xl font-semibold mb-4">Kelas GYM</h3>
                    {!subscription ? (
                        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded-lg">
                            <p className="font-medium">Anda memerlukan langganan aktif untuk mengakses kelas</p>
                            <p className="text-sm mt-1">Silakan berlangganan paket Member untuk melihat dan memesan kelas.</p>
                        </div>
                    ) : classes && classes.length > 0 ? (
                        <div className="space-y-3">
                            {classes.map((gymClass) => (
                                <div key={gymClass.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{gymClass.name}</h4>
                                        <p className="text-sm text-muted-foreground">{gymClass.day}, {gymClass.time}</p>
                                        <p className="text-xs text-muted-foreground">Instruktur: {gymClass.instructor}</p>
                                    </div>
                                    <button className="rounded-md bg-red-800 px-3 py-1 text-sm font-medium text-white">
                                        Pesan
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Tidak ada kelas hari ini. Ditunggu yah!</p>
                    )}
                    <div className="mt-4 text-center">
                        <button
                            className={`rounded-md border px-4 py-2 text-sm font-medium ${
                                !subscription
                                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                : 'border-red-800 text-red-800'
                            }`}
                            disabled={!subscription}
                        >
                            Lihat Semua Kelas
                        </button>
                    </div>
                </div>
            </div>

            {/* Upgrade Plan Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Tingkatkan Member Anda</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                                    {success}
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Pilih Paket</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.name}
                                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPlan === plan.name
                                                ? 'border-red-800 bg-red-50 dark:bg-red-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-red-500'
                                                }`}
                                            onClick={() => handlePlanSelect(plan.name)}
                                        >
                                            <h4 className="font-bold text-lg">{plan.name}</h4>
                                            <p className="text-2xl font-bold text-red-800 mt-2">${plan.price}<span className="text-sm text-gray-500">/bulan</span></p>
                                            <ul className="mt-3 space-y-2">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center text-sm">
                                                        <svg className="h-4 w-4 text-red-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Metode Pembayaran</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="credit_card"
                                            name="payment_method"
                                            value="credit_card"
                                            checked={paymentMethod === 'credit_card'}
                                            onChange={() => setPaymentMethod('credit_card')}
                                            className="h-4 w-4 text-red-800 focus:ring-red-500"
                                        />
                                        <label htmlFor="credit_card" className="ml-2 block text-sm font-medium">
                                            Kartu Kredit
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="bank_transfer"
                                            name="payment_method"
                                            value="bank_transfer"
                                            checked={paymentMethod === 'bank_transfer'}
                                            onChange={() => setPaymentMethod('bank_transfer')}
                                            className="h-4 w-4 text-red-800 focus:ring-red-500"
                                        />
                                        <label htmlFor="bank_transfer" className="ml-2 block text-sm font-medium">
                                            Transfer Bank
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-red-800 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Memproses...' : 'Selesaikan Pembayaran'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Payment Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Terima kasih! Pembayaran Anda telah berhasil diproses. Anda sekarang dapat menikmati semua fitur dari paket yang Anda pilih.
                                </p>
                                <button
                                    onClick={handleCloseSuccessModal}
                                    className="px-6 py-2 bg-red-800 text-white rounded-md text-sm font-medium hover:bg-red-700"
                                >
                                    Kembali ke Dasbor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
