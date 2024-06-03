
// site language
export const lang = localStorage.getItem('lang') || 'en'
export const changeLang = (lang) => {
    localStorage.setItem('lang', lang)
    window.location.reload()
}


// format price
export const formatPrice = (price) => {
    return Intl.NumberFormat('ru').format(price)
}


// format phone number
export const formatPhone = (str) => {
    if (!str) return ""
    const mask = "+### (##) ### ## ##"
    if (!mask) return str
    const numeric = str?.replaceAll(/[^\d]/g, "")
    let idx = 0
    const formatted = mask?.split("").map((el) => {
        if (el === "#") {
            el = numeric[idx]
            idx++
        }
        return el
    })
    return formatted.join("")
}
