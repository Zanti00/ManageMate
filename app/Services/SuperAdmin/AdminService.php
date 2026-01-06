<?php

namespace App\Services\SuperAdmin;

use App\Models\User;
use App\Repositories\SuperAdmin\AdminRepository;

class AdminService
{
    public function __construct(private AdminRepository $adminRepo) {}

    public function getAllAdminsWithStats(): array
    {
        $admins = $this->adminRepo->getAll() ?: [];

        if (empty($admins)) {
            return [
                'admins' => [],
                'stats' => $this->getDefaultStats(),
            ];
        }

        $userId = $admins[0]->id;
        $stats = $this->adminRepo->getEventStats($userId);

        return [
            'admins' => $admins,
            'stats' => $this->formatEventStats($stats),
        ];
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
