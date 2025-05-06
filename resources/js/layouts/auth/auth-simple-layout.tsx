import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, name, title, description, ...props }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="max-w-7xl mx-auto w-full">
            <div className="flex min-h-svh flex-col py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex flex-col items-center">
                        <Link href={route('home')} className="flex items-center">
                            <span className="text-xl font-bold">PowerGYM</span>
                        </Link>
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
                    {description && <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">{description}</p>}
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">{children}</div>
                </div>
            </div>
        </div>
    );
}
