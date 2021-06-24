import React, {Component} from "react";
// import logo from './logo.svg';
import './App.css';
import web3 from "./web3";
import lottery from "./lottery"

class App extends Component {
    state = {
        manager: "",
        players: [],
        balance: "",
        value: "",
        message: "",
        winner: ""
    }

    async componentDidMount() {
        const manager = await lottery.methods.manager().call()
        const players = await lottery.methods.getPlayers().call()

        const balance  = await web3.eth.getBalance(lottery.options.address)
        console.log(balance)

        this.setState({ manager, players, balance })
    }

    onSubmit = async (event) => {
        event.preventDefault()

        const accounts = await web3.eth.getAccounts()
        this.setState({message: "Waiting on Transaction success"})

        await lottery.methods.enter().send({
            // from: accounts[0],
            from: this.state.manager,
            value: web3.utils.toWei(this.state.value, "ether")
        })

        this.setState({message: "You have been entered into the contract"})
    }

    onClick = async (event) => {
        event.preventDefault()

        const accounts = await web3.eth.getAccounts()
        this.setState({message: "Selecting a winner"})

        lottery.methods.pickWinner().send({
            // from: accounts[0],
            from: this.state.manager,
        })

        this.setState({message: "A winner has been picked"})
    }

    render() {
        return (
            <div className="App">
                <h2>This is the Lottery Contract</h2>
                <p>This contract is managed by {this.state.manager}</p>
                <p>There are currently {this.state.players.length} people in competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether! </p>
                <hr></hr>

                <form onSubmit={this.onSubmit}>
                    <h4>Want to try your luck?</h4>
                    <div>
                        <label>Amount of Ether to Enter </label>
                        <input onChange={event => this.setState({value: event.target.value})}></input>
                    </div>
                    <button>Enter</button>
                </form>
                <hr></hr>

                <h4>Ready to pick a winner?</h4>
                <button onClick={this.onClick}>Pick a Winner!</button>

                <hr></hr>
                <p>{this.state.method}</p>
            </div>
        );
    }
}

export default App;
