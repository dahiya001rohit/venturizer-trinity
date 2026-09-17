import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'trinity_announcement_dismissed'

export const BannerContext = createContext({
  isBannerVisible: true,
  dismissBanner: () => {},
})

export function BannerProvider({ children }) {
  const [isBannerVisible, setIsBannerVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(STORAGE_KEY) !== 'true'
    }
    return true
  })

  useEffect(() => {
    if (isBannerVisible) {
      document.documentElement.setAttribute('data-banner-visible', 'true')
    } else {
      document.documentElement.removeAttribute('data-banner-visible')
    }
  }, [isBannerVisible])

  const dismissBanner = () => {
    setIsBannerVisible(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }
  }

  return (
    <BannerContext.Provider value={{ isBannerVisible, dismissBanner }}>
      {children}
    </BannerContext.Provider>
  )
}

export function useBanner() {
  return useContext(BannerContext)
}
