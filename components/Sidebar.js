import {TfiMenuAlt} from 'react-icons/tfi';
import {AiOutlineShoppingCart} from 'react-icons/ai'
import {MdReplay,MdOutlineInsertChart} from 'react-icons/md';
import {ImReply} from 'react-icons/im';
import {useEffect} from 'react';
import {signIn,useSession,signOut} from 'next-auth/react'
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import {loginRoute,registerRoute} from '../utils/ApiRoutes';
import {useState} from 'react';
import axios from 'axios';
import {BsArrowLeft} from 'react-icons/bs';
import {motion} from 'framer-motion'

export default function Sidebar({id,setListReveal,listReveal,count,setCount,menuState
	,setMenuState,showLogin,setShowLogin}) {

	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const {data:session} = useSession();
	const [ready,setReady] = useState(false)

	useEffect(()=>{
    if(session){
      if(!ready){
        setReady(true)
      }
      localStorage.setItem('xshop',JSON.stringify(session.user.name))
      handleValidation()
    }
  },[session]);

  const handleValidation = async() =>{
    let email = session?.user.email
    const {data} = await axios.post(loginRoute,{
      email,
    });
    if(data.status === false){
      const {data} = await axios.post(registerRoute,{
        email
      })
      if(!localStorage.getItem('xshop')){
        localStorage.setItem('xshop',JSON.stringify(data?.user?.username));
      }
      setCurrentUser(data?.user);
    }else{
      if(!localStorage.getItem('xshop')){
        localStorage.setItem('xshop',JSON.stringify(data?.user?.username));
      }
      setCurrentUser(data?.user);
    }
  }

  useEffect(()=>{
  	if(showLogin){
  		const elemt = document.getElementById('loginnoti')
  		elemt.classList.add('animate-slide');
  		elemt.classList.remove('opacity-0');
  		setTimeout(function() {
  			elemt.classList.remove('animate-slide');
  			elemt.classList.add('opacity-0');
  		}, 3000);
  		setShowLogin(false);
  	}
  },[showLogin])

	return(
		<div className="h-[100vh] bg-[#FFFFFF] md:w-[6%] w-[14%] flex flex-col items-center justify-between">
			<div className="p-2 box-content flex items-center justify-center mt-5 relative">
				<div 
				id="loginnoti"
				className="absolute left-[70px] transition-all duration-200 ease-in opacity-0 px-2 py-1 rounded-xl bg-[#454545] shadow-xl border-[1px] border-gray-400/30">
					<h1 className="text-sm font-semibold whitespace-nowrap text-[#FFFFFF] flex items-center gap-2"><BsArrowLeft className="h-3 w-3 text-gray-300"/> Login before checkout</h1>
				</div>
				<img 
				onClick={()=>{
					if(currentUser){
						signOut();
					}else{
						signIn(id);
					}
				}}
				src={currentUser ? currentUser.photo : 'logo.svg'} className="h-10 w-10 cursor-pointer rounded-md" alt="not found"/>	
			</div>
			<div className="flex flex-col w-full gap-8">
				<div 
				onClick={()=>{setMenuState('menu');setListReveal(false)}}
				className="w-full py-2 cursor-pointer relative select-none flex items-center justify-center">
					<div className={`h-full absolute ${menuState === "menu" ? 'w-1' : 'w-0' } select-none bg-[#F9A109] transition-all duration-200 ease-in left-0`}/>
					<TfiMenuAlt className="h-6 w-6 text-[#454545] select-none"/>
				</div>
				<div 
				onClick={()=>{setMenuState('history');setListReveal(false)}}
				className="w-full py-2 cursor-pointer relative select-none flex items-center justify-center">
					<div className={`h-full absolute ${menuState === "history" ? 'w-1' : 'w-0' } select-none bg-[#F9A109] transition-all duration-200 ease-in left-0`}/>
					<MdReplay className="h-6 w-6 text-[#454545] select-none"/>
				</div>
				<div 
				onClick={()=>{setMenuState('chart');setListReveal(false)}}
				className="w-full py-2 cursor-pointer relative select-none flex items-center justify-center">
					<div className={`h-full absolute ${menuState === "chart" ? 'w-1' : 'w-0' } select-none bg-[#F9A109] transition-all duration-200 ease-in left-0`}/>
					<MdOutlineInsertChart className="h-6 w-6 text-[#454545] select-none"/>
				</div>
			</div>
			<div className="w-full flex items-center justify-center mb-7 ">
				<div className="p-2 box-border rounded-full bg-[#F9A109] flex items-center justify-center cursor-pointer relative">
					<div className="absolute -top-[14px] h-6 w-6 flex items-center justify-center -right-2 bg-red-500 text-[#FFFFFF] rounded-full">
						<h1 id="countnum" className="text-sm text-[#FFFFFF]">{count}</h1>
					</div>
					<AiOutlineShoppingCart 
					className="md:h-5 md:w-5 hidden md:block h-6 w-6 text-[#FFFFFF]" />
					{
						listReveal ? 
						<ImReply 
						onClick={()=>setListReveal(!listReveal)}
						className="md:h-5 md:w-5 md:hidden h-6 w-6 text-[#FFFFFF]"/>
						:
						<AiOutlineShoppingCart 
						onClick={()=>setListReveal(!listReveal)}
						className="md:h-5 md:w-5 md:hidden h-6 w-6 text-[#FFFFFF]" />						
					}
				</div>
			</div>
		</div>

	)
}