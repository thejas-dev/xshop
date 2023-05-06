import {GoSearch} from 'react-icons/go';
import {AiOutlinePlus} from 'react-icons/ai'
import {listOfItems} from './listData';
import {useState,useEffect} from 'react';
import {historyState,catContainerState,allListArrayState,currentListState} from '../atoms/userAtom'
import {useRecoilState} from 'recoil';
import {RiCalendarTodoFill} from 'react-icons/ri';
import {CgArrowLongLeft} from 'react-icons/cg';
import {FiChevronRight} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import {listFetchRoute,listUpdateRoute} from '../utils/ApiRoutes';
import {motion} from 'framer-motion'

export default function Menu({intermediateList,setIntermediateList,listReveal,
	setListReveal,intermediateItem,setIntermediateItem,menuState,setMenuState}) {
	// body...
	const [catArray,setCatArray] = useState([]);
	const [historyCatArray,setHistoryCatArray] = useState([]);
	const [allListArray,setAllListArray] = useRecoilState(allListArrayState);
	const [history,setHistory] = useRecoilState(historyState);
	const [months,setMonths] = useState([]);
	const [historyReveal,setHistoryReveal] = useState('');
	const [histItems,setHistItems] = useState([]);
	const [catForContainer,setCatForContainer] = useRecoilState(catContainerState)
	const [searchCatArray,setSearchCatArray] = useState([]);
	const [currentList,setCurrentList] = useRecoilState(currentListState);
	const [search,setSearch] = useState('');
	const [searchArray,setSearchArray] = useState([]);
	const [aspectRatio,setAspectRatio] = useState(2.2);
	const [topItems,setTopItems] = useState([
		{name:'Banana',
		percent:50
		},
		{name:'Rice',
		percent:30
		},
		{name:'Chicken 1kg',
		percent:18
		},
	])
	const [topCategories,setTopCategories] = useState([
		{name:'Fruit and vegetables',
		percent:70
		},
		{name:'Meat and fish',
		percent:14
		},
		{name:'KFC chicken',
		percent:40
		},
	])

	const data = [
	  {
	    name: 'January',
	    items: 35,     
	  },
	  {
	    name: 'March',
	    items: 34,    
	  },
	  {
	    name: 'May',
	    items: 32,    
	  },
	  {
	    name: 'July',
	    items: 40,    
	  },
	  {
	    name: 'September',
	    items: 100,    
	  },
	  {
	    name: 'November',
	    items: 50,    
	  },
	];


	useEffect(()=>{
		if(history){
			const array = []
			for(let i = 0; i<history.length; i++){
				if(!array.includes(history[i].month)){
					array.push(history[i].month)	
				}				
			}
			setMonths(array);		
		}
	},[history])

	useEffect(()=>{
		if(search.length>0){
			let array = []
			for (let i = 0; i<allListArray.length; i++){
				if(allListArray[i].name.toLowerCase().includes(search.toLowerCase())){
					array.unshift(allListArray[i]);
				}
			}
			setSearchArray(array);
			setSearchCatArrayFun(array);
		}else{
			setSearchArray([]);
		}
	},[search])

	useEffect(()=>{
		fetchItems();
		// createItems();
		if(window.innerWidth>0 && window.innerWidth < 700){
			setAspectRatio(1.2)
		}else if (window.innerWidth > 700){
			setAspectRatio(2.2)
		}
	},[])

	const createItems = async() => {
		const data = listOfItems
		const name = 'new'
		const result = await axios.post("http://localhost:3333/api/list/create",{
			data,name
		})
		console.log(result.result);
	}

	const fetchItems = async() =>{
		const name = 'thejas'
		const {data} = await axios.post(listFetchRoute,{
			name
		})	
		setCurrentList(data.data);
		setAllListArray(data.data.data);
	}

	useEffect(()=>{
		if(allListArray){
			setCatArrayFun()
		}
	},[allListArray])

	const setCatArrayFun = () => {
		const array = []
		for(let i = 0; i<allListArray.length; i++){
			if(!array.includes(allListArray[i].category)){
				array.push(allListArray[i].category)
			}
		}
		setCatArray(array)
	}

	const setSearchCatArrayFun = (arr) => {
		const array = []
		for(let i = 0; i<arr.length; i++){
			if(!array.includes(arr[i].category)){
				array.push(arr[i].category)
			}
		}
		setSearchCatArray(array)
	}

	useEffect(()=>{
		if(historyReveal.items){
			setHistItems(historyReveal.items);
			const array = []
			for(let i = 0; i<historyReveal.items.length; i++){
				if(!array.includes(historyReveal.items[i].category)){
					array.push(historyReveal.items[i].category)
				}
			}
			setHistoryCatArray(array)
		}
	},[historyReveal])

	useEffect(()=>{
		if(catArray){
			setCatForContainer(catArray)
		} 
	},[catArray])


	if(menuState === 'menu'){
		return (
		<div className="md:w-[66%] w-[86%] h-[100%] flex flex-col md:px-10 px-4 overflow-y-scroll scrollbar-none">
			<div className="flex justify-between md:flex-row flex-col md:mt-6 mt-5">
				<h1 className="md:text-3xl text-2xl font-semibold text-[#34333A] w-full md:w-[60%]">
					<span className="text-[#F9A109]">Xshop</span> allows you take your shopping list wherever you go
				</h1>
				<motion.div 
				initial={{
					opacity:0,
					scale:0.6
				}}
				whileInView={{
					opacity:1,
					scale:1
				}}
				viewport = {{
					once:true
				}}
				transition={{
					duration:1
				}}
				className="shadow-md md:px-3 border-[1px] border-gray-200/50 px-4 py-4 md:w-[36%] w-full my-auto md:mt-0 mt-3 rounded-lg flex md:gap-3 gap-4 items-center">
					<GoSearch className="md:h-5 h-5 md:w-5 w-5 text-[#34333A]"/>
					<input type="text" 
					value={search}
					onChange={(e)=>setSearch(e.target.value)}
					placeholder="search item"
					className="text-[#0C0C0C] font-serif text-md placeholder-[#BDBDBD] font-quicksand bg-transparent outline-none"/>
				</motion.div>
			</div>
			{
				search.length>0 ? 
				searchCatArray.length < 1 ?
				<div className={`flex flex-col h-full w-full relative`}>
					<img src="undraw_shopping_app_flsj 1.svg" alt = "" className="absolute h-[280px] w-[280px] bottom-[100px] opacity-80 left-0 mx-auto right-0	"/>
				</div>
				:
				searchCatArray?.map((cat,i)=>(
					<div key={i} className={`flex flex-col mt-12 ${searchCatArray.length === i+1 && "mb-10"}`}>
						<h1 className="text-xl text-[#000000] font-semibold">{cat}</h1>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{
								searchArray?.map((list,j)=>(
									<>
									{
										list.category === cat &&
										<motion.div
										key={j}
										initial={{
											opacity:0,
											scale:0.6
										}}
										whileInView={{
											opacity:1,
											scale:1
										}}
										viewport = {{
											once:true
										}}
										transition={{
											duration:0.4
										}}
										className={`flex md:px-3 px-2 items-center py-3 my-auto cursor-pointer hover:bg-gray-200/30 rounded-lg 
										border-[1px] border-gray-200/30 shadow-md md:mt-6 mt-4 transition-all duration-100 ease-in`}>
											<h1 
											onClick={()=>{
												setIntermediateItem(list);
												setListReveal(true);
											}}
											className="text-[#000000] w-[80%] font-semibold">{list.name}</h1>
											<AiOutlinePlus 
											onClick={()=>{
												setIntermediateList(list)
												setListReveal(true)
											}}
											className="h-6 w-6 w-[20%] text-[#C1C1C4] hover:text-orange-400 transition-all duration-100 ease-in-out"/>
										</motion.div>
									}
									</>
								))
							}
						</div>
					</div>
				))
				:
				catArray?.map((cat,i)=>(
					<div key={i} className={`flex flex-col mt-12 ${catArray.length === i+1 && "mb-14"}`}>
						<h1 className="text-xl text-[#000000] font-semibold">{cat}</h1>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{
								allListArray?.map((list,j)=>(
									<>
									{
										list.category === cat &&
										<motion.div 
										key={j}
										initial={{
											opacity:0,
											scale:0.8
										}}
										whileInView={{
											opacity:1,
											scale:1
										}}
										
										transition={{
											duration:0.3
										}}
										className="flex md:px-3 px-2 items-center py-3 my-auto cursor-pointer hover:bg-gray-200/30 rounded-lg 
										border-[1px] border-gray-200/30 shadow-md md:mt-6 mt-4 transition-all duration-100 ease-in">
											<h1 
											onClick={()=>{
												setIntermediateItem(list);
												setListReveal(true);
											}}
											className="text-[#000000] w-[80%] font-semibold">{list.name}</h1>
											<AiOutlinePlus 
											onClick={()=>{
												setIntermediateList(list)
												setListReveal(true)
											}}
											className="h-6 w-6 w-[20%] text-[#C1C1C4] hover:text-orange-400 transition-all duration-100 ease-in-out"/>
										</motion.div>
									}
									</>
								))
							}
						</div>
					</div>
				))
			}
		</div>
		)
	}else if(menuState === 'history'){
		if(historyReveal){
			return (
				<div className="md:w-[66%] w-[86%] h-[100%] flex flex-col md:px-10 px-4 overflow-y-scroll scrollbar-none">				
					<h1 
					onClick={()=>{
						setHistoryReveal('')
					}}
					className="md:text-xl text-md font-semibold z-30 cursor-pointer flex text-[#F9A109] items-center gap-1 w-full md:w-[60%] mt-5">
						<CgArrowLongLeft className="h-5 w-5 mt-1"/> <span className="cursor-pointer">back</span>
					</h1>
					<h1 className="mt-8 text-4xl font-bold text-[#34333A] md:text-2xl">{historyReveal.name}</h1>
					<div className="flex items-center gap-2 mt-5 text-[#C1C1C4]">
						<RiCalendarTodoFill className="h-5 w-5"/>
						<span className="text-md font-semibold">{historyReveal.date}</span>
					</div>
					<div className="mt-7 flex flex-col gap-9">
						{
							historyCatArray.map((histcat,i)=>(
								<div key={i} className={`flex flex-col ${historyCatArray.length === i+1 && "mb-10"}`}>
									<h1 className="text-[#000000] font-semibold text-xl">
										{histcat}
									</h1>
									<div className="grid grid-cols-2 md:grid-cols-4 mt-1 gap-4">
										{
											histItems?.map((hist,j)=>{
												if(hist.category === histcat){
													return (
														<div 
														key={j}
														onClick={()=>{
															setIntermediateItem(hist);
															setListReveal(true);
														}}
														className="flex md:px-3 px-2 items-center py-3 my-auto cursor-pointer hover:bg-gray-200/30 rounded-lg 
														gap-1 border-[1px] border-gray-200/30 justify-between shadow-md md:mt-5 mt-3 transition-all duration-100 ease-in">
															<h1	className="text-[#000000] font-semibold">{hist.name}</h1>
															<h1 
															className="font-semibold whitespace-nowrap text-[#F9A10A] hover:text-orange-400 transition-all duration-100 ease-in-out">
																{hist.qty} pcs
															</h1>
														</div>
													)
												}
											})
										}
									</div>
								</div>
							))
						}
					</div>
				</div>

			)
		}else{
			return (
			<div className="md:w-[66%] w-[86%] h-[100%] relative flex flex-col md:px-10 px-4 overflow-y-scroll scrollbar-none">				
				{
					!months.length > 0 && 
					<img src="undraw_shopping_app_flsj 1.svg" alt = "" className="absolute h-[280px] w-[280px] bottom-[200px] opacity-80 left-0 mx-auto right-0	"/>
				}
				<h1 className="md:text-3xl text-2xl font-semibold text-[#34333A] w-full md:w-[60%] mt-5">
						<span className="text-[#F9A109]">Shopping</span>  history
				</h1>
				<div className="mt-7 mb-7 flex flex-col gap-5">
					{
						months.slice(0).reverse().map((monthOf,i)=>(
							<div key={i} className={`flex flex-col mt-5 ${i !==0 &&  "border-t-[1px]"} pt-3 border-gray-200 w-full`}>
								<h1 className="text-md text-[#000000] font-semibold">{monthOf}</h1>
								<div className="mt-4 flex flex-col w-full gap-8">
								{
									history.slice(0).reverse().map((hist,j)=>{
										if(hist.month === monthOf){									
											return (
												<motion.div 
												key={j}
												initial={{
													opacity:0,
												}}
												whileInView={{
													opacity:1,
												}}
												viewport={{
													once:true
												}}
												transition={{
													duration:0.5
												}}													
												onClick={()=>{setHistoryReveal(hist)}}
												className={`cursor-pointer w-full flex items-center justify-between md:px-3 px-0 py-4 rounded-lg 
													shadow-md bg-[#FFFFFF] border-[1px] border-gray-200/80 hover:bg-gray-200/40 transition-all duration-100 ease-in`}>
													<h1 className="md:text-lg text-md font-semibold text-[#000000] ml-3 truncate">{hist.name}</h1>
													<div className="flex items-center md:gap-6 gap-2 md:px-4 px-1">
														<div className="flex md:gap-1 gap-[1px] hidden md:flex items-center">
															<RiCalendarTodoFill className="text-[#C1C1C4] h-5 w-5"/>
															<h1 className="text-[#C1C1C4] font-semibold text-sm">{hist.date}</h1>
														</div>
														{
															hist?.completed ?
															<button className="py-1 px-2 rounded-lg border-[1px] border-[#56CCF2] text-[#56CCF2]">Completed</button>
															:
															<button className="py-1 px-2 rounded-lg border-[1px] border-[#EB5757] text-[#EB5757]">Cancelled</button>

														}
														<FiChevronRight className="md:h-8 md:w-8 h-7 w-7 text-[#F9A109]"/>
													</div>
												</motion.div>
											)
										}
									})
								}
								</div>
							</div>

						))
					}
				</div>
			</div>
		)	
		}
		
	}else if(menuState==='chart'){
		return (
			<div className="md:w-[66%] w-[86%] h-[100%] flex flex-col md:px-14 px-4 overflow-y-scroll scrollbar-none">
				<motion.div 
				initial={{
					opacity:0,
				}}
				whileInView={{
					opacity:1,
				}}
				viewport = {{
					once:true
				}}
				transition={{
					duration:0.8
				}}
				className="md:mt-12 mt-7 flex items-center md:flex-row flex-col gap-14">
					<div className="md:w-[50%] w-full flex flex-col">
						<h1 className="md:text-2xl text-xl font-semibold text-[#000000]">Top items</h1>
						<div className="mt-3 flex flex-col">
							{
								topItems.map((top,i)=>(
									<div key={i} className="mt-7 flex-col flex w-full">
										<div className="flex justify-between w-full">
											<h1 className="text-lg text-[#000000] font-quicksand">{top.name}</h1>
											<h1 className="text-lg text-[#000000] font-medium">{top.percent}%</h1>
										</div>
										<div className="w-full mt-4 h-[6.5px] bg-[#E0E0E0] rounded-full">
											<motion.div 
											initial={{
												opacity:0,
												width:0
											}}
											whileInView={{
												opacity:1,
												width:`${top.percent}%`
											}}
											viewport = {{
												once:true
											}}
											transition={{
												type:"spring",
												velocity:10
											}}
											className={`transition-all duration-200 ease-in bg-[#F9A109] h-[6.5px] rounded-full`}/>
										</div>
									</div>
								))
							}
						</div>
					</div>
					<div className="md:w-[50%] w-full flex flex-col">
						<h1 className="md:text-2xl text-xl font-semibold text-[#000000]">Top Categories</h1>
						<div className="mt-3 flex flex-col">
							{
								topCategories.map((top,j)=>(
									<div key={j} className="mt-7 flex-col flex w-full">
										<div className="flex justify-between w-full">
											<h1 className="text-lg text-[#000000] font-quicksand">{top.name}</h1>
											<h1 className="text-lg text-[#000000] font-medium">{top.percent}%</h1>
										</div>
										<div className="w-full mt-4 h-[6.5px] bg-[#E0E0E0] rounded-full">
											<motion.div 
											initial={{
												opacity:0,
												width:0
											}}
											whileInView={{
												opacity:1,
												width:`${top.percent}%`
											}}
											viewport = {{
												once:true
											}}
											transition={{
												type:"spring",
												velocity:10
											}}
											className={`w-[${top.percent}%] transition-all duration-200 ease-in bg-[#56CCF2] h-[6.5px] rounded-full`}/>
										</div>
									</div>
								))
							}
						</div>
					</div>
				</motion.div>
				<h1 className="mt-14 text-[#000000] font-semibold text-xl md:text-2xl">Monthly Summary</h1>
				<motion.div 
				initial={{
					opacity:0,
				}}
				whileInView={{
					opacity:1,
				}}
				transition={{
					duration:0.4
				}}
				className="mt-8 p-0 w-full mb-10 flex items-center justify-center pr-5 md:pr-0">
					<ResponsiveContainer width="100%" aspect={aspectRatio}>
						<LineChart
				          width={800}
				          height={300}
				          data={data}
				          
				        >
				        	<CartesianGrid strokeDasharray="1 1" />
					          <Line type="monotone" dataKey="items" stroke="#F9A109" activeDot={{ r: 8 }} />
					          <XAxis dataKey="name" />					          
					          <YAxis />
					          <Tooltip />					          
					          <Legend/>
				        </LineChart>		
				       </ResponsiveContainer>			
				</motion.div>
			</div>	

		)
	}
	
}