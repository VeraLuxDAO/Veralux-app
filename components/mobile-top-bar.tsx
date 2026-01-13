"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface MobileTopBarProps {
  onMenuToggle: () => void;
  isMenuOpen?: boolean;
  className?: string;
}

export function MobileTopBar({
  onMenuToggle,
  isMenuOpen = false,
  className,
}: MobileTopBarProps) {
  const auth = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <>
      <header
        className={cn(
          "mobile-top-bar fixed top-0 left-0 right-0 z-[100] block md:hidden translate-y-0",
          className
        )}
        style={{
          background: "transparent",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <svg width="88" height="26" viewBox="0 0 88 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_mobile_top)">
                <path d="M20.1587 18.1199V0.000244141H26.0001V26.0002H19.3569L5.84154 7.84639V26.0002H0.00012207V0.000244141H6.72721L20.1587 18.1199Z" fill="#9BB6CC"/>
                <g filter="url(#filter0_mobile_top)">
                  <path d="M6.72059 0.0131836L12.9104 8.36321C12.9682 8.44121 13.0849 8.44133 13.1429 8.36345L19.3586 0.0131836H25.9739L18.0838 10.6249C17.041 12.0273 17.0401 13.9471 18.0814 15.3506L25.9739 25.9869H19.3636L13.1314 17.6159C13.0734 17.5378 12.9565 17.5381 12.8988 17.6163L6.72058 25.9869H0.0264443L7.95126 15.4099C9.00374 14.0053 9.00668 12.0755 7.95851 10.6676L0.0263672 0.0131836H6.72059Z" fill="#E5F7FD"/>
                </g>
                <g filter="url(#filter1_mobile_top)">
                  <path d="M6.71405 0.0131836L12.9103 8.36327C12.9682 8.44124 13.0849 8.44129 13.1428 8.36338L19.3521 0.0131836H25.9674L17.4561 11.4614C16.4414 12.8261 15.8935 14.4813 15.8935 16.1819V25.9869H10.1133V16.1847C10.1133 14.4823 9.56427 12.8256 8.54781 11.4601L0.0263672 0.0131836H6.71405Z" fill="#E5F7FD"/>
                </g>
              </g>
              <path d="M34 4.85278H38.108L42.045 9.98603C42.0952 10.0514 42.1938 10.0514 42.2439 9.98603L46.181 4.85278H50.2932L45.4332 11.4388C44.4788 12.7321 43.9639 14.2972 43.9639 15.9046V21.1475H40.3251V15.9033C40.3251 14.2967 39.8107 12.7324 38.8572 11.4394L34 4.85278Z" fill="#9BB6CC"/>
              <path d="M65.0115 16.252V4.85278H68.6721V21.1475H64.5091L56.0395 9.7701V21.1475H52.3789V4.85278H56.4876L65.0115 16.252Z" fill="#9BB6CC"/>
              <path d="M87.0507 21.1475L82.6573 15.272C81.6615 13.9403 81.6586 12.1126 82.65 10.7777L87.0507 4.85278H82.9379L78.9073 10.2569L74.8663 4.85278H70.7576L75.1688 10.7784C76.1616 12.1121 76.1607 13.9395 75.1667 15.2722L70.8077 21.1168H74.9707L78.9133 15.8086L82.8877 21.1475H87.0507Z" fill="#9BB6CC"/>
              <defs>
                <filter id="filter0_mobile_top" x="-229.974" y="-42.9868" width="485.948" height="872.974" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="36"/>
                  <feGaussianBlur stdDeviation="39.5"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_mobile_top"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="144"/>
                  <feGaussianBlur stdDeviation="72"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"/>
                  <feBlend mode="normal" in2="effect1_dropShadow_mobile_top" result="effect2_dropShadow_mobile_top"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="323"/>
                  <feGaussianBlur stdDeviation="97"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                  <feBlend mode="normal" in2="effect2_dropShadow_mobile_top" result="effect3_dropShadow_mobile_top"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="574"/>
                  <feGaussianBlur stdDeviation="115"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"/>
                  <feBlend mode="normal" in2="effect3_dropShadow_mobile_top" result="effect4_dropShadow_mobile_top"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_mobile_top" result="shape"/>
                </filter>
                <filter id="filter1_mobile_top" x="-229.974" y="-42.9868" width="485.941" height="872.974" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="36"/>
                  <feGaussianBlur stdDeviation="39.5"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_mobile_top"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="144"/>
                  <feGaussianBlur stdDeviation="72"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"/>
                  <feBlend mode="normal" in2="effect1_dropShadow_mobile_top" result="effect2_dropShadow_mobile_top"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="323"/>
                  <feGaussianBlur stdDeviation="97"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                  <feBlend mode="normal" in2="effect2_dropShadow_mobile_top" result="effect3_dropShadow_mobile_top"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="574"/>
                  <feGaussianBlur stdDeviation="115"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"/>
                  <feBlend mode="normal" in2="effect3_dropShadow_mobile_top" result="effect4_dropShadow_mobile_top"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_mobile_top" result="shape"/>
                </filter>
                <clipPath id="clip0_mobile_top">
                  <rect width="26" height="26" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Right Side - Menu and Sign In */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="p-0 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer hover:bg-muted/70"
              style={{
                width: "24px",
                height: "24px",
              }}
            >
              <Menu className="w-5 h-5 transition-transform duration-200 text-white" />
            </Button>
            {!auth.isAuthenticated && (
              <Button
                variant="default"
                onClick={auth.signInWithGoogle}
                disabled={auth.isLoading}
                className="flex flex-row justify-center items-center p-2.5 gap-2.5 w-16 min-w-16 bg-white rounded-xl flex-none order-1 grow-0 text-xs font-medium text-black hover:bg-white/90 transition-all md:h-auto"
                style={{
                  height: "36px",
                  minHeight: "36px",
                  maxHeight: "36px",
                  boxShadow: "0px 2px 8px rgba(255, 255, 255, 0.5)",
                }}
              >
                {auth.isLoading ? "..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16 md:hidden" />
    </>
  );
}
