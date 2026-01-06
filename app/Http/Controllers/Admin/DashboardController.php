<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function index()
    {
        $data = $this->dashboardService->getDashboardData(Auth::id());

        return Inertia::render('admin/dashboard', $data);
    }
}
