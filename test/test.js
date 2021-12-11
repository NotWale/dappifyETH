const { assert } = require("chai");

const Dappify = artifacts.require("./Dappify.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Dappify", ([deployer, author, tipper]) => {
  let dappify;

  before(async () => {
    dappify = await Dappify.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await dappify.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await dappify.name();
      assert.equal(name, "Dappify");
    });
  });

  describe("posts", async () => {
    let result, postCount;
    const hash = "ipfshash1";

    before(async () => {
      result = await dappify.uploadPost(hash, "Post Description", {
        from: author,
      });
      postCount = await dappify.postCount();
    });

    it("creates posts", async () => {
      // SUCCESS
      assert.equal(postCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(event.hash, hash, "hash is correct");
      assert.equal(
        event.description,
        "Post Description",
        "description is correct"
      );
      assert.equal(event.tipAmount, "0", "tip amount is correct");
      assert.equal(event.author, author, "author is correct");

      // FAILURE
      await dappify.uploadPost("", "Post Description", { from: author }).should
        .be.rejected;
      await dappify.uploadPost("Post Hash", "", { from: author }).should.be
        .rejected;
    });

    //check from struct
    it("lists posts", async () => {
      const post = await dappify.posts(postCount);
      assert.equal(post.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(post.hash, hash, "hash is correct");
      assert.equal(
        post.description,
        "Post Description",
        "description is correct"
      );
      assert.equal(post.tipAmount, "0", "tip amount is correct");
      assert.equal(post.author, author, "author is correct");
    });

    it("allows users to tip posts", async () => {
      // Track the author balance before purchase
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await dappify.tipPostOwner(postCount, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      });

      // SUCCESS
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), "id is correct");
      assert.equal(event.hash, hash, "Hash is correct");
      assert.equal(
        event.description,
        "Post Description",
        "description is correct"
      );
      assert.equal(
        event.tipAmount,
        "1000000000000000000",
        "tip amount is correct"
      );
      assert.equal(event.author, author, "author is correct");

      // Check that author received funds
      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipPostOwner;
      tipPostOwner = web3.utils.toWei("1", "Ether");
      tipPostOwner = new web3.utils.BN(tipPostOwner);

      const expectedBalance = oldAuthorBalance.add(tipPostOwner);

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString());

      // FAILURE: Tries to tip a post that does not exist
      await dappify.tipPostOwner(99, {
        from: tipper,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;
    });
  });
});
