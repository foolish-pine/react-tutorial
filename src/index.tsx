import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

type SquareType = string | null;

interface SquareProps {
  value: SquareType;
  onClick: () => void;
}

const calculateWinner = (squares: SquareType[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

interface BoardProps {
  squares: SquareType[];
  onClick: (i: number) => void;
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const columns = [];
      for (let j = i * 3; j < i * 3 + 3; j++) {
        columns.push(
          <Square
            key={j}
            value={this.props.squares[j]}
            onClick={() => this.props.onClick(j)}
          />
        );
      }
      rows.push(
        <div key={i} className="board-row">
          {columns}
        </div>
      );
    }

    return (
      <div>
        <div className="status">{status}</div>
        {rows}
      </div>
    );
  }
}

interface GameState {
  history: { squares: SquareType[]; location: number; player: "X" | "O" }[];
  stepNumber: number;
  xIsNext: boolean;
}

class Game extends React.Component<any, GameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          player: "X",
          location: 0,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: i,
          player: this.state.xIsNext ? "X" : "O",
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status: string;
    if (winner) {
      status = `Winner: ${winner}`;
    } else if (this.state.stepNumber === 9) {
      status = "Draw";
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    const moves = history.map((step, move) => {
      const player = history[move].player;
      const location = `(${(history[move].location % 3) + 1}, ${
        Math.floor(history[move].location / 3) + 1
      })`;
      const desc = move
        ? `Go to move # ${move} ${player}${location}`
        : "Go to game start";

      let button: JSX.Element;
      if (move === this.state.stepNumber) {
        button = (
          <button className="bold" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        );
      } else {
        button = <button onClick={() => this.jumpTo(move)}>{desc}</button>;
      }

      return <li key={move}>{button}</li>;
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
