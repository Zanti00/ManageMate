import { Button } from '@/components/ui/button';
import { edit } from '@/routes/user-password';
import { Link } from '@inertiajs/react';
import { Camera, LockKeyhole } from 'lucide-react';
import { type PropsWithChildren } from 'react';

// const sidebarNavItems: NavItem[] = [
//     {
//         title: 'Profile',
//         href: edit(),
//         icon: null,
//     },
//     {
//         title: 'Password',
//         href: editPassword(),
//         icon: null,
//     },
//     {
//         title: 'Two-Factor Auth',
//         href: show(),
//         icon: null,
//     },
//     {
//         title: 'Appearance',
//         href: editAppearance(),
//         icon: null,
//     },
// ];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="relative flex h-full w-full flex-col px-4 py-6">
            <div className="flex h-[23%] w-full flex-row place-content-end items-center gap-x-3 rounded-t-lg bg-foreground pr-10">
                <Button
                    asChild
                    size="icon"
                    variant="default"
                    className="w-fit px-5 hover:bg-gray-100 hover:text-primary-foreground"
                >
                    <Link href={edit()}>
                        <LockKeyhole />
                        <span>Change Password</span>
                    </Link>
                </Button>
            </div>
            <div className="flex h-full flex-col rounded-b-lg bg-white pt-24 shadow-md">
                <div className="absolute top-12 left-1/2 z-10 -translate-x-1/2 text-center">
                    <div className="relative">
                        <img
                            src="https://lh3.googleusercontent.com/BKN1q6592B6RRjUCzycpYLMsRXezlbNW7lbJ3Y1xDUuzdJ_D9tbhr9GHk2_STmHBcIZYu4mNpu1cGgTU=w544-h544-l90-rj"
                            alt="Profile"
                            className="h-36 w-36 rounded-full border-4 border-white bg-gray-200"
                        />
                        <button className="absolute right-3 bottom-2 rounded-full bg-white p-1.5 shadow-md">
                            <Camera className="h-5 w-5" />
                        </button>
                    </div>
                    <p>Full Name</p>
                </div>
                {children}
            </div>
        </div>
    );
}
