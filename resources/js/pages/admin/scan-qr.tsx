import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Scan QR',
        href: admin.scanQr.index.url(),
    },
];

type ScanState = 'idle' | 'scanning' | 'success';

type ScanResponseUser = {
    id: number | null;
    name: string;
    email: string | null;
} | null;

type ScanResponseEvent = {
    id: number;
    title: string;
    location: string;
    status?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
} | null;

type AttendanceDetails = {
    user: ScanResponseUser;
    event: ScanResponseEvent;
    attended_at: string;
};

type CheckInResponse = {
    message: string;
    data: AttendanceDetails;
};

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return '—';
    }

    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(value));
    } catch (error) {
        console.error('Unable to format date', error);
        return value;
    }
};

const formatDateLabel = (value?: string | null) => {
    if (!value) {
        return '—';
    }

    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
        }).format(new Date(value));
    } catch (error) {
        console.error('Unable to format date label', error);
        return value;
    }
};

const formatTimeLabel = (value?: string | null) => {
    if (!value) {
        return '—';
    }

    try {
        return new Intl.DateTimeFormat(undefined, {
            timeStyle: 'short',
        }).format(new Date(`1970-01-01T${value}`));
    } catch (error) {
        console.error('Unable to format time label', error);
        return value;
    }
};

const buildScheduleLabel = (event?: ScanResponseEvent) => {
    if (!event) {
        return '—';
    }

    const dateLabel = formatDateLabel(event.start_date);
    const timeLabel = formatTimeLabel(event.start_time);

    if (dateLabel === '—' && timeLabel === '—') {
        return '—';
    }

    if (dateLabel !== '—' && timeLabel !== '—') {
        return `${dateLabel} · ${timeLabel}`;
    }

    return dateLabel !== '—' ? dateLabel : timeLabel;
};

