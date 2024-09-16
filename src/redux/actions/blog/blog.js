import { createActionCreator } from 'deox';

// CONSTANTS

export const EGetBlogAction = {
  GET_LIST_BLOG: 'GET_LIST_BLOG',
  GET_SLUG: 'GET_SLUG',
  GET_BLOG_SUCCESS: 'GET_BLOG_SUCCESS',
  GET_SLUG_SUCCESS: 'GET_SLUG_SUCCESS',

};


// FUNCTION

export const getBlogsAction = {
  request: createActionCreator(
    EGetBlogAction.GET_LIST_BLOG,
    (resolve) => (materials, successCallback, failedCallback) =>
      resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(EGetBlogAction.GET_BLOG_SUCCESS, (resolve) => (response) => resolve({ response })),

};
export const getSlugAction = {
  request: createActionCreator(
    EGetBlogAction.GET_SLUG,
    (resolve) => (materials, successCallback, failedCallback) =>
      resolve({ materials, successCallback, failedCallback }),
  ),
  success: createActionCreator(EGetBlogAction.GET_SLUG_SUCCESS, (resolve) => (response) => resolve({ response })),
};
