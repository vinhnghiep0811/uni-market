function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5 fill-current"
    >
      <path d="M13.5 21v-7h2.3l.3-2.8h-2.6V9.4c0-.8.2-1.4 1.4-1.4H16V5.6c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.4v2.3H8.8V14h2.1v7h2.6Z" />
    </svg>
  );
}

function ZaloIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5 fill-current"
    >
      <path d="M6 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6l3.2-4H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm2.2 3.2V11h2.6l-2.9 3.8h5.9v-1.8H11l2.8-3.8H8.2Zm6.4 0v5.6h1.9V9.2h-1.9Z" />
    </svg>
  );
}

export default function SellerActions() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Contact seller on Facebook"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition duration-200 hover:bg-blue-100"
      >
        <FacebookIcon />
      </button>

      <button
        type="button"
        aria-label="Contact seller on Zalo"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 transition duration-200 hover:bg-cyan-100"
      >
        <ZaloIcon />
      </button>
    </div>
  );
}
