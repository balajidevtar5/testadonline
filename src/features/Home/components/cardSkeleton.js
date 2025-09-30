import React from 'react';
import { Skeleton } from 'antd';
const CardSkeleton = ({ number }) => {
    return (
        Array(number)
            .fill(0)
            .map((_, index) => (
                <div className='card'>
                    <div className='card-content p-10 position-relative'>
                        <div className='hide-svg'>
                            <Skeleton.Input active size="small" style={{
                                width: '100%',
                                minHeight: '15px',
                                maxHeight: '15px',
                                marginBottom: '5px'
                            }} />
                            <Skeleton.Node
                                loading={true}
                                key={index}
                                active={true}
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    maxHeight: '200px',
                                    marginBottom: '5px'
                                }}
                            />
                        </div>
                        <div className='d-flex align-items-center gap contact-button-skeleton'>
                            {Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <Skeleton.Button
                                        loading={true}
                                        key={index}
                                        active={true}
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            ))
    )
}

export default CardSkeleton