import './Search.scss'
import React, { useCallback } from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'
import DateFilter from "../date-filter/DateFilter.jsx";

const Search = ({ setSearch, fromDate, toDate, setFromDate, setToDate }) => {

    const debouncedSearch = useCallback(debounce((value) => {
        setSearch(value)
    }, 500), [setSearch])

    const handleChange = (e) => {
        debouncedSearch(e.target.value)
    }


    return (
        <div className="search d-flex between align-center g1">
            <Input.Search
                size="large"
                placeholder="Кидиринг . . ."
                onChange={handleChange}
            />
            {
                fromDate !== false &&
                <DateFilter
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                />
            }
        </div>
    )
}

export default Search
