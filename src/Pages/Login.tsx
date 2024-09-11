import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import userService from "../../services/UserService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [message, setmessage] = useState<string>();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const UserService = (window as any).app.user;
      const result = await UserService.login(data.username, data.password);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user_id", `${result.user_id}`);
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <main className="d-flex flex-fill">
        <div className="container d-flex flex-fill justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="row w-100 justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">تسجيل الدخول</div>

                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {message && <p className="text-danger">{message}</p>}
                    <div className="row mb-3">
                      <label htmlFor="username" className="col-md-4 col-form-label text-md-end">
                        رقم
                      </label>

                      <div className="col-md-6">
                        <input id="username" className="form-control" {...register("username", { required: true })} />

                        {errors.username && <p className="text-danger"> username is required</p>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label htmlFor="password" className="col-md-4 col-form-label text-md-end">
                        كلمة السر
                      </label>

                      <div className="col-md-6">
                        <input id="password" type="password" className="form-control " {...register("password", { required: true })} />

                        {errors.password && <p className="text-danger"> password is required</p>}
                      </div>
                    </div>

                    <div className="row mb-0">
                      <div className="col-md-8 offset-md-4">
                        <button type="submit" className="btn btn-primary">
                          سجل دخولك
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
