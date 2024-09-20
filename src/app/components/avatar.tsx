import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"


const UseAvatar = ({url}: {url: string})=>{
    return (
        <Avatar className="h-6 w-6">
          <AvatarImage src={url} />
          <AvatarFallback className="bg-neutral-300">
            <Icons.avatar className="h-3 w-3 text-neutral-600"/>
          </AvatarFallback>
        </Avatar>
    )
}

export default UseAvatar;