import {RocketIcon} from "lucide-react"
type Props={
    degress:number
}
export const RockeCompo=({degress}:Props)=>{
     return (
        <div className="rocket-shadow">
         <RocketIcon className="fill-red-500" size={32} style={{
                transform: `rotate(${-45 - degress / 3}deg)`,
                transition: 'all',
                animationDuration: '10ms' }} />
           </div> 
         )
}      
