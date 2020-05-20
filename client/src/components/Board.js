import React from 'react';
import { Row } from 'antd';
import Card from './Card';
import 'antd/dist/antd.css';
import '../style/Home.css';

export default class Board extends React.Component {
  render() {
    //let cardRow = this.state.cards.map((card, index) => <Card key={index} rank={card.rank} suit={card.suit} set={card.set} />);

    return (
      <Row className="cardrow">
        {this.props.cards.map((item, index) => (
          <Card type="board" suit={item.suit} rank={item.rank} set={item.set} />
        ))}
      </Row>
    );
  }
}
