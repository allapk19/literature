import React from 'react';
import { Row, Col, Button, Modal, Radio, Select, Tabs, message } from 'antd';
import {
  HeartFilled,
  BellOutlined,
  SwapOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../style/Home.css';
import logo from '../lit-logo.png';
import TeamInfo from './TeamInfo.js';
import Board from './Board';
import Card from './Card';
import allSets from '../constants/constants.js';
import ReactHtmlParser from 'react-html-parser';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi'
import UIfx from 'uifx'; 
import correctFile from '../resources/sounds/correct.mp3';
import incorrectFile from '../resources/sounds/incorrect.wav';
import correctAskFile from '../resources/sounds/correctAsk.ogg';
import incorrectAskFile from '../resources/sounds/incorrectAsk.ogg';
import transferFile from '../resources/sounds/transfer.mp3';

const correctSound = new UIfx(
  correctFile,
  {
    volume: 1.0, // number between 0.0 ~ 1.0
    throttleMs: 100
  }
);
const incorrectSound = new UIfx(
  incorrectFile,
  {
    volume: 1.0, // number between 0.0 ~ 1.0
    throttleMs: 100
  }
)
const correctAskSound = new UIfx(
  correctAskFile,
  {
    volume: 1.0, // number between 0.0 ~ 1.0
    throttleMs: 100
  }
)
const incorrectAskSound = new UIfx(
  incorrectAskFile,
  {
    volume: 1.0, // number between 0.0 ~ 1.0
    throttleMs: 100
  }
)
const transferSound = new UIfx(
  transferFile,
  {
    volume: 1.0, // number between 0.0 ~ 1.0
    throttleMs: 100
  }
)

const icons = require.context('../resources/icons', true);

const { TabPane } = Tabs;
const { Option } = Select;

let askedPlayer = null;
let transferPlayer = null;

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      helpVisible: false,
      askVisible: false,
      askPlayer: null,
      askedCard: { suit: '', rank: '', set: '' },
      askSet: 'Select Set',
      availableCards: {},
      availableSetCards: [],
      availableSets: [],
      declareVisible: false,
      declareCards: [],
      transferVisible: false,
      teamOneData: [],
      teamTwoData: [],
      team: null,
      cards: [],
      isTurn: false,
      isLeader: false,
      playerTurn: null,
      log: null,
      declareMap: new Array(6),
      declareSet: 'Select Set',
      declaredSetsTeamOne: [],
      declaredSetsTeamTwo: [],
      declareState: [false, false, false, false, false, false],
      useSound: true,
    };
  }

  componentWillMount() {
    let teamOne = [];
    let teamTwo = [];
    let arr = this.props.game.players;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].team === 1) {
        teamOne.push(arr[i]);
      } else if (arr[i].team === 2) {
        teamTwo.push(arr[i]);
      }
      if (arr[i].name === this.props.playerName) {
        this.setState({
          cards: arr[i].hand,
          isTurn: arr[i].isTurn,
          availableCards: arr[i].availableCards,
          team: arr[i].team,
          availableSets: arr[i].sets,
          isLeader: arr[i].leader,
        });
      }
      if (arr[i].isTurn) {
        this.setState({ playerTurn: arr[i].name });
      }
    }
    this.setState({
      teamOneData: teamOne,
      teamTwoData: teamTwo,
      declaredSetsTeamOne: this.props.game.declaredSetsTeam1,
      declaredSetsTeamTwo: this.props.game.declaredSetsTeam2,
      log: this.props.game.log,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.game.declareMessage !== prevProps.game.declareMessage) {
      if (this.props.game.declareMessage.includes('incorrectly')) {
        message.error(this.props.game.declareMessage);
        if (this.state.useSound) {
          incorrectSound.play();
        }
      } else {
        message.success(this.props.game.declareMessage);
        if (this.state.useSound) {
          correctSound.play();
        }
      }
    }
    if (this.props.game.transferMessage !== prevProps.game.transferMessage) {
      message.info(this.props.game.transferMessage);
    }
    if (this.props.game.sound.count !== prevProps.game.sound.count) {
      if (this.state.useSound) {
        if (this.props.game.sound.sound === "correctAsk") {
          correctAskSound.play();
        } else if (this.props.game.sound.sound === "incorrectAsk") {
          incorrectAskSound.play();
        } else if (this.props.game.sound.sound === "transfer") {
          transferSound.play();
        }
      }
    }

    let teamOne = [];
    let teamTwo = [];
    let cards = [];
    let availableCards = {};
    let availableSets = [];
    let isTurn = false;
    let team = null;
    let playerTurn = null;
    let arr = this.props.game.players;
    let isLeader = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].team === 1) {
        teamOne.push(arr[i]);
      } else if (arr[i].team === 2) {
        teamTwo.push(arr[i]);
      }
      if (arr[i].name === this.props.playerName) {
        cards = arr[i].hand;
        isTurn = arr[i].isTurn;
        availableCards = arr[i].availableCards;
        team = arr[i].team;
        availableSets = arr[i].sets;
        isLeader = arr[i].leader;
      }
      if (arr[i].isTurn) {
        playerTurn = arr[i].name;
      }
    }
    if (
      teamOne.length !== prevState.teamOneData.length ||
      teamTwo.length !== prevState.teamTwoData.length ||
      cards.length !== prevState.cards.length ||
      availableCards.length !== prevState.availableCards.length ||
      availableSets.length !== prevState.availableSets.length ||
      isTurn !== prevState.isTurn ||
      team !== prevState.team ||
      this.props.game.log !== prevState.log ||
      this.props.game.declaredSetsTeam1.length !==
        prevState.declaredSetsTeamOne.length ||
      this.props.game.declaredSetsTeam2.length !==
        prevState.declaredSetsTeamTwo.length ||
      playerTurn !== prevState.playerTurn
    ) {
      this.setState({
        teamOneData: teamOne,
        teamTwoData: teamTwo,
        isTurn: isTurn,
        cards: cards,
        availableCards: availableCards,
        team: team,
        availableSets: availableSets,
        log: this.props.game.log,
        declaredSetsTeamOne: this.props.game.declaredSetsTeam1,
        declaredSetsTeamTwo: this.props.game.declaredSetsTeam2,
        playerTurn: playerTurn,
        isLeader: isLeader,
      });
    }
  }

  toggleSound = () => {
    this.setState({
      useSound: !this.state.useSound,
    })
  }

  showHelpModal = () => {
    this.setState({
      helpVisible: true,
    });
  };

  //Ask Modal Events
  showAskModal = () => {
    this.setState({
      askSet: 'Select Set',
      askVisible: true,
    });
  };

  cardClicked = (e) => {
    this.setState({
      askedCard: {
        rank: e.target.dataset.rank,
        suit: e.target.dataset.suit,
        set: e.target.dataset.set,
      },
    });
  };

  playerClicked = (e) => {
    askedPlayer = e.target.value;
  };

  handleAsk = (e) => {
    if (this.state.askedCard.suit !== '' && askedPlayer != null) {
      let card = this.state.askedCard;
      let source = this.props.playerName;
      let target = askedPlayer;
      this.props.socket.emit('ask', { source, target, card }, (asked) => {
        this.setState({
          askVisible: asked,
          declareVisible: false,
          transferVisible: false,
          availableSetCards: this.state.availableCards[
            this.state.askedCard.set
          ],
          askSet: asked ? this.state.askSet : 'Select Set',
        });
        this.setState({
          askedCard: {
            rank: '',
            suit: '',
            set: '',
          },
        });
      });
    }
  };

  handleSetSelect = (e) => {
    this.setState({
      askSet: e,
      availableSetCards: this.state.availableCards[e],
    });
  };

  //Declare Modal Events
  showDeclareModal = () => {

    this.setState({
      declareState: [false, false, false, false, false, false],
      declareVisible: true,
      declareSet: '',
      declareCards: [],
    });

  };

  handleDeclare = (e) => {
    e.preventDefault();

    for (let i = 0; i < this.state.declareCards.length; i++) {
      if (this.hasCard(this.state.declareCards[i])) {

        let map = this.state.declareMap;

        map[i] = {
          player: this.props.playerName,
          card: this.state.declareCards[i],
        };

        this.setState({ declareMap: map });
      }
    }

    
    if (Object.keys(this.state.declareMap).length === 6) {
      let cards = this.state.declareMap;
      let player = this.props.playerName;
      let set = this.state.declareSet;
      this.props.socket.emit('declare', { player, cards, set }, (declare) => {
        this.setState({
          askVisible: false,
          declareVisible: false,
          transferVisible: false,
          declareMap: new Array(6),
          declareCards: [],
          declareSet: '',
        });
      });
    }

    this.setState({
      askVisible: false,
      declareVisible: false,
      transferVisible: false,
      declareCards: [],
      declareSet: '',
    });
  };

  handleDeclareSelect = (e) => {

    let d = this.state.declareState;

    for (let i = 0; i < allSets[e].length; i++) {
     
      d[i] = this.hasCard(allSets[e][i]);
    }

    this.setState((prevState) => ({declareCards: []}), () => {
      setTimeout(this.setState({
        declareState: d,
        declareCards: allSets[e],
        declareSet: e,
      }), 0.1);
    }); 
  };

  handleDeclareMap = (e) => {
    let map = this.state.declareMap;
    const card = this.state.declareCards[e.target.name];
    const player = e.target.value;

    map[e.target.name] = {
      player: player,
      card: card,
    };

    this.setState({ declareMap: map });
  };

  hasCard = (card) => {
    for (let i = 0; i < this.state.cards.length; i++) {
      if (this.state.cards[i].rank === card.rank && this.state.cards[i].suit === card.suit) {
        return true;
      }
    }

    return false;
  }

  getPath = (suit) => {
    if (suit === 'Joker') {
      return './Jokers-icon.png';
    } 

    return `./${suit}.png`;
  }

  //Transfer Modal Events
  showTransferModal = () => {
    this.setState({
      transferVisible: true,
    });
  };

  transferClicked = (e) => {
    transferPlayer = e.target.value;
  };

  handleTransfer = (e) => {
    if (transferPlayer != null) {
      let source = this.props.playerName;
      let target = transferPlayer;
      this.props.socket.emit('transfer', { source, target }, () => {
        this.setState({
          askVisible: false,
          declareVisible: false,
          transferVisible: false,
        });
      });
    }
  };

  handleCancel = (e) => {
    this.setState({
      askVisible: false,
      declareVisible: false,
      transferVisible: false,
      helpVisible: false,
    });
  };

  newGame = () => {
    this.props.socket.emit('newGame');
  };
  leaveGame = () => {
    window.localStorage.removeItem('lit-game-user');
    this.props.socket.emit('leaveGame');
    this.props.home();
  }

  toString = (card) => {
    return card.suit === 'Joker'
      ? card.rank + ' ' + card.suit
      : card.rank + ' of ' + card.suit;
  };

  render() {
    let hasEnded = 'none';
    if (
      this.state.isLeader &&
      (this.props.game.scoreTeam1 >= 5 || this.props.game.scoreTeam2 >= 5)
    ) {
      hasEnded = 'inline';
    }
    return (
      <Row className="bg">
        <Row>
          <img src={logo} alt="Literature logo" className="lit-logo" />
          <div
            style={{
              position: 'absolute',
              right: '5vw',
              top: '30px',
              //display: hasEnded,
            }}
          >
            <Button
              type="primary"
              size="large"
              style={{ borderRadius: '7.5px', marginRight: '5px' }}
              onClick={this.leaveGame}
              danger
            >
              Leave Game
            </Button>
            <Button
              type="primary"
              size="large"
              style={{ borderRadius: '7.5px', display: hasEnded }}
              onClick={this.newGame}
            >
              New Game
            </Button>
          </div>
        </Row>
        <Row className="gameRow">
          <Col className="teamCol" lg={5} md={6}>
            <TeamInfo
              name="Team One"
              score={this.props.game.scoreTeam1}
              data={this.state.teamOneData}
              playerTurn={this.state.playerTurn}
              isTeam={this.state.team === 1}
              declaredSets={this.state.declaredSetsTeamOne}
            />
            <TeamInfo
              name="Team Two"
              score={this.props.game.scoreTeam2}
              data={this.state.teamTwoData}
              playerTurn={this.state.playerTurn}
              isTeam={this.state.team === 2}
              declaredSets={this.state.declaredSetsTeamTwo}
            />
          </Col>
          <Col lg={17} md={16} className="gameCol">
            <div className="panel">
            <div className="sound-btn-wrapper">
                <Button
                  onClick={this.toggleSound}
                  shape="circle"
                  icon={this.state.useSound ? <GiSpeaker /> : <GiSpeakerOff />}
                ></Button>
              </div>
              <div className="info-btn-wrapper">
                <Button
                  onClick={this.showHelpModal}
                  shape="circle"
                  icon={<QuestionOutlined />}
                ></Button>
              </div>
              <Row
                className="gamePanel"
                justify="center"
                align="middle"
                style={{ flexDirection: 'column' }}
              >
                <h1 className="log">{ReactHtmlParser (this.state.log)}</h1>
                <Board cards={this.state.cards} />
                <div className="buttonrow">
                  <Button
                    type={
                      this.state.isTurn && this.state.cards.length !== 0
                        ? 'primary'
                        : 'disabled'
                    }
                    onClick={this.state.isTurn ? this.showAskModal : ''}
                    size="large"
                  >
                    <QuestionOutlined />
                    Ask
                  </Button>
                  <Button
                    type={
                      this.state.isTurn && this.state.cards.length !== 0
                        ? 'primary'
                        : 'disabled'
                    }
                    onClick={this.state.isTurn ? this.showDeclareModal : ''}
                    size="large"
                  >
                    <BellOutlined />
                    Declare
                  </Button>
                  <Button
                    type={
                      this.state.isTurn && this.props.game.canTransfer
                        ? 'primary'
                        : 'disabled'
                    }
                    onClick={this.state.isTurn && this.props.game.canTransfer ? this.showTransferModal : ''}
                    size="large"
                  >
                    <SwapOutlined />
                    Transfer
                  </Button>
                </div>
                <Modal
                  title="Ask For a Card"
                  visible={this.state.askVisible}
                  onOk={this.handleAsk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="cancel" onClick={this.handleCancel}>
                      Cancel
                    </Button>,
                    <Button key="ask" type="primary" onClick={this.handleAsk}>
                      Ask
                    </Button>,
                  ]}
                >
                  <Row
                    align="middle"
                    justify="center"
                    style={{ marginBottom: '20px' }}
                  >
                    <Radio.Group
                      onChange={this.playerClicked}
                      buttonStyle="solid"
                    >
                      {this.props.game.players.map((player) => {
                        if (
                          player.name !== this.props.playerName &&
                          player.team !== this.state.team &&
                          player.hand.length > 0
                        ) {
                          return (
                            <Radio.Button value={player.name} checked={false}>
                              {player.name}
                            </Radio.Button>
                          );
                        }

                        return <span></span>;
                      })}
                    </Radio.Group>
                  </Row>
                  <Row
                    align="middle"
                    justify="center"
                    style={{ marginBottom: '20px' }}
                  >
                    <Select
                      style={{ width: 150 }}
                      placeholder="Select Set"
                      onChange={this.handleSetSelect}
                      value={this.state.askSet}
                    >
                      {this.state.availableSets.map((set) => (
                        <Option value={set}>{set}</Option>
                      ))}
                    </Select>
                  </Row>
                  <Row
                    align="middle"
                    justify="center"
                    style={{ marginBottom: '20px' }}
                  >
                    {this.state.askSet !== 'Select Set' &&
                      this.state.availableSetCards.map((card) => (
                        <Card
                          type="ask"
                          checked={this.state.askedCard}
                          clickFunc={this.cardClicked}
                          suit={card.suit}
                          rank={card.rank}
                          set={card.set}
                        />
                      ))}
                  </Row>
                  <Row align="middle" justify="center">
                    <p>{ReactHtmlParser (this.state.log)}</p>
                  </Row>
                </Modal>
                <Modal
                  title="Declare a Set"
                  visible={this.state.declareVisible}
                  onOk={this.handleDeclare}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="cancel" onClick={this.handleCancel}>
                      Cancel
                    </Button>,
                    <Button
                      onClick={this.handleDeclare}
                      key="declare"
                      type="primary"
                    >
                      Declare
                    </Button>,
                  ]}
                >
                  <Row
                    align="middle"
                    justify="center"
                    style={{ marginBottom: '20px' }}
                  >
                    <Select
                      style={{ width: 150 }}
                      placeholder="Select Set"
                      onChange={this.handleDeclareSelect}
                      value={
                        this.state.declareSet === ''
                          ? 'Select Set'
                          : this.state.declareSet
                      }
                    >
                      {this.state.availableSets.map((set) => (
                        <Option style={{ marginBottom: '10px' }} value={set}>
                          {set}
                        </Option>
                      ))}
                    </Select>
                  </Row>
                  <div>
                    {this.state.declareCards.map((card, index) => (
                      <Row style={{ width: '100%' }} className="declareRow">
                        <Col
                          span={8}
                          style={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ marginRight: '10px' }}>
                            {(card.rank === '10' || card.suit === 'Joker' ? card.rank : card.rank.charAt(0)) + ' '}
                            <img width={card.suit === 'Joker' ? '25px': '15px'} src={icons(this.getPath(card.suit))} alt={'card'} />
                          </span>
                        </Col>
                        <Col span={15}>
                          {this.state.declareState[index] ?
                            <Radio.Group
                              onChange={this.handleDeclareMap}
                              data-index={index}
                              name={index}
                              buttonStyle="solid"
                              defaultValue={this.props.playerName}
                              disabled
                            >
                              {this.props.game.players.map((player, i) => {
                                if (player.team === this.state.team) {
                                  if (player.name === this.props.playerName) {
                                    return (
                                      <Radio.Button checked={true} style={{backgroundColor: '#1890FF', color: '#FFFFFF'}} value={player.name}>
                                        {player.name}
                                      </Radio.Button>
                                    );
                                  } else {
                                    return (
                                      <Radio.Button style={{backgroundColor: '#F5F5F5', color: 'rgba(0, 0, 0, 0.25)'}} value={player.name}>
                                        {player.name}
                                      </Radio.Button>
                                    );
                                  }
                                }

                                return <span></span>;
                              })}
                            </Radio.Group>
                            : <Radio.Group
                                onChange={this.handleDeclareMap}
                                data-index={index}
                                buttonStyle="solid"
                                defaultValue=''
                                name={index}
                              >
                                {this.props.game.players.map((player, i) => {
                                  if (player.team === this.state.team) {
                                    if (player.name === this.props.playerName) {
                                      return (
                                        <Radio.Button value={player.name} disabled>
                                          {player.name}
                                        </Radio.Button>
                                      );
                                    } else {
                                      return (
                                        <Radio.Button value={player.name}>
                                          {player.name}
                                        </Radio.Button>
                                      );
                                    }
                                  } 

                                  return <span></span>;
                                })}
                              </Radio.Group>
                          } 
                        </Col>
                      </Row>
                    ))}
                  </div>
                </Modal>
                <Modal
                  title="Transfer Your Turn"
                  visible={this.state.transferVisible}
                  onOk={this.handleTransfer}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="cancel" onClick={this.handleCancel}>
                      Cancel
                    </Button>,
                    <Button
                      key="transfer"
                      type="primary"
                      onClick={this.handleTransfer}
                    >
                      Transfer
                    </Button>,
                  ]}
                >
                  <Row align="middle" justify="center">
                    <Radio.Group
                      onChange={this.transferClicked}
                      buttonStyle="solid"
                    >
                      {this.props.game.players.map((player) => {
                        if (
                          player.name !== this.props.playerName &&
                          player.team === this.state.team
                        ) {
                          return (
                            <Radio.Button value={player.name}>
                              {player.name}
                            </Radio.Button>
                          );
                        }

                        return <span></span>;
                      })}
                    </Radio.Group>
                  </Row>
                </Modal>
                <Modal
                  title="How To Play"
                  visible={this.state.helpVisible}
                  onOk={this.handleTransfer}
                  onCancel={this.handleCancel}
                  style={{ padding: 0 }}
                  footer={[]}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Setup" key="1">
                      <p style={{ marginBottom: '3px' }}>
                        <b>Players:</b> 6, 8, or 10
                      </p>
                      <p style={{ marginBottom: '3px' }}>
                        <b>Deck:</b> 52 Card Deck + 2 Jokers
                      </p>
                      <p>
                        Literature, or Fish, is a strategic turn-based card
                        game. The game is comprised of two teams whose objective
                        is to win 5 sets. The game progresses when players ask
                        for cards and declare sets. Players must keep track of
                        transactions, as only the most recent transaction is
                        displayed in the log.
                      </p>
                    </TabPane>
                    <TabPane tab="Sets" key="2">
                      <p>
                        <b>Sets:</b> There are 9 sets in the game. "Low" sets
                        are comprised of ranks 2-7 of a suit and "High" sets are
                        comprised of ranks 9-A of a suit. The last set is
                        comprised of all cards of rank 8 and the two jokers.
                      </p>
                    </TabPane>
                    <TabPane tab="Ask" key="3">
                      <p style={{ marginBottom: '3px' }}>
                        <b>Ask:</b> On a player's turn, they can ask a player of
                        the opposite team whether or not they have a certain
                        card. If they have the card, the card is transferred to
                        the players hand, and it remains their turn. Otherwise,
                        the turn is transferred to the player that was asked.
                      </p>
                      <p>
                        Note: A player may only ask for a card if they possess
                        another card from the same set. Also, a player may not
                        ask for a card that they already possess.
                      </p>
                    </TabPane>
                    <TabPane tab="Declare" key="4">
                      <p style={{ marginBottom: '3px' }}>
                        <b>Declare:</b> On a player's turn, they can choose to
                        declare a set if they believe that all cards in a
                        certain set are posessed by members of their team. When
                        declaring, a player must correctly state where among
                        their teammates all the cards in the chosen set are
                        located. Keep in mind that during the game players will
                        not be able to discuss their hands with any other
                        player, so they must rely on their memory.
                      </p>
                      <p style={{ marginBottom: '3px' }}>
                        If a player declares correctly, all the cards in the
                        declared set get taken off the board and they win a
                        point for their team. Otherwise, the point goes to the
                        other team.
                      </p>
                      <p>
                        After declaring correctly, a player may also choose to
                        transfer their turn to a teammate.
                      </p>
                    </TabPane>
                  </Tabs>
                </Modal>
              </Row>
            </div>
            <div className="footerRow">
              <span className="footer-info">
                Made with <HeartFilled style={{ color: 'red' }} /> by{' '}  
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
          </Col>
        </Row>
      </Row>
    );
  }
}
