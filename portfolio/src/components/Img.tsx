import { useState, type ImgHTMLAttributes } from "react";

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  src: string;
  alt: string;
  /** Image prioritaire (au-dessus de la ligne de flottaison) : pas de lazy loading */
  priority?: boolean;
}

/**
 * Image optimisée :
 * - lazy loading natif + décodage asynchrone (sauf si `priority`)
 * - apparition en fondu une fois chargée
 * - si l'image est un .webp généré par `npm run images`, on ajoute automatiquement
 *   la version 800 px dans un srcset pour que les mobiles chargent la petite version.
 */
export function Img({ src, alt, priority = false, className = "", sizes, onLoad, ...rest }: ImgProps) {
  const [loaded, setLoaded] = useState(false);
  const srcSet = src.endsWith(".webp") && !src.endsWith("-800.webp")
    ? `${src.replace(/\.webp$/, "-800.webp")} 800w, ${src} 1600w`
    : undefined;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? (sizes ?? "100vw") : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "auto" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      {...rest}
    />
  );
}
