import {useState, useEffect} from 'react'
import angry from './images/angry.png'
import cry from './images/cry.png'
import devil from './images/devil.png'
import exited from './images/exited.png'
import heart from './images/heart.png'
import idiot from './images/idiot.png'
import empt from './images/empt.png'
import surprise from './images/surprise.png'
import ScoreBoard from './components/ScoreBoard'

const width = 8
const candyColors = [angry, cry, exited, devil, heart, idiot]

// createGamePad()

const App = () => {
  const [currentGamepadArrangement, setCurrentGamepadArrangement] = useState([])
  const [DraggedElement, setDraggedElement] = useState([null])
  const [ReplacedElement, setReplacedElement] = useState([null])
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const moveDown = () =>{
    for(let i=0; i<64-width; i++){

      if(i<8  &&  currentGamepadArrangement[i] === empt){
        const randomColor = Math.floor(Math.random()*candyColors.length)
        const currColor = candyColors[randomColor]
    
        currentGamepadArrangement[i] = currColor
      }

      if(currentGamepadArrangement[i+width] === empt){
        currentGamepadArrangement[i+width] = currentGamepadArrangement[i]
        currentGamepadArrangement[i] = empt
      }
    }
  }

  const checkForColumnOfFour = () => {
    for(let i=0; i<39; i++){
      const column = [i, i+ width, i+ width*2, i+ width*3]
      const colorToCheck = currentGamepadArrangement[i]
      const isBlank = currentGamepadArrangement[i] === empt

      if( column.every(square => currentGamepadArrangement[square] === colorToCheck)  && !isBlank){
        setScoreDisplay((score)=> score + 4)
        column.forEach(square => currentGamepadArrangement[square] = empt)
        return true
      }
    }
  }

  const checkForColumnOfThree = () => {
      for(let i=0; i<47; i++){
        const column = [i, i+ width, i+ width*2]
        const colorToCheck = currentGamepadArrangement[i]
        const isBlank = currentGamepadArrangement[i] === empt

        if( column.every(square => currentGamepadArrangement[square] === colorToCheck)  && !isBlank){
          setScoreDisplay((score)=> score + 3)
          column.forEach(square => currentGamepadArrangement[square] = empt)
          return true
        }
      }
  }

  const checkForRowOfFour = () => {
    for(let i=0; i<64; i++){
      const row = [i, i+1, i+2, i+4]
      const colorToCheck = currentGamepadArrangement[i]
      const isBlank = currentGamepadArrangement[i] === empt
      const nonValid = [5, 6, 7,13, 14, 15, 21, 23, 22, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]

      if(nonValid.includes(i))  continue

      if( row.every(square => currentGamepadArrangement[square] === colorToCheck)  && !isBlank){
        setScoreDisplay((score)=> score + 4)
        row.forEach(square => currentGamepadArrangement[square] = empt)
        return true
      }
    }
  }

  const checkForRowOfThree = () => {
    for(let i=0; i<64; i++){
      const row = [i, i+1, i+2]
      const colorToCheck = currentGamepadArrangement[i]
      const isBlank = currentGamepadArrangement[i] === empt
      const nonValid = [6, 7, 14, 15, 23, 22, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]

      if(nonValid.includes(i))  continue

      if( row.every(square => currentGamepadArrangement[square] === colorToCheck)  && !isBlank){
        setScoreDisplay((score)=> score + 3)
        row.forEach(square => currentGamepadArrangement[square] = empt)
        return true
      }
    }
}

const dragStart = (e) => {
  // console.log(e.target);
  // console.log("dragStart");
  setDraggedElement(e.target)
}

const dragDrop = (e) => {
  // console.log(e.target);
  // console.log("dragDrop");
  setReplacedElement(e.target)
}

const dragEnd = (e) => {
  // console.log(e.target);
  // console.log("dragEnd");
  
  const squareToReplace = parseInt(ReplacedElement.getAttribute('data-id'))
  const squareDragged = parseInt(DraggedElement.getAttribute('data-id'))

  currentGamepadArrangement[squareDragged] = ReplacedElement.getAttribute('src')
  currentGamepadArrangement[squareToReplace] = DraggedElement.getAttribute('src')

  const check3Row = checkForRowOfThree()
  const check3Column = checkForColumnOfThree()
  const check4Row = checkForRowOfFour()
  const check4column = checkForColumnOfFour()


  if((squareToReplace === squareDragged+1  || squareDragged === squareToReplace+1  ||  squareToReplace === squareDragged-width  ||  squareToReplace===squareDragged+width)  &&  (check3Column || check3Row || check4Row || check4column)){
    // console.log(squareDragged);
    // console.log(squareToReplace);
      setDraggedElement(null)
      setReplacedElement(null)
    
  }
  else{
    currentGamepadArrangement[squareDragged] = DraggedElement.getAttribute('src')
    currentGamepadArrangement[squareToReplace] = ReplacedElement.getAttribute('src')
  }


  console.log(scoreDisplay);

}

  const createGamePad = () =>{

    const gamepadArrangement=[]
  
    for(let i = 0; i< width*width; i++){
      const randomColor = Math.floor(Math.random()*candyColors.length)
      const currColor = candyColors[randomColor]
  
      gamepadArrangement.push(currColor)
    }
    setCurrentGamepadArrangement(gamepadArrangement)
  
  }



  useEffect(() =>{
    createGamePad()
  }, [])

  useEffect( () => {
    const timer = setInterval( () => {
      checkForColumnOfFour()
      checkForColumnOfThree()
      checkForRowOfFour()
      checkForRowOfThree()
      moveDown()
      setCurrentGamepadArrangement([...currentGamepadArrangement])
    }, 100)
    return () => clearInterval(timer)
  }, [checkForColumnOfThree, checkForRowOfThree, checkForColumnOfFour, checkForRowOfFour, moveDown, currentGamepadArrangement])

  // console.log(currentGamepadArrangement)



  return (
    <>
      <div>
        <h1>Match The Emoji</h1>
      </div>
      <div>
        <ScoreBoard score = {scoreDisplay}/>
      </div>    
      <div className='App'>
      <div className='center'>
        <div className='gamepad'>
            
            {currentGamepadArrangement.map((candyColor, index)=>(

                < img
                  key = {index}
                  src={candyColor}
                  alt = {candyColor}
                  data-id = {index}
                  draggable = {true}
                  onDragStart = {dragStart}
                  onDragOver= {(e)=>e.preventDefault()}
                  onDragEnter = {(e)=>e.preventDefault()}
                  onDragLeave = {(e)=>e.preventDefault()}
                  onDrop = {dragDrop}
                  onDragEnd = {dragEnd}
                  
                />
            ))}

        </div>
      </div>
      
    </div>
    </>
  );
}

export default App;
