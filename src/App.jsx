// global styles
import './assets/styles/normalize.css'
import './assets/styles/global.css'
import './App.scss'

import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom"
import {useLayoutEffect} from "react"
import Header from "./components/header/Header"
import Home from "./pages/home/Home"
import {Toaster} from "react-hot-toast"
import Page404 from "./components/404/Page404.jsx";
import Workers from "./pages/workers/Workers.jsx";
import {ConfigProvider} from "antd";
import {antdConfig} from "./config/antd/antdConfig.js";
import Works from "./pages/works/Works.jsx";
import Archive from "./pages/works/Archive.jsx";
import Other from "./pages/other/Other.jsx";


const Wrapper = ({ children }) => {
    const location = useLocation()
    useLayoutEffect(() => {
        document.documentElement.scrollTo(0, 0)
    }, [location.pathname])
    return children
}


const App = () => {

    return (
        <div className="App">
            <BrowserRouter>
                <Wrapper>

                    <ConfigProvider theme={antdConfig()}>

                        <Header />

                        <Routes>

                            <Route path='/' element={<Home />} />
                            <Route path='/works' element={<Works />} />
                            <Route path='/works/archive' element={<Archive />} />
                            <Route path='/workers' element={<Workers />} />
                            <Route path='/other' element={<Other />} />

                            {/* 404 */}
                            <Route path='/*' element={<Page404 />}/>

                        </Routes>

                    </ConfigProvider>

                    <Toaster
                        containerClassName="toast"
                        position="top-center"
                        reverseOrder={false}
                    />

                </Wrapper>
            </BrowserRouter>
        </div>
    )
}

export default App