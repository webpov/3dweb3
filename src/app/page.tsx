import Image from 'next/image'
import styles from './page.module.css'
import { GameContainer } from '@/GameContainer'

export default function Home() {
  return (
    <main className={`${styles.main} _ddr`}>
      <GameContainer />
    </main>
  )
}
