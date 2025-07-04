'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthModal } from '@/components/auth/AuthModal'
import { SearchBox } from '@/components/search/SearchBox'
import { CategoryDropdown } from '@/components/navigation/CategoryDropdown'
import { useAuth } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const { user, loading } = useAuth()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary" />
            <span className="text-xl font-bold text-primary">Milford Sound</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 max-w-md mx-8 lg:flex">
            <SearchBox className="w-full" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <CategoryDropdown />
            <Link href="/tours" className="text-sm font-medium hover:text-primary">
              Tours
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">
              Travel Guide
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openAuthModal('signin')}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => openAuthModal('signup')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 lg:hidden">
          <SearchBox className="w-full" />
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t pb-4 lg:hidden">
            <nav className="flex flex-col space-y-2 pt-4">
              <Link href="/tours" className="py-2 text-sm font-medium hover:text-primary">
                Milford Sound Tours
              </Link>
              <Link href="/tours" className="py-2 text-sm font-medium hover:text-primary">
                Tours
              </Link>
              <Link href="/blog" className="py-2 text-sm font-medium hover:text-primary">
                Travel Guide
              </Link>
              <Link href="/about" className="py-2 text-sm font-medium hover:text-primary">
                About
              </Link>
            </nav>
          </div>
        )}
      </div>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
        mode={authMode} 
      />
    </header>
  )
}