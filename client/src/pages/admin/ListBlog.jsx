import {useState, useEffect} from 'react'
import BlogTableItem from '../../components/admin/BlogTableItem';
import toast from 'react-hot-toast';
import { useAppContext } from '../../../context/AppContext.jsx';

const ListBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const {axios, token} = useAppContext();
    const fetchBlogs = async () => {
        try{
            const {data} = await axios.get('/api/admin/blogs', 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if(data.success){
                setBlogs(data.blogs);
            }else{
                toast.error(data.message || 'Failed to fetch blogs');
                }
        }catch (error) {
            toast.error(error.message || 'An error occurred while fetching blogs');
        }
    }
    useEffect(() => {
        fetchBlogs();
    }, [])
  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 smpl-16  bg-blue-50/50'>
        <h1>All blogs</h1>
         <div className='relative h-4/5 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'> 
                <table className='w-full text-sm text-gray-500'>
                    <thead className='txt-xs text-gray-600 text-left uppercase'>
                        <tr>
                            <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
                            <th scope='col' className='px-2 py-4'>Blog Tilte</th>
                            <th scope='col' className='px-2 py-4'>Date</th>
                            <th scope='col' className='px-2 py-4'>Status</th>
                            <th scope='col' className='px-2 py-4'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog, index) => {
                            return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
                        })}
                    </tbody>
                </table>
            </div>
    </div>
  )
}

export default ListBlog