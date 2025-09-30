import React from 'react';
import PutAdPage, { PostDetailsProps } from "../../features/Putad"

const PutAdDialog: React.FC<PostDetailsProps>  = (props) => {
    return (
        <>
            <PutAdPage {...props}/>
        </>
    )
}

export default PutAdDialog
