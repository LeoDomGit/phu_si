/* eslint-disable */
import React from "react";
import { Sidebar, Menu, MenuItem, useProSidebar, SubMenu } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GroupIcon from "@mui/icons-material/Group";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LogoutIcon from "@mui/icons-material/Logout";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import ShopIcon from "@mui/icons-material/Shop";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import ClassIcon from "@mui/icons-material/Class";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DesignServicesTwoToneIcon from "@mui/icons-material/DesignServicesTwoTone";
import "../../css/app.css";
function Layout({ children }) {
	const { collapseSidebar } = useProSidebar();
	return (
		<>
			<div className="row w-100"></div>
			<div style={({ height: "90vh" }, { display: "flex" })}>
				<Sidebar style={{ minHeight: "90vh" }}>
					<Menu>
						<MenuItem
							icon={<MenuOutlinedIcon />}
							onClick={() => {
								collapseSidebar();
							}}
							style={{ textAlign: "center" }}>
							<h2>Admin</h2>
						</MenuItem>
						<SubMenu label="Tài khoản" icon={<GroupIcon />}>
							<MenuItem icon={<GroupIcon />} component="a" href="/admin/permissions">
								Quyền tài khoản
							</MenuItem>
							<MenuItem icon={<GroupIcon />} component="a" href="/admin/roles">
								Loại tài khoản
							</MenuItem>
							<MenuItem icon={<GroupIcon />} component="a" href="/admin/users">
								Tài khoản
							</MenuItem>
						</SubMenu>
						<SubMenu label="Quản lý sản phẩm" icon={<BrandingWatermarkIcon />}>
							<SubMenu label="Danh mục" icon={<ArrowForwardIosIcon />}>
								<MenuItem icon={<ArrowForwardIosIcon />} component="a" href="/admin/collections">
									Nhóm Danh mục
								</MenuItem>

								<MenuItem icon={<ArrowForwardIosIcon />} component="a" href="/admin/collections/create">
									Thêm nhóm danh mục
								</MenuItem>
							</SubMenu>
                            <SubMenu label="Loại sản phẩm" icon={<ArrowForwardIosIcon />}>
								<MenuItem icon={<ArrowForwardIosIcon />} component="a" href="/admin/categories">
									Loại sản phẩm
								</MenuItem>

								<MenuItem icon={<ArrowForwardIosIcon />} component="a" href="/admin/categories/create">
									Thêm loại sản phẩm
								</MenuItem>
							</SubMenu>
							<MenuItem icon={<BrandingWatermarkIcon />} component="a" href="/admin/brands">
								Thương hiệu
							</MenuItem>
							<SubMenu label="Sản phẩm" icon={<ArrowForwardIosIcon />}>
								<MenuItem icon={<ArrowForwardIosIcon />} component="a" href="/admin/products/create">
									Thêm sản phẩm
								</MenuItem>
								<MenuItem icon={<ArrowForwardIosIcon />} component="a" href="/admin/products">
									Danh sách sản phẩm
								</MenuItem>
							</SubMenu>
                            <MenuItem icon={<ArrowForwardIosIcon />} component="a" href="/admin/comments">
									Danh sách comments
								</MenuItem>
								<MenuItem icon={<ArrowForwardIosIcon />} component="a" href="/admin/reviews">
									Danh sách Reviews
								</MenuItem>
						</SubMenu>
						<SubMenu label="Quản lý Bài viết" icon={<PostAddRoundedIcon />}>
							<MenuItem icon={<PostAddRoundedIcon />} component="a" href="/admin/posts">
								Danh sách bài viết
							</MenuItem>
							<MenuItem icon={<ClassIcon />} component="a" href="/admin/post/categories">
								Chuyên mục bài viết{" "}
							</MenuItem>
							<MenuItem icon={<ClassIcon />} component="a" href="/admin/posts-collections">
								Loại bài viết
							</MenuItem>
						</SubMenu>
						<MenuItem icon={<ShopIcon />} component="a" href="/admin/slides">
							Slides
						</MenuItem>
						<MenuItem icon={<CardTravelIcon />} component="a" href="/admin/files">
							Hình ảnh
						</MenuItem>
						<MenuItem icon={<DesignServicesTwoToneIcon />} component="a" href="/admin/bills">
							Hóa đơn
						</MenuItem>
                        <MenuItem icon={<ContactMailIcon />} component="a" href="/admin/contacts">
							Liên hệ
						</MenuItem>
						<MenuItem icon={<LogoutIcon />} component="a" href="/logout">
							Log out
						</MenuItem>
					</Menu>
				</Sidebar>
				<main className="p-4 w-100">{children}</main>
			</div>
		</>
	);
}

export default Layout;
