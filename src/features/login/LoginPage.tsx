import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { loginThunk } from '@/stores/auth/auth.action';
import type { LoginRequest } from './interface/auth.interface';
import { appImages } from '@/constants/app-infor';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const onFinish = async (values: LoginRequest) => {
    try {
      await dispatch(loginThunk(values)).unwrap();
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: any) {
      message.error(error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-surface p-4 font-sans select-none">
      <div className="w-full max-w-sm sm:max-w-md bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center w-20 h-20 rounded-xl">
            <img src={appImages.logo} alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Ánh dương Bakery</h1>
          <p className="text-xs text-on-surface-variant font-medium">
            Đăng nhập hệ thống quản lý cửa hàng
          </p>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<FiMail className="text-on-surface-variant mr-1" />}
              placeholder="Email / Tên đăng nhập"
              size="large"
              className="rounded-md text-sm"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<FiLock className="text-on-surface-variant mr-1" />}
              placeholder="Mật khẩu"
              size="large"
              className="rounded-md text-sm"
            />
          </Form.Item>

          <div className="flex items-center justify-between text-xs pt-1">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-xs text-on-surface-variant">Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline hover:text-primary-hover transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item className="pt-2">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
              className="h-11! font-semibold rounded-md shadow-none cursor-pointer"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
