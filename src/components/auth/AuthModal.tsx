'use client'

import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'signin' | 'signup'
}

export function AuthModal({ open, onOpenChange, mode = 'signin' }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
      } else if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onOpenChange(false)
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setMessage('Password reset email sent!')
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setMessage('Check your email for the magic link!')
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {authMode === 'signin' && 'Sign in to your account'}
            {authMode === 'signup' && 'Create your account'}
            {authMode === 'forgot' && 'Reset your password'}
          </DialogTitle>
          <DialogDescription>
            {authMode === 'signin' && 'Welcome back! Please sign in to continue.'}
            {authMode === 'signup' && 'Join thousands of travelers discovering amazing experiences.'}
            {authMode === 'forgot' && 'Enter your email to receive a password reset link.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Google OAuth */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (
                authMode === 'signin' ? 'Sign In' :
                authMode === 'signup' ? 'Create Account' :
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Magic Link */}
          {authMode === 'signin' && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleMagicLink}
              disabled={loading || !email}
            >
              Send Magic Link
            </Button>
          )}

          {/* Message */}
          {message && (
            <div className={`text-sm text-center ${
              message.includes('error') || message.includes('Invalid') 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {message}
            </div>
          )}

          {/* Switch modes */}
          <div className="text-center space-y-2">
            {authMode === 'signin' && (
              <>
                <button
                  onClick={() => setAuthMode('forgot')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Forgot your password?
                </button>
                <div className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {authMode === 'signup' && (
              <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </div>
            )}

            {authMode === 'forgot' && (
              <button
                onClick={() => setAuthMode('signin')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}