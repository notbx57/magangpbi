import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Dumbbell, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { type SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isUserMember = auth.user.role === 'member';

    // Define navigation items based on user role
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
