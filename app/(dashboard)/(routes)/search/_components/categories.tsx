"use client"

import { Category } from "@prisma/client"

import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
  FcStatistics, 
  FcMindMap,
  FcBullish,
  FcPrivacy,
  FcCommandLine,
  FcGlobe,
  FcElectronics,
} from "react-icons/fc"
import { IconType } from "react-icons"
import { CategoryItem } from "./category-item"

interface CategoriesProps {
  items: Category[]
}

const iconMap: Record<Category["name"], IconType> = {
  "Web Development": FcGlobe,
  "Mobile Development": FcMultipleDevices,
  "Data Science": FcStatistics,
  "Machine Learning": FcMindMap,
  "Artificial Intelligence": FcElectronics,
  "Cybersecurity": FcPrivacy,
  "Game Development": FcSportsMode,
  "Engineering": FcEngineering,
  "Programming": FcCommandLine,
  "Business": FcBullish,
  "Film": FcFilmReel,
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode,
  "Accounting": FcSalesPerformance,
  "Marketing": FcBullish,
}

export const Categories = ({
  items,
}: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}