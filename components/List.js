import {useState,useEffect} from 'react';
import {MdModeEdit} from 'react-icons/md'
import {AiOutlineMinus,AiOutlinePlus,AiOutlineDelete} from 'react-icons/ai'
import {HiArrowNarrowLeft} from 'react-icons/hi';
import {useRecoilState} from 'recoil'
import {currentUserState,currentListState,cancelRevealState,historyState,catContainerState,allListArrayState} from '../atoms/userAtom'
import axios from 'axios';
import {updateRoute,listUpdateRoute} from '../utils/ApiRoutes';
import {motion} from 'framer-motion' 

let listArray =  []

export default function List({setListReveal,listReveal,intermediateList,setIntermediateList,
	intermediateItem,setIntermediateItem,setCount,count,setShowLogin,showLogin,setMakeItCancel,makeItCancel}) {
	// body...
	// const [listArray,setListArray] = useState();
	const [catArray,setCatArray] = useState([]);
	const [listName,setListName] = useState('Shopping list');
	const [newListName,setNewListName] = useState('');
	const [revealItem,setRevealItem] = useState('');
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentList,setCurrentList] = useRecoilState(currentListState);
	const [cancelReveal,setCancelReveal] = useRecoilState(cancelRevealState);
	const [catForContainer,setCatForContainer] = useRecoilState(catContainerState)
	const [allListArray,setAllListArray] = useRecoilState(allListArrayState);
	const [password,setPassword] = useState('');
	const [addItem,setAddItem] = useState(false);
	const [history,setHistory] = useRecoilState(historyState);
	const [name,setName] = useState('');
	const [note,setNote] = useState('');
	const [image,setImage] = useState('');
	const [category,setCategory] = useState('');
	const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	const monthlist = ['','January','February','March','April','May','June','July','August',
		'September','October','November','December'];

	useEffect(()=>{
		setCatArrayFun();
	},[])

	useEffect(()=>{
		setCount(listArray.length)
	},[listArray])

	useEffect(()=>{
		if(currentUser){
			setHistory(currentUser.history);
		}
	},[currentUser])

	useEffect(()=>{
		if(intermediateList){
			const temp = {
				name:intermediateList.name,
				category:intermediateList.category,
				filename:intermediateList.filename,
				note:intermediateList.note,
				qty:intermediateList.qty
			}
			listArray.unshift(temp);
			setCount(listArray.length)
			setIntermediateList('');
			setCatArrayFun();
		}
	},[intermediateList])

	useEffect(()=>{
		if(intermediateItem){
			setRevealItem(intermediateItem);
			setIntermediateItem('');
		}
	},[intermediateItem])

	const setCatArrayFun = () => {
		if(listArray){
			const array = []
			for(let i = 0; i<listArray.length; i++){
				if(!array.includes(listArray[i].category)){
					array.push(listArray[i].category)
				}
			}
			setCatArray(array)
		}		
	}


	const revealIcons = (i,j) => {
		if(!document.getElementById(`delete-${i}${j}`).classList.contains('hidden')){
			const minus = document.getElementById(`minus-${i}${j}`);
			minus.classList.remove('w-5');
			minus.classList.add('w-0');
			const plus = document.getElementById(`plus-${i}${j}`)
			plus.classList.remove('w-5','mr-3');
			plus.classList.add('w-0','mr-0');
			document.getElementById(`container-${i}${j}`).classList.remove('bg-[#FFFFFF]');
			document.getElementById(`delete-${i}${j}`).classList.add('hidden');
		}else{
			const minus = document.getElementById(`minus-${i}${j}`);
			minus.classList.remove('w-0');
			minus.classList.add('w-5');
			const plus = document.getElementById(`plus-${i}${j}`)
			plus.classList.remove('w-0','mr-0');
			plus.classList.add('w-5','mr-3');
			document.getElementById(`container-${i}${j}`).classList.add('bg-[#FFFFFF]');
			document.getElementById(`delete-${i}${j}`).classList.remove('hidden');			
		}
	}

	const addQty = (j,i) => {
		if(listArray[j].qty < 20){
			listArray[j].qty++;
			document.getElementById(`qty-${i}${j}`).innerHTML = `${listArray[j].qty} pcs`;
		}
	}

	const minusQty = (j,i) => {
		if(listArray[j].qty > 1){
			listArray[j].qty--
			document.getElementById(`qty-${i}${j}`).innerHTML = `${listArray[j].qty} pcs`			
		}
	}

	const changeSettings = () => {
		document.getElementById('save-container').classList.remove('w-full')
		document.getElementById('save-container').classList.add('w-0');
		document.getElementById('complete-container').classList.remove('hidden');
		setTimeout(function() {
			document.getElementById('complete-container').classList.remove('w-0')
			document.getElementById('complete-container').classList.add('w-full');
		}, 100);
		setTimeout(function() {
			document.getElementById('save-container').classList.add('hidden');
		}, 200);
	}

	const changeSettingsToEdit = () => {
		document.getElementById('complete-container').classList.remove('w-full')
		document.getElementById('complete-container').classList.add('w-0');
		document.getElementById('save-container').classList.remove('hidden');
		setTimeout(function() {
			document.getElementById('save-container').classList.remove('w-0')
			document.getElementById('save-container').classList.add('w-full');
		}, 100);
		setTimeout(function() {
			document.getElementById('complete-container').classList.add('hidden');
		}, 200);
	}

	const changeSettingsToAdd = () => {
		document.getElementById('save-container').classList.remove('w-full')
		document.getElementById('save-container').classList.add('w-0');
		document.getElementById('add-container').classList.remove('hidden');
		setTimeout(function() {
			document.getElementById('add-container').classList.remove('w-0')
			document.getElementById('add-container').classList.add('w-full');
		}, 100);
		setTimeout(function() {
			document.getElementById('save-container').classList.add('hidden');
		}, 200);
	}

	const changeSettingsToNormal = () => {
		document.getElementById('add-container').classList.remove('w-full')
		document.getElementById('add-container').classList.add('w-0');
		document.getElementById('save-container').classList.remove('hidden');
		setTimeout(function() {
			document.getElementById('save-container').classList.remove('w-0')
			document.getElementById('save-container').classList.add('w-full');
		}, 100);
		setTimeout(function() {
			document.getElementById('add-container').classList.add('hidden');
		}, 200);
	}

	const deleteItem = (j,i) => {
		listArray.splice(j,1);
		listArray = [...listArray];
		const minus = document.getElementById(`minus-${i}${j}`);
		minus.classList.remove('w-5');
		minus.classList.add('w-0');
		const plus = document.getElementById(`plus-${i}${j}`)
		plus.classList.remove('w-5','mr-3');
		plus.classList.add('w-0','mr-0');
		document.getElementById(`container-${i}${j}`).classList.remove('bg-[#FFFFFF]');
		document.getElementById(`delete-${i}${j}`).classList.add('hidden');
		if(listArray[j]){
			document.getElementById(`qty-${i}${j}`).innerHTML = `${listArray[j].qty} pcs`
		}
		setCatArrayFun();
	}	
	

	const completeTheList = async() => {
		if(currentUser){
			const d = new Date
			const date = `${weekday[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
			const hold = {
				name:listName,
				items:listArray,
				date:date,
				month:`${monthlist[d.getMonth()]} ${d.getFullYear()}`,
				completed:true
			}
			const newhist = [...history,hold]
			setHistory([...history,hold]);
			listArray = []
			setCount(listArray.length)
			setCatArray('');
			const {data} = await axios.post(`${updateRoute}/${currentUser._id}`,{
				newhist
			})
			setCurrentUser(data?.obj);
			
		}else{
			setListReveal(false);
			setShowLogin(true);
		}
		
	}	

	const cancelConfirm = () => {
		setCancelReveal(true);
	}

	useEffect(()=>{
		if(makeItCancel){
			setMakeItCancel(false);
			cancelTheList();
		}
	},[makeItCancel])
	

	const cancelTheList = async() => {		
		if(currentUser){
			const d = new Date
			const date = `${weekday[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
			const hold = {
				name:listName,
				items:listArray,
				date:date,
				month:`${monthlist[d.getMonth()]} ${d.getFullYear()}`,
				completed:false
			}
			const newhist = [...history,hold]
			setHistory([...history,hold]);
			listArray = []
			setCount(listArray.length)
			setListReveal(false);
			setCount(listArray.length)
			setCatArray('');
			const {data} = await axios.post(`${updateRoute}/${currentUser._id}`,{
				newhist
			})
			setCurrentUser(data?.obj);
		}else{
			setListReveal(false);
			listArray = []
			setCatArray('');			
		}
	}

	const cancelEdit = () => {
		changeSettingsToNormal();
		setAddItem(false);
	}

	const saveEdit = async() => {
		if(!name.length > 2){
			const ele = document.getElementById('name-container')
			ele.classList.add('border-red-500')
			ele.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})
			setTimeout(function() {
				ele.classList.remove('border-red-500')
			}, 4000);
			console.log("I ran")			
		}else if(!category.length > 2){
			const ele = document.getElementById('category-container')
			ele.classList.add('border-red-500')
			ele.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})
			setTimeout(function() {
				ele.classList.remove('border-red-500')
			}, 4000);
			console.log("I ran")			
			
		}else if(!note.length > 2){
			const ele = document.getElementById('note-container')
			ele.classList.add('border-red-500')
			ele.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})
			setTimeout(function() {
				ele.classList.remove('border-red-500')
			}, 4000);
			console.log("I ran")			
		}else if(!image.length > 4){
			const ele = document.getElementById('image-container')
			ele.classList.add('border-red-500')
			ele.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})
			setTimeout(function() {
				ele.classList.remove('border-red-500')
			}, 4000);
			console.log("I ran")			
		}else if(password !== 'thejashari'){
			const ele = document.getElementById('password-container')
			ele.classList.add('border-red-500')
			ele.scrollIntoView({behavior:"smooth",block:"center",inline:"center"})
			setTimeout(function() {
				ele.classList.remove('border-red-500')
			}, 4000);
			console.log("I ran")			
		}else {
			const tempData = {
				"name": name,
				"category": category,
				"note": note,
				"filename": image,
				"height": 450,
				"width": 307,
				"price": 21.32,
				"qty":1,
				"rating": 0

			}
			setName('');
			setCategory('');
			setNote('');
			setImage('');
			cancelEdit();
			const data = [...allListArray,tempData]
			const result = await axios.post(`${listUpdateRoute}/${currentList._id}`,{
				data
			});
			setAllListArray(result.data.obj.data);			
		}
	}


	return (
		<div className={`md:w-[28%] w-[86%] fixed ${listReveal ? "right-0" : "-right-[100%] md:right-0" } transition-all duration-300 ease-in h-full z-35 ${revealItem || addItem ? "bg-[#FFFFFF]": "bg-[#FFF0DE]"}  md:block`}>
			{
				revealItem ? 

				<motion.div 
				initial={{
					opacity:0,
				}}
				whileInView={{
					opacity:1,
				}}
				transition={{
					duration:1
				}}
				className="w-full md:h-[83%] h-[86.2%] overflow-y-scroll md:px-10 px-5 scrollbar-none">
					<div 
					onClick={()=>{						
						setRevealItem('');
					}}
					className="flex cursor-pointer gap-2 items-center mt-7">
						<HiArrowNarrowLeft className="h-5 w-5 text-[#F9A109]"/>
						<h1 className="text-md text-[#F9A109] font-semibold">back</h1>
					</div>
					<img src={revealItem.filename} className="w-full rounded-3xl mt-7"/>
					<h1 className="text-md text-[#C1C1C4] font-quicksand mt-8">name</h1>
					<h1 className="text-2xl text-[#000000] font-semibold mt-2">{revealItem.name}</h1>
					<h1 className="text-md text-[#C1C1C4] font-quicksand mt-8">category</h1>
					<h1 className="text-lg text-[#000000] font-semibold mt-2">{revealItem.category}</h1>
					<h1 className="text-md text-[#C1C1C4] font-quicksand mt-8">note</h1>
					<h1 className="text-lg text-[#000000] font-semibold mt-2 mb-5">{revealItem.note}</h1>
				</motion.div>

				:
				addItem ? 
				<>
				<motion.div 
				initial={{
					opacity:0,
				}}
				whileInView={{
					opacity:1,
				}}
				transition={{
					duration:1
				}}
				className="w-full md:h-[83%] h-[86.2%] overflow-y-scroll md:px-10 px-5 scrollbar-none">
					<h1 className="text-2xl mt-7 font-semibold text-[#000000]">Add a new item</h1>
					<div className="flex flex-col group">
						<h1 className="text-md mt-7 text-[#000000] group-hover:text-[#F9A109]">Name</h1>
						<div
						id="name-container"
						className="w-full transition-all duration-200 ease-in rounded-xl p-3 mt-2 border-[1.5px] peer md:border-[2px] border-gray-400 focus-within:border-[#F9A109]">
							<input type="text" 
							value={name} onChange={(e)=>setName(e.target.value)}
							placeholder="Enter a name" className="h-full w-full  placeholder-gray-300 text-sm text-gray-800 bg-transparent outline-none"/>
						</div>
					</div>
					<div className="flex flex-col group">
						<h1 className="text-md mt-7 text-[#000000] group-hover:text-[#F9A109]">Note</h1>
						<div 
						id="note-container"
						className="w-full transition-all duration-200 ease-in h-[150px] rounded-xl p-3 mt-2 border-[1.5px] md:border-[2px] border-gray-400 focus-within:border-[#F9A109]">
							<textarea 
							value={note} onChange={(e)=>setNote(e.target.value)}
							type="text" placeholder="Enter a note" className="h-full w-full scrollbar-none resize-none text-sm placeholder-gray-300 text-gray-800 bg-transparent outline-none"/>
						</div>
					</div>
					<div className="flex flex-col group">
						<h1 className="text-md mt-7 text-[#000000] group-hover:text-[#F9A109]">Image URL (use image to url <a href="https://cdn-uploader.vercel.app" target="_blank" className="text-sky-500">convertor</a>)</h1>
						<div 
						id="image-container"
						className="w-full transition-all duration-200 ease-in rounded-xl p-3 mt-2 border-[1.5px] md:border-[2px] border-gray-400 focus-within:border-[#F9A109]">
							<input 
							value={image} onChange={(e)=>setImage(e.target.value)}
							type="text" placeholder="Enter Image url" className="h-full w-full placeholder-gray-300 text-sm text-gray-800 bg-transparent outline-none"/>
						</div>
					</div>
					<div className="flex flex-col group">
						<h1 className="text-md mt-7 text-[#000000] group-hover:text-[#F9A109]">Category</h1>
						<div 
						id="category-container"
						className="w-full transition-all duration-200 ease-in rounded-xl p-3 mt-2 border-[1.5px] md:border-[2px] border-gray-400 focus-within:border-[#F9A109]">
							<input 
							value={category} onChange={(e)=>setCategory(e.target.value)}
							type="text" placeholder="Enter a category" className="h-full w-full placeholder-gray-300 text-sm text-gray-800 bg-transparent outline-none"/>
						</div>
					</div>
					<div className="mt-2 rounded-2xl bg-[#FFFFFF] flex flex-col p-1 border-[1px] border-gray-200 shadow-md">
						{
							catForContainer.map((cat,i)=>(
								<div key={i}
								onClick={()=>{setCategory(cat)}}
								className={`rounded-xl ${cat===category ? 'text-[#FFFFFF] bg-[#F9A109]' : 'hover:bg-gray-200/70 hover:text-[#000000] text-gray-400' }  transition-all duration-100 
								ease-in  px-7 py-3`}>
									{cat}
								</div>
							))
						}
					</div>
					<div className="flex flex-col group mb-7">
						<h1 className="text-md mt-7  text-[#000000] group-hover:text-green-500">Password</h1>
						<div 
						id="password-container"
						className="w-full transition-all duration-200 ease-in rounded-xl p-3 mt-2 border-[1.5px] md:border-[2px] border-gray-400 focus-within:border-green-500">
							<input 
							value={password} onChange={(e)=>setPassword(e.target.value)}
							type="text" placeholder="Enter password" className="h-full w-full placeholder-gray-300 text-sm text-gray-800 bg-transparent outline-none"/>
						</div>
					</div>
				</motion.div>
				</>
				:
				<motion.span 
				initial={{
					opacity:0,
				}}
				whileInView={{
					opacity:1,
				}}
				transition={{
					duration:0.4
				}}
				>
				<div className="w-full md:h-[83%] h-[86.2%] overflow-y-scroll md:px-10 px-5 scrollbar-none">
				<div className="w-full bg-[#80485B] flex mt-11 px-2 py-3 rounded-xl relative">
					<img src="source.svg" alt="not found" className="h-30 w-30 -top-5 absolute left-0"/>
					<div className="w-[40%] h-full"/>
					<div className="w-[60%] h-full">
						<h1 className="text-lg text-[#FFFFFF] font-semibold">Didn&apos;t find what you need?</h1>
						<button 
						onClick={()=>{setAddItem(true);changeSettingsToAdd()}}
						className="bg-[#FFFFFF] mt-2 py-2 px-5 text-[#34333A] font-semibold rounded-xl">Add item</button>
					</div>
				</div>
				<div className="relative flex flex-col mt-7">
					<div className={`flex justify-between ${catArray.length === 0 && "hidden"} items-center`}>
						<h1 className="text-2xl text-[#34333A] font-semibold">{listName}</h1>
						<MdModeEdit onClick = {changeSettingsToEdit} className="text-[#34333A] h-6 w-6 cursor-pointer"/>
					</div>
					{
						catArray.length > 0 ?
						<div className="flex flex-col mb-5">
						{
							catArray.map((cat,i)=>(
								<div key={i} className="w-full mt-7">
									<h1 className="text-md text-[#828282] font-quicksand">{cat}</h1>
									{
										listArray.map((list,j)=>(
											<>
											{
												list.category === cat &&
												<div key={j} className="flex mt-5 justify-between">
													<h1 className="font-semibold truncate md:text-lg text-md text-[#0C0C0C]">
														{list.name}
													</h1>
													<div id={`container-${i}${j}`}
													className="flex rounded-xl items-center gap-2 transition-all duration-100 ease-in">
														<div id={`delete-${i}${j}`}
														onClick={()=>deleteItem(j,i)}
														className={`px-2 py-3 bg-[#F9A109] cursor-pointer rounded-xl hidden`}>
															<AiOutlineDelete className="h-4 w-4 text-[#FFFFFF]"/>
														</div>
														<AiOutlineMinus 
														onClick={()=>minusQty(j,i)}
														id={`minus-${i}${j}`} className="h-5 transition-all duration-100 cursor-pointer ease-in w-0 text-[#F9A109]"/>
														<div 
														onClick={()=>{revealIcons(i,j)}}
														id={`qty-${i}${j}`}
														className={`rounded-full cursor-pointer px-4 py-1 border-[2px] text-sm font-semibold text-[#F9A109]
														border-[#F9A109] flex items-center whitespace-nowrap justify-center select-none`}>
															{list.qty} pcs
														</div>
														<AiOutlinePlus 
														onClick={()=>addQty(j,i)}
														id={`plus-${i}${j}`} className={`h-5 transition-all duration-100 cursor-pointer ease-in w-0 text-[#F9A109] mr-0`}/>
													</div>
												</div>

											}
											</>
										))
									}
								</div>
							))
						}
					</div>
					:
					<>
						<h1 className="text-xl text-[#34333A] absolute top-0 right-0 left-0 bottom-0 m-auto text-center mt-[150px] font-semibold md:mt-[80px]">No items</h1>
					</>
					}
					
				</div>
			</div>

				</motion.span>
			}

			<div className={`md:h-[17%] h-[13.8%] bg-[#FFFFFF] ${(revealItem || addItem) && 'border-t-[2px] rounded-md'} 
			border-gray-200/70 relative w-full px-7 md:py-6 py-5 flex`}>
				{
					revealItem ? 
					<div className="w-full flex gap-5 items-center justify-center">
						<button 
						onClick={()=>{
							setListReveal('');
							setRevealItem('');
						}}
						className="px-5 py-3 bg-[#FFFFFF] select-none text-[#00000]">back</button>
						<button 
						onClick={()=>{
							setIntermediateList(revealItem);
							setRevealItem('');
						}}
						className="px-5 py-3 bg-[#F9A109] select-none rounded-xl text-[#FFFFFF]">Add to list</button>
					</div>
					:
					<>
					{
					!catArray.length > 0 && !addItem &&
					<img src="undraw_shopping_app_flsj 1.svg" alt = "" className="absolute h-[200px] w-[200px] bottom-[85px] left-0 mx-auto right-0	"/>
					}
					<div id="save-container" className={`w-full  rounded-xl border-[2px] overflow-hidden 
						${catArray.length > 0 ? "border-[#F9A109]" : "border-[#C1C1C4]"} flex transition-all duration-200 ease-out`}>
						<input type="text" placeholder="Enter a name" value={newListName} onChange={(e)=>setNewListName(e.target.value)}
						className="bg-transparent text-md font-quicksand md:m-3 mx-3 my-0 outline-none w-full placeholder-[#BDBDBD]"/>
						<button onClick={()=>{
							if(catArray.length > 0 && newListName.length > 0){
								setListName(newListName);
								setNewListName('');
								changeSettings();							
							}
						}}
						className={`py-4 px-5 font-semibold ${catArray.length > 0 ? newListName.length > 0 ? "bg-[#F9A109]" : 'bg-[#F9A109]/90' : "bg-[#C1C1C4]"} flex items-center text-[#FFFFFF] rounded-md`}>Save</button>
					</div>
					<div id="complete-container" className={`w-0 rounded-xl ${catArray.length <= 0 && 'hidden'} overflow-hidden gap-5 items-center justify-center flex transition-all duration-200 ease-out`}>
						<button 
						onClick={cancelConfirm}
						className="px-2 py-3 bg-transparent text-[#34333A] font-semibold">Cancel</button>
						<button 
						onClick={completeTheList}
						className="px-5 font-semibold py-4 bg-[#56CCF2] text-[#FFFFFF] rounded-xl">Complete</button>
					</div>
					<div id="add-container" className={`w-0 rounded-xl ${catArray.length <= 0 && 'hidden'} overflow-hidden gap-5 items-center justify-center flex transition-all duration-200 ease-out`}>
						<button 
						onClick={cancelEdit}
						className="px-2 py-3 bg-transparent text-[#34333A] font-semibold">Cancel</button>
						<button 
						onClick={saveEdit}
						className="px-5 font-semibold md:py-4 py-2 bg-[#56CCF2] text-[#FFFFFF] rounded-xl">Add</button>
					</div>
					</>
				}
				

			</div>
		</div>

	)
}