import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    description,
    secondDescription,
    footer,
    isLogin,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    secondDescription?: string;
    footer?: React.ReactNode;
    isLogin?: boolean;
}) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            secondDescription={secondDescription}
            footer={footer}
            isLogin={isLogin}
            {...props}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
