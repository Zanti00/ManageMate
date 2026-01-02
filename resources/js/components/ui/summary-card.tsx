import { cn } from "@/lib/utils"
import { Card } from "./card"
import { Bookmark, LucideIcon } from "lucide-react"

type Props =  {
    value: string;
    label: string;
    icon?: LucideIcon;
    className?: string;
    iconBg?: string;
}

function SummaryCard ({value, label, icon: Icon = Bookmark, className, iconBg}: Props) {
    return(
        <Card>
            <div className={cn('flex flex-col px-6 gap-2', className)}>
                <div className="flex flex-row">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>
                        <Icon className={cn("stroke-white", className)}/>
                    </div>
                </div>
                <div className="flex flex-row">
                    <h3 className="text-3xl font-bold text-gray-900">{value || '0'}</h3>
                </div>
                <div className="flex flex-row">
                    <p className="text-sm text-gray-600">{label}</p>
                </div>
            </div>
        </Card>
    )
}

export { SummaryCard }