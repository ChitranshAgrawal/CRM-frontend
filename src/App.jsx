import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Suspense, lazy } from "react"
import Layout from "./components/Layout"
import Dashboard from "./components/Dashboard"

// Lazy load components for better performance
const ClientForm = lazy(() => import("./leads/Form"))
const UpdateForm = lazy(() => import("./leads/Update"))
const LeadsLandingPage = lazy(() => import("./leads/LeadsLandingPage"))
const Display = lazy(() => import("./leads/Display"))

// Add project components
const ProjectLandingPage = lazy(() => import("./projects/ProjectLandingPage"))
const DisplayProject = lazy(() => import("./projects/DisplayProject"))
const UpdateProject = lazy(() => import("./projects/UpdateProject"))
const Quotation = lazy(() => import("./leads/Quotation"))
const AllQuotations = lazy(() => import("./invoices/AllQuotations"))

// Add these imports
const Invoice = lazy(() => import("./invoices/Invoice"))
const PaymentDetails = lazy(() => import("./projects/PaymentDetails"))

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
          element: <ProjectLandingPage />,
        },
        {
          path: "/project/:id",
          element: <DisplayProject />,
        },
        {
          path: "/updateProject/:id",
          element: <UpdateProject />,
        },
        {
          path: "/pdf-files/:id",
          element: <Quotation />,
        },
        {
          path: "/invoices",
          element: <AllQuotations />,
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
          path: "/activity",
          element: (
            <div className="page-container">
              <h1>Activity Log</h1>
              <p>Activity Log page is under construction.</p>
            </div>
          ),
        },
        // Add these routes inside the children array
        {
          path: "/invoice/:id",
          element: <Invoice />,
        },
        {
          path: "/payment-details/:id",
          element: <PaymentDetails />,
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

