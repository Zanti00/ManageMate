<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\DashboardService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function index()
    {
        $data = $this->dashboardService->getDashboardData(Auth::id());

        return Inertia::render('user/dashboard', $data);
    }
}
