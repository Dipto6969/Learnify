import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
    numberOfItems: number;
    label: string;
    variant?: "default" | "success";
    icon: LucideIcon;
}

export const InfoCard = ({
    variant,
    icon: Icon,
    label,
    numberOfItems
}: InfoCardProps) => {
    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge
             variant={variant}
             icon={Icon}
            />
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p>
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    )
}