<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SuperAdmin\OrganizationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function __construct(private OrganizationService $organizationService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = $this->organizationService->getAllOrganizations();

        return Inertia::render('superadmin/organization/index', [
            'organizations' => $data['organizations'],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('superadmin/organization/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'abbreviation' => 'required|string|max:20',
            'email' => 'required|string|email|max:100',
            'address' => 'required|string|max:255',
            'type' => 'required|string|in:academic,non-academic',
        ]);

        try {
            $this->organizationService->create($validated);

            return redirect()->route('superadmin.organization.index')
                ->with('success', 'Organization created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to create organization: '.$e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $organization = $this->organizationService->getOrganization((int) $id);

        if (! $organization) {
            abort(404);
        }

        return Inertia::render('superadmin/organization/view', [
            'organization' => $organization,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $organization = $this->organizationService->getOrganization((int) $id);

        if (! $organization) {
            abort(404);
        }

        return Inertia::render('superadmin/organization/edit', [
            'organization' => $organization,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'abbreviation' => 'required|string|max:20',
            'email' => 'required|string|email|max:100',
            'address' => 'required|string|max:255',
            'type' => 'required|string|in:academic,non-academic',
        ]);

        try {
            $this->organizationService->updateOrganization((int) $id, $validated);

            return redirect()->route('superadmin.organization.show', $id)
                ->with('success', 'Organization updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to update organization: '.$e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->organizationService->deleteOrganization((int) $id);

            return redirect()->route('superadmin.organization.index')
                ->with('success', 'Organization deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Failed to delete organization: '.$e->getMessage(),
            ]);
        }
    }
}
