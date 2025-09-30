import React from 'react'

const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 10H8.01" stroke="#ff780c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 10H12.01" stroke="#ff780c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 10H16.01" stroke="#ff780c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 13V7C21 5.11438 21 4.17157 20.4142 3.58579C19.8284 3 18.8856 3 17 3H7C5.11438 3 4.17157 3 3.58579 3.58579C3 4.17157 3 5.11438 3 7V13C3 14.8856 3 15.8284 3.58579 16.4142C4.17157 17 5.11438 17 7 17H7.5C7.77614 17 8 17.2239 8 17.5V20V20.1499C8 20.5037 8.40137 20.7081 8.6875 20.5L13.0956 17.2941C13.3584 17.103 13.675 17 14 17H17C18.8856 17 19.8284 17 20.4142 16.4142C21 15.8284 21 14.8856 21 13Z" stroke="#ff780c" stroke-width="2" stroke-linejoin="round"></path> </g></svg>
    )
}

export default ChatIcon

export const ChatFilledIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="chat-alt-5" className="icon glyph" fill="#ff780c" {...props}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20,2H4A2,2,0,0,0,2,4V16a2,2,0,0,0,2,2H7v3a1,1,0,0,0,.57.9A.91.91,0,0,0,8,22a1,1,0,0,0,.62-.22L13.35,18H20a2,2,0,0,0,2-2V4A2,2,0,0,0,20,2ZM8,11a1,1,0,1,1,1-1A1,1,0,0,1,8,11Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,12,11Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,16,11Z"></path></g></svg>
    )
}