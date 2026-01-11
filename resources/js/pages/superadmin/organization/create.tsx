import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { Form, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Organization',
        href: superadmin.organization.create.url(),
    },
];

type OrgType = 'academic' | 'non-academic';

export default function CreateOrganization() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        abbreviation: '',
        email: '',
        address: '',
        type: '' as OrgType | '',
    });

    const handleSubmit = () => {
        post(superadmin.organization.store.url(), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="my-8 mr-52 ml-8 flex flex-col p-8">
                <Form className="space-y-6">
                    <CardTitle>Organization Details</CardTitle>
                    <div className="flex flex-row gap-8">
                        <div className="flex flex-col gap-2">
                            <Label>Organization Name *</Label>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter organization name"
                            />
                            {errors.name && (
                                <span className="text-sm text-red-500">
                                    {errors.name}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Organization Abbreviation *</Label>
                            <Input
                                value={data.abbreviation}
                                onChange={(e) =>
                                    setData('abbreviation', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter abbreviation"
                            />
                            {errors.abbreviation && (
                                <span className="text-sm text-red-500">
                                    {errors.abbreviation}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Organization Type *</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) =>
                                    setData('type', value as OrgType)
                                }
                                required
                            >
                                <SelectTrigger className="w-[220px]">
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
                            {errors.type && (
                                <span className="text-sm text-red-500">
                                    {errors.type}
                                </span>
                            )}
                        </div>
                    </div>

                    <CardTitle>Contact Information</CardTitle>
                    <div className="flex flex-row gap-8">
                        <div className="flex flex-col gap-2">
                            <Label>Email *</Label>
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
                    </div>

                    <div className="flex flex-row gap-8">
                        <div className="flex w-full flex-col gap-2">
                            <Label>Address *</Label>
                            <Input
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                type="text"
                                required
                                placeholder="Enter address"
                            />
                            {errors.address && (
                                <span className="text-sm text-red-500">
                                    {errors.address}
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
                            Create Organization
                        </Button>
                        <Button
                            onClick={() => {
                                if (window.history.length > 1) {
                                    window.history.back();
                                } else {
                                    router.visit(
                                        superadmin.organization.index.url(),
                                    );
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
