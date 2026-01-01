import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { Form, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Admin',
        href: superadmin.admin.create.url(),
    },
];

export default function CreateAdmin() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        position_title: '',
        email: '',
        phone_number: '',
        password: '',
    });

    const handleSubmit = () => {
        post(superadmin.admin.store.url(), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="my-8 mr-52 ml-8 flex flex-col p-8">
                <Form className="space-y-6">
                    {/* <div className="flex flex-row gap-8">
                        <div className="gap flex flex-col gap-2">
                            <Label>Organization Type *</Label>
                            <Select
                                value={data.organization_type}
                                onValueChange={(value) =>
                                    setData('organization_type', value)
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select organization type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="academic">
                                        Academic
                                    </SelectItem>
                                    <SelectItem value="non-academic">
                                        Non-Academic
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.organization_type && (
                                <span className="text-sm text-red-500">
                                    {errors.organization_type}
                                </span>
                            )}
                        </div>
                    </div> */}
                    <CardTitle>Admin Contact Information</CardTitle>
                    <div className="flex flex-row gap-8">
                        <div className="gap flex flex-col gap-2">
                            <Label>First Name *</Label>
                            <Input
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter first name"
                            />
                            {errors.first_name && (
                                <span className="text-sm text-red-500">
                                    {errors.first_name}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Middle Name </Label>
                            <Input
                                value={data.middle_name}
                                onChange={(e) =>
                                    setData('middle_name', e.target.value)
                                }
                                type="text"
                                placeholder="Enter middle name"
                            />
                            {errors.middle_name && (
                                <span className="text-sm text-red-500">
                                    {errors.middle_name}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Last Name *</Label>
                            <Input
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter last name"
                            />
                            {errors.last_name && (
                                <span className="text-sm text-red-500">
                                    {errors.last_name}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row gap-8">
                        <div className="gap flex flex-col gap-2">
                            <Label>Position Title *</Label>
                            <Input
                                value={data.position_title}
                                onChange={(e) =>
                                    setData('position_title', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter title"
                            />
                            {errors.position_title && (
                                <span className="text-sm text-red-500">
                                    {errors.position_title}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Contact Email *</Label>
                            <Input
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                type="email"
                                required
                                placeholder="Enter email"
                            />
                            {errors.email && (
                                <span className="text-sm text-red-500">
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Phone Number *</Label>
                            <Input
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData('phone_number', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter phone number"
                            />
                            {errors.phone_number && (
                                <span className="text-sm text-red-500">
                                    {errors.phone_number}
                                </span>
                            )}
                        </div>
                    </div>
                    <CardTitle>Account Settings</CardTitle>
                    <div className="flex flex-row gap-8">
                        <div className="gap flex flex-col gap-2">
                            <Label>Username *</Label>
                            <Input
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter username"
                            />
                            {errors.username && (
                                <span className="text-sm text-red-500">
                                    {errors.username}
                                </span>
                            )}
                        </div>
                        <div className="gap flex flex-col gap-2">
                            <Label>Temporary Password *</Label>
                            <Input
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                type="password"
                                required
                                placeholder="Enter password"
                            />
                            {errors.password && (
                                <span className="text-sm text-red-500">
                                    {errors.password}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <Button
                            type="button"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            Create Account
                        </Button>
                        <Button
                            onClick={() => {
                                if (window.history.length > 1) {
                                    window.history.back();
                                } else {
                                    router.visit(superadmin.admin.index.url());
                                }
                            }}
                            className="bg-gray-100 text-black"
                            type="button"
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>
        </AppLayout>
    );
}
