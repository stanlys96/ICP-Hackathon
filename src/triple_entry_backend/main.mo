import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Model "./model";

actor {
  type Role = { #Company; #Accounting; #Staff };
  var userRoles: HashMap.HashMap<Principal, Role> = HashMap.HashMap<Principal, Role>(10, Principal.equal, Principal.hash);

  public shared (msg) func whoami() : async Principal {
    return msg.caller
  };

  public shared (msg) func greetShared() : async Text {
    return "Hello, " # Principal.toText(msg.caller) # "!";
  };
    
  public func setUserRole(user: Principal, role: Role): async Bool {
    userRoles.put(user, role);
    return true;
  };

  public func hasRole(user: Principal): async Bool {
    return userRoles.get(user) != null;
  };

  public func getUserRole(user: Principal): async ?Role {
    return userRoles.get(user);
  };

  public func removeUserRole(user: Principal): async Bool {
    return userRoles.remove(user) != null;
  };
};