import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
export default function AboutVideo() {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        style={{
          minHeight: "200px",
          transition: "transform 0.4s ease-in-out",
          transform: isHovering ? "scale(2)" : "scale(1.5)",
        }}
      >
        <Image className="object-cover" src="/image.png" alt="sample" layout="fill" />
      </div>
      {isHovering && (
        <Link
          className="absolute inset-0 flex justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 10 }} // Ensure this zIndex is higher than the image's zIndex
          href={''}
        >
          <div
            className="text-white cursor-pointer"
            style={{ fontSize: "3rem" }}
          >
            ▶
          </div>
        </Link>
      )}
    </div>
  );
}
