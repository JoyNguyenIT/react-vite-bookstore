import { Outlet } from "react-router-dom"
import AppHeader from "components/layout/app.header"
import { useState } from "react"
function Layout() {
  const [searchBook, setSearchBook] = useState<string>("")
  return (
    <>
      <AppHeader
        setSearchBook={setSearchBook}
      />
      <Outlet context={{ searchBook }} />
    </>
  )


}

export default Layout
