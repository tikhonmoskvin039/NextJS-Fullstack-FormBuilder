'use client';

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon, UpdateIcon } from '@radix-ui/react-icons';
import { Form } from '@prisma/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { RemoveForm } from '@/actions/form';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface IRemoveFormButtonProps {
  form: Form;
}

export const RemoveFormButton = ({ form }: IRemoveFormButtonProps) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const removeForm = async () => {
    try {
      await RemoveForm(form.id);
      router.refresh();
      toast({
        title: 'Success',
        description: 'Form and all their submissions have been deleted.',
        variant: 'default',
      });
    } catch (error: unknown) {
      console.error('error', error);
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={'icon'}
          variant={'ghost'}
          className="flex justify-center items-center h-[20px]"
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone! This will permanently delete your form
          and all submissions around it.
        </AlertDialogDescription>
        <Separator />
        <AlertDialogFooter className="flex flex-1 !justify-between">
          {isLoading ? (
            <Button
              disabled
              className={cn('w-full dark:text-white text-white')}
            >
              <UpdateIcon className="animate-spin" />
            </Button>
          ) : (
            <AlertDialogAction onClick={() => startTransition(removeForm)}>
              Confirm
            </AlertDialogAction>
          )}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
