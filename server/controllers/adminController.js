import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
export const adminLogin = async (req, res)=> {
    try {
        const { email, password } = req.body;
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Login successful' });
    }catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.status(200).json({blogs , success: true});
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({ createdAt: -1 });
        
        res.status(200).json({comments, success: true});
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({ }).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
        const comment = await Comment.countDocuments();
        const draft = await Blog.countDocuments({ isPublished: false });

        const dashboardData = {
           blogs,
           comment,
           draft,
           recentBlogs   
        };

        res.status(200).json({dashboardData, success: true});

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Comment deleted successfully', success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        comment.isApproved = true; // Approve the comment
        await comment.save(); // Save the updated comment
        res.status(200).json({ message: 'Comment approved successfully', isApproved: comment.isApproved, success: true });
    } catch (error) {
        console.error('Error approving comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}