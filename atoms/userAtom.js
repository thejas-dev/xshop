import { atom } from 'recoil';


export const currentUserState = atom({
	key:"currentUserState",
	default:"",
})

export const historyState = atom({
	key:"historyState",
	default:[]
})

export const cancelRevealState = atom({
	key:"cancelRevealState",
	default:false
})

export const catContainerState = atom({
	key:"catContainerState",
	default:[]
})

export const allListArrayState = atom({
	key:"allListArrayState",
	default:[]
})

export const currentListState = atom({
	key:"currentListState",
	default:''
})