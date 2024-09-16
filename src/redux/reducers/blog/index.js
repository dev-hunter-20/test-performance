import { createReducer } from 'deox';

import { getBlogsAction, getSlugAction } from '../../../redux/actions';
import { getSlug, getBlogs } from './blog';

const initialState = {
  slug: '',
  listBlog: [],
};
const BlogReducer = createReducer(initialState, (handleAction) => [
  handleAction(getBlogsAction.success, getBlogs),
  handleAction(getSlugAction.success, getSlug),
]);

export default BlogReducer;