export default function AdminScanQr() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const controlsRef = useRef<IScannerControls | null>(null);

    const [scanState, setScanState] = useState<ScanState>('idle');
    const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [attendanceDetails, setAttendanceDetails] =
        useState<AttendanceDetails | null>(null);
    const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false);
    const [rawPayload, setRawPayload] = useState<string | null>(null);

    const csrfToken = useMemo(() => {
        if (typeof document === 'undefined') {
            return '';
        }

        const meta = document.querySelector(
            'meta[name="csrf-token"]',
        ) as HTMLMetaElement | null;
        return meta?.content ?? '';
    }, []);

    const stopCamera = useCallback(() => {
        controlsRef.current?.stop();
        controlsRef.current = null;
        readerRef.current = null;
        if (videoRef.current) {
            const stream = videoRef.current.srcObject as MediaStream | null;
            stream?.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    const captureCurrentFrame = useCallback((): string | null => {
        if (!videoRef.current || !canvasRef.current) {
            return null;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 360;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return null;
        }

        ctx.drawImage(video, 0, 0, width, height);
        return canvas.toDataURL('image/png');
    }, []);

    const confirmAttendance = useCallback(
        async (payload: string) => {
            setIsConfirmingAttendance(true);

            try {
                const response = await fetch(admin.scanQr.checkIn.url(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ payload }),
                });

                const data: CheckInResponse | null = await response
                    .json()
                    .catch(() => null);

                if (!response.ok || !data?.data) {
                    let errorMsg =
                        data?.message ??
                        'Failed to update attendance. Please try again.';
                    if (
                        response.status === 419 ||
                        errorMsg.toLowerCase().includes('csrf')
                    ) {
                        errorMsg +=
                            ' If this error persists, please refresh the page and try again.';
                    }
                    throw new Error(errorMsg);
                }

                setAttendanceDetails(data.data);
                setErrorMessage(null);
            } catch (err) {
                console.error('Attendance update failed', err);
                setAttendanceDetails(null);
                setCapturedFrame(null);
                setRawPayload(null);
                setScanState('idle');
                setErrorMessage(
                    err instanceof Error
                        ? err.message
                        : 'Unable to update attendance.',
                );
            } finally {
                setIsConfirmingAttendance(false);
            }
        },
        [csrfToken],
    );

    const handleScanSuccess = useCallback(
        (payload: string) => {
            const frame = captureCurrentFrame();
            setCapturedFrame(frame);
            setRawPayload(payload);
            setScanState('success');
            stopCamera();
            void confirmAttendance(payload);
        },
        [captureCurrentFrame, confirmAttendance, stopCamera],
    );

    const startScan = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setErrorMessage('Camera access is not supported in this browser.');
            return;
        }

        try {
            setErrorMessage(null);
            setCapturedFrame(null);
            setAttendanceDetails(null);
            setRawPayload(null);
            setScanState('scanning');

            const reader = new BrowserMultiFormatReader();
            readerRef.current = reader;

            const controls = await reader.decodeFromConstraints(
                {
                    audio: false,
                    video: {
                        facingMode: { ideal: 'environment' },
                    },
                },
                videoRef.current!,
                (result) => {
                    if (result) {
                        handleScanSuccess(result.getText());
                    }
                },
            );
            controlsRef.current = controls;
        } catch (error) {
            console.error('Unable to access camera', error);
            setErrorMessage(
                'Unable to access camera. Please verify permissions.',
            );
            stopCamera();
            setScanState('idle');
            setAttendanceDetails(null);
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
            setScanState('idle');
        };
    }, [stopCamera]);

    const isBusy = scanState === 'scanning' || isConfirmingAttendance;
    const eventInfo = attendanceDetails?.event;
    const userInfo = attendanceDetails?.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className="m-4 h-full p-6 shadow-md">
                <div className="flex flex-row justify-between gap-8">
                    <div className="flex w-full flex-col gap-6">
                        <Card className="min-h-[450px] items-center justify-center bg-gray-100 text-gray-400">
                            <div className="flex w-full flex-col gap-4 p-4">
                                <p className="text-sm tracking-wide text-gray-500 uppercase">
                                    Camera Preview
                                </p>
                                <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-white">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className={`absolute inset-0 h-full w-full object-cover transition-opacity ${scanState === 'scanning' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                                    />
                                    {scanState !== 'scanning' &&
                                        capturedFrame && (
                                            <img
                                                src={capturedFrame}
                                                alt="Scanned frame"
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        )}
                                    {scanState !== 'scanning' &&
                                        !capturedFrame && (
                                            <div className="text-center text-gray-500">
                                                <p className="text-lg font-semibold">
                                                    Ready to Scan
                                                </p>
                                                <p className="text-sm">
                                                    Click "Scan QR" to open your
                                                    camera.
                                                </p>
                                            </div>
                                        )}
                                    <canvas
                                        ref={canvasRef}
                                        className="hidden"
                                    />
                                </div>
                                {isConfirmingAttendance && (
                                    <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                                        Finalizing attendance...
                                    </p>
                                )}
                                {errorMessage && (
                                    <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                                        {errorMessage}
                                    </p>
                                )}
                                {attendanceDetails && (
                                    <p className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                                        {userInfo?.name ?? 'Attendee'} checked
                                        in at{' '}
                                        {formatDateTime(
                                            attendanceDetails.attended_at,
                                        )}
                                    </p>
                                )}
                            </div>
                        </Card>
                        <div className="flex flex-row place-self-end">
                            <Button
                                onClick={() => {
                                    stopCamera();
                                    startScan();
                                }}
                                disabled={isBusy}
                            >
                                {scanState === 'scanning'
                                    ? 'Scanning…'
                                    : isConfirmingAttendance
                                      ? 'Updating attendance…'
                                      : 'Scan QR'}
                            </Button>
                            {capturedFrame && (
                                <Button
                                    variant="outline"
                                    className="ml-2"
                                    disabled={isBusy}
                                    onClick={() => {
                                        setCapturedFrame(null);
                                        setAttendanceDetails(null);
                                        setRawPayload(null);
                                        setErrorMessage(null);
                                        stopCamera();
                                        startScan();
                                    }}
                                >
                                    Rescan
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full flex-col">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-extrabold">
                                Event Details
                            </h1>
                            <hr className="rounded-2xl border-gray-200"></hr>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <h3 className="text-xs tracking-wide text-gray-500 uppercase">
                                        User
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {userInfo?.name ?? 'Awaiting scan'}
                                    </p>
                                    {userInfo?.email && (
                                        <span className="text-sm text-gray-500">
                                            {userInfo.email}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xs tracking-wide text-gray-500 uppercase">
                                        Event
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {eventInfo?.title ?? 'Awaiting scan'}
                                    </p>
                                    <span className="text-sm text-gray-500">
                                        {eventInfo?.location ?? 'Location TBA'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xs tracking-wide text-gray-500 uppercase">
                                        Status
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {attendanceDetails
                                            ? 'Checked in'
                                            : 'Awaiting scan'}
                                    </p>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xs tracking-wide text-gray-500 uppercase">
                                        Schedule
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {buildScheduleLabel(eventInfo)}
                                    </p>
                                </div>
                                <div className="col-span-2 flex flex-col">
                                    <h3 className="text-xs tracking-wide text-gray-500 uppercase">
                                        Checked-in at
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {attendanceDetails
                                            ? formatDateTime(
                                                  attendanceDetails.attended_at,
                                              )
                                            : '—'}
                                    </p>
                                </div>
                            </div>
                            {!attendanceDetails && (
                                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                                    Scan a ticket to populate attendee and event
                                    details.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
}
