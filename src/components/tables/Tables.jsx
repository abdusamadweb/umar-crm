import React from 'react';
import Search from "../search/Search.jsx";
import {Table} from "antd";

const Tables = ({ data, columns, setSearch, fromDate, toDate, setFromDate, setToDate }) => {

    return (
        <div className="tables">
            <Search
                setSearch={setSearch}
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
            />
            <Table
                columns={columns}
                dataSource={data}
                scroll={{ x: 550 }}
            />
        </div>
    );
};

export default Tables;