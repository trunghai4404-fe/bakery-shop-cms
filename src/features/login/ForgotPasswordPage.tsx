import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      message.success(`Đã gửi liên kết khôi phục mật khẩu tới ${values.email}`);
      navigate('/login');
    } catch {
      message.error('Gửi liên kết thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-surface p-4 font-sans select-none">
      <div className="w-full max-w-sm sm:max-w-md bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-on-primary font-bold text-2xl shadow-xs">
            🥖
          </div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Quên mật khẩu?</h1>
          <p className="text-xs text-on-surface-variant font-medium">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        <Form
          name="forgotPassword"
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
              placeholder="Email của bạn"
              size="large"
              className="rounded-md text-sm"
            />
          </Form.Item>

          <Form.Item className="pt-2">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="h-11! font-semibold rounded-md shadow-none cursor-pointer"
            >
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
