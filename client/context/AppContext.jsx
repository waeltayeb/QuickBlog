import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
   const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [input, setInput] = useState("");
    

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('api/blog/all');
            data.blogs ? setBlogs(data.blogs) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
      
        fetchBlogs();
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
            axios.defaults.headers.common["Authorization"] = `${savedToken}`;
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `${token}`;
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    return (
        <AppContext.Provider value={{ axios, token, setToken, blogs, setBlogs, input, setInput, navigate }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
