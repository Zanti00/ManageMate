<?php

namespace App\Services\SuperAdmin;

use App\Models\User;
use App\Repositories\SuperAdmin\AdminRepository;
use App\Repositories\SuperAdmin\OrganizationRepository;

class AdminService
{
    public function __construct(private AdminRepository $adminRepo, private OrganizationRepository $organizationRepo) {}

    public function getAllAdminsWithStats(): array
    {
        $admins = $this->adminRepo->getAll() ?: [];

        if (empty($admins)) {
            return [
                'admins' => [],
            ];
        }

        $adminsWithStats = array_map(function ($admin) {
            $stats = $this->formatEventStats($this->adminRepo->getEventStats($admin->id));

            return (object) array_merge((array) $admin, $stats);
        }, $admins);

        return [
            'admins' => $adminsWithStats,
        ];
    }

    public function searchAdmins(string $query, ?string $status, int $page, int $perPage): array
    {
        return $this->adminRepo->searchAdmins($query, $status, $page, $perPage);
    }

    public function getOrganizationOptions(): array
    {
        $organizations = $this->organizationRepo->getAll();

        return array_map(function ($org) {
            return [
                'id' => $org->id,
                'name' => $org->name,
            ];
        }, $organizations ?: []);
    }

    public function getAdminWithStats(int $id): array
    {
        $admin = $this->adminRepo->findById($id);
        $stats = $this->adminRepo->getEventStats($id);

        return [
            'admin' => $admin,
            'stats' => $this->formatEventStats($stats),
        ];
    }

    public function createAdmin(array $validatedData): void
    {
        // Insert admin with temporary password (stored procedure requirement)
        $this->adminRepo->insert([
            'username' => $validatedData['username'],
            'first_name' => $validatedData['first_name'],
            'middle_name' => $validatedData['middle_name'],
            'last_name' => $validatedData['last_name'],
            'position_title' => $validatedData['position_title'],
            'email' => $validatedData['email'],
            'phone_number' => $validatedData['phone_number'],
            'password' => 'temporary',
            'role' => 'admin',
            'organization_id' => $validatedData['organization_id'] ?? null,
        ]);

        // Update password using Eloquent to properly hash it
        $user = User::where('email', $validatedData['email'])->first();
        $user->password = $validatedData['password'];
        $user->save();
    }

    public function updateAdmin(int $id, array $validatedData): void
    {
        $this->adminRepo->update($id, $validatedData);
    }

    public function deleteAdmin(int $id): void
    {
        $this->adminRepo->delete($id);
    }

    public function restoreAdmin(int $id): void
    {
        $this->adminRepo->restore($id);
    }

    private function formatEventStats(?object $stats): array
    {
        if (! $stats) {
            return $this->getDefaultStats();
        }

        return [
            'total_events' => (string) ($stats->total_events ?? 0),
            'pending_events' => (string) ($stats->pending_events ?? 0),
            'active_events' => (string) ($stats->active_events ?? 0),
            'rejected_events' => (string) ($stats->rejected_events ?? 0),
            'closed_events' => (string) ($stats->closed_events ?? 0),
        ];
    }

    public function getMonthlyPerformanceData(int $userId)
    {
        $year = (int) now()->year;

        $monthlyPerformanceData = $this->adminRepo->getMonthlyPerformanceById($userId, $year);

        return [
            'monthly_performance_data' => $monthlyPerformanceData,
        ];
    }

    public function getEvents(int $id)
    {
        $events = $this->adminRepo->getEvents($id);

        return [
            'events' => $events,
        ];
    }

    private function getDefaultStats(): array
    {
        return [
            'total_events' => '0',
            'pending_events' => '0',
            'active_events' => '0',
            'rejected_events' => '0',
        ];
    }
}
