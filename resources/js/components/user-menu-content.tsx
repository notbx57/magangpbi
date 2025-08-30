import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { LogOut, Settings, Menu, MessageCircle } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;

    const handleLogout = () => {
        cleanup();
        router.post(route('logout'));
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {auth.user.role === 'member' && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href={route('member.quick-menu')} as="button" prefetch onClick={cleanup}>
                            <Menu className="mr-2" />
                            Menu Cepat
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Pengaturan
                    </Link>
                </DropdownMenuItem>
                {(auth.user.role === 'premium' || auth.user.role === 'gymbro') && (
                    <DropdownMenuItem>
                        <a
                            href="https://discord.gg/v9xbAp9p"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center w-full"
                        >
                            <MessageCircle className="mr-2" />
                            Discord
                        </a>
                    </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <button className="block w-full text-left" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Keluar
                </button>
            </DropdownMenuItem>
        </>
    );
}
