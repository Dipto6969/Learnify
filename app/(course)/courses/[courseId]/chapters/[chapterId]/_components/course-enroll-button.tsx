"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  const onClick = async () => {
    if (!userId) {
      // Redirect unauthenticated users to sign-in page
      return router.push("/sign-in");
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch {
      toast.error("Failed to enroll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto"
      size="sm"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
