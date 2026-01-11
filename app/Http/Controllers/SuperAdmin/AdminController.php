<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SuperAdmin\AdminService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct(private AdminService $adminService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = $this->adminService->getAllAdminsWithStats();

        return Inertia::render('superadmin/admin/index', [
            'admins' => $data['admins'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('superadmin/admin/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50',
            'first_name' => 'required|string|max:25',
            'middle_name' => 'nullable|string|max:25',
            'last_name' => 'required|string|max:25',
            'position_title' => 'required|string|max:25',
            'email' => 'required|string|email|max:50|unique:users,email',
            'phone_number' => 'required|string|size:11',
            'password' => 'required|string|min:8|max:255',
        ]);

        try {
            $this->adminService->createAdmin($validated);

            return redirect()->route('superadmin.admin.index')
                ->with('success', 'Admin created successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create admin: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = $this->adminService->getAdminWithStats((int) $id);
        $monthlyPerformanceData = $this->adminService->getMonthlyPerformanceData((int) $id);
        $events = $this->adminService->getEvents((int) $id);

        return Inertia::render('superadmin/admin/view', [
            'admin' => $data['admin'],
            'total_events' => $data['stats']['total_events'],
            'pending_events' => $data['stats']['pending_events'],
            'active_events' => $data['stats']['active_events'],
            'rejected_events' => $data['stats']['rejected_events'],
            'monthly_performance_data' => $monthlyPerformanceData['monthly_performance_data'],
            'events' => $events['events'],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $data = $this->adminService->getAdminWithStats((int) $id);

        return Inertia::render('superadmin/admin/edit', [
            'admin' => $data['admin'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50',
            'first_name' => 'required|string|max:25',
            'middle_name' => 'nullable|string|max:25',
            'last_name' => 'required|string|max:25',
            'position_title' => 'required|string|max:25',
            'email' => ['required', 'string', 'email', 'max:50',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'phone_number' => 'required|string|size:11',
        ]);

        try {
            $this->adminService->updateAdmin((int) $id, $validated);

            return redirect()->route('superadmin.admin.show', $id)
                ->with('success', 'Admin edited successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update admin: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->adminService->deleteAdmin((int) $id);

            return redirect()->route('superadmin.admin.index')
                ->with('success', 'Admin deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete admin: '.$e->getMessage()]);
        }
    }

    public function restore(string $id)
    {
        try {
            $this->adminService->restoreAdmin((int) $id);

            return redirect()->route('superadmin.admin.index')
                ->with('success', 'Admin restored successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to restore admin: '.$e->getMessage()]);
        }
    }
}
