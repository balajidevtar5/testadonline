import { Col, DatePicker, Modal, Row } from 'antd';
import Search from 'antd/es/transfer/search';
import { useState } from 'react';
const TransitionDetailDialog = (props: any) => {
  const { open, onClose } = props;

  const [searchVisible, setSearchVisible] = useState(false);
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };
  const transactions = [
    {
      date: 'Mon, 29 Mar 2016',
      transactions: [
        { name: 'Pay Tm Net Bill', amount: 149.00, time: '22:00', id: '000001234123312222' },
        { name: 'Pay Housing Loan', amount: 1198198.08, time: '12:01', id: '000001234/11' },
        { name: 'Pay Phone Bill', amount: 99.00, time: '15:32', id: '000001234123123123' },
      ],
    },
    {
      date: 'Fri, 1 Feb 2016',
      transactions: [
        { name: 'Master Card', amount: 2198.08, time: '16:00', id: '000001234123123123' },
        { name: 'Pay Car Loan', amount: 2198.08, time: '01:01', id: '000001234123123123' },
        { name: 'Takaful Insurans', amount: 2198.08, time: '14:02', id: '000001234123123123' },
      ],
    },
  ];
  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      onOk={onClose}
      footer={false}
      width={700}
      className='transactionModal'
      title="Transaction details"
    >
      <div className="transaction-container">
        <Row className="d-flex justify-content-start">
          <Col span={6}><DatePicker placeholder="select date" className='mr-5' /></Col>
          <Col span={6}><Search placeholder='search text...' /></Col>
        </Row>
        <div className='trasactionHeight'>
          {transactions.map((transaction, index) => (
            <div key={index} className="transaction-group">-
              <div className='d-flex align-items-center justify-content-center'>
                <div className="date">{transaction.date}</div>
                <div className='dateborder'></div>
              </div>
              {transaction.transactions.map((t, i) => (
                <div key={i} className="transaction-row">
                  <div>
                    <div className="transaction-name">{t.name}</div>
                    <div className="transaction-id">{t.id}</div>
                  </div>
                  <div>
                    <div className="transaction-amount">USD {t.amount.toFixed(2)}</div>
                    <div className="transaction-time">{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default TransitionDetailDialog;