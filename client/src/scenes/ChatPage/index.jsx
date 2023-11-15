import ChatWidget from '../widgets/ChatWidget'
import { useParams } from 'react-router-dom'
import Navbar from '../NavBar'
import NavbarBottom from '../NavBar/BottomNav'


const ChatPage = () => {
   const {friendId} =  useParams()
  return (
    <div>
    <Navbar />
    <ChatWidget receiverId={friendId} />
    <NavbarBottom/>
    </div>
   
  )
}

export default ChatPage
