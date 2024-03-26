"use client";
import { Box, Cylinder, Html, OrbitControls, Stage, useTexture } from "@react-three/drei"  
import { Canvas, useFrame } from "@react-three/fiber"  
import { useEffect, useMemo, useRef, useState } from "react"; 
import { Web3ReactContainer } from "./dom/organism/Web3ReactContainer";
import SolCard from "./dom/organism/SolCard";


export const LevelOne = ({score, s__score}:any) => { 
    const matcapTexture = useTexture('/img/beachmini.jpg');
    const MAX_VEL = -0.01 
    const [vel, s__vel] = useState(MAX_VEL) 
    const [finishCounter, s__finishCounter] = useState(0) 
    const $box:any = useRef(null) 
    const finishGame = () => { if (score == 0) { s__score(-1) } else { s__score(-score) } } 
    const boxClick = () => { 
        if (score < 0) { return window.location.reload() } 
        s__vel((velocity)=>(velocity+0.04)) 
        if (score > 8) { finishGame(); alert("You Win!"); return } 
        s__score(score + 1) 
    } 
    useFrame(() => { 
        if (score < 0) { return } 
        if (!$box.current) { return } 
        $box.current.position.y += vel 
        if ($box.current.position.y < -2 && score >= 0) {
            
            if (finishCounter == 0) {
                alert("You Lose!");
                finishGame()
                s__finishCounter(finishCounter+1)
            }
        } 
        if (vel <= MAX_VEL) { return } 
        s__vel(vel - 0.001) 
    }) 
    return (<> 
        {score < -7 && <Html center  position={[0,2,0]}><h1 className="tx-bold-2 nowrap tx-center">You Win!</h1></Html>} 
        <Cylinder args={[0.5,0.5,0.1]} onClick={boxClick} ref={$box} rotation={[Math.PI/2,0,0]}> 
            {/* <meshStandardMaterial  color={`#${score}0${score/2}000`} />  */}
            
  <meshMatcapMaterial  matcap={matcapTexture} 
      color={`#df${score}000`}
  />
        </Cylinder> 
    </>) 
} 
export const GameContainer = () => { 
    const [addd, s__addd] = useState(null) 
    const [counter, s__counter] = useState(0) 
    const [score, s__score] = useState(0) 
    const $solCard:any = useRef(null)
    const tokenBalance = useMemo(()=>{
        console.log("asdasqweqweqw")
        if (!$solCard.current) { return 0 }
        return $solCard.current.solBal
    },[$solCard.current?.solBal])
    const userAddress = useMemo(()=>{
        console.log("asdasqweqweqw")
        if (!$solCard.current) { return "" }
        return $solCard.current.solAddress
    },[$solCard.current?.solAddress])
     const callbackConnect = () => {
        setTimeout(()=>{
            console.log("callbackConnect", $solCard.current?.solAddress )
            if (!$solCard.current) { return }
            s__addd($solCard.current.solAddress)
        },1000)
    }
    useEffect(()=>{
        if(counter > 0) { return}
        s__counter(counter+1)
    },[])
    return (<> 
      <Web3ReactContainer><>
      <div className="pos-abs left-0 z-500">
        <a href="/" className="opacic-hov--50 opaci-chov--50  pa-4">
            <img src="/img/firecoin.png" width={64}  className=" pt-4 "/>
        </a>

      </div>
            <a className="pos-abs right-0 z-500 pa-2 px-4 block  flex z-900 pointer"  href="https://x.com/webpov" target="_blank">
                <img src="/img/x.jpg" width={32} className="opaci-chov--50 bord-r-10 pointer" />
            </a>
      {/* <div className="pos-abs right-0 z-500">
        <div >
            <a className=" pa-2 px-4 block pos-rel flex z-900 pointer"  href="/">
                <img src="/img/x.jpg" width={32} className="opaci-chov--50 bord-r-10 pointer" />
            </a>
        </div>

      </div> */}
      <div className=" z-800 mt-4  pos-rel pos-abs top-50p ">
            <div className='tx-shadow-5   tx-lgx  z-900 tx-altfont-5 tx-bold-4 tx-ls-3 block  '>
                
                <SolCard callbackConnect={callbackConnect} ref={$solCard}  name='phantom' />
            </div>      
        </div>
        <div className="  pos-abs"><h1>3D Web Game</h1></div> 
        {!!tokenBalance && 
            <div style={{position:"absolute", bottom:"15%"}}><h3>Balance: {tokenBalance}</h3></div> 
        }
        <div className="pos-abs z-200" ><h3>Score: {Math.abs(score)}</h3></div> 
        <div className="pos-abs z-200"  style={{ 
            top:"0", left:"0", width:"100%", height:"100%" ,
                background: "#AFE8F0"
            }}> 
            <Canvas> 
                <OrbitControls autoRotate autoRotateSpeed={score} enablePan={false}  /> 
                <Box position={[0,-2,0]}> <meshStandardMaterial wireframe /> </Box>  
                {!!addd && <>
                <pointLight position={[0, 3, 2]} distance={20} intensity={120} /> 
                <ambientLight intensity={1} /> 
                    <LevelOne score={score} s__score={s__score} /> 
                </>}
                {!!$solCard.current && !addd     && <>
                <InitStage $solCard={$solCard} />
                    {/* <Stage  intensity={0.5} shadows="contact" > */}
                    
{/* </Stage> */}

                </>}
        </Canvas> 
        </div> 
      </></Web3ReactContainer>
      </>) 
}
export const InitStage = ({$solCard}:any) => {
    const matcapTexture = useTexture('/img/beachmini.jpg');
    const $initCoin:any = useRef(null)
    const [rotVel, s__rotVel] = useState(0.01)
    useFrame(() => {
        if (!$initCoin.current) { return }
        $initCoin.current.rotation.z += rotVel
        $initCoin.current.rotation.x += rotVel/2.5
        if (rotVel > 0.1) {
            s__rotVel(rotVel + 0.001)
        }
    })
    return (<>
        <ambientLight intensity={0.25} /> 
  
  <Cylinder ref={$initCoin} args={[1,1,.3]} onClick={()=>{
    s__rotVel(0.11)
    $solCard.current.handleToggleConnect()
  }} rotation={[Math.PI/2,0,0]}> 
      {/* <meshStandardMaterial  color={`#fff`} />  */}
      
  <meshMatcapMaterial  matcap={matcapTexture} side={2}
      color={"#ff9900"}  
  />
  </Cylinder> 
    </>)
}