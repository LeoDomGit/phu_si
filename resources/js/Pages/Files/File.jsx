import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Notyf } from "notyf";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import "notyf/notyf.min.css";
import axios from "axios";
import Swal from 'sweetalert2'
function File({ folders }) {
    const [folder, setFolder] = useState("");
    const [images, setImages] = useState([]);
    const [data, setFolders] = useState(folders);
    const [show1, setShow1] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose1 = () => setShow(false);
    const handleClose = () => setShow(false);
    const [files, setFiles] = React.useState([]);
    const handleShow = () => setShow(false);
    const [idfolder, setIdFolder] = useState(null);

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
                color: "black",
                duration: 2000,
                dismissible: true,
            },
            {
                type: "info",
                background: "#24b3f0",
                color: "black",
                duration: 1500,
                dismissible: false,
                icon: '<i class="bi bi-bag-check"></i>',
            },
        ],
    });
    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
    };

    const submitFolder = () => {
        if (folder == "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập tên thư mục",
            });
        } else {
            axios
                .post("/admin/folder", {
                    name: folder,
                })
                .then((res) => {
                    if (res.data.check == true) {
                        setFolders(res.data.data);
                        notyf.open({
                            type: "success",
                            message: "Tạo thư mục thành công",
                        });
                        setFolder('');
                        setShow1(false);

                    }
                });
        }
    };
    const deleteImage = (id) => {
        Swal.fire({
            icon: 'question',
            text: "Xóa hình ảnh này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete('/admin/files/' + id).then((res) => {
                    if (res.data.check == true) {
                        notyf.open({
                            type: "success",
                            message: "Đã xóa thành công",
                        });
                        setTimeout(() => {
                            window.location.reload()
                        }, 1400);
                    }
                })
            } else if (result.isDenied) {
            }
        });
    }
    const closeCreateFolder = () => {
        setFolder("");
        setOpen(false);
    };
    const resetCreateFolder = () => {
        setFolder("");
        setShow1(true);
    };
    useEffect(() => {
        if (idfolder != 0) {
            axios.get("/admin/files/" + idfolder).then((res) => {
                setImages(res.data.data);
            });
        }
    }, [idfolder]);

    const uploadImage = () => {
        var formData = new FormData();
        files.forEach(file => {
            formData.append('files[]', file.file);
        });
        if (idfolder != null) {
            formData.append('folder_id', idfolder);
        }
        axios.post('/admin/files/', formData)
            .then((res) => {
                if (res.data.check == true) {
                    notyf.open({
                        type: "success",
                        message: "Tải hình ảnh thành công",
                    });
                    setGallery(res.data.result);
                    window.location.reload();
                } else if (res.data.check == false) {
                    if (res.data.msg) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });

                    }
                }
            })
            .catch((error) => {

            });
    }

    return (
        <Layout>
            <>
                <Modal
                    show={show1}
                    onHide={(e) => setShow1(false)}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Tạo thư mục</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={folder === '' ? "Tên thư mục ..." : ""}
                                value={folder}
                                aria-label="Tên thư mục ..."
                                aria-describedby="button-addon2"
                                onChange={(e) => setFolder(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-primary"
                                type="button"
                                id="button-addon2"
                                onClick={(e) => submitFolder()}
                            >
                                Thêm
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm hình ảnh</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Dropzone onChange={updateFiles} accept="image/*" value={files}>
                            {files.map((file) => (
                                <FileMosaic {...file} preview />
                            ))}
                        </Dropzone>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={(e) => uploadImage()}>Tải hình</Button>
                    </Modal.Footer>
                </Modal>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div
                            className="collapse navbar-collapse"
                            id="navbarSupportedContent"
                        >
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a
                                        className="nav-link active"
                                        aria-current="page"
                                        href="#"
                                        onClick={(e) => resetCreateFolder()}
                                    >
                                        Thêm thư mục
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="row">
                    <div className="col-md-3">
                        <div className="row mt-3">
                            <div className="col-md">
                                <ul className="list-group">
                                    <li
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => setIdFolder(null)}
                                        className={
                                            !idfolder
                                                ? "list-group-item active"
                                                : "list-group-item"
                                        }
                                    >
                                        public
                                    </li>
                                    {data.length > 0 &&
                                        data.map((folder, index) => (
                                            <li
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) =>
                                                    setIdFolder(folder.id)
                                                }
                                                className={
                                                    idfolder == folder.id
                                                        ? "list-group-item active"
                                                        : "list-group-item"
                                                }
                                            >
                                                {folder.name}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md mt-3">
                        <div class="card text-start">
                            <div class="card-body">
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <button className="btn btn-primary" onClick={(e) => setShow(true)}>Thêm</button>
                                    </div>
                                </div>
                                {images.length == 0 && (
                                    <h5>Chưa có hình ảnh</h5>
                                )}
                                {images.length > 0 && (
                                    <div className="row">
                                        {images.map((image) => (
                                            <div className="col-md-3">
                                                <div class="card">
                                                    <div class="card-body" style={{ minHeight: '210px' }}>
                                                        <img className="img-fluid" style={{ height: '190px', margin: '0px auto' }} src={image.folder ? '/storage/' + image.folder.name + '/' + image.filename : '/storage/' + image.filename} alt="" />
                                                    </div>
                                                    <div class="card-footer text-muted">
                                                        <button className="btn btn-primary">Chọn</button>
                                                        <button className="btn btn-danger ms-3" onClick={(e) => deleteImage(image.id)}>Xóa</button>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Layout>
    );
}
export default File;
