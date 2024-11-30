import Array "mo:base/Array";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Model "./model";
import Error "mo:base/Error";

actor {
  public type Transaction = {
    sender : Principal;
    receiver : Principal;
    value : Nat;
    purpose : Text;
    counter : Nat;
    timestamp: Text;
  };

  var userRoles : HashMap.HashMap<Principal, Text> = HashMap.HashMap<Principal, Text>(10, Principal.equal, Principal.hash);
  private stable var transactions : [Transaction] = [];
  private stable var principalEntries : [Principal] = [];
  var counter : Nat = 0;
  var balance: Int = 0;
  var expenses: Int = 0;

  private var principals = HashMap.HashMap<Principal, Bool>(
    10,
    Principal.equal,
    Principal.hash,
  );

  public func isRecorded(user: Principal) : async Bool {
    switch (principals.get(user)) {
      case (?exists) { exists };
      case null { false };
    };
  };

  public func recordPrincipal(user: Principal) : async Bool {
    if (Principal.isAnonymous(user)) {
      throw Error.reject("Anonymous principal not allowed");
    };
    if (principals.get(user) == null) {
      principalEntries := Array.append(principalEntries, [user]);
      principals.put(user, true);
      return true;
    };
    return false;
  };

  public func getAllPrincipals(): async [Principal] {
    return principalEntries;
  };

  public shared (msg) func whoami() : async Principal {
    return msg.caller;
  };

  public shared (msg) func greetShared() : async Text {
    return "Hello, " # Principal.toText(msg.caller) # "!";
  };

  public func setUserRole(user : Principal, role : Text) : async Bool {
    userRoles.put(user, role);
    return true;
  };

  public func isCompanyRolePicked() : async Bool {
    for ((key, value) in userRoles.entries()) {
      if (value == "Company") {
        return true;
      }
    };
    return false;
  };

  public func hasRole(user : Principal) : async Bool {
    return userRoles.get(user) != null;
  };

  public func getUserRole(user : Principal) : async ?Text {
    return userRoles.get(user);
  };

  public func removeUserRole(user : Principal) : async Bool {
    return userRoles.remove(user) != null;
  };

  public func addTransaction(sender : Principal, receiver : Principal, value : Nat, purpose : Text, timestamp : Text) : async Bool {
    if (balance - value < 0) {
      throw Error.reject("Insufficient balance!");
    };
    if (Principal.toText(sender) == Principal.toText(receiver)) {
      throw Error.reject("Sender and receiver cannot be the same!");
    };
    balance -= value;
    expenses += value;
    counter += 1;
    let newTransaction : Transaction = {
      sender = sender;
      receiver = receiver;
      value = value;
      purpose = purpose;
      timestamp = timestamp;
      counter = counter;
    };
    transactions := Array.append(transactions, [newTransaction]);
    return true;
  };

  public query func getTransactions() : async [Transaction] {
    return transactions;
  };

  public query func getTransactionByIndex(index : Nat) : async ?Transaction {
    if (index < Array.size(transactions)) {
      return ?transactions[index];
    };
    return null;
  };

  public func addBalance(amount : Nat, user : Principal) : async Int {
    if (userRoles.get(user) == ?"Company") {
      balance += amount;
      return balance;
    } else {
      throw Error.reject("Only the user with role \"Company\" can add balance!");
    }
  };

  public query func getBalance() : async Int {
    return balance;
  };

  public query func getExpenses() : async Int {
    return expenses;
  };

  public func resetTransaction() {
    transactions := [];
  };
};
