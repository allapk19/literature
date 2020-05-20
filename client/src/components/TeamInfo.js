import React from 'react';
import { Row, List } from 'antd';
import '../style/Home.css';
import 'antd/dist/antd.css';
const icons = require.context('../resources/icons', true);

export default class TeamInfo extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      paths: [],
    };
  }

  componentDidMount() {
    let { declaredSets } = this.props;
    let declarePaths = [];

    for (let i = 0; i < declaredSets.length; i++) {
      let path = `./${declaredSets[i].replace(/ /g, '_').toLowerCase()}.png`;
      declarePaths.push(path);
    }

    this.setState({ paths: declarePaths });
  }

  componentDidUpdate(prevProps, prevState) {
    let { declaredSets } = this.props;
    let declarePaths = [];

    for (let i = 0; i < declaredSets.length; i++) {
      let path = `./${declaredSets[i].replace(/ /g, '_').toLowerCase()}.png`;
      declarePaths.push(path);
    }
    if (declarePaths.length !== this.state.paths.length) {
      this.setState({ paths: declarePaths });
    }
  }

  render() {
    return (
      <Row className={`panel teamPanel ${this.props.isTeam ? "yourTeam" : ""}`}>
        <div className="teamHeader">
          <div>{this.props.name}</div>
          <div>{this.props.score}</div>
        </div>
        <div className="members">
          <List
            itemLayout="horizontal"
            dataSource={this.props.data}
            renderItem={(item) => {
              if (item.name === this.props.playerTurn) {
                return <List.Item>
                    <div style={{ fontWeight: 'bold'}}>
                      {item.name}
                    </div>
                    <div style={{ fontWeight: 'bold', position: 'relative', bottom: '2px' }}>
                      {item.hand.length}
                    </div>
                  </List.Item>
              } else {
                return <List.Item>
                    <div>
                      {item.name}
                    </div>
                    <div style={{ position: 'relative', bottom: '2px' }}>
                      {item.hand.length}
                    </div>
                </List.Item>
              }
            }}
          />
          <div className="declared-sets">
            {this.state.paths.map((path) => 
            <span className="set-label">
              <img
              src={icons(`${path}`)}
              height="20px"
              alt="declared set"
              />
            </span>
            )}
          </div>
        </div>
      </Row>
    );
  }
}
