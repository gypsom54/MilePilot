const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  'aria-hidden': true as const,
};

export function IconSearch() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.25" />
      <path d="M20 20L16.25 16.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function IconUser() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="8" r="3.75" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M5.5 19.5C5.5 16.186 8.41 13.5 12 13.5C15.59 13.5 18.5 16.186 18.5 19.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCart() {
  return (
    <svg {...ICON_PROPS}>
      <path
        d="M6.5 7H19.5L17.75 14H8.25L6.5 7Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M6.5 7L5.25 4H3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="9.25" cy="17.25" r="1.1" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16.25" cy="17.25" r="1.1" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function IconShield() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.25L4.75 6.75V12C4.75 16.175 7.9 19.675 12 20.5C16.1 19.675 19.25 16.175 19.25 12V6.75L12 3.25Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 12L11 13.75L14.75 10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconVerify() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3L4 7V12C4 16.418 7.582 20.418 12 21C16.418 20.418 20 16.418 20 12V7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
