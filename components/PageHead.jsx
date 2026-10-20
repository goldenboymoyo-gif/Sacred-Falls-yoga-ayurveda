export default function PageHead({ eyebrow, title, children }) {
  return (
    <div className="pagehead2">
      <div className="wrap">
        {eyebrow && <p className="script">{eyebrow}</p>}
        <h1>{title}</h1>
        {children && <p className="lead">{children}</p>}
      </div>
    </div>
  );
}
