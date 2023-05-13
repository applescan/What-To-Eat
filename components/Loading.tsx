import React from 'react'
import Image from 'next/image'

//local import
import LoadingImg from '../public/loading.gif'

const Loading: React.FC = () => {
  return (
    <div className='mx-auto items-center'>
      <Image
        src={LoadingImg}
        height={100}
        width={100}
        loading="lazy"
        alt={"loading"}
      />
      <h1 className='text-xl text-gray-700 font-bold mx-auto pb-14'>Loading...</h1>
    </div>
  )
}

export default Loading