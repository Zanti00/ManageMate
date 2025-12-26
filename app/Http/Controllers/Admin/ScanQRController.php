<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ScanQRController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/scan-qr');
    }
}
