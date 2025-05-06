import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, ChangeEvent } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan Profil',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    address: string;
    emergency_contact: string;
    emergency_contact_phone: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        emergency_contact: user.emergency_contact || '',
        emergency_contact_phone: user.emergency_contact_phone || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informasi Profil" description="Perbarui informasi pribadi Anda" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Nama lengkap"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Alamat Email</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Alamat email"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Nomor Telepon</Label>

                            <Input
                                id="phone_number"
                                type="tel"
                                className="mt-1 block w-full"
                                value={data.phone_number}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setData('phone_number', e.target.value)}
                                autoComplete="tel"
                                placeholder="Nomor telepon"
                            />

                            <InputError className="mt-2" message={errors.phone_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date_of_birth">Tanggal Lahir</Label>

                            <Input
                                id="date_of_birth"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.date_of_birth}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setData('date_of_birth', e.target.value)}
                                placeholder="Tanggal lahir"
                            />

                            <InputError className="mt-2" message={errors.date_of_birth} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Alamat</Label>

                            <Textarea
                                id="address"
                                className="mt-1 block w-full"
                                value={data.address}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('address', e.target.value)}
                                placeholder="Alamat Anda"
                                rows={3}
                            />

                            <InputError className="mt-2" message={errors.address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="emergency_contact">Kontak Darurat</Label>

                            <Input
                                id="emergency_contact"
                                className="mt-1 block w-full"
                                value={data.emergency_contact}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setData('emergency_contact', e.target.value)}
                                placeholder="Nama kontak darurat"
                            />

                            <InputError className="mt-2" message={errors.emergency_contact} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="emergency_contact_phone">Nomor Telepon Kontak Darurat</Label>

                            <Input
                                id="emergency_contact_phone"
                                type="tel"
                                className="mt-1 block w-full"
                                value={data.emergency_contact_phone}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setData('emergency_contact_phone', e.target.value)}
                                placeholder="Nomor telepon kontak darurat"
                            />

                            <InputError className="mt-2" message={errors.emergency_contact_phone} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Alamat email Anda belum diverifikasi.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Klik di sini untuk mengirim ulang email verifikasi.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        Tautan verifikasi baru telah dikirim ke alamat email Anda.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Simpan</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Tersimpan</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
