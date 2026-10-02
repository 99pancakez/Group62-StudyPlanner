type PillVariant = "valid" | "prerequisite" | "corequisite" | "eligibility";

function renderIcon(variant: PillVariant) {
  switch (variant) {
    case "valid":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="10"
            cy="10"
            r="8.5"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M6 10.5l2.5 2.5L14 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "prerequisite":
    case "corequisite":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 3l7.5 13.5h-15L10 3z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M10 7.5v4"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="10" cy="14" r="1" fill="#fff" />
        </svg>
      );
    case "eligibility":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="10"
            cy="10"
            r="8.5"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M7 7l6 6M13 7l-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

interface StatusPillProps {
  variant: PillVariant;
  heading: string;
  description: string;
}

function StatusPill({ variant, heading, description }: StatusPillProps) {
  return (
    <div className={`pill pill--${variant}`} role="status">
      <span className="pill__icon" aria-hidden="true">
        {renderIcon(variant)}
      </span>
      <div className="pill__content">
        <span className="pill__heading">{heading}</span>
        <span className="pill__description">{description}</span>
      </div>
    </div>
  );
}

export default StatusPill;
