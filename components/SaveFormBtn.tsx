import React from 'react'
import { Button } from './ui/button'
import { HiSaveAs } from 'react-icons/hi'

const SaveFormBtn = () => {
  return (
    <Button className='gap-2' variant={'outline'}>
        <HiSaveAs className='h-5 w-5'/>
        Save
    </Button>
  )
}

export default SaveFormBtn
