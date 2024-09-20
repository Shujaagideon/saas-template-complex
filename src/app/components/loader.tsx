import React from 'react'
import { Icons } from '../../components/ui/icons'
import { cn } from '@/lib/utils'

const Loader = ({className="", mr=""}:{className?: string, mr?: string}) => {
  return (
    <div className={`animate-spin ${mr}`}>
        <Icons.loader className={cn("h-6 w-6", className)}/>
    </div>
  )
}

export default Loader