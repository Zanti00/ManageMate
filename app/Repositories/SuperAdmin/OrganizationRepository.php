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

    public function delete(int $id): void
    {
        DB::statement('EXEC usp_Organization_Update @organization_id = :organization_id', ['organization_id' => $id]);
    }
}
