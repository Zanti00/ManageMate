<?php

namespace App\Services\SuperAdmin;

use App\Repositories\SuperAdmin\OrganizationRepository;

class OrganizationService
{
    public function __construct(private OrganizationRepository $organizationRepo) {}

    public function create(array $validated): void
    {
        $this->organizationRepo->insert([
            'name' => $validated['name'],
            'abbreviation' => $validated['abbreviation'],
            'email' => $validated['email'],
            'address' => $validated['address'],
            'type' => $validated['type'],
        ]);
    }

    public function getAllOrganizations(): array
    {
        $organizations = $this->organizationRepo->getAll() ?: [];

        if (empty($organizations)) {
            return [
                'organizations' => [],
            ];
        }

        return [
            'organizations' => $organizations,
        ];
    }

    public function getOrganization(int $id): ?object
    {
        return $this->organizationRepo->findById($id);
    }

    public function updateOrganization(int $id, array $validated): void
    {
        $this->organizationRepo->update($id, [
            'name' => $validated['name'],
            'abbreviation' => $validated['abbreviation'],
            'email' => $validated['email'],
            'address' => $validated['address'],
            'type' => $validated['type'],
        ]);
    }

    public function deleteOrganization(int $id): void
    {
        $this->organizationRepo->delete($id);
    }
}
