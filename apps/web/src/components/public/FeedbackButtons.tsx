"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useRecordFeedback } from "@/hooks";
import { toast } from "sonner";

interface FeedbackButtonsProps {
  articleId: string;
}

export function FeedbackButtons({ articleId }: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const recordFeedback = useRecordFeedback();

  const handleFeedback = (helpful: boolean) => {
    if (feedback !== null) return; // Already voted

    setFeedback(helpful);
    recordFeedback.mutate(
      { articleId, helpful },
      {
        onSuccess: () => {
          toast.success("Terima kasih atas feedback Anda!");
        },
        onError: () => {
          toast.error("Gagal mengirim feedback");
          setFeedback(null);
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 text-center">
      <p className="text-base mb-4 text-text-primary">
        Apakah artikel ini membantu?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleFeedback(true)}
          disabled={feedback !== null}
          className={`px-6 py-2 rounded-lg border border-border text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
            feedback === true ? "bg-green-50 border-green-500" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ThumbsUp className="w-4 h-4" />
          Ya
        </button>
        <button
          onClick={() => handleFeedback(false)}
          disabled={feedback !== null}
          className={`px-6 py-2 rounded-lg border border-border text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
            feedback === false ? "bg-red-50 border-red-500" : ""
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ThumbsDown className="w-4 h-4" />
          Tidak
        </button>
      </div>
    </div>
  );
}
