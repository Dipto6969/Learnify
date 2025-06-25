import Image from "next/image";

export const Logo = () => {
  return (
   
      <Image
        src="/logo.svg"
        alt="logo"
        width={30}
        height={30}
      />
    
  );
}