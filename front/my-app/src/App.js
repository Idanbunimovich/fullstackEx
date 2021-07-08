import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import {useEffect, useState} from "react";
import ItemCard from "./ItemCard";




const App = () => {
  const [roomArray,setRoomArray] = useState(['bedroom','kitchen','living-room','service-room','bathroom'])
  const [personsName,setPersonsName] = useState('')
  const [personData,setPersonData] = useState(null)
  const [recommendation,setRecommendation] = useState('')
  const [isEdit,setIsEdit] = useState()


    const onChangeText = (event) => {
      console.log(event.target.value)
        setPersonsName(event.target.value)
    }



    const onSubmit = async(name) => {
        let result = await axios.post('http://localhost:3001/person',{name})
        let {data} = result
        if(data==="wrong credentials"){

        }
        else{
            setPersonData(data.finalResult)
        }
    }

    return (
    <div className="App">
        <div className='res' style={{display:'flex',flexDirection:'column',alignItems:'start',justifyContent:'start'}}>
          <input className={'fillInBoxTitle'} onChange={(event)=>onChangeText(event)} placeholder={'Enter your name'}/>
          <button onClick={()=>onSubmit(personsName)}>submit</button>

          {personData? <>{Object.entries(personData).map(([key,value])=> {

              return <ItemCard key={key} item={key} value={value}/>


          })}</>:null }</div>



    </div>
  );
}

export default App;
