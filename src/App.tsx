import { Character } from './components/Character'
import { Spawn } from './components/Spawn'

export default function App() {
   return (
      <div className='ns_system'>
         <Spawn />
         <Character />
      </div>
   )
}
