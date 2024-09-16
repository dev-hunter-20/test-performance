'use client';
import { Button, Col, Row, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { useQuery } from '@tanstack/react-query';

const SecondaryBlog = (props) => {
  const router = useRouter();

  const viewBlog = () => {
    router.push(`blogs/${props.slug}`);
    router.refresh();
  };

  const fetchBlogDetail = async () => {
    if (!props.slug) return;
    let blog = await LandingPageApiService.getBlogSlug(props.slug);
    const { featured_media, author } = blog[0];
    let authorFromAPI = await LandingPageApiService.getAuthor(author);
    let imageUrl = await LandingPageApiService.getImageUrl(featured_media);

    if (blog && authorFromAPI && imageUrl) {
      return {
        title: blog[0].title.rendered,
        date: blog[0].date,
        content: blog[0].content.rendered,
        author: authorFromAPI?.name,
        imgUrl: imageUrl?.source_url,
      };
    }
  };

  const { data: blogDetail } = useQuery({
    queryKey: ['secondaryBlogDetail', props.slug],
    queryFn: () => fetchBlogDetail(props.slug),
    enabled: !!props.slug,
  });

  const customDiv = (html) => <div dangerouslySetInnerHTML={{ __html: html }}></div>;

  return (
    <Row className="blog-right" gutter={20}>
      <Col span={10}>
        {blogDetail && blogDetail.imgUrl && (
          <Image
            src={blogDetail.imgUrl}
            alt="avt-blog"
            width={320}
            height={200}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        )}
      </Col>
      <Col span={14}>
        <Row>{blogDetail && <Typography.Text className="blog-title">{blogDetail.title}</Typography.Text>}</Row>
        <Row>
          {blogDetail && (
            <Typography.Text type="secondary" className="blog-info">
              Created by: {blogDetail.author} at {new Date(blogDetail.date).toLocaleDateString('en-GB')}
            </Typography.Text>
          )}
        </Row>
        <Row>
          {blogDetail && <Typography.Text className="blog-text">{customDiv(blogDetail.content)}</Typography.Text>}
        </Row>
        <Row>
          <Button onClick={viewBlog} icon={<ArrowRightOutlined />} className="wrapper__button">
            Explore more
          </Button>
        </Row>
      </Col>
    </Row>
  );
};

export default SecondaryBlog;
