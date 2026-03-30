"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  INITIAL_FORM_VALUES,
} from "@/components/marketplace/create-listing/constants";
import type {
  ListingCategory,
  ListingFormErrors,
  ListingFormValues,
} from "@/components/marketplace/create-listing/types";
import {
  validateListingForm,
} from "@/components/marketplace/create-listing/utils";
import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";
import { useAuth } from "@/context/AuthContext";
import ListingList from "@/features/profile/ListingList";
import ProfileHeader from "@/features/profile/ProfileHeader";
import ProfileSidebar from "@/features/profile/ProfileSidebar";
import type {
  ProfileContactState,
  ProfileFormErrors,
  ProfileUserViewModel,
} from "@/features/profile/types";
import { validateProfileForm } from "@/features/profile/utils";
import { updateProfile } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type {
  TransactionApi,
  TransactionListResponse,
  TransactionMutationResponse,
} from "@/lib/transactions";
import type { AuthUser } from "@/types/auth";

import ListingEditorModal from "./listing-management/ListingEditorModal";
import {
  buildManagedListingEditorState,
  buildUpdateListingPayload,
  mapManagedProfileListing,
} from "./listing-management/listing-utils";
import type {
  ManagedProfileListing,
  ManagedProfileListingApi,
} from "./listing-management/types";
import TransactionsPanel from "./transaction-management/TransactionsPanel";

type ListingTab = "my-listings" | "archived-sold";
type DashboardTab = ListingTab | "orders";

const dashboardTabs: Array<{ id: DashboardTab; label: string }> = [
  { id: "my-listings", label: "My Listings" },
  { id: "archived-sold", label: "Archived & Sold" },
  { id: "orders", label: "Orders" },
];

function buildInitialContactState(user: AuthUser) {
  return {
    fullName: user.fullName,
    phoneNumber: user.phoneNumber ?? "",
    facebookLink: user.facebookLink ?? "",
    avatarUrl: user.avatarUrl ?? "",
  };
}

function isListingTab(tab: DashboardTab): tab is ListingTab {
  return tab !== "orders";
}

function filterListingsByTab(
  listings: ManagedProfileListing[],
  activeTab: ListingTab,
) {
  if (activeTab === "my-listings") {
    return listings.filter(
      (listing) =>
        listing.status === "ACTIVE" &&
        listing.backendStatus !== "IN_TRANSACTION",
    );
  }

  return listings.filter((listing) => listing.status !== "ACTIVE");
}

