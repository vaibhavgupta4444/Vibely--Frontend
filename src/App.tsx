import { Route, Routes} from 'react-router-dom'
import Signin from './pages/Signin'
import { Homepage } from './pages/Homepage'

const App = () => {
  return (
    <Routes>
      <Route path='/signin' element={<Signin/>}></Route>
      <Route path='/chat-room' element={<Homepage/>}></Route>
    </Routes>
  )
}

export default App