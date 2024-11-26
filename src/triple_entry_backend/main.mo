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
  };

  type Role = { #Company; #Accounting; #Staff };
  var userRoles : HashMap.HashMap<Principal, Role> = HashMap.HashMap<Principal, Role>(10, Principal.equal, Principal.hash);
  private stable var transactions : [Transaction] = [];
  private stable var principalEntries : [Principal] = [];

  // Create HashMap to store principals
  private var principals = HashMap.HashMap<Principal, Bool>(
    10,
    Principal.equal,
    Principal.hash,
  );

  // Check if principal is recorded
  public func isRecorded(user: Principal) : async Bool {
    switch (principals.get(user)) {
      case (?exists) { exists };
      case null { false };
    };
  };

  // Record a new principal
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

  public func setUserRole(user : Principal, role : Role) : async Bool {
    userRoles.put(user, role);
    return true;
  };

  public func hasRole(user : Principal) : async Bool {
    return userRoles.get(user) != null;
  };

  public func getUserRole(user : Principal) : async ?Role {
    return userRoles.get(user);
  };

  public func removeUserRole(user : Principal) : async Bool {
    return userRoles.remove(user) != null;
  };

  public func addTransaction(sender : Principal, receiver : Principal, value : Nat, purpose : Text) : async () {
    let newTransaction : Transaction = {
      sender = sender;
      receiver = receiver;
      value = value;
      purpose = purpose;
    };
    transactions := Array.append(transactions, [newTransaction]);
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
};
