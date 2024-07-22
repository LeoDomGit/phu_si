import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Notyf } from "notyf";
import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    Form,
    Image,
} from "react-bootstrap";
import { Box, Select, Switch, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import "notyf/notyf.min.css";
import axios from "axios";

function Index({ contacts }) {
    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
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
		if(field=='position'){
            axios
			.put(`/admin/collections/${id}`, {
				'position': value,
			})
			.then((res) => {
				if (res.data.check == true) {
					notyf.open({
						type: "success",
						message: "Chỉnh sửa thành công",
					});
					setData(res.data.data);
				} else if (res.data.check == false) {
					notyf.open({
						type: "error",
						message: res.data.msg,
					});
				}
			});
        }else{
            axios
			.put(`/admin/contacts/${id}`, {
				[field]: value,
			})
			.then((res) => {
				if (res.data.check == true) {
					notyf.open({
						type: "success",
						message: "Chỉnh sửa thành công",
					});
					setData(res.data.data);
				} else if (res.data.check == false) {
					notyf.open({
						type: "error",
						message: res.data.msg,
					});
				}
			});
        }
	};
    const [data, setData] = useState(contacts);
    const columns = [
        {
            field: "id",
            headerName: "#",
            width: 50,
            renderCell: (params) => params.rowIndex,
        },
        { field: "name", headerName: "Họ tên", width: 150, editable: false },
        { field: "email", headerName: "Email", width: 200, editable: false },
        {
            field: "phone",
            headerName: "Số điện thoại",
            width: 100,
            editable: false,
        },
        {
            field: "message",
            headerName: "Liên hệ",
            width: 400,
            editable: false,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <Typography noWrap>{params.value}</Typography>
                </Tooltip>
            ),
        },
        {
            field: "note",
            headerName: "Ghi chú",
            width: 400,
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
                    checked={params.value == 1}
                    onChange={(e) => switchContact(params, e.target.value)}
                    inputProps={{ "aria-label": "controlled" }}
                />
            ),
        },
        {
            field: "created_at",
            headerName: "Created at",
            width: 200,
            valueGetter: (params) => formatCreatedAt(params),
        },
    ];
    function switchContact(params, value) {
        if (params.row.status == 1) {
            var newStatus = 0;
        } else {
            var newStatus = 1;
        }
        axios
            .put("/admin/contacts/" + params.id, {
                status: newStatus,
            })
            .then((res) => {
                if (res.data.check == false) {
                    if (res.data.msg) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                } else if (res.data.check == true) {
                    notyf.open({
                        type: "success",
                        message: "Chuyển trạng thái thành công",
                    });
                    if (res.data.data) {
                        setData(res.data.data);
                    } else {
                        setData([]);
                    }
                }
            });
    }
    return (
        <Layout>
            <>
            <h4>Liên hệ</h4>
                {data && data.length > 0 && (
                    <Box sx={{ width: "100%" }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
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
            </>
        </Layout>
    );
}

export default Index;
