'use client';

import { LayoutPaths, Paths } from '@/router';
import Button from '@/components/ui/button/Button';
import GoogleButton from '@/components/ui/google-button/GoogleButton';
import Input from '@/components/ui/input/Input';
import AuthForm from '@/layouts/auth-form/AuthForm';
import { Form } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import './RegisterPage.scss';
import { useRouter } from 'next/navigation';
import { ERegisterAppAction } from '@/redux/actions';
import { useSelector } from 'react-redux';
import { ETypeNotification } from '@/common/enums';
import { showNotification, validationRules } from '@/utils/functions';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/common/constants';
import AuthApiService from '@/api-services/api/auth/AuthApiService';

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [, setFormValues] = useState({});
  const { password } = form.getFieldsValue();
  const [isCheck, setIsCheck] = useState(false);

  const registerLoading = useSelector((state) => state.loadingReducer[ERegisterAppAction.REGISTER_APP]);

  useEffect(() => {
    setIsCheck(true);
  }, []);

  const handleSubmit = async (values) => {
    const body = {
      fullname: values?.fullname,
      password: values?.password,
      username: values?.username,
      email: values?.email,
    };
    const result = await AuthApiService.registryTrialSubscriptions(body);
    if (result.code == 0) {
      handleRegisterAppSuccess(result.data);
    } else {
      showNotification(ETypeNotification.ERROR, result.message);
    }
  };

  const handleRegisterAppSuccess = async (response) => {
    if (response.token) {
      router.push(`${LayoutPaths.Auth}${Paths.LoginApp}`);
      showNotification(ETypeNotification.SUCCESS, 'Register Successfully');
    }
  };

  return (
    isCheck && (
      <div className="Register">
        <AuthForm>
          <div className="Register-logo">
            <Image src="/image/logo-primary.svg" alt="" onClick={() => router.push('/')} width={100} height={100} />
          </div>
          <div className="Register-description">
            Start your free trial, no credit card required Already signed up?{` `}
            <span>
              <Link prefetch={false} href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>Sign In</Link>
            </span>
          </div>
          <Form
            layout="vertical"
            form={form}
            className="Register-form"
            onFinish={handleSubmit}
            onValuesChange={(_, values) => setFormValues(values)}
          >
            <Form.Item
              name="username"
              rules={[validationRules.required(), validationRules.minLength(4), validationRules.maxLength(60)]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
            </Form.Item>
            <Form.Item
              name="fullname"
              rules={[validationRules.required(), validationRules.minLength(4), validationRules.maxLength(60)]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
            </Form.Item>
            <Form.Item name="email" rules={[validationRules.required(), validationRules.email()]}>
              <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[validationRules.required(), validationRules.minLength(5), validationRules.maxLength(60)]}
            >
              <Input
                type="password"
                prefix={<LockOutlined />}
                placeholder="Password (5 characters at least)"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[
                validationRules.required(),
                validationRules.minLength(5),
                validationRules.maxLength(60),
                validationRules.confirmPassword(password),
              ]}
            >
              <Input type="password" prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
            </Form.Item>

            <div className="Register-submit">
              <Button title="Sign up" size="large" htmlType="submit" loading={registerLoading} />
            </div>
          </Form>

          <div className="Register-third-party flex items-center justify-center text-center">
            <span>or log in with Google</span>
          </div>
          <div className="Register-socials">
            <GoogleButton />
          </div>

          <div className="Register-term">
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
