'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
        },
        success: {
          style: {
            background: '#34a853',
          },
        },
        error: {
          style: {
            background: '#ea4335',
          },
        },
      }}
    />
  )
}