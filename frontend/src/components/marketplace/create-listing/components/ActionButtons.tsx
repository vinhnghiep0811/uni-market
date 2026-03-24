import { LoaderCircle, PencilLine, SendHorizonal } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { getSubmissionLabel } from "../utils";
import type { FeedbackTone, SubmissionAction } from "../types";

type ActionButtonsProps = {
  isSubmitting: boolean;
  activeAction: SubmissionAction;
  isDisabled?: boolean;
  feedbackMessage: string | null;
  feedbackTone: FeedbackTone;
  onSaveDraft: () => void;
  onPublish: () => void;
};

const feedbackToneClasses: Record<FeedbackTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-slate-200 bg-slate-50 text-slate-600",
};

export default function ActionButtons({
  isSubmitting,
  activeAction,
  isDisabled,
  feedbackMessage,
  feedbackTone,
  onSaveDraft,
  onPublish,
}: ActionButtonsProps) {
  return (
    <Card className="border border-slate-200 bg-white/95 px-6 py-5 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.4)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-950">
            Ready to post?
          </h2>
          <p className="text-sm leading-6 text-slate-500">
            Save a private draft if you want to come back later, or publish when
            everything looks right.
          </p>
          <div
            className={`inline-flex min-h-10 items-center rounded-2xl border px-3 py-2 text-sm ${feedbackToneClasses[feedbackTone]}`}
          >
            {isSubmitting
              ? getSubmissionLabel(activeAction)
              : feedbackMessage ??
                "Required fields are marked clearly, and drafts stay private until you publish."}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isSubmitting || isDisabled}
            className="rounded-2xl border border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-50"
            leadingIcon={
              activeAction === "draft" && isSubmitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <PencilLine className="h-4 w-4" />
              )
            }
            onClick={onSaveDraft}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            size="lg"
            disabled={isSubmitting || isDisabled}
            className="rounded-2xl bg-blue-950 px-5 text-white hover:bg-blue-900 disabled:bg-slate-300"
            leadingIcon={
              activeAction === "publish" && isSubmitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )
            }
            onClick={onPublish}
          >
            Publish Listing
          </Button>
        </div>
      </div>
    </Card>
  );
}

