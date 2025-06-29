'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase'

interface CartItem {
  id: string
  product_id: string
  product_title: string
  product_image: string
  price: number
  quantity: number
  selected_date: string | null
  city: string
  duration: string | null
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalPrice: number
  totalItems: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Load cart items for authenticated user
  useEffect(() => {
    if (user) {
      loadCartItems()
    } else {
      setItems([])
    }
  }, [user])

  const loadCartItems = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          selected_date,
          products:product_id (
            title,
            price,
            image_url,
            duration,
            cities:city_id (
              name
            )
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error

      const cartItems: CartItem[] = data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_title: item.products.title,
        product_image: item.products.image_url,
        price: item.products.price,
        quantity: item.quantity,
        selected_date: item.selected_date,
        city: item.products.cities.name,
        duration: item.products.duration,
      }))

      setItems(cartItems)
    } catch (error) {
      console.error('Error loading cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (newItem: Omit<CartItem, 'id'>) => {
    if (!user) {
      // For non-authenticated users, you might want to store in localStorage
      // or prompt them to sign in
      return
    }

    setLoading(true)
    try {
      // Check if item already exists in cart
      const existingItem = items.find(item => 
        item.product_id === newItem.product_id && 
        item.selected_date === newItem.selected_date
      )

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity)
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: newItem.product_id,
            quantity: newItem.quantity,
            selected_date: newItem.selected_date,
          })
          .select()
          .single()

        if (error) throw error

        setItems(prev => [...prev, { ...newItem, id: data.id }])
      }
    } catch (error) {
      console.error('Error adding item to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing item from cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || quantity < 1) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error

      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ))
    } catch (error) {
      console.error('Error updating cart item quantity:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalPrice,
      totalItems,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  )
}