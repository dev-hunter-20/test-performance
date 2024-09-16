'use client';
import { Button, Col, Row, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { useQuery } from '@tanstack/react-query';

const MainBlog = (props) => {
  const router = useRouter();

  const viewBlog = () => {
    router.push(`blogs/${props.slug}`);
    router.refresh();
  };

  const fetchBlogDetail = async (slug) => {
    if (!slug) return;
    let blog = await LandingPageApiService.getBlogSlug(slug);
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
    queryKey: ['mainBlogDetail', props.slug],
    queryFn: () => fetchBlogDetail(props.slug),
    enabled: !!props.slug,
  });

  const customDiv = (html) => <div dangerouslySetInnerHTML={{ __html: html }}></div>;

  return (
    <Col lg={11} md={24} className="blog-left">
      <Row justify="center">
        {blogDetail && blogDetail.imgUrl && (
          <Image src={blogDetail.imgUrl} alt="avt-blog" className="blog-image" width={500} height={260} />
        )}
      </Row>
      <Row>
        {blogDetail && (
          <Typography.Text ellipsis={1} className="blog-title">
            {blogDetail.title}
          </Typography.Text>
        )}
      </Row>
      <Row>
        {blogDetail && (
          <Typography.Text type="secondary" className="blog-info">
            Created by: {blogDetail.author} at {new Date(blogDetail.date).toLocaleDateString('en-GB')}
          </Typography.Text>
        )}
      </Row>
      <Row>
        {blogDetail && <Typography.Text className="mt-20 blog-text">{customDiv(blogDetail.content)}</Typography.Text>}
      </Row>
      <Row>
        <Button onClick={viewBlog} className="wrapper__button" icon={<ArrowRightOutlined />}>
          Explore more
        </Button>
      </Row>
    </Col>
  );
};

export default MainBlog;
