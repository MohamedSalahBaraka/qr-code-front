import { useCallback } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { message } from "antd";
const Layout = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const ErrorMessage = useCallback(() => {
    messageApi.open({
      key: "logout",
      type: "error",
      content: "Error!",
      duration: 2,
    });
  }, [messageApi]);
  const successMessage = useCallback(() => {
    messageApi.open({
      key: "logout",
      type: "success",
      content: "تم!",
      duration: 2,
    });
  }, [messageApi]);
  const endCall = () => {
    successMessage();
  };
  return (
    <div className="sb-nav-fixed">
      {contextHolder}
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <Link to="/" className="nav-link text-white">
          Logo
        </Link>

        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
          onClick={(event) => {
            event.preventDefault();
            document.body.classList.toggle("sb-sidenav-toggled");
          }}
        >
          <i className="bi bi-list mobile-nav-toggle"></i>
        </button>
      </nav>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <Link to="/dashboard/Users" className="nav-link ">
                  المستخدمين
                </Link>
                <Link to="/dashboard/Emplyees" className="nav-link ">
                  الموظفين
                </Link>
                <Link to="/" className="nav-link ">
                  تسجيل الخروج
                </Link>
              </div>
            </div>
          </nav>
        </div>
        <div id="layoutSidenav_content">
          <main className="d-flex flex-fill">
            <Outlet />
          </main>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; dragon tech 2022</div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
