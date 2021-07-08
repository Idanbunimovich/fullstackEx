const DropDown = (props) => {
    let {recommendation, onClickDropDown,show} = props

    return show?<div style={{textAlign:'start',background: '#FFFFFF',position:'absolute',zIndex:1}}>{
        recommendation.map((currentItem) => {
            console.log(currentItem)
            return <div style={{fontFamily: 'Roboto' ,fontStyle: 'normal',fontWeight: 'normal',fontSize: 16,color: '#000000',height:30,width:248}} onClick={() => onClickDropDown(currentItem)}>{currentItem}</div>
        })}
    </div>:null
}

export default DropDown;