import ChatRoom from '@/components/ChatRoom'
import Contacts from '@/components/Contacts'

export const Homepage = () => {
  return (
    <div className='flex h-screen w-screen'>
        <Contacts/>
        <ChatRoom/>
    </div>
  )
}
