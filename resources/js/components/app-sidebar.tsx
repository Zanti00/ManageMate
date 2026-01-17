import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import superadmin from '@/routes/superadmin';
import user from '@/routes/user';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    Calendar,
    CalendarHeart,
    Folder,
    LayoutGrid,
    ScanQrCode,
    UserRoundCog,
} from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;

    const getEventHref = () => {
        if (auth.user.isSuperAdmin) return superadmin.event.index();
        if (auth.user.isAdmin) return admin.event.index();
        return user.event.index();
    };

    const eventHref = getEventHref();

    const getDashboardHref = () => {
        if (auth.user.isSuperAdmin) return superadmin.dashboard();
        if (auth.user.isAdmin) return admin.dashboard();
        return user.dashboard();
    };

    const dashboardHref = getDashboardHref();

    // Build navigation items based on user role
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardHref,
            icon: LayoutGrid,
        },
        {
            title: 'Events',
            href: eventHref,
            icon: Calendar,
        },
    ];

    // Add admin-only navigation items
    if (auth.user.isAdmin) {
        mainNavItems.push({
            title: 'Scan QR',
            href: admin.scanQr.index(),
            icon: ScanQrCode,
        });
    }

    // Add user-only navigation items
    if (auth.user.isUser) {
        mainNavItems.push({
            title: 'My Events',
            href: user.event.myevents(),
            icon: CalendarHeart,
        });
        // mainNavItems.push({
        //     title: 'Notifications',
        //     href: user.notification.index(),
        //     icon: Bell,
        // });
    }

    if (auth.user.isSuperAdmin) {
        mainNavItems.push({
            title: 'Admins',
            href: superadmin.admin.index(),
            icon: UserRoundCog,
        });
        mainNavItems.push({
            title: 'Organizations',
            href: superadmin.organization.index(),
            icon: Building2,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
