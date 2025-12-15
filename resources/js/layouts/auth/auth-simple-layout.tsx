import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    secondDescription?: string;
    footer?: React.ReactNode;
    isLogin?: boolean;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
    secondDescription,
    footer,
    isLogin = true,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-row items-center justify-center">
            <div className="flex min-h-svh flex-1 flex-row items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <Link
                                // href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <span className="sr-only">{title}</span>
                            </Link>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            <div
                className={`absolute top-0 z-10 flex h-full w-1/2 items-center justify-center bg-gradient-to-br from-white to-red-900 p-6 shadow-2xl transition-transform duration-500 ease-in-out md:p-10 ${
                    isLogin ? 'right-0' : 'left-0'
                }`}
            >
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-primary">{title}</h1>
                    <p className="text-sm font-medium text-primary">
                        {description}
                    </p>
                    {secondDescription && (
                        <p className="text-sm font-medium text-primary">
                            {secondDescription}
                        </p>
                    )}
                    {footer && <div className="mt-4 font-medium">{footer}</div>}
                </div>
            </div>

            <div className="flex min-h-svh flex-1 flex-row items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <Link
                                // href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <span className="sr-only">{title}</span>
                            </Link>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
