"use client"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SearchIcon from "@mui/icons-material/Search"
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { LayoutContext } from "../../components/layout/LayoutContext"
import { fetchChatDetailData } from "../../redux/slices/chatDetail"
import ChatDetail from "./ChatDetail"
import ChatList from "./ChatList"
import chatStyle from './ChatStyle.module.scss'
import './ChatStyle.module.scss' // Import the SCSS file
import { updateChatPreview } from "../../redux/slices/chat"
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import { GetMessageCount, IsSeenMessage } from "../../redux/services/chat.api";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode, setFilterValue, filterValue,setMessageCount } = useContext(LayoutContext);
  const { setActiveTab, setShouldHideBottomNavigation, shouldHideBottomNavigation } = useContext(LayoutContext);
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const ChatCategory = [
    {
      label: "ALL",
      key: "1",
    },
    {
      label: "BUYING",
      key: "2",
    },
    {
      label: "SELLING",
      key: "3",
    },
  ]

  const quickFilters = [
    { label: "All", active: true },
    { label: "Meeting", active: false },
    { label: "Unread", active: false },
    { label: "Important", active: false },
    { label: "Elite B...", active: false },
  ]

  useEffect(() => {
    if (selectedChat?.chatid) {
      const payload = {
        chatId: selectedChat?.chatid,
        pageNo: 1
      }
      dispatch(fetchChatDetailData(payload));
    } else if (location?.state?.chat?.chatid) {
      const payload = {
        chatId: location?.state?.chat?.chatid,
        pageNo: 1
      }
      dispatch(fetchChatDetailData(payload));
    }
  }, [selectedChat, location?.state?.fromHome])

     const fetchMessageCount = async() =>{
          const response = await GetMessageCount();
          if(response.success){
            setMessageCount(response?.data[0]?.messagecount || 0)
          }
        }
  const ChatSelect = async(d) => {
    const chatIdValue = d.chatid;
    dispatch(
      updateChatPreview({
        chatIdValue,
        lastmessage: d?.lastmessage,
        isseen: 1,
        lastmessagetime:d?.lastmessagetime
      })
    )
      const payload = {
          ChatId : d.chatid
        }
    const respose = await IsSeenMessage(payload)
            if(respose.success){
              fetchMessageCount()
            }
  }

 
  const handleChatSelect = (chat: any) => {
    setSelectedChat(chat);
    setShouldHideBottomNavigation(true);
    ChatSelect(chat);
    
     navigate('/chat', {
        state: {
          chat: chat,
          fromHome: false,
        }
      });
  
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setShouldHideBottomNavigation(false);
  };

   useEffect(() => {
      // When back is clicked, reset fromHome to false
      const chat = location.state?.chat;
      const handlePop = () => {
        setSelectedChat(null);
      setShouldHideBottomNavigation(true);
      ChatSelect(chat);
        navigate("/chat", {
          replace: true,
          state: {
            ...location.state,
            fromHome: false,
          },
        });
      };
  
      window.addEventListener("popstate", handlePop);
      return () => {
        window.removeEventListener("popstate", handlePop);
      };
    }, [location.state, navigate]);

  // Mobile layout (existing behavior)
  if (isMobile) {
    // Handle direct navigation from home on mobile
    if (selectedChat) {
      return <ChatDetail isMobile={isMobile} chat={selectedChat || location?.state?.chat} onBack={handleBackToList} />
    }

    if (location?.state?.fromHome) {
      return <ChatDetail isMobile={isMobile} chat={location?.state?.chat} onBack={() => {
        window.history.back();
        setShouldHideBottomNavigation(false);
      }} />
    }

    return (
      <div className={`${chatStyle.chatPage} notification-page`}>
        <div className={`${isDarkMode ? chatStyle.darkchatHeader : chatStyle.chatHeader} header-bar pb-15`}>
          <div className="d-flex align-items-center">
            <ArrowBackIcon className={chatStyle.backIcon} onClick={() => { setActiveTab(1); window.history.back() }} />
            <h2 className={chatStyle.chatTitle}>{t("General.Chat.Chat")}</h2>
          </div>
          <div className={chatStyle.headerIcons}>
            {/*<SearchIcon className={chatStyle.headerIcon} />*/}
            {/* <MoreVertIcon className={chatStyle.headerIcon} /> */}
          </div>
        </div>

        <div className="container py-4">
          <ChatList onChatSelect={handleChatSelect} />
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <>
    <Header />
    <div className={`chat-desktop-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Left Sidebar - Chat List */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div className="chat-sidebar-title">
            <ChatIcon />
            {t("General.Chat.Chat")}
          </div>
          <div className="chat-sidebar-actions">
            <SearchIcon />
            <MoreVertIcon />
          </div>
        </div>
        
        <div className="chat-list-container">
          <ChatList 
            onChatSelect={handleChatSelect} 
          />
        </div>
      </div>

      {/* Right Panel - Chat Details */}
      <div className="chat-main-panel">
        {selectedChat || location?.state?.fromHome ? (
          <ChatDetail 
          isMobile={isMobile}
            chat={selectedChat || location?.state?.chat} 
            onBack={handleBackToList} 
          />
        ) : (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">
              <ChatIcon sx={{ width: 120, height: 120, color: isDarkMode ? '#374151' : '#e5e7eb' }} />
            </div>
            <h2>Welcome to {t("General.Chat.Chat")}</h2>
            <p>Select a conversation from the sidebar to start messaging</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ChatPage