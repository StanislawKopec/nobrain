import { useEffect, useState } from 'react';
import './DraggableDiv.scss'

const DraggableDiv=()=>{

const openNode = () => {
    console.log('clicked')
}

return (

    <div className="kulka" id="kulka" onClick={openNode}>
    <h1>home</h1>
    </div>

)
}
export default DraggableDiv