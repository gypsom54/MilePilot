const UTILITY_ITEMS = [
  'Research Use Only',
  'Batch Documentation Available',
  'HPLC & Mass Spec Verified',
  'Secure UK Fulfilment',
  'Transparent Batch Information',
] as const;

export function UtilityBar() {
  return (
    <div className="utility-bar" role="note">
      <div className="utility-bar__inner">
        {UTILITY_ITEMS.map((item) => (
          <span key={item} className="utility-bar__item">
            <span className="utility-bar__check" aria-hidden="true">
              ✓
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
