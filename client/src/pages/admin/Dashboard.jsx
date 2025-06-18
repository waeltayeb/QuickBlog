import {useEffect, useState} from 'react'
import { assets } from '../../assets/assets'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../../context/AppContext.jsx'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        blogs: 0,
        comment: 0,
        draft : 0,
        recentBlogs: [],
    })

    const {axios, token} = useAppContext();




    const fetchDashboard = async () => {
        try {
            const {data} = await axios.get('/api/admin/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(data.success){
                setDashboardData(data.dashboardData);
            }else{
                toast.error(data.message || 'Failed to fetch dashboard data');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while fetching dashboard data');
        }
    }
    useEffect(() => {
        fetchDashboard()
    }, [])
  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
        <div className='flex flex-wrap gap-4'>
            <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transtion-all'>
                <img src={assets.dashboard_icon_1} alt="" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>{dashboardData.blogs}</p>
                    <p className='text-gray-400 font-light'>Blogs</p>
                </div>

            </div>
             <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transtion-all'>
                <img src={assets.dashboard_icon_2} alt="" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>{dashboardData.comment}</p>
                    <p className='text-gray-400 font-light'>Comments</p>
                </div>

            </div>
             <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transtion-all'>
                <img src={assets.dashboard_icon_3} alt="" />
                <div>
                    <p className='text-xl font-semibold text-gray-600'>{dashboardData.draft}</p>
                    <p className='text-gray-400 font-light'>Drafts</p>
                </div>

            </div>
        </div>
        <div>
            <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
                <img src={assets.dashboard_icon_4} alt="" />
                <p>Latest Blogs</p>
            </div>
            <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'> 
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
                        {Array.isArray(dashboardData.recentBlogs) &&
    dashboardData.recentBlogs.map((blog, index) => (
      <BlogTableItem
        key={blog._id}
        blog={blog}
        fetchBlogs={fetchDashboard}
        index={index + 1}
      />
    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Dashboard