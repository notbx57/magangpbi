import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Dumbbell, Users, AlertCircle } from 'lucide-react';
import AppLogo from './app-logo';
import { type SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isUserMember = auth.user.role === 'member';
    const hasActiveSubscription = auth.hasActiveSubscription;

    // For members without active subscription, show a different sidebar with subscription message
    if (isUserMember && !hasActiveSubscription) {
        return (
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent className="flex flex-col items-center justify-center p-4">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Subscription Required</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Please activate your membership to access all gym features.
                        </p>
                        <Link
                            href={route('payments.create')}
                            className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                        >
                            Subscribe Now
                        </Link>
                    </div>
                </SidebarContent>

                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        );
    }


    const mainNavItems: NavItem[] = [
        {
            title: 'Dasbor',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Kelas Gym',
            href: route('gym-classes.index'),
            icon: Dumbbell,
        },
    ];

    // Only add Members item if user is not a member
    if (!isUserMember) {
        mainNavItems.push({
            title: 'Members',
            href: route('members.index'),
            icon: Users,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
