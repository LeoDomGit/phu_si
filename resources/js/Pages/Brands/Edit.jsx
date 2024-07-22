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
import "notyf/notyf.min.css";
import axios from "axios";
function Edit({ brands,id }) {
    const [data, setData] = useState(brands);
    const [content, setContent] = useState(data.content);
    const [brand, setBrand] = useState(data.name);
    const api = "http://localhost:8000/api/";
    const app = "http://localhost:8000/";
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
    const submitEdit = () => {
        if (brand == "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập thương hiệu",
            });
        } else {
            axios
                .put("/admin/brands/"+id, {
                    name: brand,
                    content:content,
                })
                .then((res) => {
                    if (res.data.check == true) {
                        notyf.open({
                            type: "success",
                            message: "Đã sửa thương hiệu",
                        });
                        setTimeout(() => {
                            window.location.replace('/admin/brands')
                        }, 2000);
                    }
                });
        }
    };
    return (
        <Layout>
            <>
                <div className="row mt-3">
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
                                    <button className="btn btn-warning" onClick={(e)=>submitEdit()}>
                                        Sửa
                                    </button>
                                </div>
                                <CKEditor value={content} onBlur={setContent} />
                            </div>
                        </div>
                </div>
            </>
        </Layout>
    );
}

export default Edit;
