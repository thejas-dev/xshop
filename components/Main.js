import Menu from './Menu'
import Sidebar from './Sidebar'
import List from './List'
import {useState} from 'react';
import {useSession,getProviders} from 'next-auth/react';
import {useRecoilState} from 'recoil'
import {cancelRevealState} from '../atoms/userAtom'
import {RxCross2} from 'react-icons/rx'

export default function Main({providers}) {
	// body...
	const [listReveal,setListReveal] = useState(false);
	const [intermediateList,setIntermediateList] = useState('');
	const [intermediateItem,setIntermediateItem] = useState('');
	const [count,setCount] = useState(0);
	const [menuState,setMenuState] = useState('menu');
	const {data:session} = useSession();
	const [showLogin,setShowLogin] = useState(false);
	const id = "google"
	const [cancelReveal,setCancelReveal] = useRecoilState(cancelRevealState);
	const [makeItCancel,setMakeItCancel] = useState(false);


	return (
		<div className="bg-[#fafafe] flex w-full h-screen">
			<div className={`fixed ${cancelReveal ? 'opacity-100 z-50' : 'opacity-0 z-[-1]'} h-screen transition-all w-full
			duration-300 ease-in bg-[#000000]/20 flex items-center justify-center`}>
				<div className="bg-[#FFFFFF] md:p-7 md:pt-4 p-3 pt-2 pl-3 md:pl-7 rounded-2xl">
					<div 
					onClick={()=>{setCancelReveal(false)}}
					className="w-full flex justify-end">
						<RxCross2 className="h-7 w-7 text-[#828282] hover:text-red-500 transition-all duration-100 ease-in cursor-pointer"/>
					</div>
					<h1 className="md:text-2xl w-[85%] text-xl text-[#34333A] font-quicksand">
						Are you sure that you want to cancel this list?
					</h1>
					<div className="md:mt-9 mt-5 flex justify-end">
						<button 
						onClick={()=>{setCancelReveal(false)}}
						className="bg-transparent text-[#34333A] text-md font-semibold px-7 py-3 rounded-2xl">
							cancel
						</button>
						<button 
						onClick={()=>{setMakeItCancel(true);setCancelReveal(false)}}
						className="bg-[#EB5757] text-[#FFFFFF] text-md font-semibold px-7 py-3 rounded-2xl">
							Yes
						</button>
					</div>
				</div>
			</div>
			<Sidebar id={id} menuState={menuState} setMenuState={setMenuState} count={count} setCount={setCount} listReveal={listReveal} setListReveal={setListReveal} 
			showLogin={showLogin} setShowLogin={setShowLogin} />
			<Menu menuState={menuState} setMenuState={setMenuState} listReveal={listReveal} 
			setListReveal={setListReveal} intermediateList={intermediateList} setIntermediateList={setIntermediateList} setIntermediateItem={setIntermediateItem} intermediateItem={intermediateItem} />
			<List makeItCancel={makeItCancel} setMakeItCancel={setMakeItCancel} showLogin={showLogin} setShowLogin = {setShowLogin} count={count} setCount={setCount} intermediateList={intermediateList} setIntermediateList={setIntermediateList}  
			listReveal={listReveal} setListReveal={setListReveal}  setIntermediateItem={setIntermediateItem} intermediateItem={intermediateItem}/>
		</div>

	)
}

export async function getServerSideProps(context){
  const providers = await getProviders();
  // const session = await getSession(context);
  return{
    props: {
      providers,
    }
  }
}