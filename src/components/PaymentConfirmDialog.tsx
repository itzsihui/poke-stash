import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PaymentConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  gachaType: "normal" | "premium";
  tonAmount: number;
}

export const PaymentConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  gachaType,
  tonAmount,
}: PaymentConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-card border-2 border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center">
            Confirm 1 Draw of {gachaType === "premium" ? "Premium" : "Normal"} Gacha?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg py-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">Cost:</p>
              <p className="text-3xl font-bold text-primary">
                {tonAmount} TON
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
          <AlertDialogCancel className="flex-1 m-0">No</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="flex-1 m-0 bg-gradient-primary hover:opacity-90"
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
