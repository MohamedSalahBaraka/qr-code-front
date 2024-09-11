import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal, message } from "antd";
import useColors from "../Hooks/useColors";
const key = "Loading";
const Report: React.FC = () => {
  const [, Colors] = useColors();
  const EmplyeeService = (window as any).app.employee;
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState<
    {
      attendance_date: string;
      check_in_time: string;
      check_out_time: string;
      employee_id: string;
      minutes_worked: number;
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
        const result = await EmplyeeService.attendreport(id || "", array[0], array[1]);
        // setcontent(result);
        setdata(result);
        successMessage();
      } catch (error) {
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
            <td className="h4">التاريخ</td>
            <td className="h4">موعد الدخول</td>
            <td className="h4">موعد الانصراف</td>
            <td className="h4">صافي وقت العمل</td>
          </thead>
          <tbody>
            {data.map((d, index) => (
              <tr key={index}>
                <td className="h5">{d.attendance_date}</td>
                <td className="h5">{d.check_in_time.split(" ")[1]}</td>
                <td className="h5">{d.check_out_time.split(" ")[1]}</td>
                <td className="h5">
                  {(d.minutes_worked / 60).toFixed()} : {Math.floor(d.minutes_worked % 60)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Report;
