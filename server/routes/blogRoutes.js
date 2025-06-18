import express from 'express';
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getCommentsBlog, toggleBlogPublish } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';
const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image') , auth,addBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId/comments', getCommentsBlog);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete', auth, deleteBlogById);
blogRouter.post('/toggle-publish', auth, toggleBlogPublish);
blogRouter.post('/add-comment', addComment);

blogRouter.post('/generate', auth, generateContent);


export default blogRouter;