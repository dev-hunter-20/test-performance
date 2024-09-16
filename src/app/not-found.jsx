'use client';

import { Button, Result } from 'antd';
import './not-found.scss';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleClick}>
          Back Home
        </Button>
      }
      className="not-found-container"
    />
  );
}
