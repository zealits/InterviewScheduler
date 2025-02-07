import React from 'react'

function Sidebar() {
  return (
    <div className='bg-gray-100 h-screen w-64'>
        <div className='flex flex-col items-center justify-center h-full'>
            <div className='flex flex-col items-center justify-center'>
                <Link to='/availability'>Availability</Link>

                <Link to='/upcoming-interviews'>Upcoming Interviews</Link>
                <Link to='/profile-update'>Profile Update</Link>
                <Link to='/logout'>Logout</Link>
                    
            </div>
        </div>
    </div>

    
  )
}

export default Sidebar