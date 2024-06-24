import $api from "./apiConfig.js";


// add or edit item
export const addOrEdit = async (url, value, id) => {
    const res = await $api({
        url: id ? `${url}/update/${id}` : url,
        method: "POST",
        data: value,
    })
    return res.data
}

// delete item
export const deleteData = async (url, id) => {
    const res = await $api({
        url: `${url}/${id}`,
        method: "DELETE",
    })
    return res.data
}

// fetch workers-category
export const fetchCategory = async () => {
    const { data } = await $api.get('/workers_category')
    return data.reverse()
}