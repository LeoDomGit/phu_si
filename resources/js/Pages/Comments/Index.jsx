import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Notyf } from "notyf";
import { Box, Switch, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import "notyf/notyf.min.css";
import axios from "axios";

function Index({ comments }) {
    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // Format date as dd/mm/yyyy
    };

    const notyf = new Notyf({
        duration: 1000,
        position: {
            x: "right",
            y: "top",
        },
        types: [
            {
                type: "warning",
                background: "orange",
                icon: {
                    className: "material-icons",
                    tagName: "i",
                    text: "warning",
                },
            },
            {
                type: "error",
                background: "indianred",
                duration: 2000,
                dismissible: true,
            },
            {
                type: "success",
                background: "green",
                color: "white",
                duration: 2000,
                dismissible: true,
            },
            {
                type: "info",
                background: "#24b3f0",
                color: "white",
                duration: 1500,
                dismissible: false,
                icon: '<i class="bi bi-bag-check"></i>',
            },
        ],
    });

    const handleCellEditStop = (id, field, value) => {
        if (field === "position") {
            axios
                .put(`/admin/comments/${id}`, { position: value })
                .then((res) => {
                    if (res.data.check === true) {
                        notyf.open({
                            type: "success",
                            message: "Chỉnh sửa thành công",
                        });
                        setData(res.data.data);
                    } else {
                        notyf.open({ type: "error", message: res.data.msg });
                    }
                });
        } else {
            axios
                .put(`/admin/comments/${id}`, { [field]: value })
                .then((res) => {
                    if (res.data.check === true) {
                        notyf.open({
                            type: "success",
                            message: "Chỉnh sửa thành công",
                        });
                        setData(res.data.data);
                    } else {
                        notyf.open({ type: "error", message: res.data.msg });
                    }
                });
        }
    };

    const [data, setData] = useState(comments);

    const columns = [
        {
            field: "id",
            headerName: "#",
            width: 50,
        },
        {
            field: "name",
            headerName: "Họ tên",
            width: 150,
            editable: false,
            renderCell: (params) => <b>{params.row.customer?.name}</b>,
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
            editable: false,
            renderCell: (params) => <b>{params.row.customer?.email}</b>,
        },
        {
            field: "phone",
            headerName: "Số điện thoại",
            width: 150,
            editable: false,
            renderCell: (params) => <b>{params.row.customer?.phone}</b>,
        },
        {
            field: "product_name",
            headerName: "Product Name",
            width: 200,
            editable: false,
            renderCell: (params) => (
                <Tooltip title={params.row.products?.name}>
                    <Typography noWrap>{params.row.products?.name}</Typography>
                </Tooltip>
            ),
        },
        {
            field: "comment",
            headerName: "Comment",
            width: 200,
            editable: false,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <Typography noWrap>{params.value}</Typography>
                </Tooltip>
            ),
        },
        ,
        {
            field: "reply",
            headerName: "Phản hồi",
            width: 200,
            editable: true,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <Typography noWrap>{params.value}</Typography>
                </Tooltip>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 70,
            renderCell: (params) => (
                <Switch
                    checked={params.value === 1}
                    onChange={() => switchContact(params)}
                    inputProps={{ "aria-label": "controlled" }}
                />
            ),
        },
        {
            field: "created_at",
            headerName: "Created at",
            width: 100,
            valueGetter: (params) => formatCreatedAt(params),
        },
        ,
        {
            headerName: "Chi tiết",
            width: 100,
            renderCell: (params) => (
                    <>
                    <a target="_blank" href={"https://maxellvn.com/"+params.row.products.slug}>Xem sản phẩm</a>
                    </>
            ),
        }
    ];

    const switchContact = (params) => {
        const newStatus = params.row.status === 1 ? 0 : 1;
        axios
            .put(`/admin/comments/${params.id}`, { status: newStatus })
            .then((res) => {
                if (res.data.check === true) {
                    notyf.open({
                        type: "success",
                        message: "Chuyển trạng thái thành công",
                    });
                    setData(res.data.data);
                } else {
                    notyf.open({ type: "error", message: res.data.msg });
                }
            });
    };

    return (
        <Layout>
            <h4>Quản lý bình luận</h4>
            {data && data.length > 0 && (
                <Box sx={{ width: "100%" }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                        onCellEditStop={(params, e) =>
                            handleCellEditStop(
                                params.row.id,
                                params.field,
                                e.target.value
                            )
                        }
                    />
                </Box>
            )}
        </Layout>
    );
}

export default Index;
