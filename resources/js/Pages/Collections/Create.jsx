import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import axios from "axios";
import { idID } from "@mui/material/locale";
function Create({ collections }) {
    const [collection, setCollection] = useState("");
    const [position, setPosition] = useState(1);
    const [id_parent,setIdParent]= useState(0);
    const [HomeCollection, setHomeCollection] = useState("");
    const [HomeCollectionPosition, setHomeCollectionPosition] = useState(1);
    const [data, setData] = useState(collections);
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
        ],
    });

    const submitCollection = () => {
        if (collection == "") {
            notyf.open({
                type: "error",
                message: "Thiếu tên danh mục",
            });
        } else {
            axios
                .post("/admin/collections", {
                    collection: collection,
                    position: position,
                    id_parent:id_parent
                })
                .then((res) => {
                    if (res.data.check == true) {
                        notyf.open({
                            type: "success",
                            message: "Thêm thành công",
                        });
                        setCollection("");
                        setPosition("");
                        setIdParent(0);
                    } else if (res.data.check == false) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                });
        }
    };

    const submitHomeCollection = () => {
        if (HomeCollection == "") {
            notyf.open({
                type: "error",
                message: "Thiếu tên danh mục",
            });
        } else {
            axios
                .post("/admin/collections/home", {
                    collection: HomeCollection,
                    position: HomeCollectionPosition,
                })
                .then((res) => {
                    if (res.data.check == true) {
                        notyf.open({
                            type: "success",
                            message: "Thêm thành công",
                        });
                        setHomeCollection("");
                        setHomeCollectionPosition("");
                    } else if (res.data.check == false) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                });
        }
    };
    return (
        <Layout>
            <>
                <div className="row">
                    <div className="col-md- pt-5">
                        <div class="shadow p-3 mb-5 bg-body rounded card text-start">
                            <div class="card-body">
                                <>
                                    <nav>
                                        <div
                                            className="nav nav-tabs"
                                            id="nav-tab"
                                            role="tablist"
                                        >
                                            <button
                                                className="nav-link active"
                                                id="nav-home-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-home"
                                                aria-selected="true"
                                            >
                                                Danh mục menu
                                            </button>
                                            {/* <button
                                                className="nav-link"
                                                id="nav-profile-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-profile"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-profile"
                                                aria-selected="false"
                                            >
                                                Danh mục trang chủ
                                            </button> */}
                                            {/* <button
                                                className="nav-link"
                                                id="nav-contact-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-contact"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-contact"
                                                aria-selected="false"
                                            >
                                                Contact
                                            </button> */}
                                        </div>
                                    </nav>
                                    <div
                                        className="tab-content"
                                        id="nav-tabContent"
                                    >
                                        <div
                                            className="tab-pane fade show active"
                                            id="nav-home"
                                            role="tabpanel"
                                            aria-labelledby="nav-home-tab"
                                        >
                                            <div className="row pt-4 ps-3">
                                                <a href="/admin/collections">
                                                    Quay lại trang danh mục
                                                </a>

                                                <div className="col-md-4 mt-2">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            Danh mục sản phẩm
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Danh mục sản phẩm"
                                                            value={collection}
                                                            aria-label="Danh mục sản phẩm"
                                                            onChange={(e) =>
                                                                setCollection(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-describedby="basic-addon1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row ps-3">
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon2"
                                                        >
                                                            Danh mục cha
                                                        </span>
                                                        <select name="" className="form-control" value={id_parent} onChange={(e)=>setIdParent(e.target.value)} id="">
                                                            <option value={0}>Chọn danh mục cha</option>
                                                            {collections.map((item,index)=>(
                                                                <option value={item.id}>{item.collection}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row ps-3">
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon2"
                                                        >
                                                            Thứ tự
                                                        </span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Thứ tự"
                                                            value={position}
                                                            onChange={(e) =>
                                                                setPosition(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-label="Thứ tự"
                                                            aria-describedby="basic-addon2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row ps-3">
                                                <div className="col-md-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={(e) =>
                                                            submitCollection()
                                                        }
                                                    >
                                                        Thêm
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div
                                            className="tab-pane fade"
                                            id="nav-profile"
                                            role="tabpanel"
                                            aria-labelledby="nav-profile-tab"
                                        >
                                            <div className="row ps-3 pt-3">
                                                <div className="col-md-4 mt-2">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            Danh mục trang chủ
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Danh mục sản phẩm ..."
                                                            value={
                                                                HomeCollection
                                                            }
                                                            aria-label="Danh mục sản phẩm"
                                                            onChange={(e) =>
                                                                setHomeCollection(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-describedby="basic-addon1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row ps-3">
                                                <div className="col-md-4">
                                                <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon2"
                                                        >
                                                            Thứ tự
                                                        </span>
                                                        </div>
                                                </div>
                                            </div>
                                            <div className="row ps-3">
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon2"
                                                        >
                                                            Thứ tự
                                                        </span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Thứ tự"
                                                            value={
                                                                HomeCollectionPosition
                                                            }
                                                            onChange={(e) =>
                                                                setHomeCollectionPosition(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-label="Thứ tự"
                                                            aria-describedby="basic-addon2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row ps-3">
                                                <div className="col-md-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={(e) =>
                                                            submitHomeCollection()
                                                        }
                                                    >
                                                        Thêm
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="nav-contact"
                                            role="tabpanel"
                                            aria-labelledby="nav-contact-tab"
                                        >
                                            ...
                                        </div> */}
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Layout>
    );
}

export default Create;
