import { Button, message, Modal } from "antd";
import jsQR from "jsqr";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const key = "Loading";
function Home() {
  const [open, setOpen] = useState(false);
  const [qrmodal, setqrmodal] = useState(false);
  const navigate = useNavigate();
  const [username, setusername] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const UserService = (window as any).app?.user;
  const EmplyeeService = (window as any).app.employee;
  const [messageApi, contextHolder] = message.useMessage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const interval = useRef<NodeJS.Timer>();
  const [qrCodeData, setQRCodeData] = useState<string | null>(null);
  const successMessage = () => {
    messageApi.open({
      key,
      type: "success",
      content: "تم!",
      duration: 2,
    });
  };
  useEffect(() => {
    console.log("home");
  }, []);
  const login = async () => {
    try {
      setLoading(true);
      await UserService.login(username, password);
      successMessage();
      navigate("/dashboard/Users", { replace: true });
    } catch (error) {
      // Handle error
      const err = error as { message: string; status: number };
      const array = err.message.split("Error:");
      messageApi.open({
        key,
        type: "error",
        content: array[array.length - 1],
        duration: 2,
      });
      setLoading(false);
    }
  };
  const setupCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };
  const stop = () => {
    clearInterval(interval.current);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };
  const scanQRCode = async (type: boolean) => {
    try {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
          if (qrCode) {
            setQRCodeData(qrCode.data); // This will be the decoded QR data
            console.log(type);

            await EmplyeeService.attend(qrCode.data, type);
            successMessage();
            setqrmodal(false);
            stop();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const start = (type: boolean) => {
    setupCamera();
    interval.current = setInterval(() => {
      scanQRCode(type);
    }, 500); // Scan every 500ms
  };
  return (
    <div className="container">
      {contextHolder}
      <div className="container d-flex flex-row justify-content-center align-items-center vh-100">
        <div className="col-6 d-flex justify-content-center align-items-center">
          <Button key="submit" type="primary" onClick={() => setOpen(true)}>
            تسجيل دخول
          </Button>
        </div>
        <div className="col-6  d-flex justify-content-around align-items-center">
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              setqrmodal(true);
              start(true);
            }}
          >
            حضور
          </Button>
          <Button
            key="dd"
            type="primary"
            onClick={() => {
              setqrmodal(true);
              start(false);
            }}
          >
            انصراف
          </Button>
        </div>
        <Modal
          open={qrmodal}
          width={1000}
          title="الحضور والانصراف"
          onOk={login}
          onCancel={() => {
            setqrmodal(false);
            stop();
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setqrmodal(false);
                stop();
              }}
            >
              تم
            </Button>,
          ]}
        >
          <video ref={videoRef} style={{ width: "100%" }} />
          {qrCodeData && <p>قد تم الحفظ</p>}
        </Modal>
        <Modal
          open={open}
          width={1000}
          title="تسجيل دخول"
          onOk={login}
          onCancel={() => setOpen(false)}
          footer={[
            <Button key="back" onClick={() => setOpen(false)}>
              إلغاء
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={login}>
              حفظ
            </Button>,
          ]}
        >
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
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">كلمة السر</label>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Home;
