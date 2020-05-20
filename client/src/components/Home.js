import React from 'react';
import { Row, Col, Tabs } from 'antd';
import 'antd/dist/antd.css';
import '../style/Home.css';
import GameForm from './GameForm.js';
import logo from '../lit-logo.png';

const { TabPane } = Tabs;

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      play: false,
    };
  }

  render() {
    return (
      <Row className="bg" align="middle" justify="center">
        <img
          className="homeImg"
          src={logo}
          alt="Literature Logo"
          style={{ marginBottom: '10vh' }}
        />
        <Row className="homeRow">
          <Col className="homeCol" sm={12} align="right">
            <div align="left" className="panel homePanel">
              <Row
                justify="center"
                align="middle"
                style={{ flexDirection: 'column' }}
              >
                <h2 style={{ marginTop: '2vh' }}>Get Started</h2>
                <Tabs defaultActiveKey="1" style={{ width: '75%' }}>
                  <TabPane tab="Join Game" key="1">
                    {
                      <GameForm
                        assign={this.props.assign}
                        text="Join Game"
                        socket={this.props.socket}
                      />
                    }
                  </TabPane>
                  <TabPane tab="Create Game" key="2">
                    {
                      <GameForm
                        assign={this.props.assign}
                        text="Create Game"
                        socket={this.props.socket}
                      />
                    }
                  </TabPane>
                </Tabs>
              </Row>
            </div>
          </Col>
          <Col className="homeCol" sm={12}>
            <div className="panel homePanel">
              <Row
                justify="center"
                align="middle"
                style={{
                  flexDirection: 'column',
                }}
              >
                <h2 style={{ marginTop: '2vh' }}>Instructions</h2>
                <Tabs defaultActiveKey="1" style={{ width: '75%' }}>
                  <TabPane
                    tab="Setup"
                    key="1"
                    style={{ height: '170px', overflowY: 'scroll' }}
                  >
                    <p style={{ marginBottom: '3px' }}>
                      <b>Players:</b> 6, 8, or 10
                    </p>
                    <p style={{ marginBottom: '3px' }}>
                      <b>Deck:</b> 52 Card Deck + 2 Jokers
                    </p>
                    <p>
                      Literature, or Fish, is a strategic turn-based card game.
                      The game is comprised of two teams whose objective is to
                      win 5 sets. The game progresses when players ask for cards
                      and declare sets. Players must keep track of transactions,
                      as only the most recent transaction is displayed in the
                      log.
                    </p>
                  </TabPane>
                  <TabPane
                    tab="Sets"
                    key="2"
                    style={{ height: '170px', overflowY: 'scroll' }}
                  >
                    <p>
                      <b>Sets:</b> There are 9 sets in the game. "Low" sets are
                      comprised of ranks 2-7 of a suit and "High" sets are
                      comprised of ranks 9-A of a suit. The last set is
                      comprised of all cards of rank 8 and the two jokers.
                    </p>
                  </TabPane>
                  <TabPane
                    tab="Ask"
                    key="3"
                    style={{ height: '170px', overflowY: 'scroll' }}
                  >
                    <p style={{ marginBottom: '3px' }}>
                      <b>Ask:</b> On a players turn, they can ask a player of
                      the opposite team whether or not they have a certain card.
                      If they have the card, the card is transferred to the
                      players hand, and it remains their turn. Otherwise, the
                      turn is transferred to the player that was asked.
                    </p>
                    <p>
                      Note: A player may only ask for a card if they possess
                      another card from the same set. Also, a player may not ask
                      for a card that they already possess.
                    </p>
                  </TabPane>
                  <TabPane
                    tab="Declare"
                    key="4"
                    style={{ height: '170px', overflowY: 'scroll' }}
                  >
                    <p style={{ marginBottom: '3px' }}>
                      <b>Declare:</b> On a player's turn, they can choose to
                      declare a set if they believe that all cards in a certain
                      set are posessed by members of their team. When declaring,
                      a player must correctly state where among their teammates
                      all the cards in the chosen set are located. Keep in mind
                      that during the game players will not be able to discuss
                      their hands with any other player, so they must rely on
                      their memory.
                    </p>
                    <p style={{ marginBottom: '3px' }}>
                      If a player declares correctly, all the cards in the
                      declared set get taken off the board and they win a point
                      for their team. Otherwise, the point goes to the other
                      team.
                    </p>
                    <p>
                      After declaring correctly, a player may also choose to
                      transfer their turn to a teammate.
                    </p>
                  </TabPane>
                </Tabs>
              </Row>
            </div>
          </Col>
          <div className="footerRow">
            <span className="footer-info">
              Made with &#10084;by{' '}
              <a
                href="https://www.linkedin.com/in/praneethalla/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Praneeth Alla
              </a>
              ,{' '}
              <a
                href="https://www.linkedin.com/in/tirthakharel/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tirtha Kharel
              </a>
              ,{' '}
              <a
                href="https://www.linkedin.com/in/ashwinnathan00/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ashwin Nathan
              </a>
              , and{' '}
              <a
                href="https://www.linkedin.com/in/ishaanr21/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ishaan Rao
              </a>
            </span>
          </div>
        </Row>
      </Row>
    );
  }
}
