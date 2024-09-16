export const getBlogs = (state, action) => ({
  ...state,
  listBlog: action.payload.response,
});
export const getSlug = (state, action) => {
  return {
  ...state,
  slug: action.payload.response,
}};
