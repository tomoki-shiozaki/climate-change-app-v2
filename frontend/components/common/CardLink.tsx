import Link from "next/link";

type CardLinkProps = {
  href: string;
  children: React.ReactNode;
};

export const CardLink = ({ href, children }: CardLinkProps) => {
  return (
    <Link
      href={href}
      className="
        block p-6 rounded-2xl bg-white shadow-md
        transition cursor-pointer
        hover:shadow-lg hover:-translate-y-1
      "
    >
      {children}
    </Link>
  );
};
