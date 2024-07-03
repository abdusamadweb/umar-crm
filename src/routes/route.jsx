import {Route, Routes} from 'react-router-dom'
import Home from "../pages/home/Home.jsx"
import Page404 from "../components/404/Page404.jsx"
import RequireAuth from "../components/RequireAuth.jsx"
import Auth from "../pages/auth/Auth.jsx";
import Other from "../pages/other/Other.jsx";
import Price from "../pages/price/Price.jsx";
import Workers from "../pages/workers/Workers.jsx";
import WorksArchive from "../pages/works/WorksArchive.jsx";
import Works from "../pages/works/Works.jsx";
import Partners from "../pages/partners/Partners.jsx";
import PartnersArchive from "../pages/partners/PartnersArchive.jsx";
import Davomat from "../pages/davomat/Davomat.jsx";
import Products from "../pages/products/Products.jsx";
import Debt from "../pages/debt/Debt.jsx";


// Non-protect-able routes
const publicRoutes = [
    { path: '/login', element: <Auth /> },
    { path: '*', element: <Page404 /> },
]

// Protect-able routes
const protectedRoutes = [
    { path: '/', element: <Home /> },
    { path: '/works', element: <Works /> },
    { path: '/works/archive', element: <WorksArchive /> },
    { path: '/partners', element: <Partners /> },
    { path: '/partners/archive', element: <PartnersArchive /> },
    { path: '/workers', element: <Workers /> },
    { path: '/davomat', element: <Davomat /> },
    { path: '/products', element: <Products /> },
    { path: '/money-manage', element: <Price /> },
    { path: '/other', element: <Other /> },
    { path: '/debt', element: <Debt /> },
]


const routes = (
    <Routes>
        {
            publicRoutes.map(route => (
                <Route key={route.path} path={route.path} element={route.element} />
            ))
        }

        <Route key='RequireAuth' element={<RequireAuth />}>
            {
                protectedRoutes.map(route => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))
            }
        </Route>
    </Routes>
)

export { publicRoutes, protectedRoutes, routes }