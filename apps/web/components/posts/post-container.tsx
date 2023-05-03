import React from "react";

export const PostContainer = ({children}: React.PropsWithChildren<{}>) => {
  return (
    <div>
      <div className="space-y-10">
        {children}
      </div>
    </div>
  )
}