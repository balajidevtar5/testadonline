"use client"

import BlockIcon from '@mui/icons-material/Block';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Avatar, Popconfirm, Popover } from "antd";
import { t } from 'i18next';
import type React from "react";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoDataImage from "../../assets/images/NoDataImage.jpg";
import { LayoutContext } from "../../components/layout/LayoutContext";
import { API_ENDPOINT_PROFILE, firebaseConfig } from "../../libs/constant";
import { changeDateFormat } from "../../libs/helper";
import { BlockUnblockUser, DeleteChat } from "../../redux/services/chat.api";
import { fetchchatList, updateChatPreview } from "../../redux/slices/chat";
import { updateBlockedStatus } from '../../redux/slices/postSlice';
import chatStyle from './ChatStyle.module.scss';
import { getDatabase, off, onChildAdded, ref, remove } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { useTranslation } from "react-i18next";

interface ChatListProps {
    onChatSelect: (chat: any) => void
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
    const dispatch: any = useDispatch();
    const { isDarkMode } = useContext(LayoutContext);
    const { data: chatList } = useSelector((state: any) => state.chat);
    const app = initializeApp(firebaseConfig);
    const db: any = getDatabase(app);
    const { t } = useTranslation();
    const handleBlockUnBlock = async (chat: any) => {
        try {
            const payload = {
                userId: chat?.userid
            }
            const response = await BlockUnblockUser(payload);
            if (response.success) {
                dispatch(fetchchatList());
                dispatch(updateBlockedStatus({ postId: chat?.postid, isBlocked: !chat?.isblocked }));
            }
        } catch (error) {
            console.log(error, 'error');
        }
    }
    const deleteFirebaseChat = async (chatId) => {
        const chatRef = ref(db, `chats/${chatId}/messages`);
        await remove(chatRef);
    };

    const onDeleteChat = async (chat: any) => {
        try {
            const payload = {
                chatId: chat?.chatid,
            };

            const response = await DeleteChat(payload);
            if (response.success) {
                dispatch(fetchchatList());
                await deleteFirebaseChat(chat?.chatid);
            }
        } catch (error) {
            console.log(error, 'error');
        }
    };

    useEffect(() => {
        if (chatList?.data?.length > 0) return;
        dispatch(fetchchatList());
        
    }, [])


useEffect(() => {
    const unsubscribes = [];
      if (!chatList?.data || chatList.data.length === 0) return;

    // Store listener start time in ISO string format
    const startTime = new Date().toISOString(); // e.g., "2025-08-04T17:41:15.023Z"

    chatList?.data?.forEach((elm) => {
        const messagesRef = ref(db, `chats/${elm.chatid}/messages`);

        const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
            const newMessage = snapshot.val();
            const chatIdValue = elm?.chatid;
            const msgTime = new Date(newMessage.datetime).toISOString(); // convert to comparable format


            // Only process messages created after listener start
            if (newMessage && msgTime > startTime) {
                dispatch(
                    updateChatPreview({
                        chatIdValue,
                        lastmessage: newMessage?.message,
                        isseen: 0,
                        lastmessagetime:msgTime
                    })
                );
               
            }
        });

        unsubscribes.push(() => off(messagesRef));
    });

    return () => {
        unsubscribes.forEach((unsub) => unsub());
    };
}, [JSON.stringify(chatList?.data?.map((c) => c.chatid))]);



    return (
        // className={`${isDarkMode ? chatStyle.darkchatList : chatStyle.chatList}`}
        chatList?.data?.length === 0 ?
            <div className='noChatFound'>
                <img src={NoDataImage} alt='no data found' width="250" />
                <p className="text-center mt-5">{t("General.No data found")}</p>
            </div>
            : <div className={isDarkMode ? chatStyle.darkchatList : chatStyle.chatList} style={{ marginBottom: '60px' }}>
                {chatList?.data?.map((chat, index) => (
                    <div key={`chatList-${index}`} className={chatStyle.chatItem} onClick={() => onChatSelect(chat)}>
                        {chat.image ? (
                            <div className={chatStyle.chatAvatar}>
                                <img src={`${API_ENDPOINT_PROFILE}/${chat?.image?.replace(/^~/, '')}`} />
                            </div>
                        ) : <div className={chatStyle.chatAvatar}>
                            <Avatar className="text-white text-uppercase" size="large">
                                {chat.username ? chat.username?.split(' ')[0].charAt(0) + chat.username?.split(' ')[1].charAt(0) : "AU"}
                            </Avatar>
                        </div>}

                        <div className={chatStyle.chatContent}>
                            <div className={chatStyle.chatHeaderRow}>
                                <div className={chatStyle.chatName}>
                                    {chat.username ?? "AdOnline User"}
                                    {chat?.isblocked ? <BlockIcon className="text-red" /> : null}
                                </div>

                                <div className={chatStyle.chatTime}>{changeDateFormat(chat.lastmessagetime)}</div>
                                <div className={chatStyle.chatPopover} onClick={(e) => e.stopPropagation()}>
                                    <Popover className={chatStyle.chatPopover}
                                        content={
                                            <>
                                                <Popconfirm placement="bottomLeft" title={`Are you sure you want to delete this chat?`} okText="Yes" cancelText="No" onConfirm={() => onDeleteChat(chat)} >
                                                    <div className="d-flex align-items-center cursor-pointer gap-2">
                                                        <DeleteOutlineIcon className="text-danger" />{t("General.Chat.Delete chat")}
                                                    </div>
                                                </Popconfirm>

                                                <Popconfirm placement="bottomLeft" title={`Are you sure you want to ${chat?.isblocked ? 'unblock' : 'block'} this user?`} okText="Yes" cancelText="No" onConfirm={() => handleBlockUnBlock(chat)} >
                                                    <div className="ml-3">
                                                        {chat?.isblocked ? <div className="d-flex align-items-center cursor-pointer gap-6 pt-8"><LockOpenOutlinedIcon className="text-green" sx={{ fontSize: "18px" }} />{t("General.Chat.Unblock user")}</div> :
                                                            <div className="d-flex align-items-center cursor-pointer gap-6 pt-8"><BlockIcon className="text-red mr-2" sx={{ fontSize: "18px" }} />{t("General.Chat.Block user")}</div>
                                                        }
                                                    </div>
                                                </Popconfirm>
                                            </>
                                        } trigger="hover" placement="bottomLeft">
                                        <MoreVertIcon className={chatStyle.chatMenu} />
                                    </Popover>
                                </div>
                            </div>
                            <div className={chatStyle.chatMessage}>{chat.title}</div>
                            <div
                                className={`${chatStyle.chatSubMessage} ${chat.isseen === 0 ? chatStyle.unreadMessage : ""
                                    }`}
                            >
                                {chat.lastmessage}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    )
}

export default ChatList
