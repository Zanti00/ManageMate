<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admins = DB::select('EXEC GetAdmins');
        $userId = $admins[0]->id;
        $eventStats = DB::select('EXEC CountEventStatsByAdmin @user_id = :user_id', ['user_id' => $userId]);

        $admins = $admins ?: [];

        $stats = $eventStats[0] ?? null;

        $totalEvents = $stats ? (string) ($stats->total_events ?? 0) : '0';
        $pendingEvents = $stats ? (string) ($stats->pending_events ?? 0) : '0';
        $activeEvents = $stats ? (string) ($stats->active_events ?? 0) : '0';
        $rejectedEvents = $stats ? (string) ($stats->rejected_events ?? 0) : '0';

        return Inertia::render('superadmin/admin/index', [
            'admins' => $admins,
            'total_events' => $totalEvents,
            'pending_events' => $pendingEvents,
            'active_events' => $activeEvents,
            'rejected_events' => $rejectedEvents,
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
            // Use stored procedure with all fields except password
            DB::statement(
                'EXEC InsertAdmins
                @username = :username,
                @first_name = :first_name,
                @middle_name = :middle_name,
                @last_name = :last_name,
                @position_title = :position_title,
                @email = :email,
                @phone_number = :phone_number,
                @password = :password,
                @role = :role',
                [
                    'username' => $validated['username'],
                    'first_name' => $validated['first_name'],
                    'middle_name' => $validated['middle_name'],
                    'last_name' => $validated['last_name'],
                    'position_title' => $validated['position_title'],
                    'email' => $validated['email'],
                    'phone_number' => $validated['phone_number'],
                    'password' => 'temporary',
                    'role' => 'admin',
                ]
            );

            // I used eloquent hashing because stored procedure alters the hashed password
            $user = User::where('email', $validated['email'])->first();
            $user->password = $validated['password'];
            $user->save();

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
        $admin = DB::select(
            'EXEC GetAdminById :id',
            ['id' => $id]
        );
        $eventStats = DB::select('EXEC CountEventStatsByAdmin @user_id = :user_id', ['user_id' => $id]);

        $admin = $admin ? $admin[0] : null;

        $stats = $eventStats[0] ?? null;

        $totalEvents = $stats ? (string) ($stats->total_events ?? 0) : '0';
        $pendingEvents = $stats ? (string) ($stats->pending_events ?? 0) : '0';
        $activeEvents = $stats ? (string) ($stats->active_events ?? 0) : '0';
        $rejectedEvents = $stats ? (string) ($stats->rejected_events ?? 0) : '0';

        return Inertia::render('superadmin/admin/view', [
            'admin' => $admin,
            'total_events' => $totalEvents,
            'pending_events' => $pendingEvents,
            'active_events' => $activeEvents,
            'rejected_events' => $rejectedEvents,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $admin = DB::select(
            'EXEC GetAdminById :id',
            ['id' => $id]
        );

        $admin = $admin ? $admin[0] : null;

        return Inertia::render('superadmin/admin/edit', [
            'admin' => $admin,
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
            // Use stored procedure with all fields except password
            DB::statement(
                'EXEC EditAdmin
                @id = :id,
                @username = :username,
                @first_name = :first_name,
                @middle_name = :middle_name,
                @last_name = :last_name,
                @position_title = :position_title,
                @email = :email,
                @phone_number = :phone_number',
                [
                    'id' => $id,
                    'username' => $validated['username'],
                    'first_name' => $validated['first_name'],
                    'middle_name' => $validated['middle_name'],
                    'last_name' => $validated['last_name'],
                    'position_title' => $validated['position_title'],
                    'email' => $validated['email'],
                    'phone_number' => $validated['phone_number'],
                ]
            );

            return redirect()->route('superadmin.admin.show', $id)
                ->with('success', 'Admin edited successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create admin: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::statement(
                'EXEC DeleteAdmin @id = :id',
                ['id' => $id]
            );

            return redirect()->route('superadmin.admin.index')
                ->with('success', 'Admin deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create admin: '.$e->getMessage()])
                ->withInput();
        }
    }

    public function restore(string $id)
    {
        try {
            DB::statement(
                'EXEC RestoreAdmin @id = :id',
                ['id' => $id]
            );

            return redirect()->route('superadmin.admin.index')
                ->with('success', 'Admin restored successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create admin: '.$e->getMessage()])
                ->withInput();
        }
    }
}
