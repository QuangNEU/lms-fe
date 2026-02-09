import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './routes'
import HomeLayout from './components/Layouts/HomeLayout'

function App() {

  return (
    <>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          const Layout = route.layout;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}

        {privateRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = HomeLayout;
          if (route.layout) {
            Layout = route.layout;
          }
          else if (route.layout == null) {
            Layout = Fragment;
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout >
                  <Page />
                </Layout>
              }
            />
          )
        })}
      </Routes>
    </>
  )
}

export default App
