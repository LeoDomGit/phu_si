import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Notyf } from "notyf";
import { Box, Select, Switch, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "notyf/notyf.min.css";
import axios from "axios";
function Index({ collection }) {
	const [data, setData] = useState(collection);
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

	const columns = [
		{ field: "id", headerName: "#", width: 100, renderCell: (params) => params.rowIndex },
		{ field: "collection", headerName: "Danh mục sản phẩm", width: 200, editable: true },
		{ field: "slug", headerName: "Slug", width: 200, editable: true },
		{ field: "position", headerName: "Thứ tự", width: 100, editable: true },
		{
			field: "status",
			headerName: "Status",
			width: 70,
			renderCell: (params) => <Switch checked={params.value == 1} onChange={(e) => switchCollection(params, e.target.value)} inputProps={{ "aria-label": "controlled" }} />,
		},
		{
			field: "created_at",
			headerName: "Created at",
			width: 200,
			valueGetter: (params) => formatCreatedAt(params),
		},
	];
	function switchCollection(params, value) {
		if (params.row.status == 1) {
			var newStatus = 0;
		} else {
			var newStatus = 1;
		}
		axios
			.put("/admin/collectionsHome/" + params.id, {
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
	const handleCellEditStop = (id, field, value) => {
		axios
			.put(`/admin/collectionsHome/${id}`, {
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
				<div className="row mt-3">
					<div className="col-md-7">
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
									onCellEditStop={(params, e) => handleCellEditStop(params.row.id, params.field, e.target.value)}
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
