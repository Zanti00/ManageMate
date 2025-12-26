<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/event/index');
    }

    public function create()
    {
        return Inertia::render('admin/event/create');
    }

    public function view()
    {
        return Inertia::render('admin/event/view');
    }
}
