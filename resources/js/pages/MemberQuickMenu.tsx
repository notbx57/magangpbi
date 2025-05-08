import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Calendar, Dumbbell, Clock, CreditCard, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: '/dashboard',
    },
    {
        title: 'Menu Cepat',
        href: '/member/quick-menu',
    },
];

type Subscription = {
    plan_name: string;
    status: string;
    end_date: string;
}

type Class = {
    id: number;
    name: string;
    time: string;
    instructor: string;
}

type PageProps = {
    subscription: Subscription | null;
    attendance: {
        last_visit: string | null;
    };
    classes: Class[];
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
}

export default function MemberQuickMenu() {
    const { subscription, attendance, classes, auth } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu Cepat Anggota" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center mb-4">
                    <Link href="/dashboard" className="mr-4">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Menu Cepat Anggota</h1>
                </div>

                {/* User Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Anggota</CardTitle>
                        <CardDescription>Detail profil dan keanggotaan Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                                <User className="h-5 w-5 mr-2 text-gray-500" />
                                <span className="font-medium">{auth.user.name}</span>
                            </div>
                            <div className="flex items-center">
                                <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                                <span>Paket: {subscription ? subscription.plan_name : 'Tidak ada paket aktif'}</span>
                            </div>
                            {subscription && (
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                                    <span>Berakhir: {subscription.end_date}</span>
                                </div>
                            )}
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                                <span>Kunjungan terakhir: {attendance.last_visit || 'Belum pernah'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                        <CardDescription>Akses cepat ke fitur-fitur utama</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/gym-classes" className="no-underline">
                                <Button variant="outline" className="w-full justify-start">
                                    <Dumbbell className="mr-2 h-4 w-4" />
                                    Kelas Gym
                                </Button>
                            </Link>
                            <Link href={route('profile.edit')} className="no-underline">
                                <Button variant="outline" className="w-full justify-start">
                                    <User className="mr-2 h-4 w-4" />
                                    Profil
                                </Button>
                            </Link>
                            {subscription && (
                                <Link href="/dashboard" className="no-underline">
                                    <Button variant="outline" className="w-full justify-start">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Langganan
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Classes */}
                {classes && classes.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Kelas Hari Ini</CardTitle>
                            <CardDescription>Jadwal kelas untuk hari ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {classes.map((gymClass) => (
                                    <div key={gymClass.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        <div>
                                            <h4 className="font-medium">{gymClass.name}</h4>
                                            <p className="text-sm text-muted-foreground">{gymClass.time}</p>
                                            <p className="text-xs text-muted-foreground">Instruktur: {gymClass.instructor}</p>
                                        </div>
                                        <Link href={`/gym-classes/${gymClass.id}`} className="no-underline">
                                            <Button size="sm" variant="default">
                                                Detail
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
