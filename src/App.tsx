import './App.css'
import EFFA from './pages/effa.tsx'
import IP from './pages/ip.tsx'
import ITM from './pages/itm.tsx'
import ITP from './pages/itp.tsx'
import INFOG from './pages/infog.tsx'
import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router'

const Layout = () => {
  return (
    <div className='app'>
      <div className="layout-menu">
      <NavLink to="/infog">
          Informations générales
        </NavLink>
        <NavLink to="/itp">
          Incapacité Temporaire Personnelle
        </NavLink>
        <NavLink to="/itm">
          Incapacité Temporaire Ménagère
        </NavLink>
        <NavLink to="/effa">
          Efforts Accrus
        </NavLink>
        <NavLink to="/ip">
          Incapacité Permanente
        </NavLink>
      </div>
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<INFOG />} />
          <Route path="ip" element={<IP />} />
          <Route path="effa" element={<EFFA />} />
          <Route path="itm" element={<ITM />} />
          <Route path="infog" element={<INFOG />} />
          <Route path="itp" element={<ITP />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App