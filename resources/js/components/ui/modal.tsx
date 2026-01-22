import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalProps {
    open: boolean;
    title?: string;
    children?: ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    showFooter?: boolean;
}

export default function Modal({
    open,
    title,
    children,
    onClose,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
    showFooter = true,
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                {title && (
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                )}
                <div className="py-4">{children}</div>
                {showFooter && (
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            {cancelText}
                        </Button>
                        <Button onClick={onConfirm} disabled={loading}>
                            {loading ? 'Loading...' : confirmText}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
