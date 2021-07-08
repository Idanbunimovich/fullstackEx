import {useRef, useState} from "react";
import axios from "axios";
import DropDown from "./DropDown";
let timeout
const debounce = (func, wait)=> {
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}
const ItemCard = (props) => {
    let {item,value} = props
    console.log(props)
    const [personItem,setPersonItem] = useState(item)
    const [room,setRoom] = useState(value)
    const [data,setData] = useState({edit:'',show:true})
    const [recommendation,setRecommendation] = useState('')
    const [roomArray,setRoomArray] = useState(['bedroom','kitchen','living-room','service-room','bathroom'])


    const autoComplete = (str) => {
        if(!str){
            setRecommendation('')
        }
        else {
            let filterArray = roomArray.filter((item) => {
               return item.substr(0, str.length).toUpperCase() === str.toUpperCase()
            })
            if(!filterArray.length){
                setRecommendation('')
            }
        else{
            setRecommendation(filterArray)
            }
        }
    }
    const onChangeRoom = (event) => {
        let value = event.target.value
        let obj = {...data}
        obj.edit = value
        obj.show = true
        setData(obj)
        debounce(autoComplete,500)(value)
    }
    const onClickDropDown = (value) => {
        let obj = {...data}
        obj.edit = value
        obj.show = false
        setData(obj)
    }
    const onEditClick = async() => {
        let {edit} = data
        if(edit === recommendation[0]) {
            let result = await axios.post('http://localhost:3001/rooms', {item, room:edit})
            if(result.data === 'great') {
                setRoom(edit)
            }
        else{
            console.log('something went wrong')
            }
        }
        else{
            console.log({data:data.edit,recommendation})
        }
    }
    return <div style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'start',justifyContent:'start'}}><p>{`${personItem} : ${room}`}</p>

    <input  style={{height:30,width:240}} className={'fillInBoxTitle'} onChange={(event) => onChangeRoom(event)}
           value={data.edit}
           placeholder={'Enter Room'}/>
        <div style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'start',position:'relative',justifyContent:'start'}}>
    {recommendation?<DropDown show={data.show} onClickDropDown={onClickDropDown} recommendation ={recommendation}/>
    :null}
        </div>
    <button style={{marginLeft:100,height:30,width:50,marginTop:10}} onClick={onEditClick}>edit</button>
        </div>
}
export default ItemCard