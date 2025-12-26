<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('superadmin/event/index');
    }
}
