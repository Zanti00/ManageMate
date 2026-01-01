import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from './card';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface RegisterModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    eventTitle?: string;
    eventLocation?: string;
    eventPrice?: string;
    eventDate: string;
    eventTime: string;
    eventId: number;
}

export function RegisterModal({ open, onClose, onConfirm, eventTitle, eventLocation, eventPrice, eventDate, eventTime, eventId }: RegisterModalProps) {
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = () => {
        setIsSubmitting(true);
        
        router.post(
            `/user/event/${eventId}/register`,
            {
                event_id: eventId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.error(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };
    
    return (
        
        <Dialog open={open} onOpenChange={onClose} >
            
            <DialogContent className='bg-white'>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <DialogTitle>Confirm Registration</DialogTitle>
                        <DialogDescription>Are you sure you want to register for <span className="font-bold">{eventTitle}</span>?</DialogDescription>
                    </div>
                    <Card className='bg-gray-100 shadow-none flex flex-col p-4 gap-1'>
                        <DialogTitle>
                            {eventTitle}
                        </DialogTitle>
                        <p className='text-gray-600 text-sm'>
                            {eventDate}
                        </p>
                        <p className='text-gray-600 text-sm'>
                            {eventTime}
                        </p>
                        <p className='text-gray-600 text-sm'>
                            {eventLocation}
                        </p>
                        <p className='text-gray-600 text-sm'>
                            {eventPrice}
                        </p>
                    </Card>
                </div>
                <DialogFooter className='grid grid-cols-2'>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
