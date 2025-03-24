import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Suspense, lazy } from "react"
import Layout from "./components/Layout"
import Dashboard from "./components/Dashboard"

// Lazy load components for better performance
const ClientForm = lazy(() => import("./leads/Form"))
const UpdateForm = lazy(() => import("./leads/Update"))
const LeadsLandingPage = lazy(() => import("./leads/LeadsLandingPage"))
const Display = lazy(() => import("./leads/Display"))

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <LeadsLandingPage />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/create",
          element: <ClientForm />,
        },
        {
          path: "/update/:id",
          element: <UpdateForm />,
        },
        {
          path: "/display/:id",
          element: <Display />,
        },
        {
          path: "/projects",
          element: (
            <div className="page-container">
              <h1>Projects</h1>
              <p>Projects page is under construction.</p>
            </div>
          ),
        },
        {
          path: "/teams",
          element: (
            <div className="page-container">
              <h1>Teams</h1>
              <p>Teams page is under construction.</p>
            </div>
          ),
        },
        {
          path: "/invoices",
          element: (
            <div className="page-container">
              <h1>Invoices</h1>
              <p>Invoices page is under construction.</p>
            </div>
          ),
        },
        {
          path: "/activity",
          element: (
            <div className="page-container">
              <h1>Activity Log</h1>
              <p>Activity Log page is under construction.</p>
            </div>
          ),
        },
      ],
    },
  ])

  return (
    <Suspense
      fallback={
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App

