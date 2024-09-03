'use client';

import { Form } from '@prisma/client';
import React, {
  KeyboardEvent,
  useEffect,
  useState,
  useTransition,
} from 'react';
import PreviewDialogBtn from './PreviewDialogBtn';
import SaveFormBtn from './SaveFormBtn';
import PublishFormBtn from './PublishFormBtn';
import Designer from './Designer';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import DragOverlayWrapper from './DragOverlayWrapper';
import useDesigner from './hooks/useDesigner';
import { ImSpinner2 } from 'react-icons/im';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import Link from 'next/link';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import Confetti from 'react-confetti';
import { Badge } from './ui/badge';
import { ChangeFormName } from '@/actions/form';
import { useRouter } from 'next/navigation';

const FormBuilder = ({ form }: { form: Form }) => {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const { setElements, setSelectedElement } = useDesigner();
  const [isReady, setIsReady] = useState(false);
  const [editFormName, setEditFormName] = useState(false);
  const [formName, setFormName] = useState(form.name);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (isReady) return;
    const elements = JSON.parse(form.content);
    setElements(elements);
    setSelectedElement(null);
    const readyTimeout = setTimeout(() => setIsReady(true), 500);

    return () => clearInterval(readyTimeout);
  }, [form, setElements, isReady, setSelectedElement]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ImSpinner2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  const handleUpdateFormName = async (e: KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === 'Enter') {
        await ChangeFormName(form, formName);
        router.refresh();
        setEditFormName(false);
        toast({
          title: 'Success',
          description: 'Form name updated successfully.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('error', error);
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  const shareURL = `${window.location.origin}/submit/${form.shareURL}`;

  if (form.published) {
    return (
      <>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1000}
        />
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="max-w-md">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
              🎉Form Published🎉
            </h1>
            <h2 className="text-2xl">Share this form</h2>
            <h3 className="texxt-xl text-muted-foreground border-b pb-10">
              Anyone with the link can view and submit the form
            </h3>
            <div className="my-4 flex flex-col gap-2 itmes-center w-full border-b pb-4">
              <Input className="w-full" readOnly value={shareURL}></Input>
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareURL);
                  toast({
                    title: 'Copied!',
                    description: 'Link copied to clipboard',
                  });
                }}
              >
                Copy Link
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={'link'} asChild>
                <Link href={'/'} className="gap-2">
                  <BsArrowLeft />
                  Go back home
                </Link>
              </Button>
              <Button variant={'link'} asChild>
                <Link href={`/forms/${form.id}`} className="gap-2">
                  Form details
                  <BsArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2
            className="truncate font-medium cursor-pointer w-full"
            onClick={() => setEditFormName(true)}
          >
            <span className="text-muted-foreground mr-2">Form:</span>
            <div className="flex flex-row gap-2">
              {editFormName ? (
                <>
                  <input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => handleUpdateFormName(e)}
                  />
                  <Badge variant={'destructive'}>
                    Press "ENTER" to save changes
                  </Badge>
                </>
              ) : (
                form.name
              )}
            </div>
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </nav>
        <div
          className="flex w-full flex-grow items-center justify-center
            relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)]
            dark:bg-[url(/paper-dark.svg)]"
        >
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default FormBuilder;
