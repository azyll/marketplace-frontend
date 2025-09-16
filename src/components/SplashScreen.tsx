import { Text, Title } from "@mantine/core"

// components/SplashScreen.tsx
export default function SplashScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#F2F5F9]">
      <div className="flex h-20 w-20 items-center justify-center">
        <img
          src="/logo.png"
          alt="STIMERCH MARKET Logo"
          className="h-full w-full animate-bounce object-contain"
        />
      </div>
    </div>
  )
}
