/* eslint-disable @next/next/no-img-element */
"use client";

import type { ReactNode } from "react";
import { CheckCheck, CircleOff, Facebook, Phone, ShoppingBag, Store } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";
import type { TransactionApi } from "@/lib/transactions";

const FALLBACK_IMAGE = "/images/download.jpg";

type TransactionsPanelProps = {
  buyerTransactions: TransactionApi[];
  sellerTransactions: TransactionApi[];
  pendingTransactionId: string | null;
  onAccept: (transactionId: string) => void;
  onReject: (transactionId: string) => void;
  onCancel: (transactionId: string) => void;
  onConfirmReceived: (transactionId: string) => void;
  onConfirmSold: (transactionId: string) => void;
};

type TransactionRole = "buyer" | "seller";

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "recently";
  }

  const diffInSeconds = Math.round((timestamp - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(diffInSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  if (absoluteSeconds < 60) {
    return formatter.format(diffInSeconds, "second");
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (absoluteSeconds < 60 * 60) {
    return formatter.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInSeconds / (60 * 60));
  if (absoluteSeconds < 60 * 60 * 24) {
    return formatter.format(diffInHours, "hour");
  }

  const diffInDays = Math.round(diffInSeconds / (60 * 60 * 24));
  if (absoluteSeconds < 60 * 60 * 24 * 30) {
    return formatter.format(diffInDays, "day");
  }

  const diffInMonths = Math.round(diffInSeconds / (60 * 60 * 24 * 30));
  if (absoluteSeconds < 60 * 60 * 24 * 365) {
    return formatter.format(diffInMonths, "month");
  }

  const diffInYears = Math.round(diffInSeconds / (60 * 60 * 24 * 365));
  return formatter.format(diffInYears, "year");
}

function formatVndPrice(value: number | string) {
  const numericValue = Number(value);

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

function normalizeExternalUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function getStatusPresentation(status: TransactionApi["status"]) {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending",
        className: "bg-blue-100 text-blue-700",
        description: "Waiting for the seller to review this order.",
      };
    case "ACCEPTED":
      return {
        label: "Accepted",
        className: "bg-amber-100 text-amber-800",
        description: "Both sides should contact each other and complete the trade.",
      };
    case "COMPLETED":
      return {
        label: "Sold",
        className: "bg-emerald-100 text-emerald-700",
        description: "Both sides confirmed successfully. The item is sold.",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-slate-100 text-slate-700",
        description: "This order was cancelled and the listing can go live again.",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        className: "bg-rose-100 text-rose-700",
        description: "The seller declined this purchase request.",
      };
    default:
      return {
        label: status,
        className: "bg-slate-100 text-slate-700",
        description: "Transaction status updated.",
      };
  }
}

function getContact(transaction: TransactionApi, role: TransactionRole) {
  if (role === "buyer") {
    return transaction.seller;
  }

  return transaction.buyer;
}

function getContactHeading(role: TransactionRole) {
  if (role === "buyer") {
    return "Seller contact";
  }

  return "Buyer contact";
}

function getTimestampLabel(role: TransactionRole, createdAt: string) {
  if (role === "buyer") {
    return `Requested ${formatRelativeTime(createdAt)}`;
  }

  return `Received ${formatRelativeTime(createdAt)}`;
}

function TransactionSection({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon,
  transactions,
  role,
  pendingTransactionId,
  onAccept,
  onReject,
  onCancel,
  onConfirmReceived,
  onConfirmSold,
}: {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: ReactNode;
  transactions: TransactionApi[];
  role: TransactionRole;
  pendingTransactionId: string | null;
  onAccept: (transactionId: string) => void;
  onReject: (transactionId: string) => void;
  onCancel: (transactionId: string) => void;
  onConfirmReceived: (transactionId: string) => void;
  onConfirmSold: (transactionId: string) => void;
}) {
  if (transactions.length === 0) {
    return (
      <Card className="p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-2.5 text-slate-700">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{emptyTitle}</h2>
            <p className="text-sm text-slate-500">{emptyDescription}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-2.5 text-slate-700">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </Card>

      {transactions.map((transaction) => {
        const statusPresentation = getStatusPresentation(transaction.status);
        const isPending = pendingTransactionId === transaction.id;
        const contact = getContact(transaction, role);
        const contactFacebookLink = normalizeExternalUrl(contact?.facebookLink);
        const imageUrl = transaction.listing.images[0]?.imageUrl ?? FALLBACK_IMAGE;

        return (
          <Card key={transaction.id} className="px-8">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="h-28 overflow-hidden rounded-[22px] bg-slate-100 lg:w-32 lg:shrink-0">
                <img
                  src={imageUrl}
                  alt={transaction.listing.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusPresentation.className}>
                        {statusPresentation.label}
                      </Badge>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        {getTimestampLabel(role, transaction.createdAt)}
                      </p>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-slate-950">
                      {transaction.listing.title}
                    </h3>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {formatVndPrice(transaction.listing.price)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {statusPresentation.description}
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {role === "buyer" ? "Seller" : "Buyer"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {contact?.fullName ?? "Campus user"}
                    </p>
                    {contact?.email ? (
                      <p className="mt-1 text-xs text-slate-500">{contact.email}</p>
                    ) : null}
                  </div>
                </div>

                {transaction.message ? (
                  <div className="rounded-[20px] bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
                    <span className="font-semibold text-slate-900">Message:</span>{" "}
                    {transaction.message}
                  </div>
                ) : null}

                {(transaction.status === "ACCEPTED" ||
                  transaction.status === "COMPLETED") && (
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="rounded-[20px] bg-slate-50 px-4 py-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {getContactHeading(role)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3">
                        {contact?.phoneNumber ? (
                          <a
                            href={`tel:${contact.phoneNumber}`}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800",
                            )}
                          >
                            <Phone className="h-4 w-4" />
                            Zalo / Phone
                          </a>
                        ) : null}

                        {contactFacebookLink ? (
                          <a
                            href={contactFacebookLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            <Facebook className="h-4 w-4" />
                            Facebook
                          </a>
                        ) : null}
                      </div>

                      {!contact?.phoneNumber && !contactFacebookLink ? (
                        <p className="mt-3 text-sm text-slate-500">
                          This user has not added Facebook or Zalo/phone yet.
                        </p>
                      ) : null}
                    </div>

                    <div className="rounded-[20px] bg-slate-50 px-4 py-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Confirmation progress
                      </p>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <p>
                          Buyer:{" "}
                          <span className="font-semibold text-slate-900">
                            {transaction.buyerConfirmed ? "Confirmed" : "Pending"}
                          </span>
                        </p>
                        <p>
                          Seller:{" "}
                          <span className="font-semibold text-slate-900">
                            {transaction.sellerConfirmed ? "Confirmed" : "Pending"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {role === "buyer" && transaction.status === "PENDING" ? (
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={isPending}
                      onClick={() => onCancel(transaction.id)}
                    >
                      {isPending ? "Updating..." : "Cancel request"}
                    </Button>
                  ) : null}

                  {role === "buyer" && transaction.status === "ACCEPTED" ? (
                    <>
                      <Button
                        size="sm"
                        disabled={isPending || transaction.buyerConfirmed}
                        onClick={() => onConfirmReceived(transaction.id)}
                      >
                        {transaction.buyerConfirmed
                          ? "You confirmed"
                          : isPending
                            ? "Updating..."
                            : "Confirm received"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isPending}
                        onClick={() => onCancel(transaction.id)}
                      >
                        {isPending ? "Updating..." : "Cancel order"}
                      </Button>
                    </>
                  ) : null}

                  {role === "seller" && transaction.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() => onAccept(transaction.id)}
                      >
                        {isPending ? "Updating..." : "Accept"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isPending}
                        onClick={() => onReject(transaction.id)}
                      >
                        {isPending ? "Updating..." : "Reject"}
                      </Button>
                    </>
                  ) : null}

                  {role === "seller" && transaction.status === "ACCEPTED" ? (
                    <>
                      <Button
                        size="sm"
                        disabled={isPending || transaction.sellerConfirmed}
                        onClick={() => onConfirmSold(transaction.id)}
                      >
                        {transaction.sellerConfirmed
                          ? "You confirmed"
                          : isPending
                            ? "Updating..."
                            : "Confirm sold"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isPending}
                        onClick={() => onCancel(transaction.id)}
                      >
                        {isPending ? "Updating..." : "Cancel transaction"}
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function TransactionsPanel({
  buyerTransactions,
  sellerTransactions,
  pendingTransactionId,
  onAccept,
  onReject,
  onCancel,
  onConfirmReceived,
  onConfirmSold,
}: TransactionsPanelProps) {
  return (
    <div className="space-y-6">
      <TransactionSection
        title="My Orders"
        description="Track requests you sent to sellers, cancel them, or confirm when the trade is done."
        emptyTitle="No purchase requests yet"
        emptyDescription="When you press Dat mua on the home page, the order will appear here."
        icon={<ShoppingBag className="h-5 w-5" />}
        transactions={buyerTransactions}
        role="buyer"
        pendingTransactionId={pendingTransactionId}
        onAccept={onAccept}
        onReject={onReject}
        onCancel={onCancel}
        onConfirmReceived={onConfirmReceived}
        onConfirmSold={onConfirmSold}
      />

      <TransactionSection
        title="Orders on my listings"
        description="Accept requests, contact the buyer through Facebook or Zalo, and confirm when the item is sold."
        emptyTitle="No incoming requests"
        emptyDescription="Buyer requests for your listings will show up here."
        icon={<Store className="h-5 w-5" />}
        transactions={sellerTransactions}
        role="seller"
        pendingTransactionId={pendingTransactionId}
        onAccept={onAccept}
        onReject={onReject}
        onCancel={onCancel}
        onConfirmReceived={onConfirmReceived}
        onConfirmSold={onConfirmSold}
      />

      {/* {(buyerTransactions.length > 0 || sellerTransactions.length > 0) && (
        <Card className="border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-2 text-slate-700 ring-1 ring-slate-200">
              <CheckCheck className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Order flow</p>
              <p>Buyer creates request, seller accepts, both contact each other, then each side confirms.</p>
              <p>If the trade fails, either side can cancel the accepted transaction and the listing returns to available.</p>
            </div>
          </div>
        </Card>
      )} */}

      {/* {(buyerTransactions.length > 0 || sellerTransactions.length > 0) && (
        <Card className="border border-rose-100 bg-rose-50/60 p-5 text-sm text-rose-700">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-2 text-rose-700 ring-1 ring-rose-100">
              <CircleOff className="h-4 w-4" />
            </div>
            <p>
              Use <span className="font-semibold">Cancel</span> for accepted
              transactions that failed. Use <span className="font-semibold">Reject</span>
              only when the seller declines a pending request before accepting it.
            </p>
          </div>
        </Card>
      )} */}
    </div>
  );
}
