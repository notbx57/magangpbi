import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { quote } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen w-full">
            <div className="hidden h-full w-full overflow-hidden md:block md:w-1/2">
                <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-black dark:bg-gray-800">
                    <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm" />

                    <div className="z-20 flex flex-col items-center px-10 text-center text-white">
                        <span className="text-3xl font-bold">PowerGYM</span>
                        <p className="mt-10 max-w-md text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {quote.message}
                        </p>
                        <p className="text-muted-foreground mt-4">&mdash; {quote.author}</p>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col justify-center px-5 py-12 sm:px-6 md:w-1/2 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-xl space-y-8">
                    <div>
                        <div className="flex w-full justify-center md:hidden">
                            <Link href={route('home')} className="text-xl font-bold">PowerGYM</Link>
                        </div>
                        <h2 className="mt-4 text-center text-3xl font-extrabold">{title}</h2>
                        <p className="text-muted-foreground mt-2 text-center text-sm">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
