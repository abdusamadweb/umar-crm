// global styles
import './assets/styles/normalize.css'
import './assets/styles/global.css'
import './App.scss'

import {BrowserRouter, useLocation} from "react-router-dom"
import {useLayoutEffect} from "react"
import Header from "./components/header/Header"
import {Toaster} from "react-hot-toast"
import {ConfigProvider} from "antd";
import {antdConfig} from "./config/antd/antdConfig.js";
import {routes} from "./routes/route.jsx";


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

                        { routes }

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