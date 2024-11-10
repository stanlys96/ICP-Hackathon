actor {
  public shared (msg) func whoami() : async Principal {
    msg.caller
  };

  public shared (msg) func greetShared() : async Text {
    return "Hello, " # Principal.toText(msg.caller) # "!";
  };
};