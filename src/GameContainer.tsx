"use client";
import { Box, Center, Cylinder, Html, OrbitControls, Stage, Text3D, useTexture } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react";
import { Web3Provider } from "@/Web3Provider";
import ConnectWalletCard from "@/ConnectWalletCard";


export const GameContainer = () => {
  const [addd, s__addd] = useState(null)
  const [counter, s__counter] = useState(0)
  const [score, s__score] = useState(0)
  const $solCard: any = useRef(null)
  const tokenBalance = useMemo(() => {
    if (!$solCard.current) { return 0 }
    return $solCard.current.tokBal
  }, [$solCard.current?.tokBal])
  const callbackConnect = () => {
    setTimeout(() => {
      if (!$solCard.current) { return }
      s__addd($solCard.current.solAddress)
    }, 1000)
  }
  useEffect(() => {
    if (counter > 0) { return }
    s__counter(counter + 1)
  }, [])

  return (<>
    <Web3Provider><>
      <TopMenu />
      <div className=" z-800 mt-4  pos-rel pos-abs top-50p ">
        <div className='tx-shadow-5   tx-lgx  z-900 tx-altfont-5 tx-bold-4 tx-ls-3 block  '>
          <ConnectWalletCard callbackConnect={callbackConnect} ref={$solCard}
            RPC_URL="https://solana-mainnet.g.alchemy.com/v2/KyPv5ltJS3W9NXyKAUwG9OFSxf5HEI4r"
            MY_TOKEN_ADDRESS='8ETRMuisyt8fgtdVFKx2JWSSqtuQxQyCuWEBQJym86Nf'
            MY_USD_ADDRESS='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
          />
        </div>
      </div>
      <div className="  pos-abs"><h1>3D Web Game</h1></div>
      {!!tokenBalance &&
        <div className="pos-abs z-800 right-0 pr-8 bottom-0 mb-100 "><h3>Balance: {tokenBalance}</h3></div>
      }
      <div className="pos-abs z-200" ><h3>Score: {Math.abs(score)}</h3></div>
      <div className="pos-abs z-200"
        style={{ top: "0", left: "0", width: "100%", height: "100%", background: "#AFE8F0" }}
      >
        <Canvas>
          <OrbitControls autoRotate autoRotateSpeed={score} enablePan={false} />
          <Box position={[0, -2, 0]}> <meshStandardMaterial wireframe /> </Box>
          {!!addd && <> <LevelOne tokenBalance={tokenBalance} score={score} s__score={s__score} />  </>}
          {!!$solCard.current && !addd && <> <InitStage $solCard={$solCard} /> </>}
        </Canvas>
      </div>
    </></Web3Provider>
  </>)
}

export const InitStage = ({ $solCard }: any) => {
  const matcapTexture = useTexture('/img/beachmini.jpg');
  const $initCoin: any = useRef(null)
  const [rotVel, s__rotVel] = useState(0.01)
  useFrame(() => {
    if (!$initCoin.current) { return }
    $initCoin.current.rotation.y += rotVel
    $initCoin.current.rotation.x += rotVel / 2.5
    $initCoin.current.position.y = Math.sin(Date.now() / 3000) * 1 + 1.5

    if (rotVel > 0.1) { s__rotVel(rotVel + 0.001) }
    if (rotVel > 0.5) { window.location.reload() }
  })
  return (<>
    <ambientLight intensity={0.25} />
    <group ref={$initCoin}>
      <Box args={[0.15, 0.25, 0.2]} position={[0.15, 0.6, -0.1]}>
        <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ffcc77"} />
      </Box>
      <Box args={[0.15, 0.25, 0.2]} position={[-0.15, 0.6, -0.1]}>
        <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ffcc77"} />
      </Box>
      <Box args={[0.15, 0.25, 0.2]} position={[0.15, -0.7, -0.1]}>
        <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ffcc77"} />
      </Box>
      <Box args={[0.15, 0.25, 0.2]} position={[-0.15, -0.7, -0.1]}>
        <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ffcc77"} />
      </Box>
      <Center position={[0, -0.05, 0]} >
        <Text3D position={[-0.5, -0, 0.05]} font={"./font.json"} size={1.25} >
          {"$"}
          <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ffbb66"} />
        </Text3D>
        <Text3D position={[0.61, -0, -0.05]} font={"./font.json"} rotation={[0, Math.PI, 0]} size={1.2}>
          {"B"}
          <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ffbb66"} />
        </Text3D>
      </Center>
      <Cylinder args={[1, 1, .3]} onClick={() => {
        s__rotVel(0.11)
        $solCard.current.handleToggleConnect()
      }} rotation={[Math.PI / 2, 0, 0]}>
        <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ff9900"} />
      </Cylinder>
    </group>
  </>)
}


export const TokenBalanceDisplay = ({ tokenBalance }: any) => {
  const matcapTexture = useTexture('/img/beachmini.jpg');
  if (!tokenBalance) { return (<></>) }

  return (<>
    <Center>
      <Text3D position={[-0.4, 0, 0.05]} font={"./font.json"} size={0.5} >
        {tokenBalance}
        <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ff9900"} />
      </Text3D>
      <Text3D position={[0.4, 0, -0.05]} font={"./font.json"} rotation={[0, Math.PI, 0]} size={0.5}>
        {tokenBalance}
        <meshMatcapMaterial matcap={matcapTexture} side={2} color={"#ff9900"} />
      </Text3D>
    </Center>
  </>)
}

export const TopMenu = () => {
  return (<>
    <div className="pos-abs left-0 z-500">
      <a href="/" className="opacic-hov--50 opaci-chov--50  pa-4">
        <img src="/img/firelong.png" width={64} className=" pt-4 " />
      </a>
    </div>
    <a className="pos-abs right-0 z-500 pa-2 px-4 block  flex z-900 pointer" href="https://x.com/webpov" target="_blank">
      <img src="/img/x.jpg" width={32} className="opaci-chov--50 bord-r-10 pointer" />
    </a>
  </>)
}

export const LevelOne = ({ score, s__score, tokenBalance }: any) => {
  const matcapTexture = useTexture('/img/beachmini.jpg');
  const MAX_VEL = -0.01
  const [vel, s__vel] = useState(MAX_VEL)
  const [finishCounter, s__finishCounter] = useState(0)
  const $box: any = useRef(null)
  const finishGame = () => { if (score == 0) { s__score(-1) } else { s__score(-score) } }
  const boxClick = () => {
    if (score < 0) { return window.location.reload() }
    s__vel((velocity) => (velocity + 0.04))
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
        s__finishCounter(finishCounter + 1)
      }
    }
    if (vel <= MAX_VEL) { return }
    s__vel(vel - 0.001)
  })
  return (<>
    {score < -7 && <Html center position={[0, 2, 0]}><h1 className="tx-bold-2 nowrap tx-center">You Win!</h1></Html>}
    <group ref={$box} >
      <TokenBalanceDisplay tokenBalance={tokenBalance} />
      <Cylinder args={[0.5, 0.5, 0.25]} onClick={boxClick} rotation={[Math.PI / 2, 0, 0]}>
        <meshMatcapMaterial matcap={matcapTexture} color={`#df${score}000`} />
      </Cylinder>
    </group>
  </>)
}