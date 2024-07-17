import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Gallery from "../../components/Gallery";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Container, Row, Col, Button, Modal, Form, Image } from "react-bootstrap";
import { Box, Select, Switch, Typography, MenuItem, InputLabel, FormControl } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import axios from "axios";
import CKEditor from "../../components/CKEditor";

export default function Post({ posts, categorys, collections, products }) {
	const [data, setData] = useState("");
	const [categories, setCategories] = useState("");
	const [collection, setCollection] = useState("");
	const [show, setShow] = useState(false);
	const [showDetail, setShowDetail] = useState(false);
	const [modalShow, setModalShow] = React.useState(false);
	const [modalShow2, setModalShow2] = React.useState(false);
	const [links, setLinks] = useState([]);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handledDetail = (id) => {
		setShowDetail(true);
		axios.get(`/admin/posts/${id}`).then((response) => {
			if (response.data.check === true) {
				setId(response.data.data.id);
				setTitle(response.data.data.title);
				setLinks(response.data.links);
				// console.log(response.data.links);
				setSummary(response.data.data.summary);
				setPosition(response.data.data.position);
				setContent(response.data.data.content);
			} else {
				notyf.error(response.data.msg);
			}
		});
	};

	useEffect(() => {
		setData(posts);
		setCategories(categorys);
		setCollection(collections);
	}, [posts, categorys, collections]);
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
	const formatCreatedAt = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString();
	};

	// =================={Create}=======================
	const [id, setId] = useState(0);
	const [title, setTitle] = useState("");
	const [summary, setSummary] = useState("");
	const [idCollection, setIdCollection] = useState([]);
	const [idProduct, setIdProduct] = useState([]);
	const [category, setCategory] = useState("");
	const [position, setPosition] = useState(0);
	const [content, setContent] = useState("");
	const [images, setImages] = useState({});
	const [images2, setImages2] = useState({});
	const [status, setStatus] = useState(false);
	const [highlighted, setHighlighted] = useState(false);
	const handleSelectImages = (selectedImages) => {
		setImages(selectedImages);
		setModalShow(false);
	};
	const handleSelectImages2 = (selectedImages) => {
		setImages2(selectedImages);
		setModalShow2(false);
	};
	const resetCreate = () => {
		setTitle("");
		setSummary("");
		setIdCollection("");
		setCategory("");
		setContent("");
		setStatus(false);
		setHighlighted(false);
		handleClose();
	};

	const handleCloseDetail = () => {
		setId(0);
		setTitle("");
		setSummary("");
		setContent("");
		setShowDetail(false);
	};
	const handleChangeRelatedProduct = (event) => {
		const {
			target: { value },
		} = event;
		setIdProduct(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value
		);
	};

	const handleChangeRelatedProduct1 = (event) => {
		const {
			target: { value },
		} = event;
		setLinks(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value
		);
	};
	const handleCreate = () => {
		axios
			.post("/admin/posts", {
				title: title,
				summary: summary,
				id_collection: Number(idCollection),
				id_category: Number(category),
				position: position,
				content: content,
				status: status,
				image: images,
				highlighted: highlighted,
				collection: JSON.stringify(idProduct),
			})
			.then((response) => {
				if (response.data.check === true) {
					notyf.open({ type: "success", message: response.data.msg });
					setData(response.data.data);
					resetCreate();
				} else {
					notyf.open({ type: "error", message: response.data.msg });
				}
			});
	};

	const handleCellEditStop = (id, field, value) => {
		console.log(id, field, value);
		axios
			.put(`/admin/posts/${id}`, {
				[field]: value,
			})
			.then((response) => {
				if (response.data.check === true) {
					notyf.open({ type: "success", message: response.data.msg });
					setData(response.data.data);
				} else {
					notyf.open({ type: "error", message: response.data.msg });
				}
			});
	};

	const handleUpdate = (id) => {
		axios
			.put(`/admin/posts/${id}`, {
				summary: summary,
				position: position,
				image: images2,
				content: content,
				collection: JSON.stringify(links),
			})
			.then((response) => {
				if (response.data.check === true) {
					notyf.open({ type: "success", message: response.data.msg });
					setData(response.data.data);
					window.location.reload();
				} else {
					notyf.open({ type: "error", message: response.data.msg });
				}
			});
	};

	const handleDelete = (id) => {
		axios
			.delete(`/admin/posts/${id}`)
			.then((response) => {
				if (response.data.check === true) {
					notyf.open({ type: "success", message: response.data.msg });
					setData(response.data.data);
				} else {
					notyf.open({ type: "error", message: response.data.msg });
				}
			})
			.catch((error) => {
				notyf.open({ type: "error", message: error.response.data.msg });
			});
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
				background: "#7dd3e8",
				duration: 2000,
				dismissible: true,
			},
		],
	});

	const columns = [
		{ field: "id", headerName: "#", width: 30 },
		{
			field: "title",
			headerName: "Tiêu đề bài viết",
			width: 240,
			editable: true,
		},
		{ field: "slug", headerName: "Slug", width: 180 },
		{
			field: "id_collection",
			headerName: "Loại bài viết",
			width: 160,
			editable: true,
			renderCell: (params) => (
				<Select variant="standard" value={params.value} className="w-100" onChange={(e) => handleCellEditStop(params.id, params.field, e.target.value)}>
					{collection && collection.length > 0 ? (
						collection.map((item) => (
							<MenuItem key={item.id} value={item.id}>
								{item.name}
							</MenuItem>
						))
					) : (
						<MenuItem disabled>Loại không tồn tại</MenuItem>
					)}
				</Select>
			),
		},
		{
			field: "id_category",
			headerName: "Chuyên mục",
			width: 160,
			editable: true,
			renderCell: (params) => (
				<Select variant="standard" value={params.value} className="w-100" onChange={(e) => handleCellEditStop(params.id, params.field, e.target.value)}>
					{categories && categories.length > 0 ? (
						categories.map((item) => (
							<MenuItem key={item.id} value={item.id}>
								{item.title}
							</MenuItem>
						))
					) : (
						<MenuItem disabled>Không có chuyên mục</MenuItem>
					)}
				</Select>
			),
		},
		{
			field: "status",
			headerName: "Trạng thái",
			width: 100,
			editable: true,
			renderCell: (params) => (
				<Switch checked={params.value == 1} onChange={(e) => handleCellEditStop(params.id, params.field, e.target.checked ? 1 : 0)} inputProps={{ "aria-label": "controlled" }} />
			),
		},
		{
			field: "highlighted",
			headerName: "Highlighted",
			width: 100,
			editable: true,
			renderCell: (params) => (
				<Switch checked={params.value == 1} onChange={(e) => handleCellEditStop(params.id, params.field, e.target.checked ? 1 : 0)} inputProps={{ "aria-label": "controlled" }} />
			),
		},
		{ field: "view", headerName: "Lượt xem", width: 80 },
		{
			field: "created_at",
			headerName: "Ngày tạo",
			width: 140,
			valueGetter: (params) => formatCreatedAt(params),
		},
		{
			field: "updated_at",
			headerName: "Ngày cập nhật",
			width: 140,
			valueGetter: (params) => formatCreatedAt(params),
		},
		{
			field: "action",
			headerName: "Thao tác",
			width: 180,
			type: "actions",
			hideSortIcons: true,
			getActions: (params) => [
				<Button variant="warning" onClick={() => handledDetail(params.row.id)} title="Chỉnh sửa content">
					<i className="bi bi-pencil-square" />
				</Button>,

				<Button className="ms-2" variant="danger" onClick={() => handleDelete(params.row.id)} title="Xóa slide">
					<i className="bi bi-trash" />
				</Button>,
			],
		},
	];

	return (
		<Layout>
			<>
				<Row>
					<Col>
						<Button variant="primary" onClick={handleShow}>
							Thêm bài viết mới
						</Button>

						<Modal show={show} onHide={resetCreate} backdrop="static" size="lg" centered keyboard={false}>
							<Form
								encType="multipart/form-data"
								onSubmit={(e) => {
									e.preventDefault();
									handleCreate();
								}}>
								<Modal.Header closeButton>
									<Modal.Title> Tạo bài viết</Modal.Title>
								</Modal.Header>
								<Modal.Body aria-modal="true" role="dialog" tabIndex={-1} scroll="body">
									<Gallery show={modalShow} backdrop="static" onHide={() => setModalShow(false)} onSelectImages={handleSelectImages} />
									<Row>
										<Col sm={12} md={6} lg={6}>
											<Form.Group className="mb-3" controlId="formGroupTitle">
												<Form.Label>
													<strong>Tiêu đề</strong>{" "}
												</Form.Label>
												<Form.Control type="text" placeholder="Nhập tiêu đề bài viết..." value={title} onChange={(e) => setTitle(e.target.value)} />
											</Form.Group>
										</Col>
										<Col sm={12} md={6} lg={6}>
											<Form.Group className="mb-3" controlId="formGroupSummary">
												<Form.Label>
													<strong>Mô tả </strong>{" "}
												</Form.Label>
												<Form.Control type="text" placeholder="Nhập mô tả ngắn..." value={summary} onChange={(e) => setSummary(e.target.value)} />
											</Form.Group>
										</Col>
										<Col sm={12} md={5} lg={4}>
											<Form.Group className="mb-3" controlId="formGroupCollection">
												<Form.Label>
													<strong>Doanh mục chính</strong>
												</Form.Label>
												<Form.Select value={collection} onChange={(e) => setCollection(e.target.value)}>
													<option>Chọn 1 loại</option>
													{collection.length > 0 &&
														collection.map((collection) => (
															<option key={collection.id} value={collection.id}>
																{collection.name}
															</option>
														))}
												</Form.Select>
											</Form.Group>
										</Col>
										<Col sm={12} md={5} lg={5}>
											<Form.Group className="mb-3" controlId="formGroupCategory">
												<Form.Label>
													<strong>Chuyên mục</strong>
												</Form.Label>
												<Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
													<option value="">Chọn 1 chuyên mục</option>
													{categories.length > 0 &&
														categories.map((category) => (
															<option key={category.id} value={category.id}>
																{category.title}
															</option>
														))}
												</Form.Select>
											</Form.Group>
										</Col>
										<Col sm={12} md={2} lg={3}>
											<Form.Group className="mb-3" controlId="formGroupPosition">
												<Form.Label>
													<strong>Vị trí</strong>
												</Form.Label>
												<Form.Control type="number" placeholder="Nhập vị trí bài viết..." value={position} onChange={(e) => setPosition(e.target.value)} />
											</Form.Group>
										</Col>
										<Col xs={12}>
											<FormControl
												sx={{
													m: 1,
													width: 300,
												}}>
												<InputLabel id="demo-multiple-name-label">Danh mục sản phẩm xuất hiện</InputLabel>
												<Select
													labelId="demo-multiple-name-label"
													id="demo-multiple-name"
													multiple
													value={idProduct}
													onChange={handleChangeRelatedProduct}
													input={<OutlinedInput label="Name" />}
													MenuProps={MenuProps}>
													{products.map((item) => (
														<MenuItem key={item.id} value={item.id}>
															{item.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Col>
										<Col xs={12}>
											<button onClick={(e) => setModalShow(true)} className="btn btn-primary m-2">
												<i class="bi bi-card-image"></i>
											</button>
										</Col>
										<Col xs={5}>{images && <img src={images} alt="" />}</Col>
										<Col xs={12}>
											<Form.Group className="mb-3" controlId="formGroupContent">
												<Form.Label>
													<strong>Nội dung</strong>{" "}
												</Form.Label>
												<CKEditor value={content} onBlur={setContent} />
											</Form.Group>
										</Col>
										<Col xs={3}>
											<Form.Check type="switch" id="custom-switch-status" label="Trạng thái bài viết" checked={status === 1} onChange={(e) => setStatus(e.target.checked ? 1 : 0)} />
										</Col>
										<Col xs={3}>
											<Form.Check type="switch" id="custom-switch-highlight" label="Highlighted" checked={highlighted === 1} onChange={(e) => setHighlighted(e.target.checked ? 1 : 0)} />
										</Col>
									</Row>
								</Modal.Body>
								<Modal.Footer>
									<Button variant="secondary" onClick={resetCreate}>
										Thoát
									</Button>
									<Button variant="primary" type="submit">
										Lưu lại
									</Button>
								</Modal.Footer>
							</Form>
						</Modal>
					</Col>
				</Row>
				<Row>
					{data && (
						<Col className="mt-3">
							<div className="container-fluid">
								<div>
									<DataGrid
										rows={data}
										columns={columns}
										pageSize={5}
										initialState={{
											pagination: {
												paginationModel: {
													pageSize: 5,
												},
											},
										}}
										pageSizeOptions={[5]}
										slots={{ toolbar: GridToolbar }}
										slotProps={{
											toolbar: {
												showQuickFilter: true,
											},
										}}
										checkboxSelection
										disableRowSelectionOnClick
										onCellEditStop={(params, e) => handleCellEditStop(params.row.id, params.field, e.target.value)}
									/>
								</div>
							</div>
						</Col>
					)}
					<Modal show={showDetail} onHide={handleCloseDetail} backdrop="static" size="lg" centered keyboard={false}>
						<Form
							encType="multipart/form-data"
							onSubmit={(e) => {
								e.preventDefault();
								handleUpdate(id);
							}}>
							<Modal.Header closeButton>
								<Modal.Title>
									{" "}
									<small className="text-muted fs-6">Chỉnh sửa bài viết:</small> <br /> <strong>{title}</strong>
								</Modal.Title>
							</Modal.Header>
							<Modal.Body aria-modal="true" role="dialog" tabIndex={-1} scroll="body">
								<Row>
									<Col sm={12} md={10} lg={9}>
										<Form.Group className="mb-3" controlId="formGroupSummary">
											<Form.Label>
												<strong>Mô tả </strong>{" "}
											</Form.Label>
											<Form.Control type="text" placeholder="Nhập mô tả ngắn..." value={summary} onChange={(e) => setSummary(e.target.value)} />
										</Form.Group>
									</Col>
									<Col xs={12}>
										<FormControl
											sx={{
												m: 1,
												width: 300,
											}}>
											<InputLabel id="demo-multiple-name-label">Danh mục sản phẩm xuất hiện</InputLabel>
											<Select
												labelId="demo-multiple-name-label"
												id="demo-multiple-name"
												multiple
												value={links}
												onChange={handleChangeRelatedProduct1}
												input={<OutlinedInput label="Name" />}
												MenuProps={MenuProps}>
												{products.map((item) => (
													<MenuItem key={item.id} value={item.id}>
														{item.name}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Col>
									<Gallery show={modalShow2} backdrop="static" onHide={() => setModalShow2(false)} onSelectImages={handleSelectImages2} />
									<Col sm={12} md={2} lg={3}>
										<Form.Group className="mb-3" controlId="formGroupPosition">
											<Form.Label>
												<strong>Vị trí</strong>
											</Form.Label>
											<Form.Control type="number" placeholder="Nhập vị trí bài viết..." value={position} onChange={(e) => setPosition(e.target.value)} />
										</Form.Group>
									</Col>
									<Col xs={12}>
										<button type="button" onClick={(e) => setModalShow2(true)} className="btn btn-primary m-2">
											<i class="bi bi-card-image"></i>
										</button>
									</Col>
									<Col xs={5}>{images2 && <img src={images2} alt="" />}</Col>
									<Col xs={12}>
										<Form.Group className="mb-3" controlId="formGroupContent">
											<Form.Label>
												<strong>Nội dung</strong>{" "}
											</Form.Label>
											<CKEditor value={content} onBlur={setContent} />
										</Form.Group>
									</Col>
								</Row>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={handleCloseDetail}>
									Thoát
								</Button>
								<Button variant="primary" type="submit">
									Lưu lại
								</Button>
							</Modal.Footer>
						</Form>
					</Modal>
				</Row>
			</>
		</Layout>
	);
}
