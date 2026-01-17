<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class OrganizationRepository
{
    /**
     * Insert a new organization using the InsertOrganization stored procedure.
     */
    public function insert(array $data): void
    {
        DB::statement(
            'EXEC usp_Organization_Insert
            @name = :name,
            @abbreviation = :abbreviation,
            @email = :email,
            @address = :address,
            @type = :type',
            $data
        );
    }

    public function getAll(): array
    {
        return DB::select('EXEC usp_Organization_GetAll');
    }

    public function findById(int $id): ?object
    {
        $result = DB::select('EXEC usp_Organization_GetById @organization_id = :organization_id', ['organization_id' => $id]);

        return $result[0] ?? null;
    }

    public function update(int $id, array $data): void
    {
        DB::statement(
            'EXEC usp_Organization_Update
            @id = :id,
            @name = :name,
            @abbreviation = :abbreviation,
            @email = :email,
            @address = :address,
            @type = :type',
            array_merge(['id' => $id], $data)
        );
    }

    public function search(
        ?string $query = null,
        ?string $status = null,
        int $page = 1,
        int $perPage = 9,
    ): array {
        $result = DB::select(
            'EXEC usp_Organization_Search
            @query = :query,
            @status = :status,
            @page = :page,
            @per_page = :per_page',
            [
                'query' => $query ?? '',
                'status' => $status,
                'page' => $page,
                'per_page' => $perPage,
            ],
        );

        $organizations = array_map(static fn ($row) => (array) $row, $result);

        $meta = [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => count($organizations),
            'last_page' => max(1, (int) ceil(max(count($organizations), 1) / max($perPage, 1))),
        ];

        if (! empty($result)) {
            $first = (array) $result[0];

            $total = isset($first['total_count']) ? (int) $first['total_count'] : $meta['total'];
            $per = isset($first['per_page']) ? (int) $first['per_page'] : $meta['per_page'];
            $current = isset($first['current_page']) ? (int) $first['current_page'] : $meta['current_page'];
            $last = isset($first['last_page'])
                ? (int) $first['last_page']
                : (int) ceil(max($total, 1) / max($per, 1));

            $meta = [
                'current_page' => $current,
                'per_page' => $per,
                'total' => $total,
                'last_page' => max(1, $last),
            ];
        }

        return [
            'data' => $organizations,
            'meta' => $meta,
        ];
    }

    public function delete(int $id): void
    {
        DB::statement('EXEC usp_Organization_Update @organization_id = :organization_id', ['organization_id' => $id]);
    }
}
