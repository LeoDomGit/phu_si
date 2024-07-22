import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import axios from 'axios';
function CreateCategories({collections,categories}) {
    const [category,setCategory]= useState('');
    const [position,setPosition]= useState(1);
    const [id_collection,setIdCollection]= useState(0);
    const [id_parent,setIdParent]= useState(null);
    const [data,setData]=useState(collections);
    const [dataCate,setDataCate]=useState(categories);

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

    const submitCategory=()=>{
        if(category==''){
            notyf.open({
                type: "error",
                message: "Thiếu tên danh mục",
            });
        }else if(id_collection==0){
            notyf.open({
                type: "error",
                message: "Thiếu danh mục cha",
            });
        }else{
            axios.post('/admin/categories',{
                name:category,
                position:position,
                id_collection:Number(id_collection),
                id_parent:id_parent,
            }).then((res)=>{
                if(res.data.check==true){
                    notyf.open({
                        type: "success",
                        message: "Thêm thành công",
                    });
                    window.location.reload();
                }else if(res.data.check==false){
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            })
        }
    }
    return (
        <Layout>
            <>
                <div className="row">
                    <div className="col-md- pt-5">
                        <div class="shadow p-3 mb-5 bg-body rounded card text-start">
                            <div class="card-body">
                                <div className="row">
                                    <a href="/admin/collections">Quay lại trang danh mục</a>

                                    <div className="col-md-4 mt-2">
                                        <div className="input-group mb-3">
                                            <span
                                                className="input-group-text"
                                                id="basic-addon1"
                                            >
                                                Danh mục con
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Danh mục sản phẩm"
                                                value={category}
                                                aria-label="Danh mục sản phẩm"
                                                onChange={(e)=>setCategory(e.target.value)}
                                                aria-describedby="basic-addon1"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="input-group mb-3">
                                            <span
                                                className="input-group-text"
                                                id="basic-addon2"
                                            >
                                                Chọn nhóm danh mục
                                            </span>
                                          <select name="" onChange={(e)=>setIdCollection(e.target.value)} className="form-control" defaultValue={0} id="">
                                            <option disabled value={0}>Chọn nhóm mục cha</option>
                                            {data.map((item,index)=>(
                                                <option value={item.id}>{item.collection}</option>
                                            ))}
                                          </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="input-group mb-3">
                                            <span
                                                className="input-group-text"
                                                id="basic-addon2"
                                            >
                                                Danh mục cha
                                            </span>
                                          <select name="" onChange={(e)=>setIdParent(e.target.value)} className="form-control" defaultValue={0} id="">
                                            <option disabled value={0}>Chọn danh mục cha</option>
                                            {dataCate.map((item,index)=>(
                                                <option value={item.id}>{item.name}</option>
                                            ))}
                                          </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
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
                                                onChange={(e)=>setPosition(e.target.value)}
                                                aria-label="Thứ tự"
                                                aria-describedby="basic-addon2"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <button className="btn btn-sm btn-outline-primary" onClick={(e)=>submitCategory()}>
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Layout>
    );
}

export default CreateCategories;
