import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { HiSaveAs } from 'react-icons/hi'
import useDesigner from './hooks/useDesigner'
import { toast } from './ui/use-toast'
import { UpdateFormContent } from '@/actions/form'
import { FaSpinner } from 'react-icons/fa'

const SaveFormBtn = ({ id }: {id: number}) => {
  const { elements } = useDesigner()
  const [loading, startTransition] = useTransition()

  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements)
      await UpdateFormContent(id, JsonElements)
      toast({
        title: 'Success',
        description: 'Your form has been saved'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Button className='gap-2' variant={'outline'} disabled={loading}
    onClick={() => { startTransition(updateFormContent) }}>
      <HiSaveAs className='h-5 w-5'/>
      Save
      {loading && <FaSpinner className='animate-spin'/>}
    </Button>
  )
}

export default SaveFormBtn
