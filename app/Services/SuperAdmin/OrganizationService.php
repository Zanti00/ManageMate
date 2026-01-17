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

    public function searchOrganizations(
        ?string $query,
        ?string $status,
        int $page,
        int $perPage,
    ): array {
        $payload = $this->organizationRepo->search($query, $status, $page, $perPage);
        $items = $payload['data'] ?? [];

        $data = array_map(static function ($organization) {
            $record = (array) $organization;
            $isDeleted = $record['is_deleted'] ?? false;
            $isInactive = $isDeleted === true || $isDeleted === 1 || $isDeleted === '1';

            $record['status'] = $isInactive ? 'Inactive' : 'Active';
            $record['is_deleted'] = isset($record['is_deleted'])
                ? (string) $record['is_deleted']
                : null;

            return $record;
        }, $items);

        $meta = $payload['meta'] ?? null;

        if (! $meta) {
            $total = count($data);
            $meta = [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => max(1, (int) ceil(max($total, 1) / max($perPage, 1))),
            ];
        }

        return [
            'data' => $data,
            'meta' => $meta,
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
