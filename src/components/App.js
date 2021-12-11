import React, { Component } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import Dappify from "../abis/Dappify.json";
import Navbar from "./Navbar";
import Main from "./Main";

// declare ipfs
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/ipfs/api/v0",
});

class App extends Component {
  // runs before render()
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Dappify.networks[networkId];
    if (networkData) {
      const dappify = web3.eth.Contract(Dappify.abi, networkData.address);
      this.setState({ dappify });
      const postCount = await dappify.methods.postCount().call();
      this.setState({ postCount });

      // load songs
      for (var i = 1; i <= postCount; i++) {
        const song = await dappify.methods.posts(i).call();
        this.setState({
          posts: [...this.state.posts, song],
        });
      }

      this.setState({
        posts: this.state.posts.sort((a, b) => b.tipAmount - a.tipAmount),
      });

      this.setState({ loading: false });
    } else {
      window.alert("Dappify contract not deployed to detected network.");
    }
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  uploadPost = (description) => {
    console.log("Submitting file to ipfs...");

    this.setState({ loading: true });

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }

      this.state.dappify.methods
        .uploadPost(result[0].hash, description) // this is calling the smart contract function!
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({ loading: false });
        });
    });
  };

  tipPostOwner = (id, tipAmount) => {
    this.setState({ loading: true });
    this.state.dappify.methods
      .tipPostOwner(id)
      .send({ from: this.state.account, value: tipAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      dappify: null,
      posts: [],
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            posts={this.state.posts}
            captureFile={this.captureFile}
            uploadMusic={this.uploadPost}
            tipSongOwner={this.tipPostOwner}
          />
        )}
        }
      </div>
    );
  }
}

export default App;
