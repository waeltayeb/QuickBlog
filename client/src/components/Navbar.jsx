
import { useAppContext } from '../../context/AppContext';
import {assets} from '../assets/assets'



const Navbar = () => {
  
    const {navigate, token} = useAppContext();
  return (
    <div className=' flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
        <img src={assets.logo} onClick={()=>navigate('/')} alt="Logo" className='w-32 sm:w-44 cursor-pointer'  />
        <button onClick={()=>navigate('/admin')} className=' text-white
         flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-xhite px-10 py-2.5'>
            {(token === null) ? 'Login' : 'Dashboard'}
        <img src={assets.arrow} alt="Login Icon" className='w-3' />
        </button>
    </div>
  )
}

export default Navbar