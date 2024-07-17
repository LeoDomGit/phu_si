import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Notyf } from "notyf";
import { Box, Switch, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import CKEditor from "../../components/CKEditor";
import Autocomplete from "@mui/material/Autocomplete";
import "./datagrid.css";
import "notyf/notyf.min.css";
import axios from "axios";
function Index({ brands,products }) {
    const [data, setData] = useState(products);
    const [create, setCreate] = useState(false);
    const [content, setContent] = useState('');
    const [brand, setBrand] = useState("");
    const api = "http://localhost:8000/api/";
    const app = "http://localhost:8000/";
    const handleParentChange=(id,value)=>{
        axios
        .put(`/admin/products/${id}`, {
            id_brand: value,
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
    console.log(data);
    const formatPrice = (params) => {
        return new Intl.NumberFormat("en-US").format(params);
    };
    const columns = [
        {
            field: "id",
            headerName: "#",
            width: 100,
            renderCell: (params) => params.rowIndex,
        },
        {
            field: 'image',
            headerName: 'Hình ảnh',
            width: 120,
            renderCell: (params) => (
                <div style={{ height: 60 }}>
                <img className="img-fluid" src={params.row.image?params.row.image.image:''}  style={{ height: '100%' }} />
            </div>
            ),
        },
        {
            field: "name",
            headerName: "Tên sản phẩm",
            width: 300,
            editable: true,
        },
        { field: "slug", headerName: "Slug", width: 100, editable: false },
        { field: "price", headerName: "Giá khuyến mãi", valueFormatter: formatPrice, width: 100, editable: true },

        {
            field:'id_brand',
            headerName:'Thương hiệu',
            width: 200,
            renderCell: (params) => (
                <Select
                  value={params.value}
                  className='w-100'
                  onChange={(e) => handleParentChange(params.id, e.target.value)}
                >
                  <MenuItem value={null}>None</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                  ))}
                </Select>
              )
        },
        { field: "compare_price", headerName: "Giá sản phẩm", valueFormatter: formatPrice, width: 100, editable: true },

        {
            field: "status",
            headerName: "Status",
            width: 70,
            renderCell: (params) => (
                <Switch
                    checked={params.value == 1}
                    onChange={(e) => switchProduct(params, e.target.value)}
                    inputProps={{ "aria-label": "controlled" }}
                />
            ),
        },
        {
            field: "highlighted",
            headerName: "Hiển thị ở trang chủ",
            width: 70,
            renderCell: (params) => (
                <Switch
                    checked={params.value == 1}
                    onChange={(e) => switchHighlighter(params, e.target.value)}
                    inputProps={{ "aria-label": "controlled" }}
                />
            ),
        },
        {
            headerName: "Edit",
            width: 70,
            renderCell: (params) => (
                <a href={'/admin/products/'+params.id} className="btn btn-sm btn-warning">Edit</a>
            ),
        },
        {
            field: "created_at",
            headerName: "Created at",
            width: 200,
            valueGetter: (params) => formatCreatedAt(params),
        },
    ];
    const resetCreate = () => {
        setBrand("");
        setCreate(true);
    };
    function switchProduct(params, value) {
        if (params.row.status == 1) {
            var newStatus = 0;
        } else {
            var newStatus = 1;
        }
        axios
            .put("/admin/products/" + params.id, {
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
    function switchHighlighter(params, value) {
        if (params.row.highlighted == 1) {
            var highlighted = 0;
        } else {
            var highlighted = 1;
        }
        axios
            .put("/admin/products/" + params.id, {
                highlighted: highlighted,
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
    const handleCellEditStop = (id, field, value) => {
        axios
            .put(`/admin/products/${id}`, {
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
    };
    return (
        <Layout>
            <>
                <div className="row">
                    <div className="col-md-2">
                        <a href="/admin/products/create"
                            className="btn btn-sm btn-primary"
                        >
                            Thêm
                        </a>
                    </div>
                </div>
                <div className="row mt-3">
                    {create && (
                        <div className="col-md-3">
                            <div className="row">
                                <div className="input-group mb-3">
                                    <span
                                        className="input-group-text"
                                        id="basic-addon1"
                                    >
                                        Thương hiệu
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Thương hiệu"
                                        aria-label="Thương hiệu"
                                        value={brand}
                                        onChange={(e) =>
                                            setBrand(e.target.value)
                                        }
                                        aria-describedby="basic-addon1"
                                    />
                                    <button className="btn btn-primary" onClick={(e)=>submitCreate()}>
                                        Thêm
                                    </button>
                                </div>
                                <CKEditor value={content} onBlur={setContent} />
                            </div>
                        </div>
                    )}

                    <div className="col-md">
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
                    </div>
                </div>
            </>
        </Layout>
    );
}

export default Index;
