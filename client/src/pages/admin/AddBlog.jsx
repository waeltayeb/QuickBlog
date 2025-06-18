import {useEffect, useRef, useState} from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import {useAppContext} from '../../../context/AppContext.jsx'
import toast from 'react-hot-toast'
import {parse} from 'marked'

const AddBlog = () => {

    const {axios, token} = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [loading , setLoading] = useState(false);

    const quillRef = useRef(null);
    const editorRef = useRef(null);


    const [image, setImage] = useState(false);
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [category, setCategory] = useState('');  


    const generateContent = async () => {
        if(!title) return toast.error('Please enter a title first');
        try {
            setLoading(true);
            const {data} = await axios.post('/api/blog/generate', {
                prompt: title
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(data.success){
                quillRef.current.root.innerHTML = parse(data.content);
                setLoading(false);
                toast.success('Content generated successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong while generating content');
        }

    }


    const onSubmitHandler = async(e) => {
        try {
            e.preventDefault();
            setIsAdding(true);
            const blog = {
                title,
                subTitle,
                description: quillRef.current.root.innerHTML,
                category,
                isPublished
            };
            const formData = new FormData();
            formData.append('blog', JSON.stringify(blog));
            formData.append('image', image);

            
            const {data} = await axios.post('/api/blog/add', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(data.success){
                toast.success('Blog added successfully');
                setIsAdding(false);
                setImage(false);
                setTitle('');
                setSubTitle('');
                setCategory('');
                quillRef.current.root.innerHTML = '';
                
            }else{
                toast.error(data.message || 'Failed to add blog');
                setIsAdding(false);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong' );
        }finally {
            setIsAdding(false);
        }
        
    }
    useEffect(() => {
        if(!quillRef.current && editorRef.current){
            quillRef.current = new Quill(editorRef.current, {theme:'snow'
                , modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        ['link', 'image'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['clean']
                    ]
                }
            });}
    }, []);
  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
        <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

            <p>Upload thumbnail</p>
            <label htmlFor="image">
                <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer' />
                <input onChange={(e)=> setImage(e.target.files[0])}  type="file" name="" id="image" hidden required />
            </label>

            <p className='mt-4'>Blog Tilte</p>
            <input type="text" placeholder="Type here" required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
            onChange={e=>setTitle(e.target.value)} value={title}/>

            <p className='mt-4'>Sub Tilte</p>
            <input type="text" placeholder="Type here" required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
            onChange={e=>setSubTitle(e.target.value)} value={subTitle}/>

            <p className='mt-4'>Blog Description</p>
            <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
                <div ref={editorRef}></div>
                { loading && (
                    <div className='absolute inset-0 bg-black/10 mt-2 flex items-center justify-center'>
                        <div className='w-8 h8 rounded-full border-2 border-t-white animate-spin'></div>
                    </div>)}
                <button disabled={loading} type='button' onClick={generateContent} className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'> Generate with AI</button>
            </div>
            <p className='mt-4'>Blog categpry</p>
            <select onChange={e => setCategory(e.target.value)} value={category} name="category"  className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'>
                <option value="">Select category</option>
                {blogCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </select>
            <div className='flex gap-2 mt-4'>
                <p className=''>Publish Now</p>
                <input type="checkbox" checked={isPublished} className='scale-125 cursor-pointer' onChange={e => setIsPublished(e.target.checked)} />
            </div>

            <button disabled={isAdding} type='submit' className='mt-8 w-40 h-10 bg-primary text-white rounded  cursor-pointer text-sm'>
                {isAdding ? 'Adding...' : 'Add Blog'}
            </button>

        </div>
    </form>
  )
}

export default AddBlog