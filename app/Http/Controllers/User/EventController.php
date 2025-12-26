<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('user/event/index');
    }
}
