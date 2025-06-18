import React from 'react'
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import { useAppContext } from '../../../context/AppContext.jsx';

const BlogTableItem = ({blog, fetchBlogs, index}) => {
    const{title, createdAt} = blog;
    const BlogData = new Date(createdAt);

    const {axios, token} = useAppContext();
    const deleteBlog = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this blog?");
            if (!confirm) return;
            try {
                const {data} = await axios.post('/api/blog/delete', {id: blog._id}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (data.success) {
                    toast.success(data.message || 'Blog deleted successfully');
                    await fetchBlogs();
                } else {
                    toast.error(data.message || 'Failed to delete blog');
                }
            }catch (error) {
                toast.error(error.message || 'An error occurred while deleting the blog');
            }
            
        } catch (error) {
            toast.error(error.message || 'An error occurred while deleting the blog');
        }
    }
    const togglePublish = async () => {
        try {
            const {data} = await axios.post('/api/blog/toggle-publish', {id: blog._id}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success) {
                toast.success(data.message || 'Blog updated successfully');
                await fetchBlogs();
            } else {
                toast.error(data.message || 'Failed to update blog');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the blog');
        }
    }
  return (
    <tr className='border-y border-gray-300'>
        <th className='px-2 py-4'>{index}</th>
        <td className='px-2 py-4'>{title}</td>
        <td className='px-2 py-4 max-sm:hidden'> {BlogData.toDateString()}</td>
        <td className='px-2 py-4 max-sm:hidden'>
            <p className={`${blog.isPublished ? "text-green-600 " : "text-orange-700"}`}>
                {blog.isPublished ? "Published" : "Unpublished"}
            </p>
        </td>
        <td className='px-2 py-4 flex text-xs gap-3'>
            <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>
                {blog.isPublished ? "Unpublish" : "Publish"}
            </button>
            <img src={assets.cross_icon} alt="" className='w-8 hover:scale-110 transition-all cursor-pointer' onClick={deleteBlog}/>
        </td>
    </tr>
  )
}

export default BlogTableItem