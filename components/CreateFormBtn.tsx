'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { BsFileEarmarkPlus } from 'react-icons/bs'
import { ImSpinner2 } from 'react-icons/im'
import { Button } from './ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { toast } from './ui/use-toast'
import { formSchema, formSchemaType } from '@/schemas/form'
import { CreateForm } from '@/actions/form'

const CreateFormBtn = () => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (values: formSchemaType) => {
    try {
      const formId = await CreateForm(values)
      console.log(formId)

      toast({
        title: 'Success',
        description: 'Form created successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create new form</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Create a new form to start collecting data
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}>
            </FormField>
            <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}>
            </FormField>
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting} className='w-full mt-4'>
            {
              !form.formState.isSubmitting
                ? <span>Save</span>
                : <ImSpinner2 className='animate-spin'></ImSpinner2>
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormBtn
