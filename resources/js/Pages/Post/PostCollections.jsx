import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Container, Row, Col, Button, Modal, Form, Image } from "react-bootstrap";
import { Box, Select, Switch, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import axios from "axios";

export default function PostCollections({ collections }) {
	const [data, setData] = useState([]);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		setData(collections);
	}, [collections]);

	const formatCreatedAt = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString();
	};

	//=================={Create}=======================
	const [name, setName] = useState("");
	const [position, setPosition] = useState("");

	const resetCreate = () => {
		setName("");
		setPosition("");
		handleClose();
	};

	const handleCreate = () => {
		axios
			.post("/admin/posts-collections", {
				name: name,
				position: Number(position),
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
			.put(`/admin/posts-collections/${id}`, {
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

	const handleDelete = (id) => {
		axios
			.delete(`/admin/posts-collections/${id}`)
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
		{ field: "id", headerName: "ID", width: 40, editable: true, type: "number" },
		{ field: "name", headerName: "Tiêu đề phân loại", width: 120, editable: true },
		{ field: "slug", headerName: "Slug", width: 120 },
		{ field: "position", headerName: "Vị trí", width: 220, editable: true },
		{ field: "created_at", headerName: "Ngày tạo", width: 160, valueGetter: (params) => formatCreatedAt(params) },
		{ field: "updated_at", headerName: "Ngày cập nhật", width: 160, valueGetter: (params) => formatCreatedAt(params) },
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
			field: "actions",
			headerName: "Thao tác",
			sortable: false,
			width: 160,
			type: "actions",
			getActions: (params) => [
				<Button className="ms-2" variant="danger" onClick={() => handleDelete(params.row.id)} title="Xóa">
					<i className="bi bi-trash" />
				</Button>,
			],
		},
	];

	return (
		<Layout>
			<>
				<h1>Danh sách phân loại</h1>
				<Row>
					<Col>
						<Button variant="primary" onClick={handleShow}>
							Tạo mới phân loại
						</Button>

						<Modal show={show} onHide={resetCreate} backdrop="static" keyboard={false}>
							<Form
								onSubmit={(e) => {
									e.preventDefault();
									handleCreate();
								}}>
								<Modal.Header closeButton>
									<Modal.Title>Tạo mới phân loại</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<Form.Group className="mb-3" controlId="formGroupTitle">
										<Form.Label>
											<strong>Tiêu đề</strong>
										</Form.Label>
										<Form.Control type="text" placeholder="Vui lòng nhập tiêu đề..." value={name} onChange={(e) => setName(e.target.value)} />
									</Form.Group>
									<Form.Group className="mb-3" controlId="formGroupSummary">
										<Form.Label>
											<strong>Vị trí hiển thị</strong>
										</Form.Label>
										<Form.Control type="number" placeholder="Vui nhập vị trí mà bạn muốn hiển thị..." value={position} onChange={(e) => setPosition(e.target.value)} />
									</Form.Group>
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
					<Col className="mt-3">
						<Box sx={{ height: 400, width: "72%" }}>
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
								checkboxSelection
								disableRowSelectionOnClick
								onCellEditStop={(params, e) => handleCellEditStop(params.row.id, params.field, e.target.value)}
							/>
						</Box>
					</Col>
				</Row>
			</>
		</Layout>
	);
}
