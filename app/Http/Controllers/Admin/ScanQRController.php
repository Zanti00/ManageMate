<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\ScanQrService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScanQRController extends Controller
{
    public function __construct(private ScanQrService $scanQrService) {}

    public function index()
    {
        return Inertia::render('admin/scan-qr');
    }

    public function checkIn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payload' => ['required', 'string'],
        ]);

        $adminId = $request->user()->id;

        try {
            $data = $this->scanQrService->handleScan($validated['payload'], $adminId);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Unable to update attendance.',
            ], 500);
        }

        return response()->json([
            'message' => 'Attendance updated successfully.',
            'data' => $data,
        ]);
    }
}
