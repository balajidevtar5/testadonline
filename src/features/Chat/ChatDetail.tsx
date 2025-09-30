"use client"

import type React from "react"
import { useContext, useEffect, useRef, useState } from "react"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CallIcon from "@mui/icons-material/Call"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Avatar, Input, Popconfirm, Popover, Tabs, Tag, message } from "antd"
import chatStyle from './ChatStyle.module.scss';
import SendIcon from '@mui/icons-material/Send';
import { changeDateFormat, timeFormat } from "../../libs/helper"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/reducer"
import CheckIcon from '@mui/icons-material/Check';
import { chatDetailsAppendMessage, chatDetailsReset } from "../../redux/slices/chatDetail"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { API_ENDPOINT_PROFILE, CLIENT_URL, FIREBASE_REALTIME_CHAT_TOKEN, firebaseConfig } from "../../libs/constant"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import BlockIcon from '@mui/icons-material/Block';
import { fetchchatList } from "../../redux/slices/chat";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import ReportPost from "../../dialog/postDetails/resportad"
import { LayoutContext } from "../../components/layout/LayoutContext"
import { t } from "i18next"
import { getDatabase, ref, onChildAdded, serverTimestamp, push, set, off, remove } from "firebase/database";
import { getApp, initializeApp } from "firebase/app";
import { BlockUnblockUser, GetMessageCount, IsSeenMessage, ReportUser, SaveChat } from "../../redux/services/chat.api"
import { updateBlockedStatus, updateChatId } from "../../redux/slices/postSlice"
import { AccessTimeOutlined, Padding } from "@mui/icons-material"
import { CircularProgress } from "@mui/material"
import { ReactComponent as DoubleTickIcon } from "../../assets/icons/DoubleTickIcon.svg";
import { ReactComponent as SingleTickIcon } from "../../assets/icons/SingleTickIcon.svg";

const app = initializeApp(firebaseConfig);
const db: any = getDatabase(app);
interface ChatDetailProps {
  isMobile?:any,
  chat: any
  onBack: () => void
}