function DashboardTabs({
  activeTab,
  onChangeTab,
}: {
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
}) {
  return (
    <Card className="px-8">
      <div className="flex flex-wrap gap-2">
        {dashboardTabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition duration-200",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default function ManagedUserProfilePage() {
  const { user, logoutUser, setCurrentUser } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <AuthenticatedProfileContent
      user={user}
      onLogout={logoutUser}
      onUpdateCurrentUser={setCurrentUser}
      onNavigateToLogin={() => {
        router.push("/login");
        router.refresh();
      }}
    />
  );
}

type AuthenticatedProfileContentProps = {
  user: AuthUser;
  onLogout: () => Promise<void>;
  onUpdateCurrentUser: (user: AuthUser | null) => void;
  onNavigateToLogin: () => void;
};

function AuthenticatedProfileContent({
  user,
  onLogout,
  onUpdateCurrentUser,
  onNavigateToLogin,
}: AuthenticatedProfileContentProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("my-listings");
  const [profileValues, setProfileValues] = useState<ProfileContactState>(
    buildInitialContactState(user),
  );
  const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [saveFeedbackTone, setSaveFeedbackTone] = useState<"success" | "error">(
    "success",
  );

  const [listings, setListings] = useState<ManagedProfileListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingsLoadError, setListingsLoadError] = useState<string | null>(null);
  const [listingFeedbackMessage, setListingFeedbackMessage] = useState<string | null>(null);
  const [listingFeedbackTone, setListingFeedbackTone] = useState<
    "success" | "error"
  >("success");

  const [buyerTransactions, setBuyerTransactions] = useState<TransactionApi[]>(
    [],
  );
  const [sellerTransactions, setSellerTransactions] = useState<TransactionApi[]>(
    [],
  );
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [transactionsLoadError, setTransactionsLoadError] = useState<string | null>(
    null,
  );
  const [transactionFeedbackMessage, setTransactionFeedbackMessage] =
    useState<string | null>(null);
  const [transactionFeedbackTone, setTransactionFeedbackTone] = useState<
    "success" | "error"
  >("success");
  const [transactionActionId, setTransactionActionId] = useState<string | null>(
    null,
  );

  const [categories, setCategories] = useState<ListingCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(null);

  const [editableListing, setEditableListing] =
    useState<ManagedProfileListing | null>(null);
  const [editorValues, setEditorValues] =
    useState<ListingFormValues>(INITIAL_FORM_VALUES);
  const [editorErrors, setEditorErrors] = useState<ListingFormErrors>({});
  const [editorFeedbackMessage, setEditorFeedbackMessage] = useState<string | null>(null);
  const [editorFeedbackTone, setEditorFeedbackTone] = useState<
    "success" | "error"
  >("success");

  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [archivingListingId, setArchivingListingId] = useState<string | null>(null);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [
          listingsResponse,
          categoriesResponse,
          buyerTransactionsResponse,
          sellerTransactionsResponse,
        ] = await Promise.all([
          apiRequest<ManagedProfileListingApi[]>("/listings/me"),
          apiRequest<ListingCategory[]>("/categories"),
          apiRequest<TransactionListResponse>("/transactions/my-requests"),
          apiRequest<TransactionListResponse>("/transactions/incoming"),
        ]);

        if (!isMounted) {
          return;
        }

        setListings(listingsResponse.map(mapManagedProfileListing));
        setCategories(categoriesResponse);
        setBuyerTransactions(buyerTransactionsResponse.data);
        setSellerTransactions(sellerTransactionsResponse.data);
        setListingsLoadError(null);
        setCategoryLoadError(null);
        setTransactionsLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Could not load your dashboard right now.";

        setListingsLoadError(message);
        setCategoryLoadError(message);
        setTransactionsLoadError(message);
      } finally {
        if (isMounted) {
          setIsLoadingListings(false);
          setIsLoadingCategories(false);
          setIsLoadingTransactions(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadListings = async () => {
    setIsLoadingListings(true);
    setListingsLoadError(null);

    try {
      const response = await apiRequest<ManagedProfileListingApi[]>("/listings/me");
      setListings(response.map(mapManagedProfileListing));
    } catch (error) {
      setListingsLoadError(
        error instanceof Error
          ? error.message
          : "Could not load your listings right now.",
      );
    } finally {
      setIsLoadingListings(false);
    }
  };

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryLoadError(null);

    try {
      const response = await apiRequest<ListingCategory[]>("/categories");
      setCategories(response);
    } catch (error) {
      setCategoryLoadError(
        error instanceof Error
          ? error.message
          : "Could not load categories right now.",
      );
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadTransactions = async () => {
    setIsLoadingTransactions(true);
    setTransactionsLoadError(null);

    try {
      const [buyerResponse, sellerResponse] = await Promise.all([
        apiRequest<TransactionListResponse>("/transactions/my-requests"),
        apiRequest<TransactionListResponse>("/transactions/incoming"),
      ]);

      setBuyerTransactions(buyerResponse.data);
      setSellerTransactions(sellerResponse.data);
    } catch (error) {
      setTransactionsLoadError(
        error instanceof Error
          ? error.message
          : "Could not load your orders right now.",
      );
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const refreshListingsAndTransactions = async () => {
    const [listingsResponse, buyerResponse, sellerResponse] = await Promise.all([
      apiRequest<ManagedProfileListingApi[]>("/listings/me"),
      apiRequest<TransactionListResponse>("/transactions/my-requests"),
      apiRequest<TransactionListResponse>("/transactions/incoming"),
    ]);

    setListings(listingsResponse.map(mapManagedProfileListing));
    setBuyerTransactions(buyerResponse.data);
    setSellerTransactions(sellerResponse.data);
  };

  const profileUser: ProfileUserViewModel = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    facebookLink: user.facebookLink,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    listings,
  };

  const visibleListings = isListingTab(activeTab)
    ? filterListingsByTab(listings, activeTab)
    : [];

  const handleFieldChange = (
    field: keyof ProfileContactState,
    value: string,
  ) => {
    setProfileValues((current) => ({ ...current, [field]: value }));
    setProfileErrors((current) => ({ ...current, [field]: undefined }));
    setSaveFeedback(null);
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateProfileForm(profileValues);
    setProfileErrors(errors);
    setSaveFeedback(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await updateProfile({
        fullName: profileValues.fullName.trim(),
        phoneNumber: profileValues.phoneNumber.trim() || null,
        facebookLink: profileValues.facebookLink.trim() || null,
        avatarUrl: profileValues.avatarUrl.trim() || null,
      });

      setProfileValues({
        fullName: updatedUser.fullName,
        phoneNumber: updatedUser.phoneNumber ?? "",
        facebookLink: updatedUser.facebookLink ?? "",
        avatarUrl: updatedUser.avatarUrl ?? "",
      });
      onUpdateCurrentUser(updatedUser);
      setSaveFeedback("Profile updated successfully.");
      setSaveFeedbackTone("success");
    } catch (error) {
      setSaveFeedback(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
      setSaveFeedbackTone("error");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditor = (listingId: string) => {
    const nextListing = listings.find((listing) => listing.id === listingId);

    if (!nextListing) {
      return;
    }

    setEditableListing(nextListing);
    setEditorValues(buildManagedListingEditorState(nextListing));
    setEditorErrors({});
    setEditorFeedbackMessage(null);
    setEditorFeedbackTone("success");
  };

  const closeEditor = () => {
    if (editingListingId) {
      return;
    }

    setEditableListing(null);
    setEditorValues(INITIAL_FORM_VALUES);
    setEditorErrors({});
    setEditorFeedbackMessage(null);
    setEditorFeedbackTone("success");
  };

  const handleEditorFieldChange = <FieldName extends keyof ListingFormValues>(
    field: FieldName,
    value: ListingFormValues[FieldName],
  ) => {
    setEditorValues((current) => ({ ...current, [field]: value }));
    setEditorErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
    setEditorFeedbackMessage(null);
    setEditorFeedbackTone("success");
  };

  const handleSaveListing = async () => {
    if (!editableListing) {
      return;
    }

    const nextErrors = validateListingForm(editorValues, 0);

    if (categoryLoadError || categories.length === 0) {
      nextErrors.form = "Categories need to load before you can save listing changes.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setEditorErrors(nextErrors);
      setEditorFeedbackMessage(
        nextErrors.form ?? "Please fix the highlighted fields before saving.",
      );
      setEditorFeedbackTone("error");
      return;
    }

    setEditingListingId(editableListing.id);

    try {
      const response = await apiRequest<ManagedProfileListingApi>(
        `/listings/${editableListing.id}`,
        {
          method: "PATCH",
          body: buildUpdateListingPayload(editorValues),
        },
      );

      const updatedListing = mapManagedProfileListing(response);

      setListings((current) =>
        current.map((listing) =>
          listing.id === updatedListing.id ? updatedListing : listing,
        ),
      );
      setListingFeedbackMessage("Listing updated successfully.");
      setListingFeedbackTone("success");
      setEditableListing(null);
      setEditorValues(INITIAL_FORM_VALUES);
      setEditorErrors({});
      setEditorFeedbackMessage(null);
    } catch (error) {
      setEditorFeedbackMessage(
        error instanceof Error ? error.message : "Failed to update listing.",
      );
      setEditorFeedbackTone("error");
    } finally {
      setEditingListingId(null);
    }
  };

  const handleMarkAsSold = async (listingId: string) => {
    setArchivingListingId(listingId);
    setListingFeedbackMessage(null);

    try {
      const response = await apiRequest<ManagedProfileListingApi>(
        `/listings/${listingId}/status`,
        {
          method: "PATCH",
          body: { status: "SOLD" },
        },
      );

      const updatedListing = mapManagedProfileListing(response);

      setListings((current) =>
        current.map((listing) =>
          listing.id === updatedListing.id ? updatedListing : listing,
        ),
      );
      setActiveTab("archived-sold");
      setListingFeedbackMessage("Listing marked as sold.");
      setListingFeedbackTone("success");
    } catch (error) {
      setListingFeedbackMessage(
        error instanceof Error
          ? error.message
          : "Failed to update listing status.",
      );
      setListingFeedbackTone("error");
    } finally {
      setArchivingListingId(null);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm("Delete this listing permanently?")) {
      return;
    }

    setDeletingListingId(listingId);
    setListingFeedbackMessage(null);

    try {
      await apiRequest<{ message: string }>(`/listings/${listingId}`, {
        method: "DELETE",
      });

      setListings((current) => current.filter((listing) => listing.id !== listingId));
      setListingFeedbackMessage("Listing deleted successfully.");
      setListingFeedbackTone("success");
    } catch (error) {
      setListingFeedbackMessage(
        error instanceof Error ? error.message : "Failed to delete listing.",
      );
      setListingFeedbackTone("error");
    } finally {
      setDeletingListingId(null);
    }
  };

  const runTransactionAction = async (
    transactionId: string,
    endpoint: string,
    successMessage: string,
  ) => {
    setTransactionActionId(transactionId);
    setTransactionFeedbackMessage(null);

    try {
      await apiRequest<TransactionMutationResponse>(endpoint, {
        method: "PATCH",
      });

      await refreshListingsAndTransactions();
      setActiveTab("orders");
      setTransactionFeedbackMessage(successMessage);
      setTransactionFeedbackTone("success");
      setTransactionsLoadError(null);
    } catch (error) {
      setTransactionFeedbackMessage(
        error instanceof Error
          ? error.message
          : "Failed to update transaction.",
      );
      setTransactionFeedbackTone("error");
    } finally {
      setTransactionActionId(null);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await onLogout();
      onNavigateToLogin();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <section className="min-h-[calc(100vh-73px)] bg-[#f8fafc] sm:px-6 lg:px-8 px-4 py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <ProfileHeader user={profileUser} />
            <DashboardTabs activeTab={activeTab} onChangeTab={setActiveTab} />

            {isListingTab(activeTab) ? (
              <>
                {listingFeedbackMessage ? (
                  <Card
                    className={`ml-8 p-4 text-sm ${
                      listingFeedbackTone === "success"
                        ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border border-rose-100 bg-rose-50 text-rose-600"
                    }`}
                  >
                    {listingFeedbackMessage}
                  </Card>
                ) : null}

                {isLoadingListings ? (
                  <Card className="p-8 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Loading your listings
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Pulling the latest items from Uni Market.
                    </p>
                  </Card>
                ) : listingsLoadError ? (
                  <Card className="p-8 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Could not load your listings
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">{listingsLoadError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        void loadListings();
                      }}
                      className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Try again
                    </button>
                  </Card>
                ) : (
                  <ListingList
                    listings={visibleListings}
                    activeTab={activeTab}
                    deletingListingId={deletingListingId}
                    archivingListingId={archivingListingId}
                    editingListingId={editingListingId}
                    onEdit={openEditor}
                    onMarkAsSold={handleMarkAsSold}
                    onDelete={handleDeleteListing}
                  />
                )}
              </>
            ) : (
              <>
                {transactionFeedbackMessage ? (
                  <Card
                    className={`py-4 px-8 text-sm ${
                      transactionFeedbackTone === "success"
                        ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border border-rose-100 bg-rose-50 text-rose-600"
                    }`}
                  >
                    {transactionFeedbackMessage}
                  </Card>
                ) : null}

                {isLoadingTransactions ? (
                  <Card className="p-8 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Loading your orders
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Pulling buyer and seller transactions from Uni Market.
                    </p>
                  </Card>
                ) : transactionsLoadError ? (
                  <Card className="p-8 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Could not load your orders
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {transactionsLoadError}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        void loadTransactions();
                      }}
                      className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Try again
                    </button>
                  </Card>
                ) : (
                  <TransactionsPanel
                    buyerTransactions={buyerTransactions}
                    sellerTransactions={sellerTransactions}
                    pendingTransactionId={transactionActionId}
                    onAccept={(transactionId) => {
                      void runTransactionAction(
                        transactionId,
                        `/transactions/${transactionId}/accept`,
                        "Purchase request accepted. Contact details are now available.",
                      );
                    }}
                    onReject={(transactionId) => {
                      void runTransactionAction(
                        transactionId,
                        `/transactions/${transactionId}/reject`,
                        "Purchase request rejected.",
                      );
                    }}
                    onCancel={(transactionId) => {
                      void runTransactionAction(
                        transactionId,
                        `/transactions/${transactionId}/cancel`,
                        "Transaction cancelled. The listing is available again.",
                      );
                    }}
                    onConfirmReceived={(transactionId) => {
                      void runTransactionAction(
                        transactionId,
                        `/transactions/${transactionId}/confirm-received`,
                        "Buyer confirmation saved.",
                      );
                    }}
                    onConfirmSold={(transactionId) => {
                      void runTransactionAction(
                        transactionId,
                        `/transactions/${transactionId}/confirm-sold`,
                        "Seller confirmation saved.",
                      );
                    }}
                  />
                )}
              </>
            )}
          </div>

          <ProfileSidebar
            values={profileValues}
            errors={profileErrors}
            isSaving={isSaving}
            isLoggingOut={isLoggingOut}
            feedbackMessage={saveFeedback}
            feedbackTone={saveFeedbackTone}
            onChange={handleFieldChange}
            onSubmit={handleSaveProfile}
            onLogout={handleLogout}
          />
        </div>
      </section>

      <ListingEditorModal
        isOpen={editableListing !== null}
        listingTitle={editableListing?.title ?? "Edit listing"}
        values={editorValues}
        errors={editorErrors}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        categoryLoadError={categoryLoadError}
        feedbackMessage={editorFeedbackMessage}
        feedbackTone={editorFeedbackTone}
        isSaving={editingListingId !== null}
        onRetryCategories={() => {
          void loadCategories();
        }}
        onChangeField={handleEditorFieldChange}
        onClose={closeEditor}
        onSave={() => {
          void handleSaveListing();
        }}
      />
    </>
  );
}
