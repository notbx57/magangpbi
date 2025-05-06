import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';


type MembershipPlan = {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_days: number;
    is_active: boolean;
};

type PageProps = SharedData & {
    plans: MembershipPlan[];
};

export default function Welcome() {
    const { auth, plans } = usePage<PageProps>().props;
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="PowerGYM - Perjalanan Kebugaran Anda Dimulai Di Sini">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <style>{`
                    html, body {
                        overflow-x: hidden;
                        width: 100%;
                        position: relative;
                        touch-action: pan-y;
                        -ms-touch-action: pan-y;
                    }
                `}</style>
            </Head>
            <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-stone-900 text-white overflow-x-hidden">
                {/* Navigation */}
                <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${isScrolled ? 'bg-gray-900 shadow-lg py-2' : 'bg-transparent py-4'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-red-800">POWER<span className="text-white">GYM</span></span>
                            </div>
                            <div className="hidden md:block">
                                <div className="flex items-center space-x-4 lg:space-x-8">
                                    <a href="#features" className="text-gray-300 hover:text-white">Fitur</a>
                                    <a href="#memberships" className="text-gray-300 hover:text-white">Member</a>
                                    <a href="#trainers" className="text-gray-300 hover:text-white">Pelatih</a>
                                    <a href="#contact" className="text-gray-300 hover:text-white">Kontak</a>
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-md bg-red-800 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors"
                                        >
                                            Dasbor
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="rounded-md border border-red-800 px-4 py-2 font-medium text-red-800 hover:bg-red-800 hover:text-white transition-colors"
                                            >
                                                Masuk
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="rounded-md bg-red-800 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors"
                                            >
                                                Daftar
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="md:hidden flex items-center">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-red-800 px-4 py-2 font-medium text-white hover:bg-red-700"
                                    >
                                        Dasbor
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="mr-2 rounded-md border border-red-800 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-800 hover:text-white"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-red-800 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section - Add padding top to account for the fixed navbar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center w-full">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                        Gaya Hidup Baru, <br /><span className="text-red-800">Buat POWER Dirimu</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                        Bergabunglah dengan PowerGYM hari ini dan mulailah perjalanan kebugaran yang akan menantang, menginspirasi, dan mengubah Anda.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            href={route('register')}
                            className="rounded-md bg-red-800 px-8 py-3 font-bold text-white hover:bg-red-700 transition-colors"
                        >
                            MULAI SEKARANG
                        </Link>
                        <a
                            href="#memberships"
                            className="rounded-md border border-white px-8 py-3 font-bold text-white hover:bg-white hover:text-gray-900 transition-colors"
                        >
                            LIHAT PAKET
                        </a>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="bg-stone-900 py-16 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">Mengapa Memilih <span className="text-red-800">PowerGYM</span>?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            <div className="bg-gray-900 p-8 rounded-lg transition-transform hover:scale-105">
                                <div className="text-red-800 text-4xl mb-4">💪</div>
                                <h3 className="text-xl font-bold mb-4">Peralatan Mutakhir</h3>
                                <p className="text-gray-300">Akses ke peralatan kebugaran premium, dirancang untuk membantu Anda mencapai tujuan kebugaran secara efisien dan aman.</p>
                            </div>
                            <div className="bg-gray-900 p-8 rounded-lg transition-transform hover:scale-105">
                                <div className="text-red-800 text-4xl mb-4">👨‍🏫</div>
                                <h3 className="text-xl font-bold mb-4">Pelatih Pribadi Ahli</h3>
                                <p className="text-gray-300">Pelatih bersertifikat kami memberikan bimbingan personal untuk membantu Anda mencapai hasil lebih cepat.</p>
                            </div>
                            <div className="bg-gray-900 p-8 rounded-lg transition-transform hover:scale-105">
                                <div className="text-red-800 text-4xl mb-4">🏆</div>
                                <h3 className="text-xl font-bold mb-4">Berbagai Macam Kelas</h3>
                                <p className="text-gray-300">Dari latihan intensitas tinggi hingga yoga dan pilates, kami menawarkan berbagai kelas untuk semua tingkat kebugaran.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Membership Plans */}
                <div id="memberships" className="py-16 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">Paket <span className="text-red-800">Member</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <div
                                    key={plan.id}
                                    className={`bg-gray-900 p-8 rounded-lg ${index === 1
                                        ? "border-2 border-red-800 shadow-lg shadow-red-800/20 transform md:scale-105 relative"
                                        : "border border-gray-700 transition-transform hover:scale-105"
                                        }`}
                                >
                                    {index === 1 && (
                                        <div className="absolute top-0 right-0 bg-red-800 text-white py-1 px-4 rounded-bl-lg font-semibold">POPULER</div>
                                    )}
                                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                    <div className="text-red-800 text-4xl font-bold mb-4">${plan.price}<span className="text-sm text-gray-400">/bulan</span></div>
                                    <ul className="mb-8 space-y-2">
                                        {plan.description.split('.').filter(item => item.trim()).map((item, i) => (
                                            <li key={i} className="flex items-center">
                                                <span className="text-red-800 mr-2">✓</span> {item.trim()}
                                            </li>
                                        ))}
                                        <li className="flex items-center">
                                            <span className="text-red-800 mr-2">✓</span> Akses {plan.duration_days} hari
                                        </li>
                                    </ul>
                                    <Link
                                        href={route('register')}
                                        className={`block text-center rounded-md ${index === 1
                                            ? "bg-red-800 px-4 py-2 font-bold text-white hover:bg-red-700"
                                            : "border border-red-800 px-4 py-2 font-medium text-red-800 hover:bg-red-800 hover:text-white"
                                            } transition-colors`}
                                    >
                                        Pilih {plan.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Call To Action */}
                <div className="bg-red-800 py-16 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Siap Mengubah Hidup Anda?</h2>
                        <p className="text-red-100 mb-8 max-w-2xl mx-auto">Bergabunglah dengan PowerGYM hari ini dan ambil langkah pertama menuju diri yang lebih sehat dan lebih kuat. Daftar sekarang dan mulai perjalanan kebugaran Anda!</p>
                        <Link
                            href={route('register')}
                            className="inline-block rounded-md bg-gray-900 px-8 py-3 font-bold text-white hover:bg-gray-800 transition-colors"
                        >
                            GABUNG SEKARANG
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <footer id="contact" className="bg-gray-900 py-8 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="mb-6 md:mb-0">
                                <span className="text-2xl font-bold text-red-800">POWER<span className="text-white">GYM</span></span>
                                <p className="text-gray-400 mt-2">Perjalanan Kebugaran Anda Dimulai Di Sini</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                                <div>
                                    <h3 className="text-red-800 font-semibold mb-2">Tautan Cepat</h3>
                                    <ul className="text-gray-400 space-y-2">
                                        <li><a href="#" className="hover:text-white">Beranda</a></li>
                                        <li><a href="#features" className="hover:text-white">Fitur</a></li>
                                        <li><a href="#memberships" className="hover:text-white">Member</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-red-800 font-semibold mb-2">Kontak</h3>
                                    <ul className="text-gray-400 space-y-2">
                                        <li>Jl. Oerangkoeat No. 98</li>
                                        <li>Bintaro, Tangerang Selatan</li>
                                        <li>contact@powergym.com</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-red-800 font-semibold mb-2">Jam Buka</h3>
                                    <ul className="text-gray-400 space-y-2">
                                        <li>Senin-Jumat: 05.00 - 23.00</li>
                                        <li>Sabtu: 06.00 - 22.00</li>
                                        <li>Minggu: 07.00 - 21.00</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
                            <p>© {new Date().getFullYear()} PowerGYM. Hak cipta dilindungi undang-undang.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
