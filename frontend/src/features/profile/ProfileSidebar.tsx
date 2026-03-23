import type { FormEvent } from "react";

import AccountActions from "./AccountActions";
import ProfileSettingsForm from "./ProfileSettingsForm";
import type { ProfileContactState, ProfileFormErrors } from "./types";

type ProfileSidebarProps = {
  values: ProfileContactState;
  errors: ProfileFormErrors;
  isSaving: boolean;
  isLoggingOut: boolean;
  feedbackMessage?: string | null;
  feedbackTone?: "success" | "error";
  onChange: (field: keyof ProfileContactState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
};

export default function ProfileSidebar({
  values,
  errors,
  isSaving,
  isLoggingOut,
  feedbackMessage,
  feedbackTone,
  onChange,
  onSubmit,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <ProfileSettingsForm
        values={values}
        errors={errors}
        isSaving={isSaving}
        feedbackMessage={feedbackMessage}
        feedbackTone={feedbackTone}
        onChange={onChange}
        onSubmit={onSubmit}
      />
      <AccountActions isLoggingOut={isLoggingOut} onLogout={onLogout} />
    </aside>
  );
}
