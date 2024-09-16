/* eslint-disable react/no-unescaped-entities */
'use client';

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import AuthForm from '@/layouts/auth-form/AuthForm';
import { Form } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import './ChangePasswordPage.scss';
import { getQueryParam, showNotification, validationRules } from '@/utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { EChangePasswordAction, changePasswordAction } from '@/redux/actions';
import { useRouter } from 'next/navigation';
import { ETypeNotification } from '@/common/enums';
import { LockOutlined } from '@ant-design/icons';
import { LayoutPaths, Paths } from '@/router';

export default function ChangePasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const token = getQueryParam('token');
  const changePasswordLoading = useSelector((state) => state.loadingReducer[EChangePasswordAction.CHANGE_PASSWORD]);
  const [, setFormValues] = useState({});
  const { password } = form.getFieldsValue();
  const [isCheck, setIsCheck] = useState(false);

  const handleSubmit = (values) => {
    const body = {
      new_password: values.password,
    };
    dispatch(changePasswordAction.request({ token, body }, handleChangePasswordSuccess));
  };

  const handleChangePasswordSuccess = () => {
    showNotification(ETypeNotification.SUCCESS, 'Change password Successfully');
    router.push(`${LayoutPaths.Auth}${Paths.LoginApp}`);
  };

  useEffect(() => {
    if (!token) router.push(`${LayoutPaths.Auth}${Paths.ResetPassword}`);
    setIsCheck(true);
  }, []);

  return (
    isCheck && (
      <div className="ChangePassword">
        <AuthForm>
          <div className="ChangePassword-title">Create new password</div>
          <div className="ChangePassword-description">Your new password must be at least 8 characters.</div>
          <Form
            layout="vertical"
            form={form}
            className="ChangePassword-form"
            onValuesChange={(_, values) => setFormValues(values)}
            onFinish={handleSubmit}
          >
            <Form.Item name="password" rules={[validationRules.required()]}>
              <Input
                type="password"
                prefix={<LockOutlined />}
                placeholder="Password (8 characters at least)"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[validationRules.required(), validationRules.confirmPassword(password)]}
            >
              <Input type="password" prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
            </Form.Item>
            <div className="ChangePassword-submit">
              <Button title="Reset Password" size="large" htmlType="submit" loading={changePasswordLoading} />
            </div>
          </Form>
          <div className="ChangePassword-description">
            <i>
              You remember your password?{' '}
              <span>
                <Link prefetch={false} href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>Sign in</Link>
              </span>
            </i>
          </div>
        </AuthForm>
      </div>
    )
  );
}
