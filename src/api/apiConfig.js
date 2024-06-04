import axios from 'axios'

export const API = 'https://api.choynak.org/api/0d4b4bc1e0f44ea1ad26c81bd7edf437'
export const TOKEN = 'Bearer 7nuimEOYjVeFI539YcdNlCbKGcKolrOecEFZ29id'

const $api = axios.create({
    baseURL: API,
    headers: {
        "Content-Type": 'application/json',
        Authorization: TOKEN,
    },
    redirect: 'follow',
})

export default $api
