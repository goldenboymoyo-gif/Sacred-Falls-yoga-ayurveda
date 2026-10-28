export default function Fig({ src, alt, cap, style }) {
  return (
    <figure className="fig" style={style}>
      <img className="photo" src={src} alt={alt || cap} loading="lazy" />
      {cap && <figcaption>{cap}</figcaption>}
    </figure>
  );
}
