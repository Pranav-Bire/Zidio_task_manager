import { Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Task from './pages/Task';
import TaskDetails from './pages/TaskDetails';
import Trash from './pages/Trash';
import Users from './pages/Users';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { setOpenSidebar } from './redux/slices/authSlice';
import { Fragment, useRef } from 'react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';
import Landing from './pages/Landing';



function Layout() {
  const {user} = useSelector((state) => state.auth);
  const location = useLocation()

  return user ?(
    <div className='w-full h-screen flex md:flex-row'>
      <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar/>
      </div>

      <MobileSidebar/>
      
      <main className='flex-1 overflow-auto'>
        <Navbar/>
        <div className='p-4 lg:p-6 2xl:p-8'>
          <Outlet/>
        </div>
      </main>
    </div>
  ):(
    <Navigate to ="/log-in" state={{from:location}} replace/>
  )
}


  const MobileSidebar = () => {
    const { isSidebarOpen } = useSelector((state) => state.auth);
    const mobileMenuRef = useRef(null);
    const dispatch = useDispatch();
  
    const closeSidebar = () => {
      dispatch(setOpenSidebar(false));
    };
  
    return (
      <>
        <Transition
          show={isSidebarOpen}
          as={Fragment}
          enter='Transition-opacity duration-700'
          enterFrom='opacity-x-10'
          enterTo='opacity-x-100'
          leave='transition-opacity duration-700'
          leaveFrom='opacity-x-100'
          leaveTo='opacity-x-0'
        >
          {(ref) => (
            <div
              ref={(node) => (mobileMenuRef.current = node)}
              className={clsx(
                "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
                isSidebarOpen ? "translate-x-0" : "translate-x-full"
              )}
              onClick={() => closeSidebar()}
            >
              <div className='bg-white w-3/4 h-full'>
                <div className='w-full flex justify-end px-5 pt-3'>
                  <button
                    onClick={() => closeSidebar()}
                    className='flex justify-end items-end'
                  >
                    <IoClose size={25} />
                  </button>
                </div>
  
                <div className='-mt-10'>
                  <Sidebar />
                </div>
              </div>
            </div>
          )}
        </Transition>
      </>
    );
  };


function App() {
  return(
    <main className='w-full min-h-screen bg-[#f3f4f6]'>
        
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route element= {<Layout/>}>
              {/* protected routes */}
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/tasks' element={<Task/>}/>
                <Route path='/completed/:status' element={<Task/>}/>
                <Route path='/in-progress/:status' element={<Task/>}/>
                <Route path='/todo/:status' element={<Task/>}/>
                <Route path='/team' element={<Users/>}/>
                <Route path='/trashed' element={<Trash/>}/>
                <Route path='/task/:id' element={<TaskDetails/>}/>
                
            </Route>

            {/* public routes */}
            <Route path='/log-in' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>

        </Routes>

        <Toaster richColors/>
    </main>
  )
}

export default App
