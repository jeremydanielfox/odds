//
//  Friendship.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class Friendship: NSObject {
    private var friendOne: User
    private var friendTwo: User
    
    init(friendOne: User, friendTwo: User) {
        self.friendOne = friendOne
        self.friendTwo = friendTwo
    }
    
    func containsFriend(friend: User) -> Bool {
        if self.friendOne.isEqual(friend) || self.friendTwo.isEqual(friend) {
            return true
        }
        else {
            return false
        }
    }
    
    func unfriendFriend() -> Bool {
        //implement
        
        return false
    }
}
