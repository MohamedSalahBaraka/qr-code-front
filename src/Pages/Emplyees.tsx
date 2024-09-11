import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, message } from "antd";
import { CalendarOutlined, CheckOutlined, DeleteOutlined, EditOutlined, MoneyCollectOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Employee, User } from "../type";
import useColors from "../Hooks/useColors";
import ReactPaginate from "react-paginate";
import { QRCodeCanvas } from "qrcode.react";
// This is the Employee component that been used for the emplyees screen
const Emplyees: React.FC = () => {
  // THis is the key for messages of ANTDesign
  const key = "Loading";
  // this is the service coming from the preload.js in the electron app we need to use window as any because typescript can't know the vars that we are exposing to the main World on it is own
  const EmplyeeService = (window as any).app.employee;
  // useColor Hooks form app/src/Hooks/useColors
  const [, Colors] = useColors();
  // this a Hook comes from the react router dom libory it use to navigate bettween screens
  const navigate = useNavigate();
  // A Hook from ANT design used to show messages on top of the screen
  const [messageApi, contextHolder] = message.useMessage();
  const [id, setid] = useState<string>("");
  const [keyword, setkeyword] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [phone, setphone] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [address, setaddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [qrmodal, setqrmodal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setpage] = useState<number>(1);
  const [totalpages, settotalpages] = useState<number>(0);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [refresh, setrefresh] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const downloadQRCode = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (canvas) {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = name + "-" + "qr-code.png";
      link.click();
    }
    setqrmodal(false);
  };
  const reset = () => {
    setname("");
    setphone("");
    setemail("");
    setaddress("");
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
    setqrmodal(false);
    successMessage();
  };
  const save = async () => {
    try {
      setLoading(true);
      await EmplyeeService.create(name, phone, email, address);
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
      await EmplyeeService.update(id, phone, email, address, name);
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
      await EmplyeeService.delete(id);
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
    setqrmodal(false);
    reset();
  };
  const renderProfiles = employees.map((Element, index) => {
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
              <div className="h4">{Element.name}</div>
            </div>
            <div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  showModal();
                  setphone(Element.phone);
                  setname(Element.name);
                  setaddress(Element.address);
                  setemail(Element.email);
                  setIsSave(false);
                  setid(Element.id);
                }}
              >
                <EditOutlined style={{ fontSize: 30, color: Colors.primary }} />
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setqrmodal(true);
                  setphone(Element.phone);
                  setname(Element.name);
                  setaddress(Element.address);
                  setemail(Element.email);
                  setIsSave(false);
                  setid(Element.id);
                }}
              >
                <QrcodeOutlined style={{ fontSize: 30, color: Colors.primary }} />
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/dashboard/Emplyees/" + Element.id);
                }}
              >
                <CalendarOutlined style={{ fontSize: 30, color: Colors.primary }} />
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
        const result = await EmplyeeService.get(page);
        settotalpages(result.pages);
        setEmployees(result.Employees);
        successMessage();
      } catch (error) {
        // Handle error
        ErrorMessage();
        console.log(error);
        console.log(EmplyeeService);
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
      const result = await EmplyeeService.search(keyword);
      setEmployees(result);
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
          <div
            className="p-2 px-4 d-flex mb-3 mx-auto"
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 20,
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/dashboard/ReportAll/");
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
              التقرير
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
        <Modal open={open} width={1000} title="الموظفين" onOk={handleOk} onCancel={handleCancel} footer={getFooter}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">اسم الموظف</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => {
                setphone(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">رقم الهاتف</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">الايميل</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => {
                setaddress(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">العنوان</label>
          </div>
        </Modal>
        <Modal
          open={qrmodal}
          width={1000}
          title="الموظفين"
          onOk={downloadQRCode}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={() => setqrmodal(false)}>
              إلغاء
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={downloadQRCode}>
              حفظ
            </Button>,
          ]}
        >
          <div className="justify-content-center d-flex align-items-center" ref={canvasRef}>
            <QRCodeCanvas bgColor="#fff" value={id} size={350} marginSize={4} />
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

export default Emplyees;
