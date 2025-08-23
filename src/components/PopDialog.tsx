import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface PopDialogProps {
    isConfirmDialogOpen: boolean;
    setIsConfirmDialogOpen: (open: boolean) => void;
    confirmDialogContent: {
        title: string;
        description: string;
        onConfirm: () => void;
    };
}


export default function PopDialog({ isConfirmDialogOpen, setIsConfirmDialogOpen, confirmDialogContent }: PopDialogProps) {
    return <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{confirmDialogContent.title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {confirmDialogContent.description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                    confirmDialogContent.onConfirm();
                    setIsConfirmDialogOpen(false);
                }}>
                    Confirm
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>;
}