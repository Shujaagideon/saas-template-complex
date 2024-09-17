import React from 'react'
import { Icons } from '../../components/ui/icons'
import { cn } from '@/lib/utils'

const Loader = ({className=""}:{className?: string}) => {
  return (
    <div className='animate-spin'>
        <Icons.loader className={cn("h-6 w-6", className)}/>
    </div>
  )
}

export default Loader