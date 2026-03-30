// "use client";

// import type { FormEvent } from "react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { useAuth } from "@/context/AuthContext";
// import { updateProfile } from "@/lib/auth";
// import type { AuthUser } from "@/types/auth";

// import ListingList from "./ListingList";
// import { buildProfileUser } from "./mockData";
// import ProfileHeader from "./ProfileHeader";
// import ProfileSidebar from "./ProfileSidebar";
// import ProfileTabs from "./ProfileTabs";
// import type {
//   ProfileContactState,
//   ProfileFormErrors,
//   ProfileListing,
//   ProfileTab,
// } from "./types";
// import { validateProfileForm } from "./utils";

// function buildInitialContactState(user: ReturnType<typeof buildProfileUser>) {
//   return {
//     fullName: user.fullName,
//     phoneNumber: user.phoneNumber ?? "",
//     facebookLink: user.facebookLink ?? "",
//     avatarUrl: user.avatarUrl ?? "",
//   };
// }

// function filterListingsByTab(listings: ProfileListing[], activeTab: ProfileTab) {
//   if (activeTab === "my-listings") {
//     return listings.filter((listing) => listing.status === "ACTIVE");
//   }

//   return listings.filter((listing) => listing.status !== "ACTIVE");
// }

// export default function UserProfilePage() {
//   const { user, logoutUser, setCurrentUser } = useAuth();
//   const router = useRouter();

//   if (!user) {
//     return null;
//   }

//   return (
//     <AuthenticatedProfileContent
//       user={user}
//       onLogout={logoutUser}
//       onUpdateCurrentUser={setCurrentUser}
//       onNavigateToLogin={() => {
//         router.push("/login");
//         router.refresh();
//       }}
//     />
//   );
// }

// type AuthenticatedProfileContentProps = {
//   user: AuthUser;
//   onLogout: () => Promise<void>;
//   onUpdateCurrentUser: (user: AuthUser | null) => void;
//   onNavigateToLogin: () => void;
// };

// function AuthenticatedProfileContent({
//   user,
//   onLogout,
//   onUpdateCurrentUser,
//   onNavigateToLogin,
// }: AuthenticatedProfileContentProps) {
//   const profileUser = buildProfileUser(user);
//   const [activeTab, setActiveTab] = useState<ProfileTab>("my-listings");
//   const [profileValues, setProfileValues] = useState<ProfileContactState>(
//     buildInitialContactState(profileUser),
//   );
//   const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({});
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
//   const [saveFeedbackTone, setSaveFeedbackTone] = useState<"success" | "error">(
//     "success",
//   );
//   const [editingListingId, setEditingListingId] = useState<string | null>(null);
//   const [archivingListingId, setArchivingListingId] = useState<string | null>(
//     null,
//   );
//   const [deletingListingId, setDeletingListingId] = useState<string | null>(
//     null,
//   );
//   const [listings, setListings] = useState<ProfileListing[]>(profileUser.listings);

//   const visibleListings = filterListingsByTab(listings, activeTab);

//   const handleFieldChange = (
//     field: keyof ProfileContactState,
//     value: string,
//   ) => {
//     setProfileValues((current) => ({ ...current, [field]: value }));
//     setProfileErrors((current) => ({ ...current, [field]: undefined }));
//     setSaveFeedback(null);
//   };

//   const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const errors = validateProfileForm(profileValues);
//     setProfileErrors(errors);
//     setSaveFeedback(null);

//     if (Object.keys(errors).length > 0) {
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const updatedUser = await updateProfile({
//         fullName: profileValues.fullName.trim(),
//         phoneNumber: profileValues.phoneNumber.trim() || null,
//         facebookLink: profileValues.facebookLink.trim() || null,
//         avatarUrl: profileValues.avatarUrl.trim() || null,
//       });

//       setProfileValues({
//         fullName: updatedUser.fullName,
//         phoneNumber: updatedUser.phoneNumber ?? "",
//         facebookLink: updatedUser.facebookLink ?? "",
//         avatarUrl: updatedUser.avatarUrl ?? "",
//       });
//       onUpdateCurrentUser(updatedUser);
//       setSaveFeedback("Profile updated successfully.");
//       setSaveFeedbackTone("success");
//     } catch (error) {
//       setSaveFeedback(
//         error instanceof Error ? error.message : "Failed to update profile.",
//       );
//       setSaveFeedbackTone("error");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleEditListing = async (listingId: string) => {
//     setEditingListingId(listingId);

//     await new Promise((resolve) => setTimeout(resolve, 350));

//     setListings((current) =>
//       current.map((listing) =>
//         listing.id === listingId
//           ? {
//               ...listing,
//               title: `${listing.title} (Edited)`,
//               updatedAtLabel: "Updated just now",
//             }
//           : listing,
//       ),
//     );
//     setEditingListingId(null);
//   };

//   const handleMarkAsSold = async (listingId: string) => {
//     setArchivingListingId(listingId);

//     await new Promise((resolve) => setTimeout(resolve, 450));

//     setListings((current) =>
//       current.map((listing) =>
//         listing.id === listingId
//           ? {
//               ...listing,
//               status: "SOLD",
//               updatedAtLabel: "Marked sold just now",
//             }
//           : listing,
//       ),
//     );
//     setActiveTab("archived-sold");
//     setArchivingListingId(null);
//   };

//   const handleDeleteListing = async (listingId: string) => {
//     setDeletingListingId(listingId);

//     await new Promise((resolve) => setTimeout(resolve, 350));

//     setListings((current) => current.filter((listing) => listing.id !== listingId));
//     setDeletingListingId(null);
//   };

//   const handleLogout = async () => {
//     setIsLoggingOut(true);

//     try {
//       await onLogout();
//       onNavigateToLogin();
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   return (
//     <section className="min-h-[calc(100vh-73px)] bg-black px-4 py-8">
//       <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
//         <div className="space-y-5">
//           <ProfileHeader user={profileUser} />
//           <ProfileTabs activeTab={activeTab} onChangeTab={setActiveTab} />
//           <ListingList
//             listings={visibleListings}
//             activeTab={activeTab}
//             deletingListingId={deletingListingId}
//             archivingListingId={archivingListingId}
//             editingListingId={editingListingId}
//             onEdit={handleEditListing}
//             onMarkAsSold={handleMarkAsSold}
//             onDelete={handleDeleteListing}
//           />
//         </div>

//         <ProfileSidebar
//           values={profileValues}
//           errors={profileErrors}
//           isSaving={isSaving}
//           isLoggingOut={isLoggingOut}
//           feedbackMessage={saveFeedback}
//           feedbackTone={saveFeedbackTone}
//           onChange={handleFieldChange}
//           onSubmit={handleSaveProfile}
//           onLogout={handleLogout}
//         />
//       </div>
//     </section>
//   );
// }
