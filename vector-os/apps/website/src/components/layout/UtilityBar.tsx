export function UtilityBar() {
  const items = [
    'Batch documentation available',
    'HPLC & Mass Spec verified',
    'Secure UK fulfilment',
    'Research Use Only',
  ];

  return (
    <div className="utility-bar" role="note">
      <div className="utility-bar__inner">
        {items.map((item) => (
          <span key={item} className="utility-bar__item">
            <span className="utility-bar__dot" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
