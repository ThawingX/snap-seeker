"use client";
import React from "react";
import { SidebarLink, SidebarCredits } from "@/components/ui/sidebar";
import {
  IconHome,
  IconHistory,
  IconCoins,
  IconBulb,
  IconChartBar,
  IconTarget,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { trackPricingClick, trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";


export const Navigation = () => {
  // Define sidebar navigation links
  const navigationLinks = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-muted-foreground" />
      ),
    },
    {
      label: "History",
      href: "/history",
      icon: (
        <IconHistory className="h-5 w-5 shrink-0 text-muted-foreground" />
      ),
    },
    {
      label: "Competitor Prompt Analysis",
      href: "/competitor-analysis",
      icon: (
        <IconBulb className="h-5 w-5 shrink-0 text-muted-foreground" />
      ),
    },
    {
      label: "PMF Analysis",
      href: "/pmf-analysis",
      icon: (
        <IconChartBar className="h-5 w-5 shrink-0 text-muted-foreground" />
      ),
    },
    {
      label: "Product Marketing Context",
      href: "/product-marketing",
      icon: (
        <IconTarget className="h-5 w-5 shrink-0 text-muted-foreground" />
      ),
    },
  ];

  const pricingLink = {
    label: "Pricing",
    href: "https://seeker-landing.snapsnap.site/en/pricing",
    icon: (
      <IconCoins className="h-5 w-5 shrink-0 text-muted-foreground" />
    ),
  };

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {navigationLinks.map((link, idx) => (
        <SidebarLink key={idx} link={link} />
      ))}
    </nav>
  );
};

export const AuthButtons = () => {
  const { showAuthModal, isAuthenticated, logout } = useAuth();

  const pricingLink = {
    label: "Pricing",
    href: "https://seeker-landing.snapsnap.site/en/pricing",
    icon: (
      <IconCoins className="h-5 w-5 shrink-0 text-white" />
    ),
    onClick: () => {
      trackPricingClick({
        action: 'click',
        section: 'sidebar',
        page: 'main_app'
      });
    }
  };

  return (
    <div className="pb-4">
      <div className="mb-4">
        <SidebarLink 
          link={pricingLink} 
          className="bg-gradient-to-r from-amber-300 to-orange-300 hover:from-amber-400 hover:to-orange-400 text-white font-semibold shadow-lg hover:shadow-xl border-amber-300/30 hover:border-amber-300/50 transition-all duration-300"
        />
      </div>
      <div className="mb-4">
        <SidebarCredits />
      </div>
      {isAuthenticated ? (
        <div className="flex justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground mb-3">
              Hey Snaper!
            </div>
            <button 
              onClick={logout}
              className="text-sm py-2 cursor-pointer px-6 rounded-full bg-gray-500/20 hover:bg-gray-500/30 text-muted-foreground font-medium transition-all duration-300 backdrop-blur-sm border border-gray-400/20 hover:border-gray-400/40">
                Logout
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <button 
              onClick={() => {
                trackEvent(ANALYTICS_EVENTS.CREATE_ACCOUNT_CLICK, {
                  method: 'email',
                  page: 'sidebar',
                  has_invitation_code: false
                });
                showAuthModal("signup");
              }}
              className="text-base py-3 px-8 rounded-full bg-green-600/80 hover:bg-green-600/90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-green-500/30 hover:border-green-500/50 backdrop-blur-sm">
                Sign Up
            </button>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => {
                trackEvent(ANALYTICS_EVENTS.LOGIN_START, {
                  method: 'email',
                  page: 'sidebar'
                });
                showAuthModal("login");
              }}
              className="text-base py-3 px-8 rounded-full bg-blue-600/80 hover:bg-blue-600/90 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-500/30 hover:border-blue-500/50 backdrop-blur-sm">
                Log in
            </button>
          </div>
        </>
      )}
    </div>
  );

};