const ChatDetail: React.FC<ChatDetailProps> = ({isMobile, chat, onBack }) => {
  const { isDarkMode,setMessageCount,messageCount } = useContext(LayoutContext);
  const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
  const { data: chatData , isLoading: chatDetailsLoading} = useSelector((state: RootState) => state.chatDetail);
  const { data: chatList } = useSelector((state: any) => state.chat);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch: any = useDispatch();
  const [inputMsg, setInputMsg] = useState('');
  const [chatId, setChatId] = useState(chat?.chatid);
  const [isBlocked, setIsBlocked] = useState(chat.isblocked);
  const [isBlockedByLoginUser, setIsBlockedByLoginUser] = useState(false);
  const [isReportConfirmation, setIsReportConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  const postId = location.state?.fromHome ? chat?.id : chat.postid
  const chatRef = useRef(null);
 useEffect(() => {
  const chatEl = chatRef.current;
  if (chatEl) {
    chatEl.scrollTop = chatEl.scrollHeight;
  }
}, [chatData]);
  
  const handleSendMsg = async () => {
    try {
      setIsLoadingMsg(true);
      if (inputMsg.trim() === "") return;
      

      const payload = {
        chatId: chatId ?? 0,
        message: inputMsg,
        receiverId: chat.userid,
        postId: postId
      }
      setCurrentMessage(inputMsg);
      setInputMsg(null);
      const response = await SaveChat(payload);
      if (!response?.success) {
        setIsLoadingMsg(false);
        return message.error('Something went wrong please try again.', 3);
        
      }
      const newMessage = {
        // id: chatData?.data && chatData?.data[chatData?.data?.length - 1]?.id ? chatData?.data[chatData?.data?.length - 1]?.id + 1 : 1,
        canunblock: 0,
        sender: loginUserData.data[0].id,
        receiver: chat.userid,
        message: inputMsg,
        datetime: new Date().toISOString(),
        postid: postId,
        isseen: 0,
        image: location?.state?.fromHome && chat?.image?.length > 0 ? chat?.image[0]?.adsimage : chat?.image,
        isblocked: isBlocked,
        mobileno: chat?.mobileno,
        name: chat?.username,
        title: chat?.title,
        messageid: response?.data?.MessageId,
        secretToken: FIREBASE_REALTIME_CHAT_TOKEN
      };

      const chatIdValue = chat.chatid ? chat.chatid : response.data?.ChatId
      setChatId(chatIdValue);
      if (location?.state?.fromHome && !location?.state?.chat?.chatid) {
        const chatPayload = {
          chatId: chatIdValue,
          postId: postId,
        }
        dispatch(updateChatId(chatPayload));
      }
      
      if (!isBlocked && chatIdValue) {
        const newMessageRef = push(ref(db, `chats/${chatIdValue}/messages`));
        set(newMessageRef, newMessage).then(() => {
          console.log("✅ Message sent successfully.");
        })
          .catch((error) => {
            console.error("❌ Error writing message:", error);
          });
      }
      setIsLoadingMsg(false);

    } catch (error) {
      console.log(error, 'error');
      setIsLoadingMsg(false);
    }
  };

  const handleReport = async (reason) => {
    try {
      setIsLoading(true);
      const response = await ReportUser({ UserId: chat?.userid, Reason: reason });
      if (response.success) {
        setIsLoading(false);
        message.success(response.message);
        setIsReportConfirmation(false);
      }
    } catch (error) {
      console.log(error, 'error');
      setIsLoading(false);
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMsg();
    }
  };

  
  const handleBlockUnBlock = async () => {
    try {
      const payload = {
        userId: chat?.userid
      }
      const response = await BlockUnblockUser(payload);
      if (response.success) {
        dispatch(fetchchatList());
        setIsBlocked(!isBlocked);
        setIsBlockedByLoginUser(true);
        dispatch(updateBlockedStatus({ postId, isBlocked: !isBlocked }));
      }
    } catch (error) {
      console.log(error, 'error');
    }
  }
  useEffect(() => {
    setIsBlocked(chat.isblocked);
    setChatId(chat?.chatid);
  }, [chat]);

   const fetchMessageCount = async() =>{
            const response = await GetMessageCount();
            if(response.success){
              setMessageCount(response?.data[0]?.messagecount || 0)
            }
          }
  useEffect(() => {

    const messagesRef = ref(db, `chats/${chatId}/messages`);

    const unsubscribe = onChildAdded(messagesRef, async(snapshot) => {
       const messageId = snapshot.key;
      const newMsg = snapshot.val();
    
      const alreadyExists = chatData?.data?.some((msg) => msg.messageid === newMsg.messageid);
      if (!alreadyExists) {
        dispatch(chatDetailsAppendMessage(newMsg));
        const payload = {
          ChatId : chatId
        }
        const respose = await IsSeenMessage(payload)
        if(respose.success){
          fetchMessageCount()
        }
       const messageRefValue = ref(db, `chats/${chatId}/messages/${messageId}`);
       await remove(messageRefValue);
      }
    });

    return () => {
      off(messagesRef);
    };
  }, [chatData?.data, chatId]);


  useEffect(() => {
      const handlePop = () => {
       onBack()
      };
  
      window.addEventListener("popstate", handlePop);
      return () => {
        window.removeEventListener("popstate", handlePop);
      };
    }, []);
  useEffect(() => {
    return () => {
      dispatch(chatDetailsReset());
    }
  }, [])
 
 
  const DoubleTick = ({ seen }) => {
    return seen ? <DoubleTickIcon className="tick-icon" style={{ color: '#34B7F1' }} /> : <SingleTickIcon className="tick-icon" />;
};

  return (
    <>
    {chatDetailsLoading && chatData?.data?.length === 0 && (
      <CircularProgress className="position-absolute top-1/2 left-1/2 " size={24}/>
    )}
      <div className={isDarkMode ? chatStyle.darkchartDetail : chatStyle.chatDetail}>
        <div className="sticky-header">
          <div className={chatStyle.chatDetailHeader}>
            {
              isMobile &&
            <ArrowBackIcon className={chatStyle.backIcon} onClick={onBack} />

            }
            <div className={chatStyle.userInfo}>
              <div className={chatStyle.userDetails}>
                <div  className={chatStyle.userName}>
                  {chat.username ?? "AdOnline user"}
                </div>
                {isBlocked ? <BlockIcon className="text-red" /> : null}
              </div>
            </div>
            <div className={chatStyle.headerActions}>
              {chat?.mobileno && !isBlocked && (
                <CallIcon className={chatStyle.actionIcon} onClick={() => { window.location.href = `tel:${chat?.mobileno}`; }} />
              )}
              <Popover className={chatStyle.chatPopover} content={
                <div className="d-flex flex-col">
                  <div className="d-flex align-items-center cursor-pointer gap-6  pt-8" onClick={() => setIsReportConfirmation(true)}>
                    <ReportGmailerrorredOutlinedIcon className=" text-red" sx={{ fontSize: "20px" }} />{t("General.Chat.Report user")}</div>
                  <Popconfirm placement="bottomLeft" title={`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`} okText="Yes" cancelText="No" onConfirm={() => handleBlockUnBlock()} >
                    {isBlocked && (chat?.canunblock || isBlockedByLoginUser) ? <div className="d-flex align-items-center cursor-pointer gap-6 pt-8"><LockOpenOutlinedIcon className="text-green" sx={{ fontSize: "18px" }} />{t("General.Chat.Unblock user")}</div> :
                      !isBlocked && <div className="d-flex align-items-center cursor-pointer gap-6 pt-8"><BlockIcon className="text-red" sx={{ fontSize: "18px" }} />{t("General.Chat.Block user")}</div>
                    }
                  </Popconfirm>
                </div>
              }
                trigger="hover"
                placement="bottomLeft">
                <MoreVertIcon className={chatStyle.actionIcon} onClick={(e) => e.stopPropagation()} />
              </Popover>
            </div>
          </div>

          <div className={chatStyle.postInfo}>
            <div onClick={() => navigate(`/?postId=${postId}`)} className="d-flex align-items-center justify-content-start">
              {location?.state?.fromHome && chat?.image?.length > 0 && chat?.image[0]?.adsimage &&
                <div className={chatStyle.chatAvatar}><img src={chat?.image[0]?.adsimage} /> </div>
              }
              {!location?.state?.fromHome && chat?.image && <div className={chatStyle.chatAvatar}>
                <img src={`${API_ENDPOINT_PROFILE}/${chat?.image?.replace(/^~/, '')}`} />
              </div>}
              {chat?.image?.length === 0 || !chat?.image && (
                <div className={chatStyle.chatAvatar}>
                  <Avatar className="text-white text-uppercase" size="large">
                    {chat.name?.split(' ')[0].charAt(0) + chat.name?.split(' ')[1].charAt(0)}
                  </Avatar>
                </div>
              )}
              <span className={chatStyle.postTitle}>{chat.title}</span>
            </div>
            {chat.price > 0 && (
              <span className={chatStyle.postValue}>₹{chat.price}</span>
            )}
          </div>
        </div>

      <div className={chatStyle.chatContainer}>
  {/* Messages Scrollable Area */}
  <div ref={chatRef} className={chatStyle.chatMessages}>
    <div className={chatStyle.dateDivider}>Today</div>
    {chatData?.data?.map((history, index) => (
      <div key={`history-${index}`}>
        <div
          className={`${chatStyle.message} ${
            history.sender === loginUserData?.data[0]?.id
              ? chatStyle.sent
              : chatStyle.received
          }`}
        >
          <div className={chatStyle.messageContent} style={{ fontSize: "15px" }}>
            {history.message}
            <div className={chatStyle.messageTime}>
              <div className="d-flex flex-warp">
                <div className="d-flex pt-5">
                  <span style={{ fontSize: "12px", marginTop: "3px" }}>
                    {timeFormat(new Date(history.datetime))}
                  </span>
                  {loginUserData?.data?.[0]?.id &&
                    history.sender === loginUserData?.data[0]?.id && (
                      <DoubleTick seen={history.isseen} />
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}

    {isLoadingMsg && currentMessage && (
      <div className={`${chatStyle.message} ${chatStyle.sent}`}>
        <div className={chatStyle.messageContent}>
          {currentMessage}
          <div className={chatStyle.messageTime}>
            {timeFormat(new Date())}
            <AccessTimeOutlined className="text-gray-600 h-15" />
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Fixed Input Box */}
  {!isBlocked && (
    <div
      className={
        isDarkMode
          ? chatStyle.darkmessageInputContainer
          : chatStyle.messageInputContainer
      }
    >
      <div className={chatStyle.inputWrapper}>
        <Input
          type="text"
          value={inputMsg}
          placeholder={t("General.Chat.Type here")}
          className={chatStyle.messageInput}
          autoFocus
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <SendIcon
          className={`${chatStyle.inputIcon} ${chatStyle.micIcon}`}
          onClick={handleSendMsg}
        />
      </div>
    </div>
  )}
</div>

      </div>

      {/* 
      <div className={chatStyle.bottomSection}>
        <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} className={chatStyle.detailTabs} />

        {activeTab === "2" && (
          <div className={chatStyle.offerSection}>
            <div className={chatStyle.offerChips}>
              {offerAmounts.map((amount, index) => (
                <Tag
                  key={index}
                  className={`${chatStyle.offerChip} ${selectedOffer === amount ? chatStyle.selected : ""}`}
                  onClick={() => setSelectedOffer(amount)}
                >
                  {amount}
                </Tag>
              ))}
            </div>

            <div className={chatStyle.selectedOffer}>{selectedOffer}</div>

            <div className={chatStyle.offerActions}>
              <div className={chatStyle.offerInfo}>
                <div className={chatStyle.offerBadge}>Very good offer!</div>
                <div className={chatStyle.offerSubtitle}>High chances of seller's response.</div>
              </div>
              <button className={chatStyle.sendButton}>Send</button>
            </div>
          </div>
        )}
      </div> */}
      {/* <div className={chatStyle.typeMsgContainer}>
        <textarea
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your inputMsg..."
          className={chatStyle.textarea}
          rows={1}
        />
        <SendIcon onClick={handleSendMsg} />
      </div> */}
     
      {isReportConfirmation && (
        <ReportPost
          deleteMessage={
            <span style={{ color: isDarkMode ? "#fff" : "#000" }}>
              {t(`General.Are you sure you want to report this user?`)}
            </span>
          }
          open={isReportConfirmation}
          isLoading={isLoading}
          handleClose={() => setIsReportConfirmation(false)}
          handleReportClick={(response) => { handleReport(response) }}
          reportUser={true}
        />
      )}
    </>
  )
}

export default ChatDetail
