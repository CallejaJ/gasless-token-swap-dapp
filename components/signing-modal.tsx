// components/signing-modal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Loader2 } from "lucide-react";

interface SigningModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  details?: React.ReactNode; // Cambiado de string a React.ReactNode
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function SigningModal({
  isOpen,
  title,
  description,
  details,
  onConfirm,
  onCancel,
}: SigningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel?.()}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5 text-blue-500' />
            {title}
          </DialogTitle>
          <DialogDescription className='pt-2'>{description}</DialogDescription>
        </DialogHeader>

        {details && (
          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4'>
            <div className='text-sm text-blue-700 dark:text-blue-300'>
              {details}
            </div>
          </div>
        )}

        <div className='space-y-3 my-4'>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 bg-green-500 rounded-full animate-pulse' />
            <span className='text-sm text-muted-foreground'>
              No ETH required for gas
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 bg-green-500 rounded-full animate-pulse' />
            <span className='text-sm text-muted-foreground'>
              Transaction sponsored by ZeroDev
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 bg-green-500 rounded-full animate-pulse' />
            <span className='text-sm text-muted-foreground'>
              Account Abstraction enabled
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <Shield className='mr-2 h-4 w-4' />
            Sign and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
