<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SuperAdmin\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function index()
    {
        $data = $this->dashboardService->getDashboardData();

        return Inertia::render('superadmin/dashboard', $data);
    }
}
