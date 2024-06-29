import Image from "next/image";

export default function SampleStyles() {
  return (
      <Image src="/image.png" alt="sample" layout="fill" objectFit="none" />
  );
}
