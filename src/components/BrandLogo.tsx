import Image from "next/image";

type Variant = "auto" | "on-light" | "on-dark" | "on-gold" | "mono-ink" | "mono-white";

interface BrandLogoProps {
  /** "auto" swaps between on-light and on-dark with the site theme. */
  variant?: Variant;
  /** Size with a height class, e.g. "h-9"; width follows the logo's aspect ratio. */
  className?: string;
  priority?: boolean;
}

// Intrinsic size of the wordmark's viewBox (3016.61 x 994.59).
const WIDTH = 3017;
const HEIGHT = 995;

const src = (variant: Exclude<Variant, "auto">) => `/logo/aqiran-xchange-full-logo-${variant}.svg`;

export default function BrandLogo({ variant = "auto", className = "h-9", priority = false }: BrandLogoProps) {
  if (variant !== "auto") {
    return (
      <Image src={src(variant)} alt="Aqiran Xchange" width={WIDTH} height={HEIGHT} priority={priority} className={`w-auto ${className}`} />
    );
  }

  // Both variants are rendered and toggled with the `dark` class, so the
  // right one shows on first paint without waiting for the theme to mount.
  return (
    <>
      <Image src={src("on-light")} alt="Aqiran Xchange" width={WIDTH} height={HEIGHT} priority={priority} className={`w-auto dark:hidden ${className}`} />
      <Image src={src("on-dark")} alt="Aqiran Xchange" width={WIDTH} height={HEIGHT} priority={priority} className={`w-auto hidden dark:block ${className}`} />
    </>
  );
}
