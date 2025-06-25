"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, GraduationCap } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto items-center">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Teacher Mode
            </Button>
          </Link>
        ) : null}

        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
