import {Route, Routes} from 'react-router-dom'
import Home from "../pages/home/Home.jsx"
import Page404 from "../components/404/Page404.jsx"
import RequireAuth from "../components/RequireAuth.jsx"
import Auth from "../pages/auth/Auth.jsx";
import Other from "../pages/other/Other.jsx";
import Price from "../pages/price/Price.jsx";
import Workers from "../pages/workers/Workers.jsx";
import Archive from "../pages/works/Archive.jsx";
import Works from "../pages/works/Works.jsx";


// Non-protect-able routes
const publicRoutes = [
    { path: '/login', element: <Auth /> },
    { path: '*', element: <Page404 /> },
]

// Protect-able routes
const protectedRoutes = [
    { path: '/', element: <Home /> },
    { path: '/works', element: <Works /> },
    { path: '/works/archive', element: <Archive /> },
    { path: '/workers', element: <Workers /> },
    { path: '/money-manage', element: <Price /> },
    { path: '/other', element: <Other /> },
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