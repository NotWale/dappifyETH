import React from "react";
import { useState } from "react";

function Tips(props) {
  const [value, setValue] = useState("0");

  const tipUser = (event) => {
    event.preventDefault();

    let tipAmount = window.web3.utils.toWei(value, "Ether");
    console.log(event.target.name, tipAmount);

    props.tipSongOwner(event.target.name, tipAmount);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter tip amount in eth"
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        className="btn btn-link btn-sm float-right pt-0"
        name={props.song.id}
        onClick={tipUser}
      >
        TIP ETH
      </button>
    </div>
  );
}

export default Tips;
