import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, message } from "antd";
import { CheckOutlined, DeleteOutlined, EditOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import { User } from "../type";
import useColors from "../Hooks/useColors";
import ReactPaginate from "react-paginate";
const key = "Loading";
const Users: React.FC = () => {
  const UserService = (window as any).app?.user;
  const [, Colors] = useColors();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setid] = useState<string>("");
  const [keyword, setkeyword] = useState<string>("");
  const [username, setusername] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setusers] = useState<User[]>([]);
  const [page, setpage] = useState<number>(1);
  const [totalpages, settotalpages] = useState<number>(0);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [refresh, setrefresh] = useState<boolean>(false);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/Login", { replace: true });
  };
  const reset = () => {
    setusername("");
    setpassword("");
  };
  const ErrorMessage = () => {
    messageApi.open({
      key,
      type: "error",
      content: "Error!",
      duration: 2,
    });
  };
  const successMessage = () => {
    messageApi.open({
      key,
      type: "success",
      content: "تم!",
      duration: 2,
    });
  };
  const endCall = () => {
    setrefresh(!refresh);
    setLoading(false);
    reset();
    setOpen(false);
    successMessage();
  };
  const save = async () => {
    try {
      setLoading(true);
      await UserService.create(username, password);
      endCall();
    } catch (error) {
      // Handle error
      const err = error as { message: string; status: number };
      if (err.status === 422) {
        messageApi.open({
          key,
          type: "error",
          content: err.message,
          duration: 2,
        });
      } else ErrorMessage();
      setLoading(false);
    }
  };
  const update = async () => {
    try {
      setLoading(true);
      await UserService.update(id, username, password);
      endCall();
    } catch (error) {
      // Handle error
      ErrorMessage();
      setLoading(false);
    }
  };
  const dprofile = async () => {
    try {
      setLoading(true);
      await UserService.delete(id);
      endCall();
    } catch (error) {
      // Handle error
      ErrorMessage();
      setLoading(false);
    }
  };
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    isSave ? save() : update();
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };
  const renderProfiles = users.map((Element, index) => {
    return (
      <div
        key={index}
        className="d-flex mb-2 p-2"
        style={{
          borderBottomWidth: 1,
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderColor: Colors.dark,
          borderStyle: "dashed",
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-end">
              <div className="h4">{Element.username}</div>
            </div>
            <div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  showModal();
                  setpassword(Element.password);
                  setusername(Element.username);
                  setIsSave(false);
                  setid(Element.id);
                }}
              >
                <EditOutlined style={{ fontSize: 30, color: Colors.primary }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        messageApi.open({
          key,
          type: "loading",
          content: "جار التحميل...",
          duration: 0,
        });
        const result = await UserService.get(page);
        settotalpages(result.pages);
        setusers(result.users);
        successMessage();
      } catch (error) {
        // Handle error
        ErrorMessage();
        console.log(error);
        console.log(UserService);
      }
    };
    fetchData();
  }, [refresh, page]);
  const search = async () => {
    try {
      messageApi.open({
        key,
        type: "loading",
        content: "جار التحميل...",
        duration: 0,
      });
      const result = await UserService.search(keyword);
      setusers(result);
      successMessage();
    } catch (error) {
      // Handle error
      ErrorMessage();
    }
  };
  const handlePageClick = (selectedItem: { selected: number }) => {
    setpage(selectedItem.selected + 1);
  };
  const getFooter = () => {
    let data = [
      <Button key="back" onClick={handleCancel}>
        إلغاء
      </Button>,
      <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
        حفظ
      </Button>,
    ];
    !isSave &&
      data.push(
        <Button
          key="delete"
          type="default"
          onClick={() => {
            dprofile();
          }}
          danger
          icon={<DeleteOutlined />}
        />
      );
    return data;
  };
  return (
    <>
      <div className="container p-3 pt-4">
        {contextHolder}
        <div className="d-flex justify-content-between">
          <div
            className="p-2 px-4 d-flex mb-3 mx-auto"
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 20,
              cursor: "pointer",
            }}
            onClick={() => {
              showModal();
              setIsSave(true);
            }}
          >
            <CheckOutlined style={{ fontSize: 24, color: Colors.light }} />
            <div
              className="mx-auto "
              style={{
                color: Colors.light,
                fontSize: 16,
              }}
            >
              جديد
            </div>
          </div>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            value={keyword}
            onChange={(e) => {
              setkeyword(e.target.value);
            }}
          />
          <label htmlFor="floatingInput">بحث</label>
          <button onClick={search} className="btn btn-primary">
            ابحث
          </button>
          <button
            onClick={() => {
              setrefresh(!refresh);
            }}
            className="btn btn-danger m-3"
          >
            الغاء نتائج البحث
          </button>
        </div>
        {renderProfiles}
        <Modal open={open} width={1000} title="المستخدمين" onOk={handleOk} onCancel={handleCancel} footer={getFooter}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => {
                setusername(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">اسم المستخدم</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">كلمة السر</label>
          </div>
        </Modal>

        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalpages}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          className="pagination justify-content-center my3"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          disabledClassName="disabled"
          nextClassName="page-item"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
        />
      </div>
    </>
  );
};

export default Users;
