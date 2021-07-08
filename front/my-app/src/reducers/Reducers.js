import Constants from './Constants';

const initialDataState = {
    userUrl : '',
    fullName:'',
    matches:'',
    status:'',
    show : false,
    index:1

}

const dataState = (state=initialDataState,action={})=>{
    switch(action.type){
        case Constants.DATA_CHANGE:
            return {...state,...action.payload}
        default:
            return state
    }
}

const Reducers = {
    dataState

}

export default Reducers;