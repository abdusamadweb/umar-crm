import axios from "axios"
import {API_TEST} from "./apiConfig"
import {toast} from "react-hot-toast"

export const userLang = navigator.language || navigator.userLanguage

export const $resp = axios.create({
    baseURL: API_TEST,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem('token'),
        Lang: userLang,
        "Accept-Language": userLang
    }
})