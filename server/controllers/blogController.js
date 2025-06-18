import fs from 'fs';
import imagekit from '../configs/imagesKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';
export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file ;

        if (!title || !subTitle || !description || !imageFile || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer, // required
            fileName: imageFile.originalname, // required
            folder: '/blog_images', // optional
        })

        const optimizedImageUrl =imagekit.url({
            path: response.filePath, // required
            transformation: [
                {quality: 'auto'}, // desired width
                {format: 'webp'}, // desired height
                {width: '1280'} // cropping method
            ]
        });

        const image = optimizedImageUrl;
        await Blog.create({
            title,
            subTitle,
            description,
            image,
            category,
            isPublished
        });

        res.status(201).json({ message: 'Blog added successfully', success: true });

    }catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getBlogById = async (req, res) => {
    try {
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ success: true, blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const {id} = req.body;
         await Blog.findByIdAndDelete(id);

         // delete all comments associated with the blog
        await Comment.deleteMany({ blog: id });


         res.status(200).json({ message: 'Blog deleted successfully', success: true });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
}


export const toggleBlogPublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished; // Toggle the publish status
        await blog.save(); // Save the updated blog
        res.status(200).json({ message: 'Blog publish status toggled successfully', isPublished: blog.isPublished, success: true });
    } catch (error) {
        console.error('Error toggling blog publish status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const addComment = async (req, res) => {
    try {
        const { blog, name, content} = req.body;
        await Comment.create({
            blog,
            name,
            content
        });
        res.status(201).json({ message: 'Comment added successfully', success: true });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCommentsBlog = async (req, res) => {
    try {
        const { blogId  } = req.params;
        const comments = await Comment.find({ blog: blogId , isApproved: true }).sort({ createdAt: -1 });
        res.status(200).json({comments, success: true });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }
        const content = await main(prompt, 'Generate a blog content for this topic in simple text format ');
        res.status(200).json({ content, success: true });

    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}
