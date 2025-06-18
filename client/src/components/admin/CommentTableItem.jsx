import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const CommentTableItem = ({comment, fetchComments}) => {
    const{blog, createdAt, _id} = comment;
    const BlogData = new Date(createdAt);

    const {axios, token} = useAppContext();

    const approveComment = async () => {
        try {
            const {data} = await axios.post('/api/admin/approve-comment', {id: _id}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success) {
                toast.success(data.message || 'Comment approved successfully');
                await fetchComments();
            } else {
                toast.error(data.message || 'Failed to approve comment');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while approving the comment');
        }
    }

    const deleteComment = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this comment?");
            if (!confirm) return;


            const {data} = await axios.post('/api/admin/delete-commentt', {id: _id}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success) {
                toast.success(data.message || 'Comment deleted successfully');
                fetchComments();
            } else {
                toast.error(data.message || 'Failed to delete comment');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while deleting the comment');
        }
    }

  return (
    <tr className='border-y border-gray-300'>
        <td className='px-2 py-4'>
        <b className='font-medium text-gray-600'> Blog</b> :{blog.title} <br /> <br />
        <b className='font-medium text-gray-600'>Name</b> : {comment.name} <br />
        <b className='font-medium text-gray-600'>Comment</b> : {comment.content} 
        </td>
        <td className='px-6 py-4 max-sm:hidden'>
            {BlogData.toLocaleDateString()}
        </td>
        <td className='px-6 py-4'>
            <div className='inline-flex items-center gap-4 '>
                {!comment.isApproved ?
                <img onClick={approveComment} src={assets.tick_icon} alt="" className='w-5 cursor-pointer hover:scale-110 transition-all'/> : <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1 '>Approved</p> }
                <img onClick={deleteComment} src={assets.bin_icon} alt=""  className='w-5 hover:scale-110 transition-all cursor-pointer'/>
            </div>
        </td>

    </tr>
  )
}

export default CommentTableItem