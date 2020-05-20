import React from 'react';
import { Row, Button, message } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import logo from '../lit-logo.png';
import '../style/Home.css';

export default class Assign extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamOne: [],
      teamTwo: [],
      unassigned: [],
      leader: false,
    };

    this.startGame = this.startGame.bind(this);
  }

  componentWillMount() {
    let teamOne = [];
    let teamTwo = [];
    let unassigned = [];
    let leader = false;
    let arr = this.props.game.players;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].team === null) {
        unassigned.push(arr[i]);
      } else if (arr[i].team === 1) {
        teamOne.push(arr[i]);
      } else if (arr[i].team === 2) {
        teamTwo.push(arr[i]);
      }

      if (arr[i].name === this.props.playerName) {
        leader = arr[i].leader;
      }
    }

    this.setState({
      teamOne: teamOne,
      teamTwo: teamTwo,
      unassigned: unassigned,
      leader: leader,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let teamOne = [];
    let teamTwo = [];
    let unassigned = [];
    let leader = false;
    let arr = this.props.game.players;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].team === null) {
        unassigned.push(arr[i]);
      } else if (arr[i].team === 1) {
        teamOne.push(arr[i]);
      } else if (arr[i].team === 2) {
        teamTwo.push(arr[i]);
      }

      if (arr[i].name === this.props.playerName) {
        leader = arr[i].leader;
      }
    }
    if (
      teamOne.length !== prevState.teamOne.length ||
      teamTwo.length !== prevState.teamTwo.length ||
      unassigned.length !== prevState.unassigned.length ||
      leader !== prevState.leader
    ) {
      this.setState({
        teamOne: teamOne,
        teamTwo: teamTwo,
        unassigned: unassigned,
        leader: leader,
      });
    }
  }

  move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      let player = this.state[source.droppableId][source.index];

      const result = this.move(
        this.state[source.droppableId],
        this.state[destination.droppableId],
        source,
        destination
      );

      let team = destination.droppableId;
      this.props.socket.emit('assignTeam', { player, team }, (error) => {});

      this.setState({
        [source.droppableId]: result[source.droppableId],
        [destination.droppableId]: result[destination.droppableId],
      });
    }
  };

  startGame = () => {
    if (this.state.teamOne.length < 3 || this.state.teamTwo.length < 3) {
      message.error('There are not enough players on each team');
    } else if (this.state.teamOne.length !== this.state.teamTwo.length) {
      message.error('There are not an equal number of players on each team');
    } else if (this.state.unassigned.length > 0) {
      message.error('Not all players have been assigned a team');
    } else {
      this.props.socket.emit('start');
    }
  };

  render() {
    return (
      <Row justify="middle" className="bg">
        <img
          src={logo}
          className="homeImg"
          alt="Literature logo"
          style={{ marginBottom: '3vh', marginTop: '7vh' }}
        />
        {this.state.leader ? (
          <h2 className="instr-header">
            Drag and drop names to assign teams below
          </h2>
        ) : (
          <h2 className="instr-header">
            Waiting for the game leader to assign teams...
          </h2>
        )}
        <Row style={{ width: '100%', height: 'auto' }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="teamOne">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className="panel assign-panel">
                  <h1 className="team-header">Team One</h1>
                  {this.state.teamOne.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!this.state.leader}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="assign-name"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="unassigned">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className="panel assign-panel">
                  <h1 className="team-header">Unassigned</h1>
                  {this.state.unassigned.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!this.state.leader}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="assign-name"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="teamTwo">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className="panel assign-panel">
                  <h1 className="team-header">Team Two</h1>
                  {this.state.teamTwo.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={!this.state.leader}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="assign-name"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Row>
        {this.state.leader && (
          <Button
            className="assignButton"
            type="primary"
            onClick={this.startGame}
            size="large"
          >
            Start Game
          </Button>
        )}
      </Row>
    );
  }
}
