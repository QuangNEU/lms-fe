import { Route, Routes } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './routes'
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <Page />
                  </ProtectedRoute>
                }
              />
            )
          })}
        </Route>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Page />
              }
            />
          );
        })}
      </Routes>
    </>
  )
}

export default App
