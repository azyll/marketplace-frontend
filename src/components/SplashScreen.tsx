// components/SplashScreen.tsx
export default function SplashScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white">
      <div className="flex h-15 w-15 items-center justify-center rounded-full bg-[#015582] shadow-md">
        <img
          src="/logo.png"
          alt="STIMERCH MARKET Logo"
          className="animate-fadeIn h-full w-full object-contain"
        />
      </div>
    </div>
  )
}
