interface SectionHeadingProps {
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  /** Use on sections that stay dark in both themes. */
  onDark?: boolean;
  as?: "h1" | "h2";
  className?: string;
}

export default function SectionHeading({
  title,
  intro,
  align = "left",
  onDark = false,
  as: Tag = "h2",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center mx-auto" : ""} max-w-2xl ${className}`}>
      <Tag
        className={`text-2xl sm:text-3xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.12] sm:leading-[1.05] text-balance ${
          onDark ? "text-white" : "text-ink dark:text-white"
        }`}
      >
        {title}
      </Tag>
      {intro && (
        <p
          className={`mt-2.5 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-pretty ${
            onDark ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
