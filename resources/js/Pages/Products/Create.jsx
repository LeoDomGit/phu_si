import React, { useState } from "react";
import Layout from "../../components/Layout";
import Gallery from "../../components/Gallery";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "notyf/notyf.min.css";
import axios from "axios";
import { Notyf } from "notyf";
function Create({ allCollecions, brands, collections,categories }) {
    const theme = useTheme();
    const [idBrand, setIdBrand] = useState(0);
    const [idCategories, setidCategories] = useState(0);
    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [compare_price, setComparePrice] = useState(0);
    const [instock, setInstock] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [content, setContent] = useState("");
    const [attributes, setAttributes] = useState([{ name: "", value: "" }]);
    const [description, setDescription] = useState("");
    const [modalShow, setModalShow] = React.useState(false);
    const [images, setImages] = useState([]);
    const handleSelectImages = (selectedImages) => {
        var arr = images;
        arr.push(selectedImages);
        setImages(arr);
        setModalShow(false);
    };
    const options = {
        filebrowserImageBrowseUrl: "/laravel-filemanager?type=Images",
        filebrowserImageUploadUrl:
            "/laravel-filemanager/upload?type=Images&_token=",
        filebrowserBrowseUrl: "/laravel-filemanager?type=Files",
        filebrowserUploadUrl: "/laravel-filemanager/upload?type=Files&_token=",
    };
    window.CKEDITOR.replace("editor1", options);
    window.CKEDITOR.replace("editor", options);

    const [idCollections, setIdCollections] = useState([]);
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const names = [
        "Oliver Hansen",
        "Van Henry",
        "April Tucker",
        "Ralph Hubbard",
        "Omar Alexander",
        "Carlos Abbott",
        "Miriam Wagner",
        "Bradley Wilkerson",
        "Virginia Andrews",
        "Kelly Snyder",
    ];
    const handleAttributeChange = (index, event) => {
        const { name, value } = event.target;
        const newAttributes = [...attributes];
        newAttributes[index][name] = value;
        setAttributes(newAttributes);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { name: "", value: "" }]);
    };

    const removeAttribute = (index) => {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
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
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setIdCollections(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };
    const submitCreate=()=>{
        var formData= new FormData();
        var thuoc_tinh= JSON.stringify(attributes)
        formData.append('name',name);
        formData.append('sku',sku);
        formData.append('price',price);
        formData.append('compare_price',compare_price);
        formData.append('attributes',thuoc_tinh);
        formData.append('categories',idCategories);
        formData.append('discount',discount);
        formData.append('description',CKEDITOR.instances['editor1'].getData());
        formData.append('content',CKEDITOR.instances['editor'].getData());
        formData.append('id_brand',idBrand);
        formData.append('instock',instock);
        idCollections.forEach(el => {
            formData.append('collections[]',el);
        });
        images.forEach(el => {
            formData.append('images[]',el);
        });
        axios.post('/admin/products',formData).then((res)=>{
            if(res.data.check==true){
                notyf.open({
                    type: "success",
                    message: "Thêm thành công",
                });
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }else if(res.data.check==false){
                if(res.data.msg){
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            }
        })
    }
    return (
        <Layout>
            <>
                <Gallery />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8">
                            <div class="card">
                                <div class="card-header">
                                    <h4>Thêm sản phẩm</h4>
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
                                                Thông tin sản phẩm
                                            </button>
                                            {/* <button
                                                className="nav-link"
                                                id="nav-attribute-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-attribute"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-attribute"
                                                aria-selected="false"
                                            >
                                                Thuộc tính sản phẩm
                                            </button> */}
                                            <button
                                                className="nav-link"
                                                id="nav-profile-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-profile"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-profile"
                                                aria-selected="false"
                                            >
                                                Hình ảnh sản phẩm
                                            </button>
                                            <button
                                                className="nav-link"
                                                id="nav-contact-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-contact"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-contact"
                                                aria-selected="false"
                                            >
                                                Liên kết sản phẩm
                                            </button>
                                        </div>
                                    </nav>
                                </div>
                                <div class="card-body">
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
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            SKU
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={sku==''?"SKU ...":''}
                                                            value={sku}
                                                            onChange={(e) =>
                                                                setSku(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-label=""
                                                            aria-describedby="basic-addon1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            Tên sản phẩm
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={name==''?"Tên sản phẩm ...":''}
                                                            value={name}
                                                            aria-label="Tên sản phẩm"
                                                            onChange={(e) =>
                                                                setName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-describedby="basic-addon1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            Giá sản phẩm
                                                        </span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Giá ..."
                                                            value={price}
                                                            aria-label=""
                                                            onChange={(e) =>
                                                                setPrice(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-describedby="basic-addon1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            Giá so sánh
                                                        </span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Giá so sánh ..."
                                                            value={compare_price}
                                                            onChange={(e) =>
                                                                setComparePrice(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-label=""
                                                            aria-describedby="basic-addon1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            Giảm giá
                                                        </span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={discount}
                                                            placeholder="Giảm giá ..."
                                                            aria-label=""
                                                            onChange={(e) =>
                                                                setDiscount(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-describedby="basic-addon1"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <span
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            Tồn kho
                                                        </span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={instock}
                                                            placeholder="Tồn kho ..."
                                                            aria-label=""
                                                            onChange={(e) =>
                                                                setInstock(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            aria-describedby="basic-addon1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md">
                                                    <label htmlFor="">
                                                        Mô tả{" "}
                                                    </label>
                                                    <textarea
                                                        id="editor1"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div class="mb-3">
                                                    <label
                                                        for=""
                                                        class="form-label"
                                                    >
                                                        Bài viết
                                                    </label>
                                                    <textarea
                                                        id="editor"
                                                        value={content}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="nav-attribute"
                                            role="tabpanel"
                                            aria-labelledby="nav-attribute-tab"
                                        >
                                            {attributes.map((attr, index) => (
                                                <div
                                                    className="row mb-3"
                                                    key={index}
                                                >
                                                    <div className="col-md-5">
                                                        <input
                                                            type="text"
                                                            placeholder="Thuộc tính"
                                                            name="name"
                                                            value={attr.name}
                                                            onChange={(e) =>
                                                                handleAttributeChange(
                                                                    index,
                                                                    e
                                                                )
                                                            }
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="col-md-5">
                                                        <input
                                                            type="text"
                                                            placeholder="Giá trị"
                                                            name="value"
                                                            value={attr.value}
                                                            onChange={(e) =>
                                                                handleAttributeChange(
                                                                    index,
                                                                    e
                                                                )
                                                            }
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                removeAttribute(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={(e) =>
                                                            addAttribute()
                                                        }
                                                    >
                                                        Thêm
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="nav-profile"
                                            role="tabpanel"
                                            aria-labelledby="nav-profile-tab"
                                        >
                                            <div className="row">
                                                {images.length > 0 && (
                                                    <div className="row mb-2">
                                                        {images.map(
                                                            (item, index) => (
                                                                <div className="col-md-3 mb-2">
                                                                    <div class="card">
                                                                        <div class="card-body">
                                                                            <img
                                                                            className="w-100"
                                                                                src={
                                                                                    item
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                        <div class="card-footer text-muted">
                                                                            Footer
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}

                                                    </div>

                                                )}
                                                  <div className="col-md-1">
                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={(e) =>
                                                                    setModalShow(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                            </div>

                                            <Gallery
                                                show={modalShow}
                                                       backdrop="static"
                                                onHide={() =>
                                                    setModalShow(false)
                                                }
                                                onSelectImages={
                                                    handleSelectImages
                                                }
                                            />
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="nav-contact"
                                            role="tabpanel"
                                            aria-labelledby="nav-contact-tab"
                                        >
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                        <label htmlFor="">
                                                        Thương hiệu sản phẩm
                                                        </label>
                                                    <FormControl
                                                            sx={{
                                                                m: 1,
                                                                width: 300,
                                                            }}
                                                        >
                                                            <InputLabel id="demo-multiple-name-label">
                                                            </InputLabel>
                                                            <Select
                                                                labelId="demo-multiple-name-label"
                                                                value={
                                                                    idBrand
                                                                }
                                                                onChange={
                                                                    (e)=>setIdBrand(e.target.value)
                                                                }
                                                                input={
                                                                    <OutlinedInput label="Name" />
                                                                }
                                                                MenuProps={
                                                                    MenuProps
                                                                }
                                                            >
                                                                {brands.map(
                                                                    (item) => (
                                                                        <MenuItem
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            value={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                <label htmlFor="">Danh mục sản
                                                phẩm xuất hiện</label>
                                                <div className="input-group mb-3">
                                                        <FormControl
                                                            sx={{
                                                                m: 1,
                                                                width: 300,
                                                            }}
                                                        >
                                                            <InputLabel id="demo-multiple-name-label">

                                                            </InputLabel>
                                                            <Select
                                                                labelId="demo-multiple-name-label"
                                                                id="demo-multiple-name"
                                                                multiple
                                                                value={
                                                                    idCollections
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                input={
                                                                    <OutlinedInput label="Name" />
                                                                }
                                                                MenuProps={
                                                                    MenuProps
                                                                }
                                                            >
                                                                {allCollecions.map(
                                                                    (item) => (
                                                                        <MenuItem
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            value={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            {
                                                                                item.collection
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="input-group mb-3">
                                                    <label htmlFor="">Loại sản phẩm</label>

                                                        <FormControl
                                                            sx={{
                                                                m: 1,
                                                                width: 300,
                                                            }}
                                                        >
                                                            <Select
                                                                labelId="demo-multiple-name-label"
                                                                id="demo-multiple-name"
                                                                value={
                                                                    idCategories
                                                                }
                                                                onChange={(e)=>setidCategories(e.target.value)}
                                                                input={
                                                                    <OutlinedInput label="Name" />
                                                                }
                                                                MenuProps={
                                                                    MenuProps
                                                                }
                                                            >
                                                                {categories.map(
                                                                    (item) => (
                                                                        <MenuItem
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            value={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer text-muted"><button className="btn btn-sm btn-primary" onClick={(e)=>submitCreate()}>Thêm</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Layout>
    );
}

export default Create;
