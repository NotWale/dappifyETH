import React, { Component } from "react";
import Identicon from "identicon.js";
import ReactPlayer from "react-player";
import Tips from "./Tips";
import { useState } from "react";

let textInput = React.createRef(); // React use ref to get input value

class Main extends Component {
  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "500px" }}
          >
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Share Music</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const description = this.musicDescription.value;
                  this.props.uploadMusic(description);
                }}
              >
                <input
                  type="file"
                  accept=".mp3, .wav"
                  onChange={this.props.captureFile}
                />
                <div className="form-group mr-sm-2">
                  <br></br>
                  <input
                    id="musicDescription"
                    type="text"
                    ref={(input) => {
                      this.musicDescription = input;
                    }}
                    className="form-control"
                    placeholder="Song description..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                >
                  Upload to IPFS
                </button>
              </form>

              <p>&nbsp;</p>
              {this.props.posts.map((song, key) => {
                return (
                  <div className="card mb-4" key={key}>
                    <div className="card-header">
                      <img
                        className="mr-2"
                        width="30"
                        height="30"
                        src={`data:image/png;base64,${new Identicon(
                          song.author,
                          30
                        ).toString()}`}
                      />
                      <small className="text-muted">{song.author}</small>
                    </div>
                    <ul id="songList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center">
                          {/* <img
                            src={`https://ipfs.infura.io/ipfs/${song.hash}`}
                            style={{ maxWidth: "420px" }}
                          /> */}
                        </p>
                        <ReactPlayer
                          url={`https://ipfs.infura.io/ipfs/${song.hash}`}
                          width="400px"
                          height="50px"
                          playing={false}
                          controls={true}
                        />
                        <p>{song.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2 pl-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS:{" "}
                          {window.web3.utils.fromWei(
                            song.tipAmount.toString(),
                            "Ether"
                          )}{" "}
                          ETH
                        </small>

                        <input
                          type="text"
                          placeholder="Enter tip amount in eth"
                          ref={textInput}
                        />
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={song.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei(
                              textInput.current.value,
                              "Ether"
                            );
                            console.log(event.target.name, tipAmount);
                            this.props.tipSongOwner(
                              event.target.name,
                              tipAmount
                            );
                          }}
                        >
                          TIP ETH
                        </button>

                        {/* <Tips
                          className="m-10"
                          tipSongOwner={this.tipSongOwner}
                          song={song}
                        /> */}
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
