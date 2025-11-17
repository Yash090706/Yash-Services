import React from 'react'
// import Header from '../Components/Header'

const Home = () => {
  return (
    <div className='bg-slate-100'>
      {/* <Header/>   */}
      <div>
        <h1 className="text-center mt-7 font-bold text-2xl">WELCOME TO YASH SERVICE PROVIDERS</h1></div>
      <div>
        <ul className="flex gap-2 bg-amber-500 mt-5 p-3 ">
          <li className="w-[500px] h-[300px] ml-5 rounded-lg bg-amber-50">Electrician</li>
          <li>Plumber</li>

        </ul>
        <ul className="flex gap-2">
          <li>Carpenter</li>
          <li>Painter</li>
        </ul>
      </div>
      
    </div>
  )
}

export default Home
