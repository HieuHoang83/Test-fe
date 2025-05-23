import Link from "next/link";
import React, { useState } from "react";

const ContactLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <Link href={href} passHref>
      <a
        style={{
          backgroundColor: hover ? "#40a9ff" : "#1890ff",
          color: "white",
          borderRadius: 4,
          padding: "4px 10px",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-block",
          textAlign: "center",
          transition: "background-color 0.3s ease",
          userSelect: "none",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </a>
    </Link>
  );
};

export default ContactLink;
