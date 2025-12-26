<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('superadmin/admins/index');
    }

    public function edit()
    {
        return Inertia::render('superadmin/admins/view');
    }

    public function create()
    {
        return Inertia::render('superadmin/admins/create');
    }
}
