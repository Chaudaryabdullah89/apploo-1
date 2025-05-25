import React from 'react';

const Title = ({text1,text2}) => {

  return (
    <div className=' items-center flexx justify-center gap-2 mb-3'>
        <p className='text-grey'>{text1} <span className='text-black font-bold text-grey-700 font-medium'>{text2}</span></p>
        <p className="w-8  h-[2px]  bg-grey-500"></p>
    </div>
  )
}

export default Title