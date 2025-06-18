import {useEffect, useState} from 'react'
import CommentTableItem from '../../components/admin/CommentTableItem'
import { useAppContext } from '../../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Comments = () => {
    const [comments, setComments] = useState([])
    const [filter, setFilter] = useState('Not Approved')

    const {axios, token} = useAppContext();


    const fetchComments = async () => {
        try {
            const {data} = await axios.get('/api/admin/comments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(data.success){
                setComments(data.comments);
            }else{
                toast.error(data.message || 'Failed to fetch comments');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while fetching comments');
        }
    }
    useEffect(() => {
        fetchComments();
    },[])
  return (
    <div className='flex-1 pt-5 px-5 sm:pl-16 md:p-10 bg-blue-50/50'>
        <div className='flex items-center justify-between max-w-3xl'> 
            <h1>Comments</h1>
            <div className='flex gap-4'>
                <button onClick={() => setFilter('Not Approved')} className={`px-4 py-2 rounded-lg text-sm ${filter === 'Not Approved' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>Not Approved</button>
                <button onClick={() => setFilter('Approved')} className={`px-4 py-2 rounded-lg text-sm ${filter === 'Approved' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>Approved</button>
            </div>

        </div>
        <div className='relative h-4/5 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white mt-6'>
            <table className='w-full text-sm text-gray-500'>
                <thead className='txt-xs text-gray-600 text-left uppercase'>
                    <tr>
                        <th scope='col' className='px-6 py-3 '>Blog Title & Comment</th>
                        <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
                        <th scope='col' className='px-2 py-4'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.filter((comment) => {
                    if(filter === 'Approved') return comment.isApproved;
                    return !comment.isApproved;}).map((comment, index) => <CommentTableItem key={comment._id} comment={comment} fetchComments={fetchComments} index={index + 1} />)} 

                </tbody>

            </table>
        </div>
    </div>
  )
}

export default Comments