import {Navigate, Outlet} from "react-router-dom"

interface PrivateRouteProps {
  isAllowed: boolean
  redirectTo?: string
}

export function PrivateRoute({isAllowed, redirectTo = "/"}: PrivateRouteProps) {
  return isAllowed ? <Outlet /> : <Navigate to={redirectTo} />
}
