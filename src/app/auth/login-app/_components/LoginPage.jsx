/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useState } from 'react';
import './LoginPage.scss';
import AuthForm from '@/layouts/auth-form/AuthForm';
import Link from 'next/link';
import { Form } from 'antd';
import Input from '@/components/ui/input/Input';
import Checkbox from '@/components/ui/checkbox/Checkbox';
import Button from '@/components/ui/button/Button';
import GoogleButton from '@/components/ui/google-button/GoogleButton';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Image from 'next/image';
import './LoginPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ELoginAppAction, loginAppAction } from '@/redux/actions';
import Auth from '@/utils/store/Authentication';
import { ETypeNotification } from '@/common/enums';
import { showNotification, validationRules } from '@/utils/functions';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/common/constants';
import { LayoutPaths, Paths } from '@/router';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const loginAppLoading = useSelector((state) => state.loadingReducer[ELoginAppAction.LOGIN_APP]);

  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    setIsCheck(true);
  }, []);

  const handleSubmit = (values) => {
    const body = { ...values };
    dispatch(loginAppAction.request({ body }, handleLoginAppSuccess));
  };

  const handleLoginAppSuccess = (response) => {
    if (response.token) {
      Auth.setAccessToken(response.token);
      Auth.setCurrentUser(response.fullname);
      Auth.setCurrentUserName(response.username);
      Auth.setRefreshToken(response.refresh_token);
      router.push('/');
    } else {
      showNotification(ETypeNotification.ERROR, response.message);
    }
  };

  return (
    isCheck && (
      <div className="LoginApp">
        <AuthForm>
          <div className="LoginApp-logo">
            <Image src="/image/logo-primary.svg" alt="" onClick={() => router.push('/')} width={100} height={100} />
          </div>
          <div className="LoginApp-description">
            Start your 14 day free trial <br /> Don't have an account, yet?
            <span>
              <Link prefetch={false} href={`${LayoutPaths.Auth}${Paths.Register}`}>
                {' '}
                Sign Up
              </Link>
            </span>
          </div>
          <Form layout="vertical" form={form} className="LoginApp-form" onFinish={handleSubmit}>
            <Form.Item
              name="username"
              rules={[validationRules.required(), validationRules.minLength(4), validationRules.maxLength(60)]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[validationRules.required(), validationRules.minLength(5), validationRules.maxLength(60)]}
            >
              <Input type="password" prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>
            <div className="LoginApp-remember flex justify-between items-center">
              <Form.Item>
                <Checkbox label="Remember me" />
              </Form.Item>
              <Link prefetch={false} href={`${LayoutPaths.Auth}${Paths.ResetPassword}`}>
                Forgot your password?
              </Link>
            </div>
            <div className="LoginApp-submit">
              <Button
                className="signIn-button"
                title="Sign In"
                size="large"
                htmlType="submit"
                loading={loginAppLoading}
              />
            </div>
          </Form>
          <div className="LoginApp-third-party flex items-center justify-center text-center">
            <span>or log in with Google</span>
          </div>
          <div className="LoginApp-socials">
            <GoogleButton />
          </div>

          <div className="LoginApp-term">
            Registering to this website, you accept our{' '}
            <Link prefetch={false} href={TERMS_OF_USE_URL} target="_blank" rel="noreferrer">
              terms of use
            </Link>{' '}
            and{' '}
            <Link prefetch={false} href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer">
              privacy statements
            </Link>
            .
          </div>
        </AuthForm>
      </div>
    )
  );
}
