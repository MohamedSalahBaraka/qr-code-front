import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal, message } from "antd";
import useColors from "../Hooks/useColors";
const key = "Loading";
const ReportAll: React.FC = () => {
  const [, Colors] = useColors();
  const EmplyeeService = (window as any).app.employee;
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState<
    {
      days_absent: number;
      days_present: number;
      employee_name: string;
    }[]
  >([]);
  const [month, setmonth] = useState<string>("2024-09");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/Login", { replace: true });
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
    setLoading(false);
    successMessage();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        messageApi.open({
          key,
          type: "loading",
          content: "جار التحميل...",
          duration: 0,
        });
        const array = month.split("-");
        const result = await EmplyeeService.attendreportAllEmployee(array[0], array[1]);
        // setcontent(result);
        console.log(result);

        setdata(result);
        successMessage();
      } catch (error) {
        console.log(error);

        // Handle error
        ErrorMessage();
      }
    };
    fetchData();
  }, [month]);
  return (
    <>
      <div className="container p-3 pt-4">
        {contextHolder}
        <div className="form-floating mb-3">
          <input
            type="month"
            className="form-control"
            value={month}
            onChange={(e) => {
              setmonth(e.target.value);
            }}
          />
          <label htmlFor="floatingInput">التاريخ</label>
        </div>
        <table className="table">
          <thead>
            <td className="h4">ايام الحضور</td>
            <td className="h4">ايام الغياب</td>
            <td className="h4">اسم الوظف</td>
          </thead>
          <tbody>
            {data.map((d, index) => (
              <tr key={index}>
                <td className="h5">{d.days_present}</td>
                <td className="h5">{d.days_absent}</td>
                <td className="h5">{d.employee_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReportAll;
