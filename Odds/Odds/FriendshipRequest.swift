//
//  FriendshipRequest.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit
import Alamofire

class FriendshipRequest: NSObject {
    private var fromUser: User
    private var toUser: User
    
    init(fromUser: User, toUser: User) {
        self.fromUser = fromUser
        self.toUser = toUser
    }
    
    func fromCurrentUser(user: User) -> Bool {
        if self.fromUser.isEqual(user) { return true }
        else {return false}
    }
    
    func toCurrentUser(user: User) -> Bool {
        if self.toUser.isEqual(user) { return true }
        else {return false}
    }
    
    static func sendFriendRequest(fromUser: Int, toUser: Int) {
        let parameters: Parameters = [
            "fromUser" : fromUser,
            "toUser" : toUser
        ]
        
        Alamofire.request("https://boiling-badlands-32237.herokuapp.com/addFriendRequest", method: .post, parameters: parameters, encoding: JSONEncoding.default).responseJSON { response in
            if response.result.isSuccess {
                
            }
        }
    }
    
    func acceptRequest() -> Bool {
        //implement
        
        return false
    }
    
    func denyRequest() -> Bool {
        //implement
        
        return false
    }
}
