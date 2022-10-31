import React from "react"

export const BaseLayout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div className='bg-black min-h-screen text-white'>
      {children}
    </div>
  )
}